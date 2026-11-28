import { useEffect, useState } from "react"
import { Link, Navigate, useNavigate } from "react-router-dom"
import { Invitation } from "../components/Invitation"
import { IconBank, IconWallet } from "../components/Icons"
import { getPackage, isWalletMethodAvailable, site, walletsArePlaceholders } from "../config"
import { getTemplate } from "../data"
import { encodeDraft } from "../lib/codec"
import { addInvite, createOrder, fetchDashboard, getHealth, startPayment, type Health } from "../lib/api"
import { money } from "../lib/format"
import { clearDraft, consumePackageInvite, draftReady, makeOrderId, readActivePackage, readDraft, readOwnerToken, readSelectedPackage, writeLast, writeOwnerToken } from "../lib/storage"
import type { PayMethod } from "../types"

const methods: { id: PayMethod; title: string; text: string; icon: typeof IconWallet }[] = [
  { id: "vodafone", title: "فودافون كاش", text: "حوّل المبلغ واكتب رقم العملية", icon: IconWallet },
  { id: "instapay", title: "إنستاباي", text: "تحويل فوري من تطبيق البنك", icon: IconBank },
]

export function Checkout() {
  const navigate = useNavigate()
  const draft = readDraft()
  const active = readActivePackage()
  const activeBundle = active ? getPackage(active.packageId) : null
  const continuing = Boolean(active && activeBundle && active.used < activeBundle.quantity)
  const [paidPkg, setPaidPkg] = useState("")
  const bundle = paidPkg ? getPackage(paidPkg) : continuing && activeBundle ? activeBundle : getPackage(readSelectedPackage())
  const [health, setHealth] = useState<Health | null>(null)
  const [method, setMethod] = useState<PayMethod>("vodafone")
  const [paidToken, setPaidToken] = useState("")
  const [placedToken, setPlacedToken] = useState("")
  const [placedId, setPlacedId] = useState("")
  const [orderId] = useState(() => continuing && active ? active.id : makeOrderId())
  const [refNo, setRefNo] = useState("")
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => { document.title = "تأكيد الطلب — دعوتنا" }, [])
  useEffect(() => {
    let live = true
    getHealth().then((h) => { if (!live) return; setHealth(h) })
    return () => { live = false }
  }, [])
  // أمر مدفوع من لوحة الزبون: نكمل بنفس الباقة بدون دفع تاني.
  useEffect(() => {
    const token = readOwnerToken()
    if (!token) return
    let live = true
    fetchDashboard(token).then((r) => { if (live && r.ok && r.data.order?.status === "paid" && r.data.remaining > 0) { setPaidToken(token); setPaidPkg(r.data.order.packageId) } })
    return () => { live = false }
  }, [])
  if (!draft || !draftReady(draft)) return <Navigate to="/templates" replace />
  const template = getTemplate(draft.templateId)!

  const cont = continuing || Boolean(paidToken)
  const dbOn = Boolean(health?.db)
  const methodsShown = methods.filter((m) => isWalletMethodAvailable(m.id as "vodafone" | "instapay"))

  async function pay() {
    if (!draft) return
    setError("")
    // دعوة إضافية في باقة مدفوعة (قاعدة البيانات)
    if (paidToken) {
      setBusy(true)
      const r = await addInvite(paidToken, draft)
      setBusy(false)
      if (!r.ok || !r.data.inviteId) { setError(r.status === 409 ? "الباقة خلصت." : "حصلت مشكلة، جرّب تاني."); return }
      clearDraft()
      navigate(`/done/${r.data.inviteId}`)
      return
    }
    if (dbOn) {
      if (!isWalletMethodAvailable(method as "vodafone" | "instapay")) { setError("وسيلة التحويل دي غير متاحة حاليًا."); return }
      if (refNo.trim().length < 4) { setError("اكتب رقم عملية التحويل، وأقله ٤ أرقام."); return }
      setBusy(true)
      const r = await createOrder({ draft, packageId: bundle.id, method, refNo: refNo.trim() })
      if (!r.ok || !r.data.ownerToken) { setBusy(false); setError(r.status === 429 ? "محاولات كتير، جرّب بعد شوية." : "مقدرناش نسجل الطلب، جرّب تاني."); return }
      writeOwnerToken(r.data.ownerToken)
      setPlacedId(r.data.orderId)
      setBusy(false)
      setPlacedToken(r.data.ownerToken)
      setSubmitted(true)
      return
    }
    // الطلبات الجديدة لازم تتسجل في قاعدة البيانات؛ ما نعرضش نجاحًا وهميًا لو الخدمة واقفة.
    if (!continuing) { setError("تسجيل الطلبات مش متاح مؤقتًا. حاول تاني بعد شوية أو تواصل معانا."); return }
    // --- المسار القديم للباقة المحلية الموجودة مسبقًا ---
    if (!continuing && walletsArePlaceholders) {
      setError("بيانات التحويل لسه تجريبية. تواصل مع خدمة العملاء أو انتظر تحديث بيانات الدفع قبل التحويل.")
      return
    }
    if (!continuing && refNo.trim().length < 4) {
      setError("اكتب رقم عملية التحويل، وأقله ٤ أرقام.")
      return
    }
    if (!continuing) {
      setSubmitted(true)
      return
    }
    setBusy(true)
    await new Promise((resolve) => setTimeout(resolve, 700))
    const next = consumePackageInvite()
    if (!next) {
      setBusy(false)
      setError("الباقة خلصت. اختار باقة جديدة لإضافة دعوات.")
      return
    }
    const code = encodeDraft(draft)
    writeLast({ id: orderId, method, refNo: refNo.trim(), at: Date.now(), code, packageId: bundle.id })
    navigate(`/done/${code}`)
  }

  const destination = method === "instapay" ? site.instapay : site.vodafoneCash
  const remainingAfterThis = paidToken ? "" : bundle.quantity - (cont && active ? active.used + 1 : 1)

  return (
    <main id="main" className="mx-auto max-w-5xl px-3 pb-28 pt-6 sm:px-4 sm:py-10 md:py-14">
      <div className="mx-auto mb-6 max-w-2xl text-center sm:mb-8">
        <p className="text-xs font-bold text-[#b83b50]">الخطوة ٢ من ٢</p>
        <h1 className="mt-2 font-display text-4xl text-[#4a2d33] md:text-5xl">{cont ? "أضف دعوة للباقة" : "تأكيد الباقة"}</h1>
        <p className="mt-3 leading-7 text-[#806b70]">{cont ? "دي دعوة جديدة ضمن الباقة اللي دفعت تمنها بالفعل." : "راجع تفاصيل أول دعوة واختار طريقة الدفع المناسبة."}</p>
      </div>
      <div className="grid items-start gap-4 sm:gap-6 lg:grid-cols-[300px_1fr]">
        <aside className="order-2 rounded-[26px] border border-[#f0dce1] bg-white p-4 lg:order-1">
          <div className="overflow-hidden rounded-[18px] bg-[#fff8f8]">
            <Invitation draft={draft} />
          </div>
          <div className="mt-4 flex items-start justify-between gap-3">
            <div><h2 className="font-bold text-[#4a2d33]">{template.name}</h2><p className="mt-1 text-sm text-[#806b70]">{draft.groom} و{draft.bride}</p></div>
            <p className="font-bold text-[#a64257]">{money(bundle.price)}</p>
          </div>
          <Link to={`/editor/${draft.templateId}`} className="mt-4 inline-block text-sm font-bold text-[#a64257] hover:underline">تعديل التفاصيل</Link>
        </aside>

        <section className="order-1 rounded-[26px] border border-[#f0dce1] bg-white p-4 sm:p-5 md:order-2 md:p-7">
          <div className="rounded-2xl bg-[#fbf7f3] p-4">
            <p className="text-sm text-[#806b70]">الباقة</p>
            <div className="mt-1 flex flex-wrap items-center justify-between gap-2">
              <strong className="text-lg text-[#4a2d33]">{bundle.name}</strong>
              <strong className="text-xl text-[#08745d]">{money(bundle.price)}</strong>
            </div>
            <p className="mt-2 text-sm text-[#806b70]">
              {cont && active && !paidToken ? `استخدمت ${active.used} من ${bundle.quantity} دعوة — الدعوة دي رقم ${active.used + 1}.` : `الباقة بتسمح بإنشاء ${bundle.quantity} دعوة مختلفة.`}
            </p>
          </div>

          {submitted && !cont ? (
            <div className="mt-5 rounded-2xl border border-[#e8c9a4] bg-[#fff9ed] p-5">
              <h2 className="font-bold text-[#795a2d]">طلبك مستني مراجعة التحويل</h2>
              <p className="mt-2 text-sm leading-7 text-[#806b70]">جهّزنا تفاصيل طلبك. ابعت صورة إيصال التحويل ورقم الطلب لخدمة العملاء، وبعد مراجعة الدفع هنأكد التفعيل يدويًا.</p>
              <div className="mt-3 flex flex-wrap items-center justify-between gap-2"><p className="text-sm font-bold text-[#4a2d33]">رقم الطلب: {placedId || orderId}</p><button type="button" onClick={async () => { try { await navigator.clipboard.writeText(placedId || orderId); setCopied(true); window.setTimeout(() => setCopied(false), 1800); } catch { setError("انسخ رقم الطلب يدويًا بالضغط المطول عليه."); } }} className="min-h-9 rounded-full border border-[#e8c8cf] bg-white px-3 text-xs font-bold text-[#a64257]">{copied ? "تم النسخ ✓" : "نسخ رقم الطلب"}</button></div>
              <a className="mt-4 inline-flex min-h-11 items-center justify-center rounded-full bg-[#a64257] px-5 py-3 text-sm font-bold text-white" href={"https://wa.me/" + site.whatsapp + "?text=" + encodeURIComponent("طلب دعوتنا " + (placedId || orderId) + " — رقم العملية " + refNo.trim() + " — أرفقت إيصال التحويل")} target="_blank" rel="noreferrer">ابعت إيصال التحويل على واتساب</a>
              {placedToken ? <Link to={`/dashboard/${placedToken}`} className="mt-3 flex min-h-11 items-center justify-center rounded-full border border-[#e8c8cf] bg-white px-5 text-sm font-bold text-[#a64257]">افتح لوحة طلبي</Link> : null}
              <p className="mt-3 text-xs leading-6 text-[#9a6a45]">مهم: متعتبرش الطلب مكتمل قبل ما توصلك رسالة تأكيد التفعيل.</p>
            </div>
          ) : cont ? (
            <div className="mt-5 rounded-2xl border border-[#cce4d8] bg-[#f2faf5] p-5">
              <h2 className="font-bold text-[#176447]">الدفع اتسجل للباقة بالفعل</h2>
              <p className="mt-2 text-sm leading-7 text-[#527566]">مش هتدفع تاني. اضغط تأكيد لإضافة الدعوة دي، وهيبقى متاح لك بعدها {remainingAfterThis} دعوة.</p>
              <p className="mt-3 text-xs text-[#527566]">رقم الطلب: {orderId}</p>
            </div>
          ) : (
            <>
              <h2 className="mt-6 text-lg font-bold text-[#4a2d33]">طريقة الدفع</h2>
              <p className="mt-1 text-sm text-[#806b70]">اختار وسيلة الدفع اللي تناسبك.</p>
              <div className="mt-5 grid gap-3" role="radiogroup" aria-label="طريقة الدفع">
                {methodsShown.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    role="radio"
                    aria-checked={method === item.id}
                    onClick={() => { setMethod(item.id); setError("") }}
                    className={`flex min-h-[72px] cursor-pointer items-center gap-4 rounded-2xl border px-4 py-3 text-right transition ${method === item.id ? "border-[#b83b50] bg-[#fff7f8]" : "border-[#f0dce1] bg-white hover:bg-[#fffafa]"}`}
                  >
                    <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${method === item.id ? "bg-[#f9e5e9] text-[#a64257]" : "bg-[#faf5f5] text-[#806b70]"}`}>
                      <item.icon className="h-5 w-5" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-bold text-[#4a2d33]">{item.title}</span>
                      <span className="mt-0.5 block text-sm text-[#806b70]">{item.text}</span>
                    </span>
                    <span className={`h-4 w-4 rounded-full border ${method === item.id ? "border-[5px] border-[#b83b50]" : "border-[#d9c7cb]"}`} />
                  </button>
                ))}
              </div>

                {!dbOn ? <p className="mt-5 rounded-2xl bg-[#fff9ed] p-4 text-sm leading-7 text-[#795a2d]">تسجيل الطلبات غير متاح مؤقتًا. مش هيتخصم منك أي مبلغ لحد ما الخدمة ترجع.</p> : walletsArePlaceholders ? <p className="mt-5 rounded-2xl bg-[#fffafa] p-4 text-sm leading-7 text-[#806b70]">وسائل التحويل اليدوي غير مفعّلة حاليًا حتى يتم تأكيد بياناتها. جرّب لاحقًا أو تواصل معانا.</p> : <div className="mt-5 rounded-2xl bg-[#fffafa] p-4 ring-1 ring-[#f0dce1]">
                  <p className="text-sm text-[#806b70]">حوّل {money(bundle.price)} إلى {destination}</p>
                  <div className="mt-2 flex flex-wrap items-center justify-between gap-2"><p className="text-xl font-bold text-[#4a2d33]" dir="ltr">{destination}</p><button type="button" onClick={async () => { try { await navigator.clipboard.writeText(destination); setCopied(true); window.setTimeout(() => setCopied(false), 1800); } catch { setError("مش قادرين ننسخ الرقم تلقائيًا؛ اضغط مطولًا على الرقم وانسخه."); } }} className="min-h-9 rounded-full border border-[#e8c8cf] bg-white px-3 text-xs font-bold text-[#a64257]">{copied ? "تم النسخ ✓" : "نسخ الرقم"}</button></div>
                  <p className="mt-4 text-xs text-[#806b70]">رقم الطلب — اكتبه في ملاحظة التحويل</p>
                  <div className="mt-1 flex flex-wrap items-center justify-between gap-2"><p className="break-all font-mono text-sm text-[#a64257]">{orderId}</p><button type="button" onClick={async () => { try { await navigator.clipboard.writeText(orderId); setCopied(true); window.setTimeout(() => setCopied(false), 1800); } catch { setError("انسخ رقم الطلب يدويًا بالضغط المطول عليه."); } }} className="text-[11px] font-bold text-[#a64257] underline underline-offset-4">{copied ? "تم النسخ ✓" : "نسخ"}</button></div>
                  <label className="field mt-4">
                    <span>رقم عملية التحويل</span>
                    <input value={refNo} inputMode="numeric" maxLength={30} onChange={(event) => setRefNo(event.target.value)} placeholder="مثال: 4821" />
                  </label>
                </div>}
              {walletsArePlaceholders ? <p className="mt-4 text-xs leading-6 text-[#9a6a45]">بيانات المحافظ الحالية تجريبية. حدّثها من src/config.ts قبل استقبال الطلبات.</p> : null}
              {!walletsArePlaceholders && dbOn ? <div className="mt-4 rounded-2xl border border-[#f0dce1] bg-[#fffafa] p-4"><p className="text-xs font-extrabold text-[#4a2d33]">بعد التحويل اعمل 3 خطوات بسيطة:</p><ol className="mt-2 grid gap-2 text-xs leading-6 text-[#806b70]"><li>١. اكتب رقم عملية التحويل هنا.</li><li>٢. اضغط إرسال طلب التفعيل.</li><li>٣. ابعت صورة الإيصال على واتساب، واكتب رقم الطلب في الرسالة.</li></ol></div> : null}
              {!walletsArePlaceholders && method !== "paymob" ? <p className="mt-2 text-xs leading-6 text-[#9a6a45]">إرسال الطلب لا يعني تأكيد الدفع. التفعيل بيتم بعد مراجعة الإيصال يدويًا.</p> : null}
            </>
          )}

          {error ? <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-bold text-red-800" role="alert">{error}</p> : null}
          {!submitted || cont ? <div className="fixed inset-x-0 bottom-0 z-30 mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-[#f3e6e9] bg-white/95 px-4 py-3 pb-[max(env(safe-area-inset-bottom),12px)] pt-3 backdrop-blur sm:static sm:bg-transparent sm:px-0 sm:pb-0 sm:pt-5">
            <div><p className="text-xs text-[#806b70]">{cont ? "المطلوب الآن" : "إجمالي الباقة"}</p><p className="text-xl font-bold text-[#4a2d33]">{cont ? "بدون دفع إضافي" : money(bundle.price)}</p></div>
            <button type="button" className="btn-gold min-w-44" onClick={pay} disabled={busy || (!cont && (!dbOn || !isWalletMethodAvailable(method as "vodafone" | "instapay")))}>
              {busy ? "بنجهّز الدعوة..." : cont ? "أضف الدعوة للباقة" : !dbOn ? "الطلبات غير متاحة مؤقتًا" : walletsArePlaceholders ? "الدفع غير متاح حاليًا" : "إرسال طلب التفعيل"}
            </button>
          </div> : null}
        </section>
      </div>
    </main>
  )
}
