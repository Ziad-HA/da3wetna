import type { InviteDraft } from "../types"

const MAP_HOSTS = ["google.com", "google.com.eg", "goo.gl", "maps.app.goo.gl", "maps.google.com"]

/** لينك خرائط آمن: بيقبل لينكات جوجل ماب بس، وإلا بيبحث باسم المكان والمدينة. */
export function mapLink(draft: Pick<InviteDraft, "mapUrl" | "venue" | "city">): string {
  const raw = draft.mapUrl.trim()
  if (raw) {
    try {
      const url = new URL(raw)
      const host = url.hostname.replace(/^www\./, "")
      const ok = url.protocol === "https:" && MAP_HOSTS.some((item) => host === item || host.endsWith(`.${item}`))
      if (ok) return url.href
    } catch {
      /* لينك مش صالح — نكمل بالبحث */
    }
  }
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${draft.venue} ${draft.city}`.trim())}`
}
