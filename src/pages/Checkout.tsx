import { useEffect, useState } from "react"
import { Link, Navigate, useNavigate } from "react-router-dom"
import { Invitation } from "../components/Invitation"
import { IconBank, IconCard, IconWallet } from "../components/Icons"
import { getPackage, site, walletsArePlaceholders } from "../config"
import { getTemplate } from "../data"
import { encodeDraft } from "../lib/codec"
import { money } from "../lib/format"
import { activatePackage, consumePackageInvite, draftReady, makeOrderId, readActivePackage, readDraft, readSelectedPackage, writeLast } from "../lib/storage"
import type { PayMethod } from "../types"

const methods: { id: PayMethod; title: string; text: string; icon: typeof IconWallet }[] = [
  { id: "vodafone", title: "فودافون كاش", text: "حوّل المبلغ واكتب رقم العملية", icon: IconWallet },
  { id: "instapay", title: "إنستاباي", text: "تحويل فوري من تطبيق البنك", icon: IconBank },
  { id: "card", title: "بطاقة بنكية", text: "فيزا أو ماستركارد — تجربة لحد ربط البوابة", icon: IconCard },
]

export function Checkout() {
  const navigate = useNavigate()
  const draft = readDraft()
  const active = readActivePackage()
  const activeBundle = active ? getPackage(active.packageId) : null
  const continuing = Boolean(active && activeBundle && active.used < activeBundle.quantity)
  const bundle = continuing && activeBundle ? activeBundle : getPackage(readSelectedPackage())
  const [method, setMethod] = useState<PayMethod>("vodafone")
  const [orderId] = useState(() => continuing && active ? active.id : makeOrderId())
  const [refNo, setRefNo] = useState("")
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => { document.title = "تأكيد الطلب — دعوتنا" }, [])
  if (!draft || !draftReady(draft)) return <Navigate to="/templates" replace />
  const template = getTemplate(draft.templateId)!

  async function pay() {
    if (!continuing && method !== "card" && refNo.trim().length < 4) {
      setError("اكتب رقم عملية التحويل، وأقله ٤ أرقام.")
      return
    }
    setBusy(true)
    setError("")
    await new Promise((resolve) => setTimeout(resolve, 700))

    if (continuing) {
      const next = consumePackageInvite()
      if (!next) {
        setBusy(false)
        setError("الباقة خلصت. اختار باقة جديدة لإضافة دعوات.")
        return
      }
    } else {
      activatePackage({ id: orderId, packageId: bundle.id, used: 1, createdAt: Date.now() })
    }

    const code = encodeDraft(draft)
    writeLast({ id: orderId, method, refNo: refNo.trim(), at: Date.now(), code, packageId: bundle.id })
    navigate(`/done/${code}`)
  }

  const destination = method === "vodafone" ? site.vodafoneCash : site.instapay
  const remainingAfterThis = bundle.quantity - (continuing && active ? active.used + 1 : 1)

  return (
    <main id="main" className="mx-auto max-w-5xl px-4 py-10 md:py-14">
      <div className="mx-auto mb-8 max-w-2xl text-center">
        <p className="text-xs font-bold text-[#b83b50]">الخطوة ٢ من ٢</p>
        <h1 className="mt-2 font-display text-4xl text-[#4a2d33] md:text-5xl">{continuing ? "أضف دعوة للباقة" : "تأكيد الباقة"}</h1>
        <p className="mt-3 leading-7 text-[#806b70]">{continuing ? "دي دعوة جديدة ضمن الباقة اللي دفعت تمنها بالفعل." : "راجع تفاصيل أول دعوة واختار طريقة الدفع المناسبة."}</p>
      </div>
      <div className="grid items-start gap-6 lg:grid-cols-[300px_1fr]">
        <aside className="rounded-[26px] border border-[#f0dce1] bg-white p-4">
          <div className="overflow-hidden rounded-[18px] bg-[#fff8f8]">
            <Invitation draft={draft} />
          </div>
          <div className="mt-4 flex items-start justify-between gap-3">
            <div><h2 className="font-bold text-[#4a2d33]">{template.name}</h2><p className="mt-1 text-sm text-[#806b70]">{draft.groom} و{draft.bride}</p></div>
            <p className="font-bold text-[#a64257]">{money(bundle.price)}</p>
          </div>
          <Link to={`/editor/${draft.templateId}`} className="mt-4 inline-block text-sm font-bold text-[#a64257] hover:underline">تعديل التفاصيل</Link>
        </aside>

        <section className="rounded-[26px] border border-[#f0dce1] bg-white p-5 md:p-7">
          <div className="rounded-2xl bg-[#fbf7f3] p-4">
            <p className="text-sm text-[#806b70]">الباقة</p>
            <div className="mt-1 flex flex-wrap items-center justify-between gap-2">
              <strong className="text-lg text-[#4a2d33]">{bundle.name}</strong>
              <strong className="text-xl text-[#08745d]">{money(bundle.price)}</strong>
            </div>
            <p className="mt-2 text-sm text-[#806b70]">
              {continuing && active ? `استخدمت ${active.used} من ${bundle.quantity} دعوة — الدعوة دي رقم ${active.used + 1}.` : `الباقة بتسمح بإنشاء ${bundle.quantity} دعوة مختلفة.`}
            </p>
          </div>

          {continuing ? (
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
                {methods.map((item) => (
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

              {method === "card" ? (
                <p className="mt-5 rounded-xl bg-[#fff8e9] p-4 text-sm leading-7 text-[#79603b]">
                  الدفع بالبطاقة هنا تجربة محلية فقط، ومفيش خصم فعلي من البنك. لازم تربط بوابة دفع قبل استقبال مدفوعات حقيقية.
                </p>
              ) : (
                <div className="mt-5 rounded-2xl bg-[#fffafa] p-4 ring-1 ring-[#f0dce1]">
                  <p className="text-sm text-[#806b70]">حوّل {money(bundle.price)} إلى {destination}</p>
                  <p className="mt-2 text-xl font-bold text-[#4a2d33]" dir="ltr">{destination}</p>
                  <p className="mt-4 text-xs text-[#806b70]">رقم الطلب — اكتبه في ملاحظة التحويل</p>
                  <p className="mt-1 break-all font-mono text-sm text-[#a64257]">{orderId}</p>
                  <label className="field mt-4">
                    <span>رقم عملية التحويل</span>
                    <input value={refNo} inputMode="numeric" maxLength={30} onChange={(event) => setRefNo(event.target.value)} placeholder="مثال: 4821" />
                  </label>
                </div>
              )}
              {walletsArePlaceholders ? <p className="mt-4 text-xs leading-6 text-[#9a6a45]">بيانات المحافظ الحالية تجريبية. حدّثها من src/config.ts قبل استقبال الطلبات.</p> : null}
              <p className="mt-2 text-xs leading-6 text-[#9a6a45]">تأكيد الطلب هنا محلي وليس تحققًا آليًا من التحويل.</p>
            </>
          )}

          {error ? <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-bold text-red-800" role="alert">{error}</p> : null}
          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-[#f3e6e9] pt-5">
            <div><p className="text-xs text-[#806b70]">{continuing ? "المطلوب الآن" : "إجمالي الباقة"}</p><p className="text-xl font-bold text-[#4a2d33]">{continuing ? "بدون دفع إضافي" : money(bundle.price)}</p></div>
            <button type="button" className="btn-gold min-w-44" onClick={pay} disabled={busy}>
              {busy ? "بنأكد..." : continuing ? "أضف الدعوة للباقة" : method === "card" ? "تأكيد تجريبي" : "تأكيد التحويل"}
            </button>
          </div>
        </section>
      </div>
    </main>
  )
}
