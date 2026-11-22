import type { CSSProperties } from "react"
import { isLight } from "../lib/color"
import { formatArabicDate } from "../lib/format"
import type { InviteDraft, SealKind, Template } from "../types"

type Props = {
  template: Template
  draft: InviteDraft
  photo?: string
  /** 0 = مقفول وبيستنى ضغطة · 1 = الرفرف بيفتح · 2 = الكارت بيطلع */
  step: number
  onOpen: () => void
}

const sealGlyph: Record<Exclude<SealKind, "initials">, string> = {
  heart: "♥",
  star: "✦",
  flower: "✿",
  moon: "☾",
  ring: "◎",
  leaf: "❧",
}

export function OpeningEnvelope({ template, draft, photo, step, onOpen }: Props) {
  const { envelope, vars } = template
  const sealText =
    envelope.sealKind === "initials"
      ? `${draft.groom.trim().charAt(0) || "ز"}${draft.bride.trim().charAt(0) || "ف"}`
      : sealGlyph[envelope.sealKind]

  const style = {
    "--env-body-a": envelope.body[0],
    "--env-body-b": envelope.body[1],
    "--env-flap-a": envelope.flap[0],
    "--env-flap-b": envelope.flap[1],
    "--env-liner": envelope.liner,
    "--env-pattern": isLight(envelope.liner) ? "rgba(120, 70, 85, .16)" : "rgba(255, 238, 205, .34)",
    "--env-seal": envelope.seal,
    "--env-seal-ink": isLight(envelope.seal) ? "#5b303c" : "#fff7ea",
    "--paper": vars.paper,
    "--ink": vars.ink,
    "--gold": vars.gold,
    "--soft": vars.soft,
  } as CSSProperties

  return (
    <button
      type="button"
      className="opening-envelope"
      data-flap={envelope.flapShape}
      data-pattern={envelope.linerPattern}
      data-band={envelope.band ? "pearls" : undefined}
      data-step={step}
      style={style}
      onClick={onOpen}
      disabled={step > 0}
      aria-label="اضغط لفتح ظرف الدعوة"
    >
      <span className="env-back" aria-hidden="true" />
      <span className="opening-letter" aria-hidden="true">
        {photo ? <img className="opening-letter-photo" src={photo} alt="" /> : <span className="opening-letter-spark">✦</span>}
        <strong>
          {draft.groom} <i>و</i> {draft.bride}
        </strong>
        <small>{draft.occasion} · {formatArabicDate(draft.date)}</small>
      </span>
      <span className="env-pocket" aria-hidden="true" />
      <span className="env-flap" aria-hidden="true" />
      {envelope.band ? <span className="env-band" aria-hidden="true"><i /><i /></span> : null}
      <span className="env-seal" aria-hidden="true" data-kind={envelope.sealKind}>
        <span>{sealText}</span>
      </span>
    </button>
  )
}
