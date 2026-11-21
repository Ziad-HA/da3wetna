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
] as const

export type TemplateId = (typeof templateIds)[number]

export type Occasion = "فرح" | "خطوبة" | "كتب كتاب" | "حنة"

export type Frame = "paper" | "envelope" | "poster"

export type Ornament = "seal" | "calla" | "lace" | "stars" | "marble" | "garden" | "moon" | "silk" | "rules"

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
}

export type PayMethod = "vodafone" | "instapay" | "card"

export type FieldKey = keyof Omit<InviteDraft, "templateId">
