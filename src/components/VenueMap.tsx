import type { InviteDraft } from "../types"

export function VenueMap({ draft }: { draft: InviteDraft }) {
  if (typeof draft.venueLat !== "number" || typeof draft.venueLng !== "number") return null
  return (
    <section className="w-full rounded-[26px] border border-white/70 bg-white/80 p-3 shadow-lg">
      <p className="mb-2 text-center text-sm font-bold text-[#4a2d33]">{draft.venueAddress || [draft.venue, draft.city].filter(Boolean).join(" — ")}</p>
      <iframe
        title="خريطة مكان المناسبة"
        src={`https://www.google.com/maps?q=${draft.venueLat},${draft.venueLng}&z=16&output=embed`}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="block w-full rounded-2xl border-0"
        style={{ height: 220 }}
        allowFullScreen
      />
    </section>
  )
}
