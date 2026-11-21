import { useEffect, useState } from "react"
import { Link, Navigate, useNavigate, useParams } from "react-router-dom"
import { Invitation } from "../components/Invitation"
import { getPackage } from "../config"
import { getTemplate, occasions, templates } from "../data"
import { money } from "../lib/format"
import { draftReady, initDraft, readSelectedPackage, writeDraft } from "../lib/storage"
import type { FieldKey, InviteDraft } from "../types"

const fields: { key: FieldKey; label: string; kind: "text" | "select" | "date" | "time"; max?: number }[] = [
  { key: "opening", label: "جملة الافتتاح", kind: "text", max: 60 },
  { key: "occasion", label: "المناسبة", kind: "select" },
  { key: "hosts", label: "سطر الدعوة", kind: "text", max: 80 },
  { key: "groom", label: "اسم العريس", kind: "text", max: 40 },
  { key: "bride", label: "اسم العروسة", kind: "text", max: 40 },
  { key: "message", label: "الجملة", kind: "text", max: 140 },
  { key: "date", label: "التاريخ", kind: "date" },
  { key: "time", label: "الوقت", kind: "time" },
  { key: "venue", label: "المكان", kind: "text", max: 80 },
  { key: "city", label: "المدينة", kind: "text", max: 40 },
]

export function Editor() {
  const { id } = useParams()
  const navigate = useNavigate()
  const template = getTemplate(id)
  const selectedPackage = getPackage(readSelectedPackage())
  const [draft, setDraft] = useState<InviteDraft>(() => initDraft(id))
  const [active, setActive] = useState<FieldKey | null>("groom")
  const [error, setError] = useState("")

  useEffect(() => setDraft(initDraft(id)), [id])
  useEffect(() => {
    document.title = template ? `تعديل ${template.name} — دعوتنا` : "تعديل الدعوة"
  }, [template])

  if (!template) return <Navigate to="/templates" replace />

  function update(partial: Partial<InviteDraft>) {
    setDraft((prev) => {
      const next = { ...prev, ...partial }
      writeDraft(next)
      return next
    })
    setError("")
  }

  function chooseTemplate(nextId: string) {
    const next = { ...draft, templateId: nextId as InviteDraft["templateId"] }
    writeDraft(next)
    navigate(`/editor/${nextId}`)
  }

  function goCheckout() {
    if (!draftReady(draft)) {
      setError("اكتب اسم العريس، اسم العروسة، التاريخ، والمكان.")
      return
    }
    writeDraft(draft)
    navigate("/checkout")
  }

  return (
    <main id="main" className="mx-auto max-w-6xl px-4 py-8 pb-28 lg:py-12">
      <div className="mb-7 flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link to="/templates" className="text-sm font-bold text-[#a64257] hover:underline">← كل التصاميم</Link>
          <h1 className="mt-2 font-display text-3xl text-[#4a2d33] md:text-4xl">جهّز دعوتك</h1>
          <p className="mt-1 text-sm text-[#806b70]">عدّل التفاصيل وشوف النتيجة مباشرة.</p>
        </div>
        <span className="rounded-full bg-white px-4 py-2 text-sm font-bold text-[#a64257] ring-1 ring-[#f0dce1]">{template.name}</span>
      </div>

      <div className="mb-6 rounded-2xl border border-[#f0dce1] bg-white px-4 py-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="text-xs text-[#806b70]">الباقة المختارة</p>
            <strong className="text-[#4a2d33]">{selectedPackage.name} · {selectedPackage.quantity} {selectedPackage.quantity === 1 ? "دعوة" : "دعوات"}</strong>
          </div>
          <strong className="text-xl text-[#a64257]">{money(selectedPackage.price)}</strong>
        </div>
      </div>

      <div className="grid items-start gap-7 lg:grid-cols-[minmax(0,390px)_1fr]">
        <section className="order-1 lg:sticky lg:top-24">
          <div className="mb-3 flex items-center justify-between text-sm">
            <span className="font-bold text-[#4a2d33]">معاينة الدعوة</span>
            <span className="text-[#9a8187]">اضغط على النص للتعديل</span>
          </div>
          <div className="mx-auto max-w-[360px] overflow-hidden rounded-[28px] bg-white p-2 shadow-[0_14px_40px_rgba(74,45,51,0.10)] ring-1 ring-[#f0dce1]">
            <Invitation draft={draft} activeField={active} onSelect={setActive} />
          </div>
          <div className="mx-auto mt-4 flex max-w-[360px] items-center justify-between rounded-2xl border border-[#f0dce1] bg-white px-4 py-3">
            <span className="text-sm text-[#806b70]">متوسط سعر الدعوة</span>
            <strong className="text-lg text-[#4a2d33]">{money(Math.round(selectedPackage.price / selectedPackage.quantity))}</strong>
          </div>
        </section>

        <section className="order-2 min-w-0 rounded-[28px] border border-[#f0dce1] bg-white p-5 shadow-[0_8px_28px_rgba(74,45,51,0.035)] md:p-7">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold text-[#b83b50]">الخطوة ١ من ٢</p>
              <h2 className="mt-1 text-xl font-bold text-[#4a2d33]">تفاصيل المناسبة</h2>
            </div>
            <span className="text-sm text-[#9a8187]">تقدر تعدّل في أي وقت</span>
          </div>

          <div className="mt-5">
            <label className="field">
              <span>التصميم</span>
              <select value={draft.templateId} onChange={(event) => chooseTemplate(event.target.value)}>
                {templates.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
              </select>
            </label>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {fields.map((field) => (
              <label key={field.key} className={`field ${["message", "hosts", "opening"].includes(field.key) ? "sm:col-span-2" : ""}`}>
                <span>{field.label}</span>
                {field.kind === "select" ? (
                  <select
                    value={draft.occasion}
                    onFocus={() => setActive("occasion")}
                    onChange={(event) => update({ occasion: event.target.value })}
                  >
                    {occasions.map((item) => <option key={item}>{item}</option>)}
                  </select>
                ) : (
                  <input
                    type={field.kind}
                    maxLength={field.max}
                    value={draft[field.key]}
                    onFocus={() => setActive(field.key)}
                    onChange={(event) => update({ [field.key]: event.target.value })}
                  />
                )}
              </label>
            ))}
          </div>
          {error ? <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-bold text-red-800" role="alert">{error}</p> : null}
          <div className="mt-7 hidden items-center justify-between border-t border-[#f3e6e9] pt-5 lg:flex">
            <p className="text-sm text-[#806b70]">راجع التفاصيل قبل ما تكمل.</p>
            <button type="button" className="btn-gold" onClick={goCheckout}>كمل ←</button>
          </div>
        </section>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-[#f0dce1] bg-white/95 p-3 backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3">
          <div><p className="text-xs text-[#806b70]">{selectedPackage.name}</p><p className="font-bold text-[#4a2d33]">{money(selectedPackage.price)}</p></div>
          <button type="button" className="btn-gold" onClick={goCheckout}>كمل ←</button>
        </div>
      </div>
    </main>
  )
}
