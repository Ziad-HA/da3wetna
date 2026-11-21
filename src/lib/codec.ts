import { getTemplate } from "../data"
import type { InviteDraft } from "../types"

const fields = ["groom", "bride", "occasion", "hosts", "message", "date", "time", "venue", "city", "opening"] as const

export function encodeDraft(draft: InviteDraft): string {
  const slim: InviteDraft = {
    templateId: draft.templateId,
    groom: draft.groom.slice(0, 40),
    bride: draft.bride.slice(0, 40),
    occasion: draft.occasion.slice(0, 24),
    hosts: draft.hosts.slice(0, 80),
    message: draft.message.slice(0, 140),
    date: draft.date.slice(0, 10),
    time: draft.time.slice(0, 5),
    venue: draft.venue.slice(0, 80),
    city: draft.city.slice(0, 40),
    opening: draft.opening.slice(0, 60),
  }
  const bytes = new TextEncoder().encode(JSON.stringify(slim))
  let binary = ""
  for (const byte of bytes) binary += String.fromCharCode(byte)
  return btoa(binary).replace(/\\+/g, "-").replace(/\\//g, "_").replace(/=+$/g, "")
}

export function decodeDraft(code: string): InviteDraft | null {
  try {
    const pad = code.replace(/-/g, "+").replace(/_/g, "/")
    const padded = pad + "=".repeat((4 - (pad.length % 4)) % 4)
    const binary = atob(padded)
    const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0))
    const data = JSON.parse(new TextDecoder().decode(bytes)) as Partial<InviteDraft>
    if (!data.templateId || !getTemplate(data.templateId)) return null
    if (typeof data.groom !== "string" || typeof data.bride !== "string") return null
    const draft = {} as InviteDraft
    for (const key of fields) {
      const value = data[key]
      draft[key] = typeof value === "string" ? value : ""
    }
    draft.templateId = data.templateId
    return draft
  } catch {
    return null
  }
}

export function invitePath(code: string): string {
  return `/i/${code}`
}
