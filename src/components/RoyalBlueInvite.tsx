import { useEffect, useState, type CSSProperties } from "react"
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

export function RoyalBlueInvite({ draft }: { draft: InviteDraft }) {
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
    </article>
  )
}
