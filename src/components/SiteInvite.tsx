import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react"
import { formatArabicDate } from "../lib/format"
import { mapLink } from "../lib/maps"
import { VenueMap } from "./VenueMap"
import type { InviteDraft, Template } from "../types"

const pad = (n: number) => String(n).padStart(2, "0")

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

type Props = { draft: InviteDraft; template: Template; rsvp?: (language: "ar" | "en") => ReactNode; shareUrl?: string; musicOn?: boolean; hasMusic?: boolean; onToggleMusic?: () => void }

export function SiteInvite({ draft, template, rsvp, shareUrl = "", musicOn = false, hasMusic = false, onToggleMusic }: Props) {
  const root = useRef<HTMLElement>(null)
  const style = {
    "--paper": template.vars.paper,
    "--ink": template.vars.ink,
    "--gold": template.vars.gold,
    "--soft": template.vars.soft
  } as CSSProperties
  const date = new Date(draft.date + "T00:00:00")
  const validDate = Boolean(draft.date) && !Number.isNaN(date.getTime())
  const [shareNotice, setShareNotice] = useState("")
  const [language, setLanguage] = useState<"ar" | "en">("ar")
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
      try { await navigator.share({ title: `موقع ${draft.venue}`, url: locationUrl }); setShareNotice(en ? "Location sharing opened." : "تم فتح مشاركة اللوكيشن."); return }
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
    <article ref={root} className={`vaux-site ${en ? "vaux-en" : ""}`} style={style} dir={en ? "ltr" : "rtl"} lang={language}>
      <div className="vaux-invite-controls" dir="ltr"><button type="button" onClick={() => setLanguage(en ? "ar" : "en")}>{en ? "عربي" : "EN"}</button><button type="button" onClick={onToggleMusic} disabled={!hasMusic} aria-pressed={musicOn}>{musicOn ? (en ? "♫ Music on" : "♫ الموسيقى تعمل") : (en ? "♪ Music off" : "♪ إيقاف الموسيقى")}</button></div>
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

      <section className="vaux-sec site-reveal vaux-calendar-section"><span className="vaux-kicker">{en ? "SAVE THE DATE" : "خليكم فاكرين اليوم"}</span><h2 className="vaux-script-title">{en ? "Our special day" : "ميعاد فرحتنا"}</h2>{validDate ? <><p className="vaux-subhead">{formatArabicDate(draft.date)}</p><WeddingCalendar isoDate={draft.date} english={en} /></> : <p className="vaux-body-text">{en ? "Date coming soon" : "هنعلن عن الموعد قريبًا"}</p>}</section>

      <section className="vaux-sec site-reveal vaux-story-sec vaux-family-message"><div className="vaux-family-flower" aria-hidden="true">✿</div><span className="vaux-kicker">{en ? "A DAY TO CELEBRATE" : "يومنا الحلو"}</span><h2 className="vaux-script-title">{en ? "Your presence makes it complete" : "فرحتنا بيكم أحلى"}</h2><p className="vaux-body-text">{en ? "We can't wait to celebrate this special day with our family and friends. Your presence means the world to us." : "مستنيين اليوم اللي يجمعنا بيكم، وجودكم وسطنا هو أحلى حاجة تكمل فرحتنا وتخلّي اليوم ذكرى حلوة."}</p></section>

      {(draft.photoOne || draft.photoTwo) ? <section className="vaux-sec site-reveal vaux-gallery-sec">
        <span className="vaux-kicker">{en ? "OUR MOMENTS" : "صور من فرحتنا"}</span>
        <h2 className="vaux-script-title">{en ? "Photo moments" : "لحظات حلوة"}</h2>
        <div style={{ display: "grid", gridTemplateColumns: draft.photoOne && draft.photoTwo ? "1fr 1fr" : "1fr", gap: "0.75rem", maxWidth: 420, margin: "1rem auto 0" }}>
          {[draft.photoOne, draft.photoTwo].filter(Boolean).map((src, index) => <img key={src} src={src} alt={`صورة من حكاية العروسين ${index + 1}`} loading="lazy" style={{ width: "100%", aspectRatio: "4 / 5", objectFit: "cover", borderRadius: 14, border: "1px solid color-mix(in srgb, var(--ink) 18%, transparent)" }} />)}
        </div>
      </section> : null}

      <section className="vaux-sec site-reveal vaux-reception-sec">
        <div className="vaux-reception-copy">
          <span className="vaux-kicker">{en ? "THE WEDDING DETAILS" : "مستنيينكم تشاركونا"}</span><h2 className="vaux-script-title">{en ? "When & where" : "ميعادنا ومكاننا"}</h2>{validDate ? <p className="vaux-body-text">{formatArabicDate(draft.date)} — {en ? "3:00 PM to 7:00 PM" : "من 3 عصرًا إلى 7 مساءً"}</p> : null}<p className="vaux-time-display">{en ? "Starting at 3:00 PM" : "الفرح بيبدأ الساعة 3 عصرًا"}</p>
          <p className="vaux-body-meta">{[draft.venue, draft.city].filter(Boolean).join(" — ")}</p>
          <div className="vaux-location-card">
            <span className="vaux-kicker">{en ? "WEDDING LOCATION" : "مكان الحفل"}</span><h3 className="vaux-venue-name">{draft.venue || (en ? "Wedding venue" : "مكان الحفل")}</h3><p className="vaux-body-text">{en ? "Open the location on Google Maps or share it with family and friends." : "افتحوا المكان مباشرة على خرائط Google أو شاركوا اللوكيشن مع الأهل والأصدقاء."}</p>
            {shareNotice ? <p className="vaux-share-status" role="status">{shareNotice}</p> : null}
            <div className="vaux-btn-row vaux-location-actions">
              <a href={locationUrl} target="_blank" rel="noreferrer" className="vaux-btn">{en ? "Open map ⌖" : "فتح اللوكيشن ⌖"}</a><button type="button" onClick={shareLocation} className="vaux-btn">{en ? "Share location ↗" : "مشاركة اللوكيشن ↗"}</button><button type="button" onClick={() => copyText(locationUrl, en ? "Location link copied." : "تم نسخ رابط اللوكيشن.")} className="vaux-btn">{en ? "Copy location link" : "نسخ رابط اللوكيشن"}</button>
            </div>
          </div>
          {validDate ? <div className="vaux-btn-row"><button type="button" onClick={() => downloadIcs(draft)} className="vaux-btn">{en ? "Add to calendar" : "أضف الموعد للتقويم"}</button></div> : null}
          <VenueMap draft={draft} />
        </div>
      </section>



      {rsvp ? <section className="vaux-sec site-reveal vaux-rsvp-sec">
        <h2 className="vaux-script-title">{en ? "RSVP" : "تأكيد الحضور"}</h2><p className="vaux-body-text">{en ? "Let us know if you can make it." : "يسعدنا معرفة تأكيد حضوركم"}</p><div className="vaux-rsvp-wrapper">{rsvp?.(language)}</div>
      </section> : null}



      <section className="vaux-sec site-reveal vaux-contact-sec">
        <div className="vaux-divider-wrapper"><img src="/vaux/flower_divider.jpg" alt="" className="vaux-flower-divider" /></div>
        <h2 className="vaux-script-title">{en ? "See you there!" : "مستنيينكم بالحب"}</h2><p className="vaux-body-text">{en ? "Your presence is the best gift." : "وجودكم وسطنا هو أجمل هدية لينا"}</p><div className="vaux-footer-monogram"><img src="/vaux/monogram_rose.png" alt="" /></div><p className="vaux-footer-couple">{draft.groom} <span>♡</span> {draft.bride}</p><p className="vaux-footer-wish">{en ? "From Nobi to the newlyweds: wishing you a life full of joy and love." : "من Nobi إلى العروسين: مع أطيب الأمنيات بحياة مليئة بالفرح والمحبة."}</p><p className="vaux-footer-credit">{en ? "Designed by" : "صُمم بواسطة"} <strong>Nobi</strong></p><a className="vaux-footer-whatsapp" href="https://wa.me/201012081177" target="_blank" rel="noreferrer">{en ? "WhatsApp" : "واتساب"}: 01276390301</a>
      </section>

      {shareUrl ? <section className="vaux-sec site-reveal vaux-share-sec">
        <span className="vaux-kicker">{en ? "SHARE THE JOY" : "شاركوا فرحتنا"}</span>
        <h2 className="vaux-script-title">{en ? "Share with family & friends" : "شارك الدعوة مع الأهل والأصدقاء"}</h2>
        <div className="vaux-share-grid" aria-label="مشاركة الدعوة">
          <button type="button" onClick={() => shareInvitation("whatsapp")}><b>◉</b><span>واتساب</span></button>
          <button type="button" onClick={() => shareInvitation("facebook")}><b>f</b><span>Facebook</span></button>
          <button type="button" onClick={() => shareInvitation("x")}><b>𝕏</b><span>X / Twitter</span></button>
          <button type="button" onClick={() => shareInvitation("instagram")}><b>◎</b><span>Instagram</span></button>
          <button type="button" onClick={() => shareInvitation("tiktok")}><b>♪</b><span>TikTok</span></button>
          <button type="button" onClick={() => shareInvitation("other")}><b>↗</b><span>مشاركة أخرى</span></button>
        </div>
        <p className="vaux-share-note">{en ? "For Instagram and TikTok, the invitation link will be copied automatically." : "في إنستجرام وتيك توك سيتم نسخ رابط الدعوة تلقائيًا."}</p>
        {shareNotice ? <p className="vaux-share-status" role="status" aria-live="polite">{shareNotice}</p> : null}
        <div style={{ width: 164, margin: "1.25rem auto 0", padding: 10, borderRadius: 16, background: "#fff", border: "1px solid rgba(94,28,42,.14)" }}>
          <img src={"https://api.qrserver.com/v1/create-qr-code/?size=320x320&margin=8&data=" + encodeURIComponent(shareUrl)} alt="رمز QR لفتح دعوة الزفاف" width="144" height="144" style={{ display: "block", width: "100%", height: "auto" }} loading="lazy" />
        </div>
      </section> : null}
    </article>
  )
}


function WeddingCalendar({ isoDate, english }: { isoDate: string; english: boolean }) {
 const [year, month, day] = isoDate.split("-").map(Number); const first = new Date(year, month - 1, 1); const count = new Date(year, month, 0).getDate(); const offset = first.getDay();
 const monthName = new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" }).format(first); const weekdays = english ? ["S","M","T","W","T","F","S"] : ["ح","ن","ث","ر","خ","ج","س"];
 const cells = [...Array(offset).fill(0), ...Array.from({length:count},(_,i)=>i+1)]; while(cells.length%7) cells.push(0);
 return <div className="vaux-calendar-card" aria-label={english ? `Calendar for ${monthName}` : `تقويم شهر ${monthName}`}><div className="vaux-calendar-top"><span className="vaux-calendar-icon">▦</span><strong>{monthName}</strong><span className="vaux-calendar-gregorian">{english ? "GREGORIAN CALENDAR" : "التقويم الميلادي"}</span></div><div className="vaux-calendar-grid vaux-calendar-weekdays">{weekdays.map((w,i)=><span key={i}>{w}</span>)}</div><div className="vaux-calendar-grid">{cells.map((n,i)=><span key={i} className={n===day?"vaux-calendar-day is-wedding-day":n?"vaux-calendar-day":"vaux-calendar-empty"}>{n||""}{n===day?<i aria-hidden="true">♥</i>:null}</span>)}</div><p className="vaux-calendar-caption">{english ? "The day we're celebrating ♡" : "اليوم اللي مستنيين نحتفل فيه معاكم ♡"}</p></div>
}
