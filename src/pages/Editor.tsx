import { useEffect, useState } from "react"
import { Link, Navigate, useNavigate, useParams } from "react-router-dom"
import { Invitation } from "../components/Invitation"
import { site } from "../config"
import { getTemplate, occasions, templates } from "../data"
import { money } from "../lib/format"
import { draftReady, initDraft, writeDraft } from "../lib/storage"
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
  const [draft, setDraft] = useState<InviteDraft>(() => initDraft(id))
  const [active, setActive] = useState<FieldKey | null>("groom")
  const [error, setError] = useState("")

  useEffect(() => {
    setDraft(initDraft(id))
  }, [id])

  useEffect(() => {
    document.title = template ? `${template.name} — زفّة` : "تعديل الدعوة"
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
    <main id="main" className="mx-auto grid max-w-6xl gap-8 px-4 py-8 pb-36 lg:grid-cols-[minmax(0,420px)_1fr] lg:pb-10">
      <section className="lg:sticky lg:top-24 lg:self-start">
        <p className="mb-3 text-center text-sm font-bold text-gold">اضغط على أي كلمة وعدّلها</p>
        <div className="mx-auto max-w-[380px] overflow-hidden rounded-[32px] shadow-xl ring-1 ring-black/10">
          <Invitation draft={draft} activeField={active} onSelect={setActive} />
        </div>
      </section>
      <section>
        <Link to="/templates" className="text-sm font-bold text-gold">كل التصاميم</Link>
        <h1 className="mt-2 font-display text-4xl">{template.name}</h1>
        <p className="mt-2 text-mute">{template.blurb}</p>
        <div className="mt-5 flex gap-2 overflow-x-auto pb-2" aria-label="تغيير التصميم">
          {templates.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => chooseTemplate(item.id)}
              className={`h-11 shrink-0 cursor-pointer rounded-full px-4 text-sm font-bold ${item.id === draft.templateId ? "bg-ink text-cream" : "bg-card ring-1 ring-line"}`}
            >
              {item.name}
            </button>
          ))}
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {fields.map((field) => (
            <label key={field.key} className={`field ${field.key === "message" || field.key === "hosts" || field.key === "opening" ? "sm:col-span-2" : ""}`}>
              <span>{field.label}</span>
              {field.kind === "select" ? (
                <select
                  value={draft.occasion}
                  onFocus={() => setActive("occasion")}
                  onChange={(event) => update({ occasion: event.target.value })}
                >
                  {occasions.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
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
        {error ? <p className="mt-4 text-sm font-bold text-red-800" role="alert">{error}</p> : null}
        <div className="mt-6 hidden items-center justify-between gap-4 rounded-3xl bg-card p-4 ring-1 ring-line lg:flex">
          <div>
            <p className="text-sm text-mute">دعوة واحدة</p>
            <p className="text-2xl font-bold">{money(site.price)}</p>
          </div>
          <button type="button" className="btn-gold" onClick={goCheckout}>كمل للدفع</button>
        </div>
      </section>
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-cream/95 p-3 backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3">
          <p className="font-bold">{money(site.price)}</p>
          <button type="button" className="btn-gold" onClick={goCheckout}>كمل للدفع</button>
        </div>
      </div>
    </main>
  )
}
