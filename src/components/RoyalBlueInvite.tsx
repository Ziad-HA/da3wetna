import { useEffect, useState, type CSSProperties, type ReactNode } from "react"
import { formatArabicDate } from "../lib/format"
import { Invitation } from "./Invitation"
import { VenueMap } from "./VenueMap"
import { mapLink } from "../lib/maps"
import type { InviteDraft } from "../types"

function RoyalCountdown({ draft }: { draft: InviteDraft }) {
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    const interval = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(interval)
  }, [])

  const target = new Date(`${draft.date}T${draft.time || "00:00"}:00`).getTime()
  if (!draft.date || Number.isNaN(target)) return null

  const remaining = Math.max(0, target - now)
  const units: [number, string, string][] = [
    [Math.floor(remaining / 86400000), "يوم", "days"],
    [Math.floor((remaining % 86400000) / 3600000), "ساعة", "hours"],
    [Math.floor((remaining % 3600000) / 60000), "دقيقة", "minutes"],
    [Math.floor((remaining % 60000) / 1000), "ثانية", "seconds"],
  ]

  return (
    <div className="royal-count-grid" dir="rtl" aria-label="الوقت المتبقي على المناسبة">
      {units.map(([value, label, key]) => (
        <div className="royal-count-cell" key={key}>
          <strong>{String(value).padStart(2, "0")}</strong>
          <span>{label}</span>
        </div>
      ))}
    </div>
  )
}

export function RoyalBlueInvite({ draft, preview = false, endingAdditions }: { draft: InviteDraft; preview?: boolean; endingAdditions?: ReactNode }) {
  const validDate = Boolean(draft.date) && !Number.isNaN(new Date(`${draft.date}T00:00:00`).getTime())
  const calendarUrl = validDate ? `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(`فرح ${draft.groom} و${draft.bride}`)}&dates=${draft.date.replaceAll("-", "")}T${(draft.time || "18:00").replace(":", "")}00/${draft.date.replaceAll("-", "")}T${String(Number((draft.time || "18:00").slice(0, 2)) + 3).padStart(2, "0")}${(draft.time || "18:00").slice(3, 5)}00&details=${encodeURIComponent("يسعدنا حضوركم ومشاركتنا فرحتنا")}&location=${encodeURIComponent([draft.venue, draft.venueAddress, draft.city].filter(Boolean).join(" - "))}` : ""


  return (
    <article className="royal-invite" dir="rtl" lang="ar">
      <div className="royal-flower-top" aria-hidden="true"><img src="/chateau/royal-blue-floral.webp" alt="" /></div>
      <div className="royal-invite-card">
        <Invitation draft={draft} />
      </div>
      <div className="royal-flower-divider" aria-hidden="true"><img src="/chateau/royal-blue-floral.webp" alt="" /></div>
      <div className="invite-additions" dir="rtl" lang="ar" style={{ "--add-paper": "#F1F6FC", "--add-ink": "#173B60", "--add-gold": "#B99655", "--add-soft": "#526A85" } as CSSProperties}>
        {(draft.groomFather?.trim() || draft.brideFather?.trim()) ? <section className="invite-additions-parents" aria-label="والدا العروسين">
          <img src="/chateau/royal-blue-floral.webp" alt="" aria-hidden="true" />
          <p className="invite-additions-parents-intro">بكل الحب يتشرفان بدعوتكم</p>
          <div className="invite-additions-parent">
            <span>والد العريس الأستاذ</span>
            <strong>{draft.groomFather || "—"}</strong>
          </div>
          <span className="invite-additions-parents-heart" aria-hidden="true">♡</span>
          <div className="invite-additions-parent">
            <span>والد العروسة الأستاذ</span>
            <strong>{draft.brideFather || "—"}</strong>
          </div>
          <img src="/chateau/royal-blue-floral.webp" alt="" aria-hidden="true" />
        </section> : null}
      </div>
      {(draft.photoOne || preview) ? (
        <section className="royal-photo-section" aria-label="صورة العروسين" style={{ width: "min(100%, 680px)", margin: "1rem auto 1.5rem", padding: "clamp(12px, 3vw, 22px)", position: "relative", border: "1px solid rgba(185,150,85,.72)", borderRadius: "24px", background: "linear-gradient(145deg,#fff 0%,#edf4fb 55%,#fff 100%)", boxShadow: "0 14px 34px rgba(23,59,96,.12), inset 0 0 0 5px rgba(255,255,255,.8)" }}>
          <div aria-hidden="true" style={{ position: "absolute", inset: "7px", border: "1px solid rgba(185,150,85,.32)", borderRadius: "17px", pointerEvents: "none" }} />
          <img src="/chateau/royal-blue-floral.webp" alt="" aria-hidden="true" style={{ display: "block", width: "min(72%, 290px)", height: "clamp(34px, 8vw, 58px)", objectFit: "contain", margin: "0 auto .65rem", filter: "hue-rotate(165deg) saturate(1.12)" }} />
          <div style={{ position: "relative", padding: "7px", border: "1px solid rgba(185,150,85,.55)", borderRadius: "15px", background: "#fff", boxShadow: "0 5px 16px rgba(23,59,96,.08)" }}>
            <img src={draft.photoOne || "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1400&q=85"} alt="صورة تجريبية للعروسين — يمكن استبدالها بصورة خاصة" style={{ display: "block", width: "100%", aspectRatio: "16 / 10", objectFit: "cover", borderRadius: "10px" }} />
          </div>
          <img src="/chateau/royal-blue-floral.webp" alt="" aria-hidden="true" style={{ display: "block", width: "min(72%, 290px)", height: "clamp(34px, 8vw, 58px)", objectFit: "contain", margin: ".65rem auto 0", transform: "rotate(180deg)", filter: "hue-rotate(165deg) saturate(1.12)" }} />
          {preview ? <p style={{ margin: ".25rem 0 0", textAlign: "center", color: "#607b99", fontSize: ".75rem", fontWeight: 700 }}>صورة للمعاينة فقط — تقدر ترفع صورتك أو تحذفها من التعديل</p> : null}
        </section>
      ) : null}
      <section className="royal-countdown-section">
        <div className="royal-count-ornament" aria-hidden="true">✦ ❦ ✦</div>
        <p className="royal-count-eyebrow">موعد يجمعنا على الفرح</p>
        <h2>الوقت المتبقي</h2>
        {validDate ? (
          <>
            <p className="royal-count-date">{formatArabicDate(draft.date)}</p>
            <RoyalCountdown draft={draft} />
          </>
        ) : (
          <p className="royal-count-empty">سيظهر العد التنازلي بعد تحديد موعد المناسبة</p>
        )}
        <div className="royal-count-ornament royal-count-bottom" aria-hidden="true">❦</div>
      </section>
      <section className="royal-details-section">
        <span className="royal-count-ornament" aria-hidden="true">✦ ❦ ✦</span>
        <p className="royal-count-eyebrow">كل التفاصيل في انتظاركم</p>
        <h2>مكان وموعد فرحتنا</h2>
        <div className="royal-detail-card"><span>⌖</span><strong>{draft.venue || "مكان المناسبة"}</strong>{draft.venueAddress ? <p>{draft.venueAddress}</p> : null}{draft.city ? <small>{draft.city}</small> : null}</div>
        <a className="royal-map-link" href={mapLink(draft)} target="_blank" rel="noreferrer">⌖ افتح موقع المناسبة</a>
        {validDate ? <a className="royal-calendar-link" href={calendarUrl} target="_blank" rel="noreferrer">＋ أضف الموعد إلى التقويم</a> : null}
        <VenueMap draft={draft} />
      </section>
      <div className="royal-flower-bottom" aria-hidden="true"><img src="/chateau/royal-blue-floral.webp" alt="" /></div>
      {endingAdditions}
      <div className="vaux-site vaux-royal-blue royal-closing-sections" dir="rtl" lang="ar">
        <section className="vaux-sec site-reveal">
          <span className="vaux-kicker">بكل حب</span>
          <h2 className="vaux-script-title">مستنيين نشوفكم</h2>
          <p className="vaux-body-text">{draft.dressCode || "يسعدنا حضوركم بأجمل إطلالة تليق بليلتنا."}</p>
        </section>
        <section className="vaux-sec site-reveal vaux-contact-sec">
          <div className="vaux-divider-wrapper"><img src="/vaux/flower_divider.jpg" alt="" className="vaux-flower-divider" /></div>
          <h2 className="vaux-script-title">في انتظاركم</h2>
          <p className="vaux-body-text">وجودكم وسطنا هو أجمل هدية لينا</p>
          <div className="vaux-footer-monogram"><img src="/vaux/monogram_rose.png" alt="" /></div>
        </section>
      </div>
    </article>
  )
}
