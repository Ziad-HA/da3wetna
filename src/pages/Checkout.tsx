import { useEffect, useState } from "react"
import { Link, Navigate, useNavigate } from "react-router-dom"
import { Invitation } from "../components/Invitation"
import { IconBank, IconCard, IconWallet } from "../components/Icons"
import { site, walletsArePlaceholders } from "../config"
import { getTemplate } from "../data"
import { encodeDraft } from "../lib/codec"
import { money } from "../lib/format"
import { draftReady, makeOrderId, readDraft, writeLast } from "../lib/storage"
import type { PayMethod } from "../types"

const methods: { id: PayMethod; title: string; text: string; icon: typeof IconWallet }[] = [
  { id: "vodafone", title: "فودافون كاش", text: "حوّل المبلغ واكتب رقم العملية", icon: IconWallet },
  { id: "instapay", title: "إنستاباي", text: "تحويل فوري من تطبيق البنك", icon: IconBank },
  { id: "card", title: "بطاقة بنكية", text: "فيزا أو ماستركارد — تجربة لحد ربط البوابة", icon: IconCard },
]

export function Checkout() {
  const navigate = useNavigate()
  const draft = readDraft()
  const [method, setMethod] = useState<PayMethod>("vodafone")
  const [orderId] = useState(makeOrderId)
  const [refNo, setRefNo] = useState("")
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    document.title = "الدفع — زفّة"
  }, [])

  if (!draft || !draftReady(draft)) return <Navigate to="/templates" replace />
  const template = getTemplate(draft.templateId)!

  async function pay() {
    if (method !== "card" && refNo.trim().length < 4) {
      setError("اكتب رقم عملية التحويل، وأقله ٤ أرقام.")
      return
    }
    setBusy(true)
    setError("")
    await new Promise((resolve) => setTimeout(resolve, 700))
    const code = encodeDraft(draft!)
    writeLast({ id: orderId, method, refNo: refNo.trim(), at: Date.now(), code })
    navigate(`/done/${code}`)
  }

  const destination = method === "vodafone" ? site.vodafoneCash : site.instapay

  return (
    <main id="main" className="mx-auto grid max-w-5xl gap-8 px-4 py-10 lg:grid-cols-[280px_1fr]">
      <aside className="rounded-[28px] bg-card p-4 ring-1 ring-line">
        <div className="overflow-hidden rounded-2xl">
          <Invitation draft={draft} />
        </div>
        <h1 className="mt-4 text-xl font-bold">{template.name}</h1>
        <p className="text-mute">{draft.groom} و{draft.bride}</p>
        <p className="mt-3 text-2xl font-bold">{money(site.price)}</p>
        <Link to={`/editor/${draft.templateId}`} className="mt-3 inline-block text-sm font-bold text-gold">ارجع للتعديل</Link>
      </aside>
      <section>
        <h2 className="font-display text-4xl">اختار طريقة الدفع</h2>
        <p className="mt-2 leading-7 text-mute">بعد التأكيد هتلاقي تحميل الستوري ولينك الدعوة على طول.</p>
        <div className="mt-6 grid gap-3" role="radiogroup" aria-label="طريقة الدفع">
          {methods.map((item) => (
            <button
              key={item.id}
              type="button"
              role="radio"
              aria-checked={method === item.id}
              onClick={() => { setMethod(item.id); setError("") }}
              className={`flex min-h-16 cursor-pointer items-center gap-4 rounded-2xl px-4 py-3 text-right ring-1 ${method === item.id ? "bg-white ring-gold" : "bg-card ring-line"}`}
            >
              <item.icon className="h-6 w-6 shrink-0 text-gold" />
              <span>
                <span className="block font-bold">{item.title}</span>
                <span className="text-sm text-mute">{item.text}</span>
              </span>
            </button>
          ))}
        </div>

        {method === "card" ? (
          <p className="mt-5 rounded-2xl bg-[#f3ead8] p-4 leading-7 text-sm">
            الدفع بالبطاقة هنا تجربة محلية: مفيش خصم من البنك. لما تربط بوابة زي Paymob، الزرار ده هيخصم فعليًا. التأكيد بيفتح الدعوة عشان تجرب التحميل.
          </p>
        ) : (
          <div className="mt-5 rounded-2xl bg-card p-4 ring-1 ring-line">
            <p className="text-sm text-mute">حوّل {money(site.price)} واكتب كود الطلب في الملاحظة</p>
            <p className="mt-2 font-display text-3xl">{orderId}</p>
            <p className="mt-3 text-sm">على الرقم أو العنوان</p>
            <p className="text-xl font-bold" dir="ltr">{destination}</p>
            {walletsArePlaceholders ? (
              <p className="mt-3 text-sm leading-6 text-mute">الأرقام دي تجريبية. غيّرها من ملف src/config.ts قبل ما تنشر الموقع.</p>
            ) : null}
            <label className="field mt-4">
              <span>رقم عملية التحويل</span>
              <input value={refNo} inputMode="numeric" maxLength={30} onChange={(event) => setRefNo(event.target.value)} placeholder="مثال: 4821" />
            </label>
          </div>
        )}

        {error ? <p className="mt-4 font-bold text-red-800" role="alert">{error}</p> : null}
        <button type="button" className="btn-gold mt-5 w-full" onClick={pay} disabled={busy}>
          {busy ? "بنأكد..." : method === "card" ? "تأكيد تجريبي وفتح الدعوة" : "تم التحويل، افتح الدعوة"}
        </button>
      </section>
    </main>
  )
}
