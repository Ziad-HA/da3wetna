import { draftFor, getTemplate, isTemplateId } from "../data"
import type { InviteDraft, PayMethod } from "../types"

export const DRAFT_KEY = "zaffa-draft"
const LAST_KEY = "zaffa-last"

export type LastOrder = {
  id: string
  method: PayMethod
  refNo: string
  at: number
  code: string
}

export function readDraft(): InviteDraft | null {
  try {
    const raw = sessionStorage.getItem(DRAFT_KEY)
    if (!raw) return null
    const data = JSON.parse(raw) as InviteDraft
    if (!data || !isTemplateId(data.templateId)) return null
    return data
  } catch {
    return null
  }
}

export function writeDraft(draft: InviteDraft) {
  sessionStorage.setItem(DRAFT_KEY, JSON.stringify(draft))
}

export function initDraft(id: string | undefined): InviteDraft {
  const template = getTemplate(id) ?? getTemplate("seal")!
  const saved = readDraft()
  if (saved && saved.templateId === template.id) return saved
  return draftFor(template)
}

export function readLast(): LastOrder | null {
  try {
    const raw = localStorage.getItem(LAST_KEY)
    if (!raw) return null
    const data = JSON.parse(raw) as LastOrder
    if (!data?.code || !data.id) return null
    return data
  } catch {
    return null
  }
}

export function writeLast(order: LastOrder) {
  localStorage.setItem(LAST_KEY, JSON.stringify(order))
}

export function makeOrderId(): string {
  const number = Math.floor(1000 + Math.random() * 9000)
  return `ZAF-${number}`
}

export function draftReady(draft: InviteDraft): boolean {
  return Boolean(draft.groom.trim() && draft.bride.trim() && draft.date && draft.venue.trim())
}
