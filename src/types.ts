export const templateIds = [
  "seal",
  "calla",
  "lace",
  "envelope",
  "night",
  "marble",
  "garden",
  "moon",
  "silk",
  "ink",
  "arch",
  "deco",
  "henna",
  "pearl",
  "nikah",
] as const

export type TemplateId = (typeof templateIds)[number]

export type Occasion = "فرح" | "خطوبة" | "كتب كتاب" | "حنة"

export type Frame = "paper" | "envelope" | "poster" | "arch" | "oval"

export type Ornament =
  | "seal" | "calla" | "lace" | "stars" | "marble" | "garden" | "moon" | "silk" | "rules"
  | "arch" | "deco" | "damask" | "pearls" | "sprig"

/** شكل رفرف الظرف. */
export type FlapShape = "v" | "deep" | "round" | "wing"
/** نقشة بطانة الظرف (اللي بتبان لما الرفرف يفتح). */
export type LinerPattern = "plain" | "dots" | "diamonds" | "stripes" | "stars"
/** شكل الختم على الظرف. */
export type SealKind = "heart" | "star" | "flower" | "moon" | "ring" | "initials"

export type EnvelopeStyle = {
  /** لون جسم الظرف (فاتح، غامق) */
  body: [string, string]
  /** لون الرفرف (فاتح، غامق) */
  flap: [string, string]
  /** لون البطانة من جوه */
  liner: string
  linerPattern: LinerPattern
  /** لون الختم والحواف */
  seal: string
  sealKind: SealKind
  flapShape: FlapShape
}

export type ThemeVars = {
  paper: string
  ink: string
  gold: string
  soft: string
  shell: string
}

export type Template = {
  id: TemplateId
  name: string
  blurb: string
  category: Occasion
  isNew?: boolean
  frame: Frame
  ornament: Ornament
  vars: ThemeVars
  envelope: EnvelopeStyle
  groom: string
  bride: string
  venue: string
  time: string
}

export type InviteDraft = {
  templateId: TemplateId
  groom: string
  bride: string
  occasion: string
  hosts: string
  message: string
  date: string
  time: string
  venue: string
  city: string
  opening: string
  rsvpPhone: string
  /** لينك الموقع على خرائط جوجل (اختياري) */
  mapUrl: string
  musicUrl: string
  photoOne: string
  photoTwo: string
}

export type PayMethod = "vodafone" | "instapay" | "paymob"

export type FieldKey = keyof Omit<InviteDraft, "templateId">
