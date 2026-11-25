import { useState } from "react"
import type { InviteDraft } from "../types"

export function GardenOpening({ draft, onOpen }: { draft: InviteDraft; onOpen: () => void }) {
  const [opening, setOpening] = useState(false)
  const start = () => { if (opening) return; setOpening(true); window.setTimeout(onOpen, 1250) }
  return <main className={`garden-opening ${opening ? "is-opening" : ""}`} onClick={start}>
    <div className="garden-envelope">
      <div className="garden-envelope-lid" />
      <div className="garden-envelope-paper"><span>{draft.groom} <i>و</i> {draft.bride}</span><small>دعوة زفاف</small></div>
      <div className="garden-envelope-flap" />
      <button type="button" className="garden-wax-seal" onClick={(e) => { e.stopPropagation(); start() }} aria-label="افتح الظرف"><span>{draft.groom.trim().charAt(0)} · {draft.bride.trim().charAt(0)}</span></button>
    </div>
    {!opening ? <p className="garden-opening-hint">اضغط على الختم لفتح دعوتك</p> : <p className="garden-opening-hint">دعوة من القلب…</p>}
  </main>
}
