import { useState } from "react"
import { submitRsvp } from "../lib/api"

const KEY = (id: string) => `da3wetna-rsvp-${id}`

/** فورم تأكيد الحضور — الردود بتوصل للوحة صاحب الدعوة بالاسم والعدد. */
export function RsvpForm({ inviteId }: { inviteId: string }) {
  const [done, setDone] = useState<"yes" | "no" | "">(() => {
    try { return (localStorage.getItem(KEY(inviteId)) as "yes" | "no" | null) ?? "" } catch { return "" }
  })
  const [name, setName] = useState("")
  const [attending, setAttending] = useState(true)
  const [guests, setGuests] = useState(1)
  const [note, setNote] = useState("")
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState("")

  async function send(event: React.FormEvent) {
    event.preventDefault()
    if (name.trim().length < 2) { setError("اكتب اسمك من فضلك."); return }
    setBusy(true)
    setError("")
    const r = await submitRsvp({ inviteId, name: name.trim(), attending, guests: attending ? guests : 0, note: note.trim() })
    setBusy(false)
    if (!r.ok) {
      setError(r.status === 429 ? "محاولات كتير، جرّب بعد شوية." : "حصلت مشكلة، جرّب تاني.")
      return
    }
    const value = attending ? "yes" : "no"
    try { localStorage.setItem(KEY(inviteId), value) } catch { /* التخزين مقفول */ }
    setDone(value)
  }

  if (done) {
    return (
      <section className="w-full rounded-[26px] border border-white/70 bg-white/85 p-5 text-center shadow-lg" aria-live="polite">
        <span className="text-3xl text-[#b83b50]">{done === "yes" ? "♡" : "✿"}</span>
        <p className="mt-2 font-bold text-[#4a2d33]">{done === "yes" ? "وصلنا تأكيد حضورك، منتظرينك!" : "وصلنا ردك، شكرًا إنك عرّفتنا."}</p>
        <button type="button" onClick={() => setDone("")} className="mt-3 text-xs font-bold text-[#a64257] underline underline-offset-4">إرسال رد تاني</button>
      </section>
    )
  }

  return (
    <form onSubmit={send} className="w-full rounded-[26px] border border-white/70 bg-white/85 p-5 text-[#4a2d33] shadow-lg" noValidate>
      <h2 className="text-center font-display text-2xl">تأكيد الحضور</h2>
      <p className="mt-1 text-center text-xs text-[#806b70]">عرّفنا هتيجي ولا لأ عشان نجهّز لحضرتك.</p>
      <label className="field mt-4">
        <span>اسمك</span>
        <input value={name} maxLength={60} autoComplete="name" onChange={(e) => setName(e.target.value)} placeholder="الاسم بالكامل" />
      </label>
      <div className="mt-4 grid grid-cols-2 gap-2" role="radiogroup" aria-label="هتحضر؟">
        {[{ v: true, t: "هحضر إن شاء الله" }, { v: false, t: "للأسف مش هقدر" }].map((o) => (
          <button key={String(o.v)} type="button" role="radio" aria-checked={attending === o.v} onClick={() => setAttending(o.v)}
            className={`min-h-12 rounded-2xl border px-2 text-sm font-bold transition ${attending === o.v ? "border-[#a64257] bg-[#a64257] text-white" : "border-[#ecd5da] bg-white text-[#806b70]"}`}>
            {o.t}
          </button>
        ))}
      </div>
      {attending ? (
        <div className="mt-4 flex items-center justify-between rounded-2xl bg-[#fff8f8] px-4 py-3">
          <span className="text-sm font-bold">عدد الحضور (معاك)</span>
          <div className="flex items-center gap-3">
            <button type="button" aria-label="أقل" disabled={guests <= 1} onClick={() => setGuests((g) => g - 1)} className="grid h-11 w-11 place-items-center rounded-full border border-[#e8c8cf] bg-white text-xl text-[#a64257] disabled:opacity-35">−</button>
            <strong className="w-6 text-center text-lg">{guests}</strong>
            <button type="button" aria-label="أكتر" disabled={guests >= 10} onClick={() => setGuests((g) => g + 1)} className="grid h-11 w-11 place-items-center rounded-full border border-[#e8c8cf] bg-white text-xl text-[#a64257] disabled:opacity-35">+</button>
          </div>
        </div>
      ) : null}
      <label className="field mt-4">
        <span>كلمة للعروسين (اختياري)</span>
        <input value={note} maxLength={200} onChange={(e) => setNote(e.target.value)} placeholder="مبروك ♡" />
      </label>
      {error ? <p className="mt-3 rounded-xl bg-red-50 px-4 py-2 text-sm font-bold text-red-800" role="alert">{error}</p> : null}
      <button type="submit" disabled={busy} className="btn-gold mt-5 w-full">{busy ? "بنبعت ردك..." : "أرسل ردي"}</button>
    </form>
  )
}
