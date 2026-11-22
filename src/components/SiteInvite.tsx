import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react"
import { formatArabicDate } from "../lib/format"
import { mapLink } from "../lib/maps"
import type { InviteDraft, Template } from "../types"
import { Calla, Cypress, Fountain, ScallopOval, Vine } from "./Botanicals"

const num = (n: number | string) => Number(n).toLocaleString("ar-EG", { useGrouping: false })

const pairs = (raw: string, max: number) =>
  raw.split("\n").map((l) => l.trim()).filter(Boolean).slice(0, max).map((l) => {
    const i = l.indexOf("|")
    return i < 0 ? { a: l, b: "" } : { a: l.slice(0, i).trim(), b: l.slice(i + 1).trim() }
  })

const pad = (n: number) => String(n).padStart(2, "0")

/** ملف تقويم (.ics) عشان الضيف يضيف الموعد على موبايله. */
function downloadIcs(draft: InviteDraft) {
  const [y, m, d] = draft.date.split("-").map(Number)
  const [hh, mm] = (draft.time || "18:00").split(":").map(Number)
  const start = `${y}${pad(m)}${pad(d)}T${pad(hh)}${pad(mm)}00`
  const end = `${y}${pad(m)}${pad(d)}T${pad(Math.min(23, hh + 4))}${pad(mm)}00`
  const esc = (s: string) => s.replace(/[,;\\]/g, " ").replace(/\n/g, " ")
  const ics = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//da3wetna//AR", "BEGIN:VEVENT", `UID:${start}@da3wetna`, `DTSTAMP:${start}`, `DTSTART:${start}`, `DTEND:${end}`,
    `SUMMARY:${esc(`زفاف ${draft.groom} و${draft.bride}`)}`, `LOCATION:${esc([draft.venue, draft.city].filter(Boolean).join(" "))}`, "END:VEVENT", "END:VCALENDAR"].join("\r\n")
  const a = document.createElement("a")
  a.href = URL.createObjectURL(new Blob([ics], { type: "text/calendar;charset=utf-8" }))
  a.download = "wedding.ics"
  a.click()
  URL.revokeObjectURL(a.href)
}

function Countdown({ draft }: { draft: InviteDraft }) {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => { const t = window.setInterval(() => setNow(Date.now()), 30000); return () => window.clearInterval(t) }, [])
  const target = new Date(`${draft.date}T${draft.time || "00:00"}:00`).getTime()
  if (!draft.date || Number.isNaN(target)) return null
  const left = Math.max(0, target - now)
  const cells: [number, string][] = [[Math.floor(left / 86400000), "يوم"], [Math.floor((left % 86400000) / 3600000), "ساعة"], [Math.floor((left % 3600000) / 60000), "دقيقة"]]
  return (
    <div className="site-count" dir="rtl">
      {cells.map(([v, l]) => <div key={l}><strong>{num(v)}</strong><span>{l}</span></div>)}
    </div>
  )
}

function Faq({ items }: { items: { a: string; b: string }[] }) {
  const [open, setOpen] = useState(-1)
  return (
    <ul className="site-faq">
      {items.map((q, i) => (
        <li key={i}>
          <button type="button" aria-expanded={open === i} onClick={() => setOpen(open === i ? -1 : i)}>
            <span className="site-faq-n">{num(pad(i + 1))}</span><span>{q.a}</span><b aria-hidden="true">{open === i ? "−" : "+"}</b>
          </button>
          {open === i ? <p>{q.b}</p> : null}
        </li>
      ))}
    </ul>
  )
}

type Props = { draft: InviteDraft; template: Template; rsvp?: ReactNode }

/** صفحة الزفاف الطويلة: قوس زهور، عدّاد، حكايتنا، البرنامج، RSVP، أسئلة. */
export function SiteInvite({ draft, template, rsvp }: Props) {
  const root = useRef<HTMLElement>(null)
  const style = { "--paper": template.vars.paper, "--ink": template.vars.ink, "--gold": template.vars.gold, "--soft": template.vars.soft } as CSSProperties
  const initials = `${draft.groom.trim().charAt(0)}·${draft.bride.trim().charAt(0)}`
  const program = pairs(draft.program, 8)
  const faq = pairs(draft.faq, 6)
  const place = [draft.venue, draft.city].filter(Boolean).join("، ")
  const dateObj = new Date(`${draft.date}T00:00:00`)
  const validDate = draft.date && !Number.isNaN(dateObj.getTime())
  const phone = draft.rsvpPhone.replace(/\D/g, "")

  useEffect(() => {
    const el = root.current
    if (!el || !("IntersectionObserver" in window)) return
    const io = new IntersectionObserver((entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target) } }), { threshold: 0.12 })
    el.querySelectorAll(".site-reveal").forEach((n) => io.observe(n))
    return () => io.disconnect()
  }, [])

  return (
    <article ref={root} className="site" style={style}>
      <section className="site-hero">
        <Vine className="site-vine site-vine-r" seed={5} height={430} />
        <Vine className="site-vine site-vine-l" seed={11} height={430} mirror />
        <div className="site-hero-copy">
          <p className="site-mono" aria-hidden="true">{initials}</p>
          <p className="site-kicker">{draft.opening || "بسم الله الرحمن الرحيم"}</p>
          <h1 className="site-names">{draft.groom}<i>و</i>{draft.bride}</h1>
          <p className="site-line">{draft.hosts || "يتشرفان بدعوتكم لحضور زفافهما"}</p>
          <div className="site-datebox">
            <span>{validDate ? new Intl.DateTimeFormat("ar-EG", { month: "long" }).format(dateObj) : ""}</span>
            <strong>{validDate ? num(dateObj.getDate()) : "—"}</strong>
            <span>{validDate ? num(dateObj.getFullYear()) : ""}</span>
          </div>
          <p className="site-weekday">{validDate ? new Intl.DateTimeFormat("ar-EG", { weekday: "long" }).format(dateObj) : ""}</p>
          <p className="site-place">{place}</p>
          {draft.time ? <p className="site-script">الساعة {draft.time}</p> : null}
        </div>
        <div className="site-garden" aria-hidden="true">
          <Cypress className="cy c1" /><Cypress className="cy c2" /><Fountain className="fountain" /><Cypress className="cy c3" /><Cypress className="cy c4" />
        </div>
      </section>

      <section className="site-sec site-reveal">
        <p className="site-small">{draft.message || "بانتظاركم لنشارككم أجمل أيام العمر"}</p>
        <h2 className="site-h">العدّ التنازلي</h2>
        <p className="site-small">حتى {formatArabicDate(draft.date)}</p>
        <Countdown draft={draft} />
      </section>

      {draft.story ? (
        <section className="site-sec site-story site-reveal">
          <div className="site-oval">
            <ScallopOval className="site-oval-line" />
            <Calla className="site-calla c-a" /><Calla className="site-calla c-b" flip />
            <div className="site-oval-in">
              <p className="site-small">حكايتنا</p>
              <h2 className="site-h">صفحة في كتاب</h2>
              <p className="site-story-text">{draft.story}</p>
            </div>
          </div>
        </section>
      ) : null}

      <section className="site-sec site-reveal">
        <h2 className="site-h">الحفل</h2>
        <p className="site-small">{draft.occasion}</p>
        <p className="site-venue">{draft.venue}</p>
        <p className="site-small">{[draft.city, formatArabicDate(draft.date)].filter(Boolean).join(" · ")}</p>
        {draft.time ? <p className="site-script big">{draft.time}</p> : null}
        <div className="site-btns">
          <a href={mapLink(draft)} target="_blank" rel="noreferrer">الخريطة</a>
          {validDate ? <button type="button" onClick={() => downloadIcs(draft)}>أضف للتقويم</button> : null}
        </div>
      </section>

      {program.length ? (
        <section className="site-sec site-reveal">
          <h2 className="site-h">برنامج اليوم</h2>
          <ol className="site-prog">
            {program.map((p, i) => <li key={i}><time>{p.b ? p.a : ""}</time><span>{p.b || p.a}</span></li>)}
          </ol>
        </section>
      ) : null}

      {draft.dressCode ? (
        <section className="site-sec site-reveal">
          <h2 className="site-h">كود اللبس</h2>
          <p className="site-story-text">{draft.dressCode}</p>
          <div className="site-palette" aria-hidden="true">{["#7A1F2D", "#C9707F", "#E7B8B8", "#6C7A3A", "#EFE6CF"].map((c) => <i key={c} style={{ background: c }} />)}</div>
        </section>
      ) : null}

      {rsvp ? (
        <section className="site-sec site-reveal site-rsvp">
          <div className="site-wax" aria-hidden="true"><span>{initials}</span></div>
          <h2 className="site-h">تأكيد الحضور</h2>
          <div className="site-rsvp-form">{rsvp}</div>
        </section>
      ) : null}

      {faq.length ? (
        <section className="site-sec site-reveal">
          <h2 className="site-h">أسئلة وأجوبة</h2>
          <Faq items={faq} />
        </section>
      ) : null}

      {phone ? (
        <section className="site-sec site-reveal">
          <h2 className="site-h">محتاجين حاجة؟</h2>
          <div className="site-btns">
            <a href={`https://wa.me/${phone}`} target="_blank" rel="noreferrer">واتساب</a>
            <a href={`tel:+${phone}`}>اتصال</a>
          </div>
        </section>
      ) : null}

      <section className="site-sec site-end site-reveal">
        <p className="site-mono" aria-hidden="true">{initials}</p>
        <p className="site-script big">{draft.groom} و{draft.bride}</p>
        <p className="site-small">{[validDate ? formatArabicDate(draft.date) : "", draft.city].filter(Boolean).join(" · ")}</p>
      </section>
    </article>
  )
}
