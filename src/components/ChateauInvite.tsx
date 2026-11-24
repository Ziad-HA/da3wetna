import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react"
import { formatArabicDate } from "../lib/format"
import { mapLink } from "../lib/maps"
import { VenueMap } from "./VenueMap"
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
    const timer = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(timer)
  }, [])
  const target = new Date(draft.date + "T" + (draft.time || "00:00") + ":00").getTime()
  if (!draft.date || Number.isNaN(target)) return null
  const left = Math.max(0, target - now)
  const cells: [number, string][] = [
    [Math.floor(left / 86400000), "يوم"],
    [Math.floor((left % 86400000) / 3600000), "ساعة"],
    [Math.floor((left % 3600000) / 60000), "دقيقة"],
    [Math.floor((left % 60000) / 1000), "ثانية"]
  ]
  return <div className="chx-count" dir="rtl">{cells.map(([value, label]) => (
    <div key={label} className="chx-count-item"><strong>{value}</strong><span>{label}</span></div>
  ))}</div>
}

type Props = { draft: InviteDraft; template: Template; rsvp?: ReactNode; shareUrl?: string }

export function ChateauInvite({ draft, template, rsvp, shareUrl = "" }: Props) {
  const root = useRef<HTMLElement>(null)
  const style = {
    "--chx-paper": "#F5F2EA",
    "--chx-ink": "#1E4030",
    "--chx-green": "#2D5A40",
    "--chx-soft": "#5A7A60",
    "--chx-gold": "#8A7542",
  } as CSSProperties

  const program = draft.program.split("\n").map((line) => {
    const split = line.indexOf("|")
    return split < 0 ? { time: "", title: line.trim() } : { time: line.slice(0, split).trim(), title: line.slice(split + 1).trim() }
  }).filter((item) => item.title)

  const faqItems = draft.faq ? draft.faq.split("\n").map((line) => {
    const split = line.indexOf("|")
    return split < 0 ? null : { q: line.slice(0, split).trim(), a: line.slice(split + 1).trim() }
  }).filter(Boolean) as { q: string; a: string }[] : []

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
    element.querySelectorAll(".chx-reveal").forEach((node) => observer.observe(node))
    return () => observer.disconnect()
  }, [])

  return (
    <article ref={root} className="chx-site" style={style} dir="rtl" lang="ar">

      {/* ══ HERO CARD ══ */}
      <section className="chx-hero-card">
        <div className="chx-hero-inner">
          <img src="/chateau/hero_card_blank.jpg" alt="" className="chx-hero-bg" />
          <div className="chx-hero-content">
            <img src="/chateau/wax_seal_crop.jpg" alt="" className="chx-hero-monogram" />
            <h1 className="chx-hero-names">
              <span>{draft.groom}</span><span className="chx-amp">و</span><span>{draft.bride}</span>
            </h1>
            <p className="chx-hero-hosts">{draft.hosts || "يتشرف الأهل بدعوتكم لحضور حفل الزفاف"}</p>
          </div>
        </div>
      </section>

      {/* ══ COUNTDOWN with roses background ══ */}
      <section className="chx-sec chx-reveal chx-countdown-sec">
        <div className="chx-countdown-bg">
          <img src="/chateau/roses_top.jpg" alt="" className="chx-roses-bg" />
        </div>
        <div className="chx-countdown-content">
          <span className="chx-kicker">فرحتنا تكمل بوجودكم</span>
          <h2 className="chx-script-title">باقي على فرحتنا</h2>
          {validDate ? <><p className="chx-subhead">{formatArabicDate(draft.date)}</p><Countdown draft={draft} /></> : <p className="chx-body-text">مستنيين اليوم اللي يجمعنا بيكم</p>}
          <div className="chx-lights-divider">
            <img src="/chateau/fairy_lights_strip.jpg" alt="" className="chx-lights-img" />
          </div>
        </div>
      </section>

      {/* ══ STORY / LETTER SECTION ══ */}
      {draft.story ? <section className="chx-sec chx-reveal chx-letter-sec">
        <span className="chx-kicker">كلمة منّا</span>
        <h2 className="chx-script-title">أعزاء الأصدقاء</h2>
        <div className="chx-letter-card">
          <div className="chx-letter-envelope-deco">
            <img src="/chateau/envelope_seal.jpg" alt="" className="chx-letter-env-img" />
          </div>
          <div className="chx-letter-body">
            {draft.story.split("\n").filter((line) => line.trim()).map((line, index) => (
              <p key={index}>{line}</p>
            ))}
            <p className="chx-letter-signature">{draft.groom} و{draft.bride}</p>
          </div>
        </div>
      </section> : null}

      {/* ══ COUPLE WALKING ILLUSTRATION ══ */}
      <section className="chx-sec chx-reveal chx-couple-sec">
        <img src="/chateau/couple_walking.jpg" alt="" className="chx-couple-img" />
        <span className="chx-kicker">تاريخنا</span>
        <h2 className="chx-script-title">عشر سنين، ثلاث مدن، قلب واحد</h2>
        <p className="chx-body-text">التقينا مصادفة، وعشنا حكاية جميلة. والنهارده بنبدأ أجمل فصل في حياتنا.</p>
      </section>

      {/* ══ RECEPTION / VENUE ══ */}
      <section className="chx-sec chx-reveal chx-reception-sec">
        <img src="/chateau/orangerie_illustration.jpg" alt="" className="chx-venue-illustration" />
        <div className="chx-reception-copy">
          <span className="chx-kicker">الكوكتيل والعشاء</span>
          <h2 className="chx-script-title">أورنجيري القصر</h2>
          {validDate ? <p className="chx-body-text">{formatArabicDate(draft.date)}</p> : null}
          <p className="chx-time-display">{draft.time ? formatTime(draft.time) : "الثالثة والنصف"}</p>
          <p className="chx-body-meta">{[draft.venue, draft.city].filter(Boolean).join(" — ")}</p>
          <div className="chx-btn-row">
            {draft.mapUrl || draft.venue ? <a href={mapLink(draft)} target="_blank" rel="noreferrer" className="chx-btn">الموقع على الخريطة</a> : null}
            {validDate ? <button type="button" onClick={() => downloadIcs(draft)} className="chx-btn">أضف الموعد للتقويم</button> : null}
          </div>
          <VenueMap draft={draft} />
        </div>
      </section>

      {/* ══ PROGRAM / TIMELINE ══ */}
      {program.length ? <section className="chx-sec chx-reveal chx-program-sec">
        <div className="chx-columns-deco">
          <img src="/chateau/columns_full.jpg" alt="" className="chx-columns-img" />
        </div>
        <span className="chx-kicker">تفاصيل اليوم</span>
        <h2 className="chx-script-title">برنامج الحفل</h2>
        <ol className="chx-program-list">{program.map((item, index) => (
          <li key={index} className="chx-program-item">
            {item.time ? <time>{item.time}</time> : null}<span>{item.title}</span>
          </li>
        ))}</ol>
      </section> : null}

      {/* ══ DRESS CODE ══ */}
      {draft.dressCode ? <section className="chx-sec chx-reveal chx-dresscode-sec">
        <img src="/chateau/dresscode_illustration.jpg" alt="" className="chx-dresscode-img" />
        <span className="chx-kicker">تعالوا بأجمل إطلالة</span>
        <h2 className="chx-script-title">كود اللبس</h2>
        <p className="chx-body-text">{draft.dressCode}</p>
      </section> : null}

      {/* ══ ACCOMMODATIONS ══ */}
      <section className="chx-sec chx-reveal chx-places-sec">
        <span className="chx-kicker">فين تنامو</span>
        <h2 className="chx-script-title">الإقامة القريبة</h2>
        <div className="chx-place-card">
          <img src="/chateau/vignes_illustration.jpg" alt="" className="chx-place-img" />
          <div className="chx-place-info">
            <h3>منزل الكروم</h3>
            <p>ابتداءً من 110€ للليلة · شرق فطور مجاني · 5 دقائق سيراً من القصر</p>
          </div>
        </div>
        <div className="chx-place-card">
          <img src="/chateau/hotel_illustration.jpg" alt="" className="chx-place-img" />
          <div className="chx-place-info">
            <h3>فندق البوست، سانس</h3>
            <p>ابتداءً من 85€ للليلة · في وسط المدينة</p>
          </div>
        </div>
      </section>

      {/* ══ FAQ ══ */}
      {faqItems.length ? <section className="chx-sec chx-reveal chx-faq-sec">
        <img src="/chateau/rings_illustration.jpg" alt="" className="chx-rings-img" />
        <h2 className="chx-script-title">أسئلة شائعة</h2>
        <ul className="chx-faq-list">{faqItems.map((item, index) => (
          <ChxFaqItem key={index} q={item.q} a={item.a} num={index + 1} />
        ))}</ul>
      </section> : null}

      {/* ══ RSVP with dove ══ */}
      {rsvp ? <section className="chx-sec chx-reveal chx-rsvp-sec">
        <img src="/chateau/dove_rsvp.jpg" alt="" className="chx-dove-img" />
        <h2 className="chx-script-title">تأكيد الحضور</h2>
        <p className="chx-body-text">يسعدنا تأكيد حضوركم ومشاركتنا فرحتنا</p>
        <div className="chx-rsvp-wrapper">{rsvp}</div>
      </section> : null}

      {/* ══ PHOTOS ══ */}
      {(draft.photoOne || draft.photoTwo) ? <section className="chx-sec chx-reveal">
        <span className="chx-kicker">لحظات من حكايتنا</span>
        <h2 className="chx-script-title">صورنا</h2>
        <div style={{ display: "grid", gridTemplateColumns: draft.photoOne && draft.photoTwo ? "1fr 1fr" : "1fr", gap: "0.75rem", maxWidth: 420, margin: "1rem auto 0" }}>
          {[draft.photoOne, draft.photoTwo].filter(Boolean).map((src, index) => <img key={src} src={src} alt={`صورة من حكاية العروسين ${index + 1}`} loading="lazy" style={{ width: "100%", aspectRatio: "4 / 5", objectFit: "cover", borderRadius: 14, border: "1px solid rgba(30,64,48,.14)" }} />)}
        </div>
      </section> : null}

      {/* ══ FOOTER with monogram ══ */}
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

      {/* ══ SHARE / QR ══ */}
      {shareUrl ? <section className="chx-sec chx-reveal chx-share-sec">
        <span className="chx-kicker">خلي الدعوة معاك</span>
        <h2 className="chx-script-title">شارك فرحتنا</h2>
        <p className="chx-body-text">امسح رمز QR علشان تفتح الدعوة بسهولة أو تبعتها لحد تحبه.</p>
        <div style={{ width: 184, margin: "1rem auto 0", padding: 12, borderRadius: 18, background: "#fff", border: "1px solid rgba(30,64,48,.14)", boxShadow: "0 8px 24px rgba(20,40,30,.08)" }}>
          <img src={"https://api.qrserver.com/v1/create-qr-code/?size=320x320&margin=8&data=" + encodeURIComponent(shareUrl)} alt="رمز QR لفتح دعوة الزفاف" width="160" height="160" style={{ display: "block", width: "100%", height: "auto" }} loading="lazy" />
        </div>
        <p dir="ltr" style={{ maxWidth: 320, margin: "0.75rem auto 0", fontSize: "0.68rem", lineHeight: 1.6, overflowWrap: "anywhere", color: "#5A7A60" }}>{shareUrl}</p>
      </section> : null}
    </article>
  )
}

function ChxFaqItem({ q, a, num }: { q: string; a: string; num: number }) {
  const [open, setOpen] = useState(false)
  return (
    <li className="chx-faq-item">
      <button
        type="button"
        className="chx-faq-btn"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="chx-faq-num">0{num}</span>
        <span className="chx-faq-q">{q}</span>
        <span className="chx-faq-icon">{open ? "−" : "+"}</span>
      </button>
      {open && <div className="chx-faq-answer">{a}</div>}
    </li>
  )
}
