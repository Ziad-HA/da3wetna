import type { CSSProperties } from "react"
import { formatArabicDate, formatArabicTime } from "../lib/format"
import type { FieldKey, InviteDraft } from "../types"

type Props = {
  draft: InviteDraft
  vars: CSSProperties
  activeField?: FieldKey | null
  onSelect?: (field: FieldKey) => void
}

/** المقاسات على صورة عرضها 726 وطولها 1297 (نفس نسبة 1240×2216). */
const at = (y: number, x = 363, w = 420): CSSProperties => ({
  top: `${(y / 1297) * 100}%`,
  left: `${(x / 726) * 100}%`,
  width: `${(w / 726) * 100}%`,
})
const fit = (text: string, size: number, maxChars: number): CSSProperties => ({
  fontSize: `${(size * Math.min(1, maxChars / Math.max(text.length, 1))) / 7.26}cqw`,
})

export function RoyalCard({ draft, vars, activeField, onSelect }: Props) {
  const text = (field: FieldKey, value: string, size: number, maxChars: number, className = "") =>
    onSelect ? (
      <button type="button" className={`edit-line fern-text ${className} ${activeField === field ? "is-active" : ""}`} style={fit(value, size, maxChars)} onClick={() => onSelect(field)}>
        {value}
      </button>
    ) : (
      <p className={`fern-text ${className}`} style={fit(value, size, maxChars)}>{value}</p>
    )

  const date = draft.date ? new Date(`${draft.date}T00:00:00`) : null
  const day = date && !Number.isNaN(date.getTime()) ? new Intl.DateTimeFormat("ar-EG", { weekday: "long" }).format(date) : "اليوم"
  const shortDate = date && !Number.isNaN(date.getTime()) ? new Intl.DateTimeFormat("ar-EG", { day: "numeric", month: "long" }).format(date) : formatArabicDate("")
  const time = draft.time ? formatArabicTime(draft.time) : "الوقت"

  return (
    <article className="invite fern-card royal-card" style={vars} dir="rtl">
      <img src="/cards/royal_tall.jpg" alt="" className="fern-bg" />

      <div className="fern-slot" style={at(300, 363, 440)}>
        {draft.hosts ? text("hosts", draft.hosts, 28, 80) : null}
      </div>

      {/* الـ & مرسومة في الصورة: العريس على يمينها والعروسة على شمالها */}
      <div className="fern-slot" style={at(420, 504, 200)}>{text("groom", draft.groom || "اسم العريس", 58, 6, "fern-name")}</div>
      <div className="fern-slot" style={at(420, 222, 200)}>{text("bride", draft.bride || "اسم العروسة", 58, 6, "fern-name")}</div>

      {draft.opening ? <div className="fern-slot" style={at(605, 363, 400)}>{text("opening", draft.opening, 27, 90)}</div> : null}

      <div className="fern-slot" style={at(886, 523, 175)}><p className="fern-text" style={fit(day, 26, 10)}>{day}</p></div>
      <div className="fern-slot" style={at(886, 380, 105)}>{text("date", shortDate, 24, 9)}</div>
      <div className="fern-slot" style={at(886, 235, 175)}>{text("time", time, 26, 10)}</div>

      <div className="fern-slot" style={at(1025, 380, 330)}>
        {text("venue", draft.venue || "مكان المناسبة", 28, 26)}
        {draft.venueAddress ? text("venueAddress", draft.venueAddress, 20, 40) : draft.city ? text("city", draft.city, 22, 30) : null}
      </div>

      <div className="fern-slot" style={at(1100, 430, 280)}>{text("message", draft.message || "بحضوركم تكتمل فرحتنا", 28, 26)}</div>
    </article>
  )
}
