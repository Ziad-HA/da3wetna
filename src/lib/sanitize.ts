import { isTemplateId } from "../data.js"
import type { InviteDraft } from "../types.js"

// eslint-disable-next-line no-control-regex
const CONTROL = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g

const ARABIC_FONTS = ["Amiri", "Aref Ruqaa", "Cairo", "Changa", "El Messiri", "IBM Plex Sans Arabic", "Almarai", "Alexandria", "Reem Kufi", "Tajawal", "Readex Pro", "Lalezar"]
const ENGLISH_FONTS = ["Cormorant Garamond", "Playfair Display", "Montserrat", "Poppins", "Lora", "Cinzel", "Libre Baskerville", "Great Vibes"]

function text(value: unknown, max: number): string {
  return typeof value === "string" ? value.replace(CONTROL, "").trim().slice(0, max) : ""
}

function url(value: unknown, max: number): string {
  const raw = text(value, max)
  if (!raw) return ""
  try {
    const parsed = new URL(raw)
    return parsed.protocol === "https:" || parsed.protocol === "http:" ? parsed.href.slice(0, max) : ""
  } catch {
    return ""
  }
}

function multiline(value: unknown, max: number, lines: number): string {
  if (typeof value !== "string") return ""
  return value.replace(/\r/g, "").split("\n").map((l) => text(l, 80)).filter(Boolean).slice(0, lines).join("\n").slice(0, max)
}

function coordinate(value: unknown, min: number, max: number): number | null {
  return typeof value === "number" && Number.isFinite(value) && value >= min && value <= max ? value : null
}

function galleryUrls(value: unknown): string {
  if (typeof value !== "string") return ""
  return value.split(/\s+/).map((u) => url(u, 200)).filter(Boolean).slice(0, 6).join("\n").slice(0, 900)
}

/** تنضيف وفحص بيانات الدعوة (بنستخدمه على السيرفر قبل الحفظ). بيرجع null لو البيانات الأساسية ناقصة. */
export function sanitizeDraft(raw: unknown): InviteDraft | null {
  if (!raw || typeof raw !== "object") return null
  const d = raw as Record<string, unknown>
  if (typeof d.templateId !== "string" || !isTemplateId(d.templateId)) return null

  const draft: InviteDraft = {
    templateId: d.templateId,
    groom: text(d.groom, 40),
    bride: text(d.bride, 40),
    occasion: text(d.occasion, 24),
    hosts: text(d.hosts, 80),
    message: text(d.message, 140),
    date: /^\d{4}-\d{2}-\d{2}$/.test(String(d.date ?? "")) ? String(d.date) : "",
    time: /^\d{2}:\d{2}$/.test(String(d.time ?? "")) ? String(d.time) : "",
    venue: text(d.venue, 80),
    city: text(d.city, 40),
    opening: text(d.opening, 60),
    rsvpPhone: text(d.rsvpPhone, 20),
    mapUrl: url(d.mapUrl, 300),
    venueAddress: text(d.venueAddress, 240),
    venueLat: coordinate(d.venueLat, -90, 90),
    venueLng: coordinate(d.venueLng, -180, 180),
    musicUrl: url(d.musicUrl, 500),
    photoOne: url(d.photoOne, 500),
    photoTwo: url(d.photoTwo, 500),
    program: multiline(d.program, 400, 8),
    gallery: galleryUrls(d.gallery),
    story: text(d.story, 300),
    faq: multiline(d.faq, 500, 6),
    dressCode: text(d.dressCode, 120),
    arabicFont: typeof d.arabicFont === "string" && ARABIC_FONTS.includes(d.arabicFont) ? d.arabicFont : "Amiri",
    englishFont: typeof d.englishFont === "string" && ENGLISH_FONTS.includes(d.englishFont) ? d.englishFont : "Cormorant Garamond",
  }
  if (!draft.groom || !draft.bride || !draft.date || !draft.venue) return null
  return draft
}
