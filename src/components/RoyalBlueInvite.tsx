import { useEffect, useState } from "react"
import { formatArabicDate } from "../lib/format"
import { Invitation } from "./Invitation"
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

  return (
    <article className="royal-invite" dir="rtl" lang="ar">
      <div className="royal-invite-card">
        <Invitation draft={draft} />
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
    </article>
  )
}
