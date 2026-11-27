import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react"
import { formatArabicDate } from "../lib/format"
import { mapLink } from "../lib/maps"
import { VenueMap } from "./VenueMap"
import type { InviteDraft } from "../types"

const pad = (n: number) => String(n).padStart(2, "0")

const formatTime = (value: string) => {
  const [hour, minute] = value.split(":").map(Number)
  if (!Number.isFinite(hour) || !Number.isFinite(minute)) return value
  return new Intl.DateTimeFormat("ar-EG", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(new Date(2000, 0, 1, hour, minute))
}

function downloadIcs(draft: InviteDraft) {
  const [year, month, day] = draft.date.split("-").map(Number)
  const [hour, minute] = (draft.time || "18:00").split(":").map(Number)
  const start = `${year}${pad(month)}${pad(day)}T${pad(hour)}${pad(minute)}00`
  const end = `${year}${pad(month)}${pad(day)}T${pad(Math.min(23, hour + 4))}${pad(minute)}00`
  const clean = (value: string) => value.replace(/[,;\\]/g, " ").replace(/\n/g, " ")
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//da3wetna//AR",
    "BEGIN:VEVENT",
    `UID:${start}@da3wetna`,
    `DTSTAMP:${start}`,
    `DTSTART:${start}`,
    `DTEND:${end}`,
    `SUMMARY:${clean("زفاف " + draft.groom + " و" + draft.bride)}`,
    `LOCATION:${clean([draft.venue, draft.venueAddress, draft.city].filter(Boolean).join(" - "))}`,
    "END:VEVENT",
    "END:VCALENDAR",
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
    const timer = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(timer)
  }, [])

  const target = new Date(`${draft.date}T${draft.time || "00:00"}:00`).getTime()
  if (!draft.date || Number.isNaN(target)) return null

  const left = Math.max(0, target - now)
  const cells: [number, string][] = [
    [Math.floor(left / 86400000), "يوم"],
    [Math.floor((left % 86400000) / 3600000), "ساعة"],
    [Math.floor((left % 3600000) / 60000), "دقيقة"],
    [Math.floor((left % 60000) / 1000), "ثانية"],
  ]

  return (
    <div className="chx-count" dir="rtl">
      {cells.map(([value, label]) => (
        <div key={label} className="chx-count-item">
          <strong>{value}</strong>
          <span>{label}</span>
        </div>
      ))}
    </div>
  )
}

type Props = { draft: InviteDraft; rsvp?: ReactNode; shareUrl?: string }

export function ChateauInvite({ draft, rsvp }: Props) {
  const root = useRef<HTMLElement>(null)
  const style = {
    "--chx-paper": "#F5F2EA",
    "--chx-ink": "#1E4030",
    "--chx-green": "#2D5A40",
    "--chx-soft": "#5A7A60",
    "--chx-gold": "#8A7542",
  } as CSSProperties

  const date = new Date(`${draft.date}T00:00:00`)
  const validDate = Boolean(draft.date) && !Number.isNaN(date.getTime())
  const hasVenue = Boolean(draft.venue || draft.venueAddress || draft.city)
  const hasMap = Boolean(draft.mapUrl || draft.venueLat != null || draft.venueLng != null || draft.venue || draft.venueAddress)

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

    element.querySelectorAll(".chx-reveal").forEach((node) => observer.observe(node))
    return () => observer.disconnect()
  }, [])

  return (
    <article ref={root} className="chx-site" style={style} dir="rtl" lang="ar">
      <section className="chx-hero-card">
        <div className="chx-hero-inner">
          <img src="/chateau/hero_card_blank.jpg" alt="" className="chx-hero-bg" />
          <div className="chx-hero-content">
            <img src="/chateau/wax_seal_crop.jpg" alt="" className="chx-hero-monogram" />
            <h1 className="chx-hero-names">
              <span>{draft.groom}</span>
              <span className="chx-amp">و</span>
              <span>{draft.bride}</span>
            </h1>
            <p className="chx-hero-hosts">{draft.hosts || "يتشرف الأهل بدعوتكم لحضور حفل الزفاف"}</p>
          </div>
        </div>
      </section>

      <section className="chx-sec chx-reveal chx-countdown-sec">
        <div className="chx-countdown-bg">
          <img src="/chateau/roses_top.jpg" alt="" className="chx-roses-bg" />
        </div>
        <div className="chx-countdown-content">
          <span className="chx-kicker">فرحتنا تكمل بوجودكم</span>
          <h2 className="chx-script-title">باقي على فرحتنا</h2>
          {validDate ? (
            <>
              <p className="chx-subhead">{formatArabicDate(draft.date)}</p>
              <Countdown draft={draft} />
            </>
          ) : (
            <p className="chx-body-text">مستنيين اليوم اللي يجمعنا بيكم</p>
          )}
          <div className="chx-lights-divider">
            <img src="/chateau/fairy_lights_strip.jpg" alt="" className="chx-lights-img" />
          </div>
        </div>
      </section>

      {hasVenue ? (
        <section className="chx-sec chx-reveal chx-reception-sec">
          <img src="/chateau/orangerie_illustration.jpg" alt="" className="chx-venue-illustration" />
          <div className="chx-reception-copy">
            <span className="chx-kicker">تفاصيل المكان</span>
            <h2 className="chx-script-title">مكان الحفل</h2>
            {validDate ? <p className="chx-body-text">{formatArabicDate(draft.date)}</p> : null}
            {draft.time ? <p className="chx-time-display">{formatTime(draft.time)}</p> : null}
            <p className="chx-body-meta">
              {[draft.venue, draft.venueAddress, draft.city].filter(Boolean).join(" — ")}
            </p>
            <div className="chx-btn-row">
              {hasMap ? (
                <a href={mapLink(draft)} target="_blank" rel="noreferrer" className="chx-btn">
                  افتح المكان على الخريطة
                </a>
              ) : null}
              {validDate ? (
                <button type="button" onClick={() => downloadIcs(draft)} className="chx-btn">
                  أضف الموعد للتقويم
                </button>
              ) : null}
            </div>
            {hasMap ? <VenueMap draft={draft} /> : null}
          </div>
        </section>
      ) : null}

      {rsvp ? (
        <section className="chx-sec chx-reveal chx-rsvp-sec">
          <img src="/chateau/dove_rsvp.jpg" alt="" className="chx-dove-img" />
          <h2 className="chx-script-title">تأكيد الحضور</h2>
          <p className="chx-body-text">يسعدنا تأكيد حضوركم ومشاركتنا فرحتنا</p>
          <div className="chx-rsvp-wrapper">{rsvp}</div>
        </section>
      ) : null}

      <section className="chx-sec chx-reveal chx-footer-sec">
        <div className="chx-floral-divider">
          <img src="/chateau/floral_divider.jpg" alt="" className="chx-divider-img" />
        </div>
        <div className="chx-footer-monogram">
          <img src="/chateau/monogram_gj.jpg" alt="" />
        </div>
        <p className="chx-script-title" style={{ marginTop: "1rem" }}>{draft.groom} و{draft.bride}</p>
        <p className="chx-body-text">في انتظاركم ♡</p>
      </section>
    </article>
  )
}
