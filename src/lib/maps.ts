import type { InviteDraft } from "../types"

/** Builds an OpenStreetMap link for a venue, without relying on Google Maps. */
export function mapLink(draft: Pick<InviteDraft, "mapUrl" | "venue" | "city" | "venueLat" | "venueLng">): string {
  if (
    typeof draft.venueLat === "number" &&
    Number.isFinite(draft.venueLat) &&
    typeof draft.venueLng === "number" &&
    Number.isFinite(draft.venueLng)
  ) {
    return `https://www.openstreetmap.org/?mlat=${draft.venueLat}&mlon=${draft.venueLng}#map=16/${draft.venueLat}/${draft.venueLng}`
  }

  const query = [draft.venue, draft.city].filter(Boolean).join(" ").trim()
  return `https://www.openstreetmap.org/search?query=${encodeURIComponent(query)}`
}
