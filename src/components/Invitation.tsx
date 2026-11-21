import { useId, type CSSProperties } from "react"
import { getTemplate } from "../data"
import { formatArabicDate, formatArabicTime } from "../lib/format"
import type { FieldKey, InviteDraft, Ornament } from "../types"

type Props = {
  draft: InviteDraft
  activeField?: FieldKey | null
  onSelect?: (field: FieldKey) => void
}

const stars = [
  [36, 78], [92, 46], [168, 34], [286, 58], [328, 128], [46, 188], [318, 230],
  [58, 340], [330, 390], [40, 500], [300, 540], [150, 600], [230, 86], [110, 430],
  [250, 470], [80, 560], [200, 28], [340, 300],
]

export function Invitation({ draft, activeField, onSelect }: Props) {
  const template = getTemplate(draft.templateId) ?? getTemplate("seal")!
  const maskId = useId().replace(/:/g, "")
  const vars = {
    "--paper": template.vars.paper,
    "--ink": template.vars.ink,
    "--gold": template.vars.gold,
    "--soft": template.vars.soft,
    "--shell": template.vars.shell,
  } as CSSProperties

  const content = (
    <div className="invite-inner">
      <Line field="opening" className="t-open" active={activeField} onSelect={onSelect}>
        {draft.opening || "جملة الافتتاح"}
      </Line>
      {template.ornament === "seal" || template.frame === "envelope" ? (
        <Wax groom={draft.groom} bride={draft.bride} />
      ) : null}
      <Line field="occasion" className="t-occasion" active={activeField} onSelect={onSelect}>
        {draft.occasion || "المناسبة"}
      </Line>
      <Divider />
      <Line field="hosts" className="t-hosts" active={activeField} onSelect={onSelect}>
        {draft.hosts || "سطر الدعوة"}
      </Line>
      <div className="name-stack">
        <Line field="groom" className="t-name" active={activeField} onSelect={onSelect}>
          {draft.groom || "اسم العريس"}
        </Line>
        <span className="t-waaw" aria-hidden="true">و</span>
        <Line field="bride" className="t-name" active={activeField} onSelect={onSelect}>
          {draft.bride || "اسم العروسة"}
        </Line>
      </div>
      <Line field="message" className="t-message" active={activeField} onSelect={onSelect}>
        {draft.message || "جملة الدعوة"}
      </Line>
      <div className="when">
        <Line field="date" className="t-meta" active={activeField} onSelect={onSelect}>
          {formatArabicDate(draft.date)}
        </Line>
        <span className="dot" aria-hidden="true" />
        <Line field="time" className="t-meta" active={activeField} onSelect={onSelect}>
          {formatArabicTime(draft.time)}
        </Line>
      </div>
      <Line field="venue" className="t-venue" active={activeField} onSelect={onSelect}>
        {draft.venue || "المكان"}
      </Line>
      <Line field="city" className="t-city" active={activeField} onSelect={onSelect}>
        {draft.city || "المدينة"}
      </Line>
    </div>
  )

  return (
    <article
      className="invite"
      data-frame={template.frame}
      data-ornament={template.ornament}
      style={vars}
    >
      <Ornament kind={template.ornament} maskId={maskId} />
      <span className="grain" aria-hidden="true" />
      {content}
    </article>
  )
}

function Wax({ groom, bride }: { groom: string; bride: string }) {
  const left = groom.trim().charAt(0) || "ز"
  const right = bride.trim().charAt(0) || "ف"
  return (
    <div className="wax" aria-hidden="true">
      <span>{left}</span>
      <span className="wax-dot" />
      <span>{right}</span>
    </div>
  )
}

function Divider() {
  return (
    <div className="invite-div" aria-hidden="true">
      <span />
      <i />
      <span />
    </div>
  )
}

function Line({
  field,
  className,
  active,
  onSelect,
  children,
}: {
  field: FieldKey
  className: string
  active?: FieldKey | null
  onSelect?: (field: FieldKey) => void
  children: string
}) {
  if (!onSelect) return <p className={className}>{children}</p>
  return (
    <button
      type="button"
      className={`edit-line ${className} ${active === field ? "is-active" : ""}`}
      onClick={() => onSelect(field)}
    >
      {children}
    </button>
  )
}

function Ornament({ kind, maskId }: { kind: Ornament; maskId: string }) {
  if (kind === "rules") return null
  return (
    <svg className="ornament" viewBox="0 0 360 640" aria-hidden="true">
      {kind === "seal" && (
        <>
          <path d="M28 92c28-24 48-28 78-22" fill="none" stroke="currentColor" strokeWidth="1" />
          <path d="M332 92c-28-24-48-28-78-22" fill="none" stroke="currentColor" strokeWidth="1" />
          <path d="M28 548c28 24 48 28 78 22" fill="none" stroke="currentColor" strokeWidth="1" />
          <path d="M332 548c-28 24-48 28-78 22" fill="none" stroke="currentColor" strokeWidth="1" />
        </>
      )}
      {kind === "calla" && (
        <>
          <path d="M70 500c20-40 30-70 28-110" fill="none" stroke="currentColor" strokeWidth="1.2" />
          <path d="M70 500c36-10 58-46 62-90" fill="none" stroke="currentColor" strokeWidth="1.1" />
          <ellipse cx="98" cy="372" rx="14" ry="28" fill="none" stroke="currentColor" transform="rotate(-18 98 372)" />
          <path d="M290 500c-20-40-30-70-28-110" fill="none" stroke="currentColor" strokeWidth="1.2" />
          <path d="M290 500c-36-10-58-46-62-90" fill="none" stroke="currentColor" strokeWidth="1.1" />
          <ellipse cx="262" cy="372" rx="14" ry="28" fill="none" stroke="currentColor" transform="rotate(18 262 372)" />
        </>
      )}
      {kind === "lace" && (
        <>
          <rect x="22" y="22" width="316" height="596" rx="28" fill="none" stroke="currentColor" strokeWidth="1.4" />
          <rect x="32" y="32" width="296" height="576" rx="22" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="1.2 7" />
        </>
      )}
      {kind === "stars" &&
        stars.map(([x, y]) => <circle key={`${x}-${y}`} cx={x} cy={y} r={x % 3 === 0 ? 1.5 : 0.8} fill="currentColor" />)}
      {kind === "marble" && (
        <>
          <path d="M-10 120c80 40 120-20 200 10s120 40 180-10" fill="none" stroke="currentColor" strokeWidth="8" opacity="0.18" />
          <path d="M-20 360c90-50 140 30 220 0s110-20 170 30" fill="none" stroke="currentColor" strokeWidth="10" opacity="0.12" />
          <path d="M40 560c70 20 100-30 170-10s90 16 140-24" fill="none" stroke="currentColor" strokeWidth="6" opacity="0.16" />
        </>
      )}
      {kind === "garden" && (
        <>
          <path d="M18 80c30 80 18 160 34 250s-8 150 8 250" fill="none" stroke="currentColor" strokeWidth="1.2" />
          <path d="M18 160c24 8 36-10 48 2" fill="none" stroke="currentColor" strokeWidth="1" />
          <path d="M22 300c26 6 30-16 52-4" fill="none" stroke="currentColor" strokeWidth="1" />
          <path d="M342 80c-30 80-18 160-34 250s8 150-8 250" fill="none" stroke="currentColor" strokeWidth="1.2" />
          <path d="M342 200c-24 8-36-12-50 0" fill="none" stroke="currentColor" strokeWidth="1" />
          <ellipse cx="46" cy="150" rx="8" ry="14" fill="none" stroke="currentColor" />
          <ellipse cx="318" cy="250" rx="8" ry="14" fill="none" stroke="currentColor" />
        </>
      )}
      {kind === "moon" && (
        <>
          <mask id={maskId}>
            <rect width="360" height="640" fill="black" />
            <circle cx="180" cy="78" r="26" fill="white" />
            <circle cx="194" cy="70" r="22" fill="black" />
          </mask>
          <circle cx="180" cy="78" r="26" fill="currentColor" mask={`url(#${maskId})`} />
          {stars.slice(0, 12).map(([x, y]) => (
            <circle key={`${x}-${y}`} cx={x} cy={y + 20} r="0.9" fill="currentColor" />
          ))}
        </>
      )}
      {kind === "silk" && (
        <>
          <path d="M24 92c70-48 242-48 312 0" fill="none" stroke="currentColor" strokeWidth="1.1" />
          <path d="M40 118c60-36 220-36 280 0" fill="none" stroke="currentColor" strokeWidth="0.8" />
          <path d="M24 548c70 48 242 48 312 0" fill="none" stroke="currentColor" strokeWidth="1.1" />
        </>
      )}
    </svg>
  )
}
