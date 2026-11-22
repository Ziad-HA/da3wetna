import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react"
import { formatArabicDate } from "../lib/format"
import { mapLink } from "../lib/maps"
import type { InviteDraft, Template } from "../types"

const pad = (n: number) => String(n).padStart(2, "0")

const formatTime = (value: string) => {
  const [hour, minute] = value.split(":").map(Number)
  if (!Number.isFinite(hour) || !Number.isFinite(minute)) return value
  return new Intl.DateTimeFormat("ar-EG", { hour: "numeric", minute: "2-digit", hour12: true }).format(new Date(2000, 0, 1, hour, minute))
}

function downloadIcs(draft: InviteDraft) {
  const [y, m, d] = draft.date.split("-").map(Number)
  const [hh, mm] = (draft.time || "18:00").split(":").map(Number)
  const start = String(y) + pad(m) + pad(d) + "T" + pad(hh) + pad(mm) + "00"
  const end = String(y) + pad(m) + pad(d) + "T" + pad(Math.min(23, hh + 4)) + pad(mm) + "00"
  const clean = (value: string) => value.replace(/[,;\\]/g, " ").replace(/\n/g, " ")
  const ics = [
    "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//da3wetna//AR", "BEGIN:VEVENT",
    "UID:" + start + "@da3wetna", "DTSTAMP:" + start, "DTSTART:" + start, "DTEND:" + end,
    "SUMMARY:" + clean("زفاف " + draft.groom + " و" + draft.bride),
    "LOCATION:" + clean([draft.venue, draft.city].filter(Boolean).join(" ")),
    "END:VEVENT", "END:VCALENDAR"
  ].join("\r\n")
  const url = URL.createObjectURL(new Blob([ics], { type: "text/calendar;charset=utf-8" }))
  const link = document.createElement("a")
  link.href = url
  link.download = "موعد-الزفاف.ics"
  link.click()
  URL.revokeObjectURL(url)
}

function Countdown({ draft }: { draft: InviteDraft }) {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 30000)
    return () => window.clearInterval(timer)
  }, [])
  const target = new Date(draft.date + "T" + (draft.time || "00:00") + ":00").getTime()
  if (!draft.date || Number.isNaN(target)) return null
  const left = Math.max(0, target - now)
  const cells: [number, string][] = [
    [Math.floor(left / 86400000), "يوم"],
    [Math.floor((left % 86400000) / 3600000), "ساعة"],
    [Math.floor((left % 3600000) / 60000), "دقيقة"]
  ]
  return <div className="vaux-count" dir="rtl">{cells.map(([value, label]) => (
    <div key={label} className="vaux-count-item"><strong>{value}</strong><span>{label}</span></div>
  ))}</div>
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
  const program = draft.program.split("\n").map((line) => {
    const split = line.indexOf("|")
    return split < 0 ? { time: "", title: line.trim() } : { time: line.slice(0, split).trim(), title: line.slice(split + 1).trim() }
  }).filter((item) => item.title)
  const date = new Date(draft.date + "T00:00:00")
  const validDate = Boolean(draft.date) && !Number.isNaN(date.getTime())

  useEffect(() => {
    const element = root.current
    if (!element || !("IntersectionObserver" in window)) return
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in")
          observer.unobserve(entry.target)
        }
      })
    }, { threshold: 0.12 })
    element.querySelectorAll(".site-reveal").forEach((node) => observer.observe(node))
    return () => observer.disconnect()
  }, [])

  return (
    <article ref={root} className="vaux-site" style={style} dir="rtl" lang="ar">
      <section className="vaux-hero-card">
        <div className="vaux-hero-inner">
          <img src="/vaux/hero_card_blank.jpg" alt="" className="vaux-hero-bg" />
          <div className="vaux-hero-content">
            <img src="/vaux/monogram_rose.png" alt="" className="vaux-hero-monogram" />
            <h1 className="vaux-hero-names">
              <span>{draft.groom}</span><span className="vaux-amp">و</span><span>{draft.bride}</span>
            </h1>
            <p className="vaux-hero-hosts">{draft.hosts || "يتشرف الأهل بدعوتكم لحضور حفل الزفاف"}</p>
          </div>
        </div>
      </section>

      <section className="vaux-sec site-reveal">
        <span className="vaux-kicker">فرحتنا تكمل بوجودكم</span>
        <h2 className="vaux-script-title">باقي على فرحتنا</h2>
        {validDate ? <><p className="vaux-subhead">{formatArabicDate(draft.date)}</p><Countdown draft={draft} /></> : <p className="vaux-body-text">مستنيين اليوم اللي يجمعنا بيكم</p>}
      </section>

      {draft.story ? <section className="vaux-sec site-reveal vaux-story-sec">
        <div className="vaux-story-wrapper">
          <img src="/vaux/story_frame.jpg" alt="" className="vaux-story-bg" />
          <div className="vaux-story-content">
            <span className="vaux-story-kicker">حكايتنا</span>
            <h2 className="vaux-story-heading">بداية حكاية جديدة</h2>
            <div className="vaux-story-text">{draft.story.split("\n").map((line, index) => <p key={index}>{line}</p>)}</div>
          </div>
        </div>
      </section> : null}

      <section className="vaux-sec site-reveal vaux-reception-sec">
        <div className="vaux-reception-copy">
          <span className="vaux-kicker">مستنيينكم تشاركونا</span>
          <h2 className="vaux-script-title">ميعادنا ومكاننا</h2>
          {validDate ? <p className="vaux-body-text">{formatArabicDate(draft.date)}</p> : null}
          <p className="vaux-time-display">{draft.time ? formatTime(draft.time) : "السادسة مساءً"}</p>
          <p className="vaux-body-meta">{[draft.venue, draft.city].filter(Boolean).join(" — ")}</p>
          <div className="vaux-btn-row">
            {draft.mapUrl || draft.venue ? <a href={mapLink(draft)} target="_blank" rel="noreferrer" className="vaux-btn">الموقع على الخريطة</a> : null}
            {validDate ? <button type="button" onClick={() => downloadIcs(draft)} className="vaux-btn">أضف الموعد للتقويم</button> : null}
          </div>
        </div>
      </section>

      {program.length ? <section className="vaux-sec site-reveal vaux-menu-sec">
        <span className="vaux-kicker">تفاصيل الليلة</span>
        <h2 className="vaux-script-title">برنامج الحفل</h2>
        <ol className="vaux-program-list">{program.map((item, index) => (
          <li key={index} className="vaux-program-item">
            {item.time ? <time>{item.time}</time> : null}<span>{item.title}</span>
          </li>
        ))}</ol>
      </section> : null}

      {rsvp ? <section className="vaux-sec site-reveal vaux-rsvp-sec">
        <h2 className="vaux-script-title">تأكيد الحضور</h2>
        <p className="vaux-body-text">يسعدنا تأكيد حضوركم ومشاركتنا فرحتنا</p>
        <div className="vaux-rsvp-wrapper">{rsvp}</div>
      </section> : null}

      {draft.dressCode ? <section className="vaux-sec site-reveal">
        <span className="vaux-kicker">بكل حب</span>
        <h2 className="vaux-script-title">مستنيين نشوفكم</h2>
        <p className="vaux-body-text">{draft.dressCode}</p>
      </section> : null}

      <section className="vaux-sec site-reveal vaux-contact-sec">
        <div className="vaux-divider-wrapper"><img src="/vaux/flower_divider.jpg" alt="" className="vaux-flower-divider" /></div>
        <h2 className="vaux-script-title">في انتظاركم</h2>
        <p className="vaux-body-text">وجودكم وسطنا هو أجمل هدية لينا</p>
        <div className="vaux-footer-monogram"><img src="/vaux/monogram_rose.png" alt="" /></div>
      </section>
    </article>
  )
}
