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
  const requiredItems = [
    { label: "اسم العريس", done: Boolean(draft.groom.trim()) },
    { label: "اسم العروسة", done: Boolean(draft.bride.trim()) },
    { label: "تاريخ المناسبة", done: Boolean(draft.date) },
    { label: "مكان المناسبة", done: Boolean(draft.venue.trim()) },
  ]
  const completedItems = requiredItems.filter((item) => item.done).length
  const progress = Math.round((completedItems / requiredItems.length) * 100)

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
    <main id="main" className="relative isolate mx-auto max-w-6xl overflow-hidden px-4 py-8 pb-28 lg:py-12">
      <div aria-hidden="true" className="pointer-events-none absolute -right-32 top-0 -z-10 h-80 w-80 rounded-full bg-[#f8e3e8]/60 blur-3xl" />
      <div aria-hidden="true" className="pointer-events-none absolute -left-32 top-96 -z-10 h-72 w-72 rounded-full bg-[#f5eadb]/55 blur-3xl" />
      <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
        <div>
          <Link to="/templates" className="inline-flex items-center gap-2 text-sm font-bold text-[#a64257] transition hover:gap-3">← رجوع للتصميمات</Link>
          <div className="mt-3 flex items-center gap-2 text-xs font-bold tracking-wide text-[#b36a78]"><span className="h-px w-7 bg-[#d9a3ae]" /> دعوة على ذوقك <span className="text-[#c6a15b]">✦</span></div>
          <h1 className="mt-2 font-display text-4xl text-[#4a2d33] md:text-5xl">خلّي دعوتك تحكي فرحتك</h1>
          <p className="mt-2 max-w-xl text-sm leading-7 text-[#806b70]">اكتب تفاصيل مناسبتك، وشوف كل تغيير بيظهر في التصميم قدامك فورًا.</p>
        </div>
        <span className="inline-flex items-center gap-2 rounded-full border border-[#efd5dc] bg-white/90 px-4 py-2.5 text-sm font-bold text-[#a64257] shadow-sm"><span className="text-[#c6a15b]">✦</span>{template.name}<span className="text-[#c6a15b]">✦</span></span>
      </div>

      <section className="mb-5 rounded-[26px] border border-white bg-white/90 p-4 shadow-[0_12px_35px_rgba(115,65,77,0.06)] ring-1 ring-[#f0dce1] md:p-5" aria-label="اكتمال بيانات الدعوة">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-bold text-[#4a2d33]">جهّز بيانات دعوتك</p>
            <p className="mt-1 text-xs text-[#806b70]">كمّل البيانات الأساسية عشان تقدر تنتقل لتأكيد الطلب.</p>
          </div>
          <strong className="text-sm text-[#a64257]">{completedItems} من {requiredItems.length} مكتمل</strong>
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#f7e9ec]" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress} aria-label="نسبة اكتمال بيانات الدعوة">
          <div className="h-full rounded-full bg-[#b83b50] transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {requiredItems.map((item) => (
            <div key={item.label} className="flex items-center gap-2 text-xs">
              <span className={`grid h-5 w-5 shrink-0 place-items-center rounded-full ${item.done ? "bg-[#edf7ef] text-[#28734b]" : "bg-[#fff0f2] text-[#a64257]"}`} aria-hidden="true">{item.done ? "✓" : "○"}</span>
              <span className={item.done ? "text-[#527566]" : "text-[#806b70]"}>{item.label}</span>
            </div>
          ))}
        </div>
      </section>

      <div className="mb-7 rounded-[22px] border border-[#efdce0] bg-[linear-gradient(110deg,#fff_0%,#fff7f8_100%)] px-5 py-4 shadow-[0_8px_24px_rgba(115,65,77,0.045)]">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="text-xs text-[#806b70]">الباقة المختارة</p>
            <strong className="text-[#4a2d33]">{selectedPackage.name} · {selectedPackage.quantity} {selectedPackage.quantity === 1 ? "دعوة" : "دعوات"}</strong>
            <Link to={`/packages?return=/editor/${template.id}`} className="mt-1 inline-block text-xs font-bold text-[#a64257] underline underline-offset-4">تغيير الباقة</Link>
          </div>
          <strong className="text-xl text-[#a64257]">{money(selectedPackage.price)}</strong>
        </div>
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,390px)_1fr]">
        <section className="order-2 lg:order-1 lg:sticky lg:top-24">
          <div className="mb-3 flex items-center justify-between gap-3 rounded-2xl border border-[#f0dce1] bg-white/85 px-4 py-3 shadow-sm">
            <div><p className="text-sm font-extrabold text-[#4a2d33]">معاينة حية</p><p className="mt-0.5 text-[11px] text-[#9a8187]">كل تعديل هيظهر هنا</p></div>
            <span className="rounded-full bg-[#fff0f2] px-3 py-1.5 text-[11px] font-bold text-[#a64257]">مباشر ✦</span>
          </div>
          <div className="relative mx-auto max-w-[360px] overflow-hidden rounded-[32px] border border-white bg-[radial-gradient(circle_at_50%_15%,#fff_0%,#f9e9ec_55%,#f3e4dc_100%)] p-3 shadow-[0_22px_55px_rgba(115,65,77,0.14)] ring-1 ring-[#efdce0]">
            <Invitation draft={draft} activeField={active} onSelect={setActive} />
          </div>
          <div className="mx-auto mt-4 flex max-w-[360px] items-center justify-between rounded-2xl border border-[#f0dce1] bg-white px-4 py-3">
            <span className="text-sm text-[#806b70]">متوسط سعر الدعوة</span>
            <strong className="text-lg text-[#4a2d33]">{money(Math.round(selectedPackage.price / selectedPackage.quantity))}</strong>
          </div>
        </section>

        <section className="order-1 min-w-0 overflow-hidden rounded-[30px] border border-white bg-white/95 p-5 shadow-[0_18px_48px_rgba(115,65,77,0.075)] ring-1 ring-[#f0dce1] md:p-7">
          <div className="-mx-5 -mt-5 mb-6 h-1.5 bg-[linear-gradient(90deg,#c6a15b_0%,#e8bdc8_45%,#a64257_100%)] md:-mx-7 md:-mt-7" />
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2"><span className="grid h-7 w-7 place-items-center rounded-full bg-[#a64257] text-xs font-extrabold text-white">١</span><p className="text-xs font-bold text-[#b83b50]">الخطوة الأولى</p></div>
              <h2 className="mt-2 text-2xl font-extrabold text-[#4a2d33]">تفاصيل المناسبة</h2>
            </div>
            <span className="rounded-full bg-[#fff8f8] px-3 py-1.5 text-[11px] font-semibold text-[#9a8187]">بتتحفظ تلقائيًا</span>
          </div>

          <div className="mt-5 rounded-2xl border border-[#f3e6e9] bg-[#fffdfd] p-4">
            <label className="field">
              <span>التصميم</span>
              <select value={draft.templateId} onChange={(event) => chooseTemplate(event.target.value)}>
                {templates.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
              </select>
            </label>
          </div>

          <div className="mt-4 rounded-[22px] border border-[#f1e0e4] bg-[linear-gradient(145deg,#fff8f8_0%,#fffdfb_100%)] p-4 md:p-5">
            <h3 className="font-bold text-[#4a2d33]">البيانات الأساسية</h3>
            <p className="mt-1 text-xs text-[#806b70]">ابدأ بالأسماء وميعاد ومكان المناسبة.</p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {fields.filter((field) => ["occasion", "groom", "bride", "date", "time", "venue"].includes(field.key)).map((field) => (
                <label key={field.key} className="field">
                  <span>{field.label}{["groom", "bride", "date", "venue"].includes(field.key) ? " *" : ""}</span>
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
          </div>

          <details className="mt-4 rounded-[22px] border border-[#f0dce1] bg-white p-4 transition open:bg-[#fffdfd]">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 font-bold text-[#a64257]"><span className="flex items-center gap-2"><span className="grid h-7 w-7 place-items-center rounded-full bg-[#fff0f2]">＋</span> إضافات اختيارية للدعوة</span><span className="text-xs font-normal text-[#9a8187]">اختياري</span></summary>
            <p className="mt-2 text-xs leading-6 text-[#806b70]">تقدر تسيب الإضافات دي زي ما هي، أو تخصص نص الدعوة والمدينة.</p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {fields.filter((field) => ["opening", "hosts", "message", "city"].includes(field.key)).map((field) => (
                <label key={field.key} className={`field ${["message", "hosts", "opening"].includes(field.key) ? "sm:col-span-2" : ""}`}>
                  <span>{field.label}</span>
                  <input
                    type="text"
                    maxLength={field.max}
                    value={draft[field.key]}
                    onFocus={() => setActive(field.key)}
                    onChange={(event) => update({ [field.key]: event.target.value })}
                  />
                </label>
              ))}
            </div>
          </details>
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
