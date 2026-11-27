import type { CSSProperties, ReactNode } from "react"
import { formatArabicDate, formatArabicTime } from "../lib/format"
import type { FieldKey, InviteDraft } from "../types"

type Props = {
  draft: InviteDraft
  vars: CSSProperties
  activeField?: FieldKey | null
  onSelect?: (field: FieldKey) => void
}

/** يصغّر الخط لما النص يطول عشان ما يطلعش برّه مكانه. المقاسات بوحدة بكسل الصورة الأصلية (عرض 1240). */
const fit = (text: string, size: number, maxChars: number): CSSProperties => ({
  fontSize: `${(size * Math.min(1, maxChars / Math.max(text.length, 1))) / 12.4}cqw`,
})

/** y = منتصف السطر، x/w = المنتصف والعرض، كلهم على مقاس الصورة 1240×2216. */
const at = (y: number, x = 620, w = 700): CSSProperties => ({
  top: `${(y / 2216) * 100}%`,
  left: `${(x / 1240) * 100}%`,
  width: `${(w / 1240) * 100}%`,
})

export function FernCard({ draft, vars, activeField, onSelect }: Props) {
  const text = (field: FieldKey, value: string, size: number, maxChars: number, className = ""): ReactNode =>
    onSelect ? (
      <button type="button" className={`edit-line fern-text ${className} ${activeField === field ? "is-active" : ""}`} style={fit(value, size, maxChars)} onClick={() => onSelect(field)}>
        {value}
      </button>
    ) : (
      <p className={`fern-text ${className}`} style={fit(value, size, maxChars)}>{value}</p>
    )

  const groom = draft.groom || "اسم العريس"
  const bride = draft.bride || "اسم العروسة"
  const occasion = !draft.occasion || draft.occasion === "فرح" ? "زفاف" : draft.occasion
  const date = formatArabicDate(draft.date)
  const time = draft.time ? `الساعة ${formatArabicTime(draft.time)}` : "الوقت"
  const venue = [draft.venue || "مكان المناسبة", draft.city].filter(Boolean).join("، ")

  return (
    <article className="invite fern-card" style={vars} dir="rtl">
      <img src="/cards/fern_tall.jpg" alt="" className="fern-bg" />

      <div className="fern-slot" style={at(218)}>{text("occasion", `دعوة ${occasion}`, 48, 20, "fern-title")}</div>

      <div className="fern-slot fern-intro" style={at(515, 620, 740)}>
        <p className="fern-text" style={fit("", 48, 1)}>بسم الله الرحمن الرحيم</p>
        {draft.hosts ? text("hosts", draft.hosts, 46, 70) : null}
        {draft.message ? text("message", draft.message, 46, 70) : null}
      </div>

      {draft.opening ? <div className="fern-slot" style={at(1062, 620, 660)}>{text("opening", draft.opening, 44, 90)}</div> : null}

      {/* الـ & مرسومة في الصورة: العريس على يمينها والعروسة على شمالها */}
      <div className="fern-slot" style={at(812, 835, 330)}>{text("groom", groom, 100, 6, "fern-name")}</div>
      <div className="fern-slot" style={at(812, 390, 330)}>{text("bride", bride, 100, 6, "fern-name")}</div>

      <div className="fern-slot" style={at(1216, 620, 480)}>{text("date", date, 36, 26)}</div>
      <div className="fern-slot" style={at(1287, 620, 480)}>{text("time", time, 36, 26)}</div>
      <div className="fern-slot" style={at(1358, 620, 480)}>{text("venue", venue, 36, 26)}</div>
      <div className="fern-slot" style={at(1439)}><p className="fern-text fern-title" style={fit("", 38, 1)}>حضوركم يتمم فرحتنا</p></div>
    </article>
  )
}
