import type { CSSProperties } from "react"
import { formatArabicTime } from "../lib/format"
import type { FieldKey, InviteDraft } from "../types"

type Props = {
  draft: InviteDraft
  vars: CSSProperties
  activeField?: FieldKey | null
  onSelect?: (field: FieldKey) => void
}

/** المقاسات على صورة 1135×2028. */
const at = (y: number, x = 567.5, w = 800): CSSProperties => ({
  top: `${(y / 2028) * 100}%`,
  left: `${(x / 1135) * 100}%`,
  width: `${(w / 1135) * 100}%`,
})
/** يصغّر الخط لما النص يطول. */
const fit = (text: string, size: number, maxChars: number): CSSProperties => ({
  fontSize: `${size * Math.min(1, maxChars / Math.max(text.length, 1))}cqw`,
})

export function MagnoliaCard({ draft, vars, activeField, onSelect }: Props) {
  const text = (field: FieldKey, value: string, size: number, maxChars: number, className = "") =>
    onSelect ? (
      <button type="button" className={`edit-line mag-text ${className} ${activeField === field ? "is-active" : ""}`} style={fit(value, size, maxChars)} onClick={() => onSelect(field)}>
        {value}
      </button>
    ) : (
      <p className={`mag-text ${className}`} style={fit(value, size, maxChars)}>{value}</p>
    )

  const parsed = new Date(`${draft.date || "2027-10-02"}T00:00:00`)
  const date = Number.isNaN(parsed.getTime()) ? new Date("2027-10-02T00:00:00") : parsed
  const part = (options: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat("ar-EG", options).format(date)

  return (
    <article className="invite magnolia-card-art" style={vars} dir="rtl">
      <div className="magnolia-artboard">
        <img src="/cards/magnolia-ivory-tall.jpg" alt="" />

        <div className="mag-slot" style={at(260, 567.5, 640)}>
          {text("hosts", draft.hosts || "بكل الحب ندعوكم", 5.4, 26, "mag-title")}
        </div>
        <div className="mag-slot" style={at(1070)}>
          {text("occasion", draft.occasion || "حفل زفاف", 5.6, 24, "mag-title")}
        </div>

        <div className="mag-slot" style={at(1250, 815, 360)}>{text("groom", draft.groom || "محمد", 11, 6, "mag-name")}</div>
        <span className="mag-amp" style={at(1260, 567.5, 120)} aria-hidden="true">&amp;</span>
        <div className="mag-slot" style={at(1250, 320, 360)}>{text("bride", draft.bride || "سلمى", 11, 6, "mag-name")}</div>

        <div className="mag-slot" style={at(1555, 842, 260)}><p className="mag-text" style={{ fontSize: "5cqw" }}>{part({ weekday: "long" })}</p></div>
        <div className="mag-slot" style={at(1555, 567.5, 260)}>
          <p className="mag-text mag-day">{part({ day: "numeric" })}</p>
          {text("date", `${part({ month: "long" })} ${part({ year: "numeric" })}`, 4, 14)}
        </div>
        <div className="mag-slot" style={at(1555, 293, 260)}>{text("time", draft.time ? formatArabicTime(draft.time) : "الوقت", 5, 9)}</div>

        <div className="mag-slot" style={at(1773, 567.5, 560)}>
          {text("venue", draft.venue || "قصر محمد علي", 5.4, 22, "mag-title")}
        </div>
        <div className="mag-slot" style={at(1865, 567.5, 560)}>
          {text("message", draft.message || "بحضوركم تكتمل فرحتنا", 3.8, 32)}
        </div>
      </div>
    </article>
  )
}
