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

/** حبات لؤلؤ على قوس معلّق (أعلى وأسفل الدعوة). */
const pearlArc = Array.from({ length: 15 }, (_, i) => [34 + i * 21.7, 34 + 30 * Math.sin((Math.PI * i) / 14)] as const)
const mirrorCorners = ["", "translate(360 0) scale(-1 1)", "translate(0 640) scale(1 -1)", "translate(360 640) scale(-1 -1)"]
const sprigLeaves = Array.from({ length: 9 }, (_, i) => [110 + i * 52, i % 2 === 0 ? 1 : -1] as const)

export function Invitation({ draft, activeField, onSelect }: Props) {
  const template = getTemplate(draft.templateId) ?? getTemplate("estate")!
  const maskId = useId().replace(/:/g, "")
  const vars = {
    "--paper": template.vars.paper,
    "--ink": template.vars.ink,
    "--gold": template.vars.gold,
    "--soft": template.vars.soft,
    "--shell": template.vars.shell,
    "--invite-font-ar": `"${draft.arabicFont || "Amiri"}"`,
    "--invite-font-en": `"${draft.englishFont || "Cormorant Garamond"}"`,
  } as CSSProperties

  if (template.id === "estate") {
    return (
      <article className="invite vaux-thumb-invite" style={vars}>
        <div className="vaux-thumb-wrapper">
          <img src="/vaux/hero_card_blank.jpg" alt="" className="vaux-thumb-bg" />
          <div className="vaux-thumb-content">
            <img src="/vaux/monogram_rose.png" alt="" className="vaux-thumb-monogram" />
            <div className="vaux-thumb-names">
              <Line field="groom" className="vaux-name" active={activeField} onSelect={onSelect}>
                {draft.groom || "اسم العريس"}
              </Line>
              <i className="vaux-amp">&</i>
              <Line field="bride" className="vaux-name" active={activeField} onSelect={onSelect}>
                {draft.bride || "اسم العروسة"}
              </Line>
            </div>
            <Line field="hosts" className="vaux-hosts" active={activeField} onSelect={onSelect}>
              {draft.hosts || "JOYFULLY INVITE YOU TO CELEBRATE THEIR WEDDING"}
            </Line>
          </div>
        </div>
      </article>
    )
  }

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
      {kind === "arch" && (
        <>
          <path d="M180 112v-20M170 100l10-10 10 10" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.7" />
          {[0, 1].map((side) => (
            <g key={side} transform={side ? "translate(360 0) scale(-1 1)" : undefined} fill="none" stroke="currentColor" strokeWidth="1.1">
              <path d="M44 596c8-44 6-84 22-122" />
              <path d="M66 474c-18-6-26-20-26-34 16 2 28 14 26 34Z" />
              <path d="M58 524c18-4 28-18 28-34-16 0-28 12-28 34Z" />
              <path d="M52 566c-16-8-22-22-20-36 14 4 24 16 20 36Z" />
            </g>
          ))}
        </>
      )}
      {kind === "deco" && (
        <>
          {mirrorCorners.map((tf) => (
            <g key={tf || "tl"} transform={tf || undefined} fill="none" stroke="currentColor" strokeWidth="1.1">
              <path d="M26 96 96 26M26 124 124 26M26 152 152 26" />
              <path d="M26 26h46" strokeWidth="2.2" />
              <path d="M26 26v46" strokeWidth="2.2" />
              <circle cx="26" cy="26" r="4.5" />
            </g>
          ))}
          <path d="M180 38v22M168 49h24" stroke="currentColor" strokeWidth="1.1" />
          <path d="M180 580v22M168 591h24" stroke="currentColor" strokeWidth="1.1" />
        </>
      )}
      {kind === "damask" && (
        <>
          <defs>
            <pattern id={`${maskId}d`} width="44" height="44" patternUnits="userSpaceOnUse">
              <path d="M22 4 40 22 22 40 4 22Z" fill="none" stroke="currentColor" strokeWidth="1" />
              <circle cx="22" cy="22" r="3.4" fill="currentColor" />
              <circle cx="0" cy="0" r="2" fill="currentColor" />
              <circle cx="44" cy="0" r="2" fill="currentColor" />
              <circle cx="0" cy="44" r="2" fill="currentColor" />
              <circle cx="44" cy="44" r="2" fill="currentColor" />
            </pattern>
          </defs>
          <rect x="0" y="0" width="360" height="92" fill={`url(#${maskId}d)`} opacity="0.2" />
          <rect x="0" y="548" width="360" height="92" fill={`url(#${maskId}d)`} opacity="0.2" />
          <path d="M0 92h360M0 548h360" stroke="currentColor" strokeWidth="1.2" />
          <path d="M0 98h360M0 542h360" stroke="currentColor" strokeWidth="0.6" />
        </>
      )}
      {kind === "pearls" && (
        <>
          {pearlArc.map(([x, y]) => <circle key={`t${x}`} cx={x} cy={y} r="3.4" fill="currentColor" opacity="0.85" />)}
          {pearlArc.map(([x, y]) => <circle key={`b${x}`} cx={x} cy={640 - y} r="3.4" fill="currentColor" opacity="0.85" />)}
          <path d="M34 34c60 52 232 52 292 0" fill="none" stroke="currentColor" strokeWidth="0.6" opacity="0.5" />
          <path d="M34 606c60-52 232-52 292 0" fill="none" stroke="currentColor" strokeWidth="0.6" opacity="0.5" />
        </>
      )}
      {kind === "sprig" &&
        [0, 1].map((side) => (
          <g key={side} transform={side ? "translate(360 0) scale(-1 1)" : undefined} fill="none" stroke="currentColor" strokeWidth="1.1">
            <path d="M26 560C14 440 38 260 26 84" />
            {sprigLeaves.map(([y, dir]) => (
              <ellipse key={y} cx={26 + dir * 11} cy={y} rx="10" ry="4.4" transform={`rotate(${dir * -28} ${26 + dir * 11} ${y})`} />
            ))}
          </g>
        ))}
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
