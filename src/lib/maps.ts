import type { InviteDraft } from "../types"

/** Builds an OpenStreetMap link for a venue, without relying on Google Maps. */
export function mapLink(draft: Pick<InviteDraft, "mapUrl" | "venue" | "city" | "venueLat" | "venueLng">): string {
  if (draft.mapUrl) {
    try { const parsed = new URL(draft.mapUrl); if ((parsed.protocol === "https:" || parsed.protocol === "http:") && !parsed.hostname.includes("openstreetmap.org")) return parsed.href } catch { /* generate a map destination */ }
  }

  if (
    typeof draft.venueLat === "number" &&
    Number.isFinite(draft.venueLat) &&
    typeof draft.venueLng === "number" &&
    Number.isFinite(draft.venueLng)
  ) {
    return `https://www.google.com/maps/search/?api=1&query=${draft.venueLat},${draft.venueLng}`
  }

  const query = [draft.venue, draft.city].filter(Boolean).join(" ").trim()
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`
}
