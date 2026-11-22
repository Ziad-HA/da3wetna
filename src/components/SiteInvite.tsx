import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react"
import { formatArabicDate } from "../lib/format"
import { mapLink } from "../lib/maps"
import type { InviteDraft, Template } from "../types"

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
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//da3wetna//AR",
    "BEGIN:VEVENT",
    `UID:${start}@da3wetna`,
    `DTSTAMP:${start}`,
    `DTSTART:${start}`,
    `DTEND:${end}`,
    `SUMMARY:${esc(`زفاف ${draft.groom} و${draft.bride}`)}`,
    `LOCATION:${esc([draft.venue, draft.city].filter(Boolean).join(" "))}`,
    "END:VEVENT",
    "END:VCALENDAR"
  ].join("\r\n")

  const a = document.createElement("a")
  a.href = URL.createObjectURL(new Blob([ics], { type: "text/calendar;charset=utf-8" }))
  a.download = "wedding.ics"
  a.click()
  URL.revokeObjectURL(a.href)
}

function Countdown({ draft }: { draft: InviteDraft }) {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    const t = window.setInterval(() => setNow(Date.now()), 30000)
    return () => window.clearInterval(t)
  }, [])

  const target = new Date(`${draft.date}T${draft.time || "00:00"}:00`).getTime()
  if (!draft.date || Number.isNaN(target)) return null
  const left = Math.max(0, target - now)
  const cells: [number, string][] = [
    [Math.floor(left / 86400000), "DAYS"],
    [Math.floor((left % 86400000) / 3600000), "HOURS"],
    [Math.floor((left % 3600000) / 60000), "MINUTES"]
  ]

  return (
    <div className="vaux-count">
      {cells.map(([v, l]) => (
        <div key={l} className="vaux-count-item">
          <strong>{v}</strong>
          <span>{l}</span>
        </div>
      ))}
    </div>
  )
}

function Faq({ items }: { items: { a: string; b: string }[] }) {
  const [open, setOpen] = useState(-1)
  return (
    <ul className="vaux-places-list">
      {items.map((q, i) => (
        <li key={i} className="vaux-place-item">
          <button
            type="button"
            aria-expanded={open === i}
            onClick={() => setOpen(open === i ? -1 : i)}
            className="vaux-place-btn"
          >
            <span>{q.a}</span>
            <b aria-hidden="true">{open === i ? "−" : "+"}</b>
          </button>
          {open === i && q.b ? <p className="vaux-place-desc">{q.b}</p> : null}
        </li>
      ))}
    </ul>
  )
}

type Props = { draft: InviteDraft; template: Template; rsvp?: ReactNode }

export function SiteInvite({ draft, template, rsvp }: Props) {
  const root = useRef<HTMLElement>(null)
  const style = {
    "--paper": template.vars.paper,
    "--ink": template.vars.ink,
    "--gold": template.vars.gold,
    "--soft": template.vars.soft
  } as CSSProperties

  const program = pairs(draft.program, 8)
  const faq = pairs(draft.faq, 6)
  const dateObj = new Date(`${draft.date}T00:00:00`)
  const validDate = draft.date && !Number.isNaN(dateObj.getTime())
  const phone = draft.rsvpPhone.replace(/\D/g, "")

  useEffect(() => {
    const el = root.current
    if (!el || !("IntersectionObserver" in window)) return
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-in")
            io.unobserve(e.target)
          }
        })
      },
      { threshold: 0.12 }
    )
    el.querySelectorAll(".site-reveal").forEach((n) => io.observe(n))
    return () => io.disconnect()
  }, [])

  return (
    <article ref={root} className="vaux-site" style={style}>
      {/* 1. Hero Card */}
      <section className="vaux-hero-card">
        <div className="vaux-hero-inner">
          <img src="/vaux/hero_card_blank.jpg" alt="" className="vaux-hero-bg" />
          <div className="vaux-hero-content">
            <img src="/vaux/monogram_rose.png" alt="" className="vaux-hero-monogram" />
            <h1 className="vaux-hero-names">
              <span>{draft.groom}</span>
              <span className="vaux-amp">&</span>
              <span>{draft.bride}</span>
            </h1>
            <p className="vaux-hero-hosts">
              {draft.hosts || "JOYFULLY INVITE YOU TO CELEBRATE THEIR WEDDING"}
            </p>
          </div>
        </div>
      </section>

      {/* 2. Countdown */}
      <section className="vaux-sec site-reveal">
        <h2 className="vaux-script-title">Countdown</h2>
        <p className="vaux-subhead">
          UNTIL {validDate ? new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric" }).format(dateObj).toUpperCase() : formatArabicDate(draft.date)}
        </p>
        <Countdown draft={draft} />
      </section>

      {/* 3. Our Story inside Calla Scalloped Oval */}
      {draft.story ? (
        <section className="vaux-sec site-reveal vaux-story-sec">
          <div className="vaux-story-wrapper">
            <img src="/vaux/story_frame.jpg" alt="" className="vaux-story-bg" />
            <div className="vaux-story-content">
              <span className="vaux-story-kicker">OUR STORY</span>
              <h2 className="vaux-story-heading">A rose, a book</h2>
              <div className="vaux-story-text">
                {draft.story.split("\n").map((line, idx) => (
                  <p key={idx}>{line}</p>
                ))}
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {/* 4. Reception / The Monks' Cellar */}
      <section className="vaux-sec site-reveal vaux-reception-sec">
        <div className="vaux-reception-img-wrapper">
          <img src="/vaux/cellar.jpg" alt="The monks' cellar" className="vaux-reception-img" />
        </div>
        <div className="vaux-reception-copy">
          <span className="vaux-kicker">COCKTAIL, DINNER & DANCING</span>
          <h2 className="vaux-script-title">The monks' cellar</h2>
          <p className="vaux-body-text">Cocktail in the cloister, dinner beneath the vaults</p>
          <p className="vaux-body-meta">{draft.venue || "Abbaye des Vaux-de-Cernay"}</p>
          <p className="vaux-time-display">{draft.time ? draft.time : "5:30 pm"}</p>
          <div className="vaux-btn-row">
            <a href={mapLink(draft)} target="_blank" rel="noreferrer" className="vaux-btn">MAP</a>
            {validDate ? (
              <button type="button" onClick={() => downloadIcs(draft)} className="vaux-btn">
                CALENDAR
              </button>
            ) : null}
          </div>
        </div>
      </section>

      {/* 5. Menu Section */}
      <section className="vaux-sec site-reveal vaux-menu-sec">
        <div className="vaux-wines-wrapper">
          <img src="/vaux/wines.jpg" alt="Wines" className="vaux-wines-img" />
        </div>
        <span className="vaux-kicker">DINNER & REFRESHMENTS</span>
        {draft.dressCode ? (
          <div className="vaux-menu-note">
            <p className="vaux-dresscode-text">{draft.dressCode}</p>
          </div>
        ) : null}
        {program.length ? (
          <ol className="vaux-program-list">
            {program.map((p, i) => (
              <li key={i} className="vaux-program-item">
                <time>{p.b ? p.a : ""}</time>
                <span>{p.b || p.a}</span>
              </li>
            ))}
          </ol>
        ) : null}
      </section>

      {/* 6. Accommodations & Places */}
      <section className="vaux-sec site-reveal vaux-places-sec">
        <span className="vaux-kicker">OUR FAVORITE PLACES</span>
        {faq.length ? <Faq items={faq} /> : null}
        <div className="vaux-car-wrapper">
          <img src="/vaux/vintage_car.jpg" alt="Vintage Wedding Car" className="vaux-car-img" />
        </div>
      </section>

      {/* 7. RSVP Section */}
      {rsvp ? (
        <section className="vaux-sec site-reveal vaux-rsvp-sec">
          <img src="/vaux/wax_seal.png" alt="Seal" className="vaux-seal-icon" />
          <h2 className="vaux-script-title">RSVP</h2>
          <p className="vaux-kicker">KINDLY REPLY BEFORE AUGUST 1, 2027</p>
          <div className="vaux-rsvp-wrapper">{rsvp}</div>
        </section>
      ) : null}

      {/* 8. Questions & Contact */}
      <section className="vaux-sec site-reveal vaux-contact-sec">
        <div className="vaux-divider-wrapper">
          <img src="/vaux/flower_divider.jpg" alt="" className="vaux-flower-divider" />
        </div>
        <h2 className="vaux-script-title">A question?</h2>
        <p className="vaux-body-text">
          {draft.hosts || "Margaux is orchestrating the weekend; for any question or request, write to her."}
        </p>
        {phone ? (
          <div className="vaux-btn-row">
            <a href={`https://wa.me/${phone}`} target="_blank" rel="noreferrer" className="vaux-btn">
              WHATSAPP
            </a>
            <a href={`tel:+${phone}`} className="vaux-btn">
              CALL
            </a>
          </div>
        ) : null}
        <div className="vaux-footer-monogram">
          <img src="/vaux/monogram_rose.png" alt="" />
        </div>
      </section>
    </article>
  )
}
