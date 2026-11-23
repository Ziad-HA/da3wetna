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
  return <div className="vaux-count" dir="rtl">{cells.map(([value, label]) => (
    <div key={label} className="vaux-count-item"><strong>{value}</strong><span>{label}</span></div>
  ))}</div>
}

type Props = { draft: InviteDraft; template: Template; rsvp?: ReactNode; shareUrl?: string }

export function SiteInvite({ draft, template, rsvp, shareUrl = "" }: Props) {
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
  const [shareNotice, setShareNotice] = useState("")
  const locationUrl = mapLink(draft)
  const inviteTitle = `دعوة ${draft.groom} و${draft.bride}`

  async function copyText(value: string, message: string) {
    try { await navigator.clipboard.writeText(value); setShareNotice(message) }
    catch { setShareNotice("تعذر النسخ تلقائيًا. انسخ الرابط من المتصفح.") }
  }

  async function shareInvitation(platform: "whatsapp" | "facebook" | "x" | "instagram" | "tiktok" | "other") {
    const text = `${inviteTitle}\n${shareUrl}`
    const encodedUrl = encodeURIComponent(shareUrl)
    if (platform === "instagram" || platform === "tiktok") {
      await copyText(shareUrl, `تم نسخ رابط الدعوة. افتح ${platform === "instagram" ? "إنستجرام" : "تيك توك"} والصقه في المكان المناسب.`)
      return
    }
    if (platform === "other") {
      if (navigator.share) {
        try { await navigator.share({ title: inviteTitle, text, url: shareUrl }); setShareNotice("تم فتح خيارات المشاركة."); return }
        catch { /* المستخدم أغلق نافذة المشاركة */ }
      }
      await copyText(shareUrl, "تم نسخ رابط الدعوة للمشاركة.")
      return
    }
    const target = platform === "whatsapp"
      ? `https://wa.me/?text=${encodeURIComponent(text)}`
      : platform === "facebook"
        ? `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`
        : `https://twitter.com/intent/tweet?text=${encodeURIComponent(inviteTitle)}&url=${encodedUrl}`
    window.open(target, "_blank", "noopener,noreferrer")
  }

  async function shareLocation() {
    if (navigator.share) {
      try { await navigator.share({ title: `موقع ${draft.venue}`, url: locationUrl }); setShareNotice("تم فتح مشاركة اللوكيشن."); return }
      catch { /* النسخ بديل المشاركة */ }
    }
    await copyText(locationUrl, "تم نسخ رابط اللوكيشن.")
  }

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
          <div className="vaux-story-content" style={{ padding: "10% 13%", gap: "0.35rem" }}>
            <span className="vaux-story-kicker" style={{ fontSize: "clamp(0.62rem, 2.4vw, 0.76rem)", lineHeight: 1.4 }}>حكايتنا</span>
            <h2 className="vaux-story-heading" style={{ fontSize: "clamp(1.35rem, 5.2vw, 1.85rem)", lineHeight: 1.25, margin: "0.15rem 0 0.3rem" }}>بداية حكاية جديدة</h2>
            <div className="vaux-story-text" style={{ width: "100%", maxWidth: "100%", fontSize: "clamp(0.72rem, 2.8vw, 0.86rem)", lineHeight: 1.65, fontStyle: "normal" }}>{draft.story.split("\n").filter((line) => line.trim()).map((line, index) => <p key={index} style={{ margin: index ? "0.35rem 0 0" : 0 }}>{line}</p>)}</div>
          </div>
        </div>
      </section> : null}

      {(draft.photoOne || draft.photoTwo) ? <section className="vaux-sec site-reveal vaux-gallery-sec">
        <span className="vaux-kicker">لحظات من حكايتنا</span>
        <h2 className="vaux-script-title">صورنا</h2>
        <div style={{ display: "grid", gridTemplateColumns: draft.photoOne && draft.photoTwo ? "1fr 1fr" : "1fr", gap: "0.75rem", maxWidth: 420, margin: "1rem auto 0" }}>
          {[draft.photoOne, draft.photoTwo].filter(Boolean).map((src, index) => <img key={src} src={src} alt={`صورة من حكاية العروسين ${index + 1}`} loading="lazy" style={{ width: "100%", aspectRatio: "4 / 5", objectFit: "cover", borderRadius: 14, border: "1px solid color-mix(in srgb, var(--ink) 18%, transparent)" }} />)}
        </div>
      </section> : null}

      <section className="vaux-sec site-reveal vaux-reception-sec">
        <div className="vaux-reception-copy">
          <span className="vaux-kicker">مستنيينكم تشاركونا</span>
          <h2 className="vaux-script-title">ميعادنا ومكاننا</h2>
          {validDate ? <p className="vaux-body-text">{formatArabicDate(draft.date)}</p> : null}
          <p className="vaux-time-display">{draft.time ? formatTime(draft.time) : "السادسة مساءً"}</p>
          <p className="vaux-body-meta">{[draft.venue, draft.city].filter(Boolean).join(" — ")}</p>
          <div className="vaux-location-card">
            <span className="vaux-kicker">لوصول إلى مكان الحفل</span>
            <h3 className="vaux-venue-name">{draft.venue || "مكان الحفل"}</h3>
            <p className="vaux-body-text">يمكنك فتح الموقع مباشرة على خرائط Google أو مشاركة اللوكيشن مع الأهل والأصدقاء.</p>
            {shareNotice ? <p className="vaux-share-status" role="status">{shareNotice}</p> : null}
            <div className="vaux-btn-row vaux-location-actions">
              <a href={locationUrl} target="_blank" rel="noreferrer" className="vaux-btn">فتح اللوكيشن ⌖</a>
              <button type="button" onClick={shareLocation} className="vaux-btn">مشاركة اللوكيشن ↗</button>
              <button type="button" onClick={() => copyText(locationUrl, "تم نسخ رابط اللوكيشن.")} className="vaux-btn">نسخ رابط اللوكيشن</button>
            </div>
          </div>
          {validDate ? <div className="vaux-btn-row"><button type="button" onClick={() => downloadIcs(draft)} className="vaux-btn">أضف الموعد للتقويم</button></div> : null}
          <VenueMap draft={draft} />
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
        <p className="vaux-body-text">يسعدنا معرفة تأكيد حضوركم</p>
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

      {shareUrl ? <section className="vaux-sec site-reveal vaux-share-sec">
        <span className="vaux-kicker">شاركوا فرحتنا</span>
        <h2 className="vaux-script-title">شارك الدعوة مع الأهل والأصدقاء</h2>
        <div className="vaux-share-grid" aria-label="مشاركة الدعوة">
          <button type="button" onClick={() => shareInvitation("whatsapp")}><b>◉</b><span>واتساب</span></button>
          <button type="button" onClick={() => shareInvitation("facebook")}><b>f</b><span>Facebook</span></button>
          <button type="button" onClick={() => shareInvitation("x")}><b>𝕏</b><span>X / Twitter</span></button>
          <button type="button" onClick={() => shareInvitation("instagram")}><b>◎</b><span>Instagram</span></button>
          <button type="button" onClick={() => shareInvitation("tiktok")}><b>♪</b><span>TikTok</span></button>
          <button type="button" onClick={() => shareInvitation("other")}><b>↗</b><span>مشاركة أخرى</span></button>
        </div>
        <p className="vaux-share-note">في إنستجرام وتيك توك سيتم نسخ رابط الدعوة تلقائيًا.</p>
        {shareNotice ? <p className="vaux-share-status" role="status" aria-live="polite">{shareNotice}</p> : null}
        <div style={{ width: 164, margin: "1.25rem auto 0", padding: 10, borderRadius: 16, background: "#fff", border: "1px solid rgba(94,28,42,.14)" }}>
          <img src={"https://api.qrserver.com/v1/create-qr-code/?size=320x320&margin=8&data=" + encodeURIComponent(shareUrl)} alt="رمز QR لفتح دعوة الزفاف" width="144" height="144" style={{ display: "block", width: "100%", height: "auto" }} loading="lazy" />
        </div>
      </section> : null}
    </article>
  )
}
