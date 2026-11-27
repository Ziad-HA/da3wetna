import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react"
import { formatArabicDate } from "../lib/format"
import { mapLink } from "../lib/maps"
import { VenueMap } from "./VenueMap"
import { Invitation } from "./Invitation"
import { InviteAdditions } from "./InviteAdditions"
import type { InviteDraft, Template } from "../types"

const pad = (n: number) => String(n).padStart(2, "0")

const formatTime = (value: string, locale = "ar-EG") => {
  const [hour, minute] = value.split(":").map(Number)
  if (!Number.isFinite(hour) || !Number.isFinite(minute)) return value
  return new Intl.DateTimeFormat(locale, { hour: "numeric", minute: "2-digit", hour12: true }).format(new Date(2000, 0, 1, hour, minute))
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

type Props = { draft: InviteDraft; template: Template; rsvp?: (language: "ar" | "en") => ReactNode; shareUrl?: string; musicOn?: boolean; hasMusic?: boolean; onToggleMusic?: () => void; language?: "ar" | "en"; onToggleLanguage?: () => void; showRsvpSection?: boolean; showShareSection?: boolean; preview?: boolean; endingAdditions?: ReactNode }

export function SiteInvite({ draft, template, rsvp, shareUrl = "", musicOn = false, hasMusic = false, onToggleMusic, language = "ar", onToggleLanguage, showRsvpSection = true, showShareSection = true, preview = false, endingAdditions }: Props) {
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
  const faqs = draft.faq.split("\n").map((line) => {
    const split = line.indexOf("|")
    return split < 0 ? null : { question: line.slice(0, split).trim(), answer: line.slice(split + 1).trim() }
  }).filter((item): item is { question: string; answer: string } => Boolean(item?.question && item.answer))
  const date = new Date(draft.date + "T00:00:00")
  const validDate = Boolean(draft.date) && !Number.isNaN(date.getTime())
  const [shareNotice, setShareNotice] = useState("")
  const en = language === "en"
  const locationUrl = mapLink(draft)
  const inviteTitle = en ? `Wedding invitation: ${draft.groom} & ${draft.bride}` : `دعوة ${draft.groom} و${draft.bride}`

  async function copyText(value: string, message: string) {
    try { await navigator.clipboard.writeText(value); setShareNotice(message) }
    catch { setShareNotice(en ? "Could not copy automatically. Copy the link from your browser." : "تعذر النسخ تلقائيًا. انسخ الرابط من المتصفح.") }
  }

  async function shareInvitation(platform: "whatsapp" | "facebook" | "x" | "instagram" | "tiktok" | "other") {
    const text = `${inviteTitle}\n${shareUrl}`
    const encodedUrl = encodeURIComponent(shareUrl)
    if (platform === "instagram" || platform === "tiktok") {
      await copyText(shareUrl, en ? `Invitation link copied. Open ${platform === "instagram" ? "Instagram" : "TikTok"} and paste it.` : `تم نسخ رابط الدعوة. افتح ${platform === "instagram" ? "إنستجرام" : "تيك توك"} والصقه في المكان المناسب.`)
      return
    }
    if (platform === "other") {
      if (navigator.share) {
        try { await navigator.share({ title: inviteTitle, text, url: shareUrl }); setShareNotice(en ? "Share options opened." : "تم فتح خيارات المشاركة."); return }
        catch { /* المستخدم أغلق نافذة المشاركة */ }
      }
      await copyText(shareUrl, en ? "Invitation link copied." : "تم نسخ رابط الدعوة للمشاركة.")
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
      try { await navigator.share({ title: en ? `Location: ${draft.venue}` : `موقع ${draft.venue}`, url: locationUrl }); setShareNotice(en ? "Location sharing opened." : "تم فتح مشاركة اللوكيشن."); return }
      catch { /* النسخ بديل المشاركة */ }
    }
    await copyText(locationUrl, en ? "Location link copied." : "تم نسخ رابط اللوكيشن.")
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
    <article ref={root} className={`vaux-site ${draft.templateId === "royal-blue" ? "vaux-royal-blue" : ""} ${draft.templateId === "estate" || draft.templateId === "estate-classic" ? "vaux-estate-royal" : ""} ${en ? "vaux-en" : ""}`} style={style} dir={en ? "ltr" : "rtl"} lang={language}>
      <div className="vaux-invite-controls" dir="ltr"><button type="button" onClick={onToggleLanguage}>{en ? "عربي" : "EN"}</button><button type="button" onClick={onToggleMusic} disabled={!hasMusic} aria-pressed={musicOn}>{musicOn ? (en ? "♫ Music on" : "♫ الموسيقى تعمل") : (en ? "♪ Music off" : "♪ إيقاف الموسيقى")}</button></div>
      {draft.templateId === "royal-blue" ? (
        <section className="vaux-hero-card vaux-lavender-hero" aria-label={inviteTitle}>
          <Invitation draft={draft} />
        </section>
      ) : (
        <section className="vaux-hero-card">
          <div className="vaux-hero-inner">
            <img src="/vaux/hero_card_blank.jpg" alt="" className="vaux-hero-bg" />
            <div className="vaux-hero-content">
              <img src="/vaux/monogram_rose.png" alt="" className="vaux-hero-monogram" />
              <h1 className="vaux-hero-names">
                <span>{draft.groom}</span><span className="vaux-amp">و</span><span>{draft.bride}</span>
              </h1>
              <p className="vaux-hero-hosts">{draft.hosts || (en ? "Together with our families" : "يتشرف الأهل بدعوتكم لحضور حفل الزفاف")}</p>
            </div>
          </div>
        </section>
      )}

      {(draft.templateId === "estate" || draft.templateId === "estate-classic") ? <InviteAdditions draft={draft} preview={preview} palette={{ paper: template.vars.paper, ink: template.vars.ink, gold: template.vars.gold, soft: template.vars.soft }} showRsvp={false} showShare={false} showClosing={false} /> : null}

      <section className="vaux-sec site-reveal royal-countdown-section">
        <div className="royal-count-ornament" aria-hidden="true">✦ ❦ ✦</div>
        <span className="vaux-kicker">{en ? "SAVE THE DATE" : "فرحتنا تكمل بوجودكم"}</span>
        <h2 className="vaux-script-title">{en ? "Countdown to our day" : "باقي على فرحتنا"}</h2>
        {validDate ? <><p className="royal-count-date">{formatArabicDate(draft.date)}</p><Countdown draft={draft} /></> : <p className="royal-count-empty">{en ? "We are looking forward to celebrating with you." : "مستنيين اليوم اللي يجمعنا بيكم"}</p>}
        <div className="royal-count-ornament royal-count-bottom" aria-hidden="true">❦</div>
      </section>

      {draft.opening ? <section className="vaux-sec site-reveal vaux-opening-verse">
        <span className="vaux-kicker">{en ? "A BLESSING FOR OUR DAY" : "بداية فرحتنا"}</span>
        <p className="vaux-body-text">{draft.opening}</p>
      </section> : null}

      {draft.story ? <section className="vaux-sec site-reveal vaux-story-sec">
        <div className="vaux-story-wrapper">
          <img src="/vaux/story_frame.jpg" alt="" className="vaux-story-bg" />
          <div className="vaux-story-content" style={{ padding: "10% 13%", gap: "0.35rem" }}>
            <span className="vaux-story-kicker" style={{ fontSize: "clamp(0.62rem, 2.4vw, 0.76rem)", lineHeight: 1.4 }}>{en ? "OUR STORY" : "حكايتنا"}</span>
            <h2 className="vaux-story-heading" style={{ fontSize: "clamp(1.35rem, 5.2vw, 1.85rem)", lineHeight: 1.25, margin: "0.15rem 0 0.3rem" }}>{en ? "A new chapter begins" : "بداية حكاية جديدة"}</h2>
            <div className="vaux-story-text" style={{ width: "100%", maxWidth: "100%", fontSize: "clamp(0.72rem, 2.8vw, 0.86rem)", lineHeight: 1.65, fontStyle: "normal" }}>{draft.story.split("\n").filter((line) => line.trim()).map((line, index) => <p key={index} style={{ margin: index ? "0.35rem 0 0" : 0 }}>{line}</p>)}</div>
          </div>
        </div>
      </section> : null}

      {(draft.photoOne || draft.photoTwo) ? <section className="vaux-sec site-reveal vaux-gallery-sec">
        <span className="vaux-kicker">{en ? "OUR MOMENTS" : "لحظات من حكايتنا"}</span>
        <h2 className="vaux-script-title">{en ? "Photo moments" : "صورنا"}</h2>
        <div style={{ display: "grid", gridTemplateColumns: draft.photoOne && draft.photoTwo ? "1fr 1fr" : "1fr", gap: "0.75rem", maxWidth: 420, margin: "1rem auto 0" }}>
          {[draft.photoOne, draft.photoTwo].filter(Boolean).map((src, index) => <img key={src} src={src} alt={`صورة من حكاية العروسين ${index + 1}`} loading="lazy" style={{ width: "100%", aspectRatio: "4 / 5", objectFit: "cover", borderRadius: 14, border: "1px solid color-mix(in srgb, var(--ink) 18%, transparent)" }} />)}
        </div>
      </section> : null}

      <section className="vaux-sec site-reveal vaux-reception-sec royal-details-section">
        <div className="vaux-reception-copy">
          <span className="vaux-kicker">{en ? "WEDDING DETAILS" : "مستنيينكم تشاركونا"}</span>
          <h2 className="vaux-script-title">{en ? "When & where" : "ميعادنا ومكاننا"}</h2>
          {validDate ? <p className="vaux-body-text">{en ? date.toLocaleDateString("en-US", { dateStyle: "long" }) : formatArabicDate(draft.date)}</p> : null}
          <p className="vaux-time-display">{draft.time ? formatTime(draft.time, en ? "en-US" : "ar-EG") : (en ? "6:00 PM" : "السادسة مساءً")}</p>
          <p className="vaux-body-meta">{[draft.venue, draft.city].filter(Boolean).join(" — ")}</p>
          <div className="vaux-location-card">
            <span className="vaux-kicker">{en ? "WEDDING LOCATION" : "مكان الحفل"}</span>
            <h3 className="vaux-venue-name">{draft.venue || (en ? "Wedding venue" : "مكان الحفل")}</h3>
            <p className="vaux-body-text">{en ? "Open the location on the map or share it with family and friends." : "يمكنك فتح الموقع مباشرة على خرائط Google أو مشاركة اللوكيشن مع الأهل والأصدقاء."}</p>
            {shareNotice ? <p className="vaux-share-status" role="status">{shareNotice}</p> : null}
            <div className="vaux-btn-row vaux-location-actions">
              <a href={locationUrl} target="_blank" rel="noreferrer" className="vaux-btn">{en ? "Open map ⌖" : "فتح اللوكيشن ⌖"}</a>
              <button type="button" onClick={shareLocation} className="vaux-btn">{en ? "Share location ↗" : "مشاركة اللوكيشن ↗"}</button>
              <button type="button" onClick={() => copyText(locationUrl, en ? "Location link copied." : "تم نسخ رابط اللوكيشن.")} className="vaux-btn">{en ? "Copy location link" : "نسخ رابط اللوكيشن"}</button>
            </div>
          </div>
          {validDate ? <div className="vaux-btn-row"><button type="button" onClick={() => downloadIcs(draft)} className="royal-calendar-link">{en ? "Add to calendar" : "＋ أضف الموعد إلى التقويم"}</button></div> : null}
          <VenueMap draft={draft} />
        </div>
      </section>

      {program.length ? <section className="vaux-sec site-reveal vaux-menu-sec">
        <span className="vaux-kicker">{en ? "THE EVENING" : "تفاصيل الليلة"}</span>
        <h2 className="vaux-script-title">{en ? "Wedding program" : "برنامج الحفل"}</h2>
        <ol className="vaux-program-list">{program.map((item, index) => (
          <li key={index} className="vaux-program-item">
            {item.time ? <time>{item.time}</time> : null}<span>{item.title}</span>
          </li>
        ))}</ol>
      </section> : null}

      {faqs.length ? <section className="vaux-sec site-reveal vaux-faq-sec">
        <span className="vaux-kicker">{en ? "A FEW DETAILS" : "تفاصيل تهمكم"}</span>
        <h2 className="vaux-script-title">{en ? "Frequently asked" : "أسئلة وإجابات"}</h2>
        <div className="vaux-faq-list">
          {faqs.map((item, index) => <details key={index} className="vaux-faq-item">
            <summary>{item.question}</summary>
            <p className="vaux-body-text">{item.answer}</p>
          </details>)}
        </div>
      </section> : null}

      {showRsvpSection && rsvp ? <section className="vaux-sec site-reveal vaux-rsvp-sec">
        <h2 className="vaux-script-title">{en ? "RSVP" : "تأكيد الحضور"}</h2>
        <p className="vaux-body-text">{en ? "Let us know if you can make it." : "يسعدنا معرفة تأكيد حضوركم"}</p>
        <div className="vaux-rsvp-wrapper">{rsvp?.(language)}</div>
      </section> : null}

      {!(draft.templateId === "estate" || draft.templateId === "estate-classic") && draft.dressCode ? <section className="vaux-sec site-reveal">
        <span className="vaux-kicker">{en ? "WITH LOVE" : "بكل حب"}</span>
        <h2 className="vaux-script-title">{en ? "See you there" : "مستنيين نشوفكم"}</h2>
        <p className="vaux-body-text">{draft.dressCode}</p>
      </section> : null}

      {!(draft.templateId === "estate" || draft.templateId === "estate-classic") ? <section className="vaux-sec site-reveal vaux-contact-sec">
        <div className="vaux-divider-wrapper"><img src="/vaux/flower_divider.jpg" alt="" className="vaux-flower-divider" /></div>
        <h2 className="vaux-script-title">{en ? "See you there!" : "في انتظاركم"}</h2>
        <p className="vaux-body-text">{en ? "Your presence is the best gift." : "وجودكم وسطنا هو أجمل هدية لينا"}</p>
        <div className="vaux-footer-monogram"><img src="/vaux/monogram_rose.png" alt="" /></div>
      </section> : null}

      {showShareSection && shareUrl ? <section className="vaux-sec site-reveal vaux-share-sec">
        <span className="vaux-kicker">{en ? "SHARE THE JOY" : "شاركوا فرحتنا"}</span>
        <h2 className="vaux-script-title">{en ? "Share with family & friends" : "شارك الدعوة مع الأهل والأصدقاء"}</h2>
        <div className="vaux-share-grid" aria-label="مشاركة الدعوة">
          <button type="button" onClick={() => shareInvitation("whatsapp")}><b>◉</b><span>{en ? "WhatsApp" : "واتساب"}</span></button>
          <button type="button" onClick={() => shareInvitation("facebook")}><b>f</b><span>Facebook</span></button>
          <button type="button" onClick={() => shareInvitation("x")}><b>𝕏</b><span>X / Twitter</span></button>
          <button type="button" onClick={() => shareInvitation("instagram")}><b>◎</b><span>Instagram</span></button>
          <button type="button" onClick={() => shareInvitation("tiktok")}><b>♪</b><span>TikTok</span></button>
          <button type="button" onClick={() => shareInvitation("other")}><b>↗</b><span>{en ? "More" : "مشاركة أخرى"}</span></button>
        </div>
        <p className="vaux-share-note">{en ? "For Instagram and TikTok, the invitation link will be copied automatically." : "في إنستجرام وتيك توك سيتم نسخ رابط الدعوة تلقائيًا."}</p>
        {shareNotice ? <p className="vaux-share-status" role="status" aria-live="polite">{shareNotice}</p> : null}
        <div style={{ width: 164, margin: "1.25rem auto 0", padding: 10, borderRadius: 16, background: "#fff", border: "1px solid rgba(94,28,42,.14)" }}>
          <img src={"https://api.qrserver.com/v1/create-qr-code/?size=320x320&margin=8&data=" + encodeURIComponent(shareUrl)} alt="رمز QR لفتح دعوة الزفاف" width="144" height="144" style={{ display: "block", width: "100%", height: "auto" }} loading="lazy" />
        </div>
      </section> : null}

      {endingAdditions}

      {(draft.templateId === "estate" || draft.templateId === "estate-classic") ? <>
        {<section className="vaux-sec site-reveal">
          <span className="vaux-kicker">{en ? "WITH LOVE" : "بكل حب"}</span>
          <h2 className="vaux-script-title">{en ? "See you there" : "مستنيين نشوفكم"}</h2>
          <p className="vaux-body-text">{draft.dressCode || "يسعدنا حضوركم بأجمل إطلالة تليق بليلتنا."}</p>
        </section>}
        <section className="vaux-sec site-reveal vaux-contact-sec">
          <div className="vaux-divider-wrapper"><img src="/vaux/flower_divider.jpg" alt="" className="vaux-flower-divider" /></div>
          <h2 className="vaux-script-title">{en ? "See you there!" : "في انتظاركم"}</h2>
          <p className="vaux-body-text">{en ? "Your presence is the best gift." : "وجودكم وسطنا هو أجمل هدية لينا"}</p>
          <div className="vaux-footer-monogram"><img src="/vaux/monogram_rose.png" alt="" /></div>
        </section>
      </> : null}
    </article>
  )
}
