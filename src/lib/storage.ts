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

export function readSelectedPackage(): PackageId {
  try {
    const value = sessionStorage.getItem(SELECTED_PACKAGE_KEY)
    return getPackage(value).id
  } catch {
    return "single"
  }
}

export function selectPackage(id: PackageId) {
  sessionStorage.setItem(SELECTED_PACKAGE_KEY, id)
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
