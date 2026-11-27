import { draftFor, getTemplate, isTemplateId } from "../data"
import { getPackage, type PackageId } from "../config"
import type { InviteDraft, PayMethod } from "../types"

export const DRAFT_KEY = "zaffa-draft"
const LAST_KEY = "zaffa-last"
const SELECTED_PACKAGE_KEY = "da3wetna-selected-package"
const ACTIVE_PACKAGE_KEY = "da3wetna-active-package"

export type LastOrder = {
  id: string
  method: PayMethod
  refNo: string
  at: number
  code: string
  packageId: PackageId
}

export type ActivePackage = {
  id: string
  packageId: PackageId
  used: number
  createdAt: number
}

export function readDraft(): InviteDraft | null {
  try {
    const raw = localStorage.getItem(DRAFT_KEY) ?? sessionStorage.getItem(DRAFT_KEY)
    if (!raw) return null
    const data = JSON.parse(raw) as InviteDraft
    if (!data || !isTemplateId(data.templateId)) return null
    localStorage.setItem(DRAFT_KEY, JSON.stringify(data))
    return { ...draftFor(getTemplate(data.templateId)!), ...data,
      rsvpPhone: typeof data.rsvpPhone === "string" ? data.rsvpPhone : "",
      mapUrl: typeof data.mapUrl === "string" ? data.mapUrl : "",
      venueAddress: typeof data.venueAddress === "string" ? data.venueAddress : "",
      venueLat: typeof data.venueLat === "number" && Number.isFinite(data.venueLat) ? data.venueLat : null,
      venueLng: typeof data.venueLng === "number" && Number.isFinite(data.venueLng) ? data.venueLng : null,
      musicUrl: typeof data.musicUrl === "string" ? data.musicUrl : draftFor(getTemplate(data.templateId)!).musicUrl,
      photoOne: typeof data.photoOne === "string" ? data.photoOne : "",
      photoTwo: typeof data.photoTwo === "string" ? data.photoTwo : "",
      program: typeof data.program === "string" ? data.program : "",
      gallery: typeof data.gallery === "string" ? data.gallery : "",
      story: typeof data.story === "string" ? data.story : "",
      faq: typeof data.faq === "string" ? data.faq : "",
      dressCode: typeof data.dressCode === "string" ? data.dressCode : "",
    }
  } catch {
    return null
  }
}

export function clearDraft() {
  localStorage.removeItem(DRAFT_KEY)
  sessionStorage.removeItem(DRAFT_KEY)
}

export function writeDraft(draft: InviteDraft) {
  try { localStorage.setItem(DRAFT_KEY, JSON.stringify(draft)) } catch {
    console.warn("تعذر حفظ المسودة محليًا. تأكد من مساحة التخزين المتاحة.")
  }
}

export function initDraft(id: string | undefined): InviteDraft {
  const template = getTemplate(id) ?? getTemplate("estate")!
  const saved = readDraft()
  if (saved && saved.templateId === template.id) return saved
  const fresh = draftFor(template)
  // قالب الزمردي بيفتح فاضي عشان العميل يكتب بياناته (الأسماء التجريبية في المعاينة بس).
  if (template.id === "emerald-fern") return { ...fresh, groom: "", bride: "", date: "", time: "", venue: "", city: "" }
  return fresh
}

export function readSelectedPackage(): PackageId {
  try {
    const value = localStorage.getItem(SELECTED_PACKAGE_KEY) ?? sessionStorage.getItem(SELECTED_PACKAGE_KEY)
    if (value) localStorage.setItem(SELECTED_PACKAGE_KEY, value)
    return getPackage(value).id
  } catch {
    return "single"
  }
}

export function selectPackage(id: PackageId) {
  localStorage.setItem(SELECTED_PACKAGE_KEY, id)
}

export function readActivePackage(): ActivePackage | null {
  try {
    const raw = localStorage.getItem(ACTIVE_PACKAGE_KEY)
    if (!raw) return null
    const data = JSON.parse(raw) as ActivePackage
    if (!data?.id || !data.packageId || !Number.isInteger(data.used) || data.used < 1) return null
    return data
  } catch {
    return null
  }
}

export function activatePackage(order: ActivePackage) {
  localStorage.setItem(ACTIVE_PACKAGE_KEY, JSON.stringify(order))
}

export function consumePackageInvite(): ActivePackage | null {
  const active = readActivePackage()
  if (!active) return null
  const bundle = getPackage(active.packageId)
  if (active.used >= bundle.quantity) return null
  const next = { ...active, used: active.used + 1 }
  activatePackage(next)
  return next
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
  return `DA3-${number}`
}

export function draftReady(draft: InviteDraft): boolean {
  return Boolean(draft.groom.trim() && draft.bride.trim() && draft.date && draft.venue.trim())
}

const OWNER_TOKEN_KEY = "da3wetna-owner-token"

export function readOwnerToken(): string {
  try { return localStorage.getItem(OWNER_TOKEN_KEY) ?? "" } catch { return "" }
}
export function writeOwnerToken(token: string) {
  try { localStorage.setItem(OWNER_TOKEN_KEY, token) } catch { /* التخزين مقفول */ }
}
