export const templateIds = [
  "estate",
  "estate-classic",
  "calla",
  "envelope",
  "estate-rose",
  "chateau",
  "garden-classic",
  "royal-blue",
  "emerald-fern",
  "burgundy-velvet",
  "magnolia-ivory",
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
export type SealKind = "heart" | "star" | "flower" | "moon" | "ring" | "leaf" | "initials"

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
  /** شريط لؤلؤ بيتقطع لما الظرف يفتح (اختياري) */
  band?: boolean
  /** الظرف بيقرّب لحد ما يملا الشاشة بعد الفتح */
  zoom?: boolean
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
  /** "strip" = بعد فتح الظرف بيطلع شريط دعوة طويل بيتحرك لتحت */
  layout?: "card" | "strip" | "site"
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
  groomFather: string
  brideFather: string
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
  venueAddress: string
  venueLat: number | null
  venueLng: number | null
  musicUrl: string
  photoOne: string
  photoTwo: string
  /** برنامج الحفل: كل سطر "الساعة | النشاط" (لقالب الشريط) */
  program: string
  /** روابط صور إضافية للمعرض، كل رابط في سطر (لقالب الشريط) */
  gallery: string
  /** حكايتنا (لقالب الموقع) */
  story: string
  /** أسئلة وأجوبة، كل سطر "سؤال | جواب" (لقالب الموقع) */
  faq: string
  /** كود اللبس (لقالب الموقع) */
  dressCode: string
  arabicFont: string
  englishFont: string
}

export type PayMethod = "vodafone" | "instapay" | "paymob"

/** مفاتيح الحقول النصية بس (من غير القالب والإحداثيات) */
export type FieldKey = Exclude<{ [K in keyof InviteDraft]: InviteDraft[K] extends string ? K : never }[keyof InviteDraft], "templateId">
