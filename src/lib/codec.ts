import { getTemplate } from "../data"
import { templateIds } from "../types"
import type { InviteDraft } from "../types"

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
    rsvpPhone: draft.rsvpPhone.slice(0, 20),
    musicUrl: draft.musicUrl.slice(0, 500),
    photoOne: draft.photoOne.slice(0, 500),
    photoTwo: draft.photoTwo.slice(0, 500),
  }

  const bytes = new TextEncoder().encode(JSON.stringify(slim))
  let binary = ""
  for (const byte of bytes) binary += String.fromCharCode(byte)

  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "")
}

export function decodeDraft(code: string): InviteDraft | null {
  try {
    const normalized = code.replace(/-/g, "+").replace(/_/g, "/")
    const padded = normalized + "=".repeat((4 - (normalized.length % 4)) % 4)
    const binary = atob(padded)
    const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0))
    const data = JSON.parse(new TextDecoder().decode(bytes)) as Record<string, unknown>

    if (typeof data.templateId !== "string") return null

    const templateId = templateIds.find((id) => id === data.templateId)
    if (!templateId || !getTemplate(templateId)) return null

    if (typeof data.groom !== "string" || typeof data.bride !== "string") return null

    const readString = (key: string): string =>
      typeof data[key] === "string" ? (data[key] as string) : ""

    return {
      templateId,
      groom: readString("groom"),
      bride: readString("bride"),
      occasion: readString("occasion"),
      hosts: readString("hosts"),
      message: readString("message"),
      date: readString("date"),
      time: readString("time"),
      venue: readString("venue"),
      city: readString("city"),
      opening: readString("opening"),
      rsvpPhone: readString("rsvpPhone"),
      musicUrl: readString("musicUrl"),
      photoOne: readString("photoOne"),
      photoTwo: readString("photoTwo"),
    }
  } catch {
    return null
  }
}

export function invitePath(code: string): string {
  return `/i/${code}`
}
