import type { InviteDraft } from "../types"

export function VenueMap({ draft }: { draft: InviteDraft }) {
  if (typeof draft.venueLat !== "number" || typeof draft.venueLng !== "number") return null
  const { venueLat, venueLng } = draft
  const bbox = [venueLng - 0.012, venueLat - 0.008, venueLng + 0.012, venueLat + 0.008].join("%2C")
  return (
    <section className="w-full rounded-[26px] border border-white/70 bg-white/80 p-3 shadow-lg">
      <p className="mb-2 text-center text-sm font-bold text-[#4a2d33]">{draft.venueAddress || [draft.venue, draft.city].filter(Boolean).join(" — ")}</p>
      <iframe
        title="خريطة مكان المناسبة"
        src={`https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${venueLat}%2C${venueLng}`}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="block w-full rounded-2xl border-0"
        style={{ height: 220 }}
        allowFullScreen
      />
      <p className="mt-2 text-center text-[11px] text-[#806b70]">© OpenStreetMap contributors</p>
    </section>
  )
}
