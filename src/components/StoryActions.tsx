import { useRef, useState } from "react"
import { invitePath } from "../lib/codec"
import { downloadStory, fileName } from "../lib/download"
import type { InviteDraft } from "../types"
import { Invitation } from "./Invitation"

export function StoryActions({ draft, code }: { draft: InviteDraft; code: string }) {
  const sheet = useRef<HTMLDivElement>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState("")
  const [copied, setCopied] = useState(false)
  const link = `${window.location.origin}${invitePath(code)}`

  async function save() {
    if (!sheet.current) return
    setBusy(true)
    setError("")
    try {
      await downloadStory(sheet.current, fileName(draft.groom, draft.bride))
    } catch {
      setError("التحميل متعطل في المتصفح ده. افتح الدعوة من كروم، أو صوّر الشاشة.")
    } finally {
      setBusy(false)
    }
  }

  async function share() {
    const text = `دعوة ${draft.groom} و${draft.bride}\n${link}`
    if (navigator.share) {
      try {
        await navigator.share({ title: `دعوة ${draft.groom} و${draft.bride}`, text, url: link })
        return
      } catch {
        /* المستخدم قفل نافذة المشاركة */
      }
    }
    await navigator.clipboard.writeText(text)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1800)
  }

  const mapHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${draft.venue} ${draft.city}`)}`

  return (
    <div className="grid gap-3">
      <div className="export-stage" aria-hidden="true">
        <div ref={sheet} className="export-sheet">
          <Invitation draft={draft} />
        </div>
      </div>
      <button type="button" className="btn-gold w-full" onClick={save} disabled={busy}>
        {busy ? "بنجهّز الصورة..." : "حمّل ستوري واتساب"}
      </button>
      <button type="button" className="btn-dark w-full" onClick={share}>
        {copied ? "اللينك اتنسخ" : "ابعت الدعوة"}
      </button>
      <a className="btn-ghost w-full" href={mapHref} target="_blank" rel="noreferrer">
        افتح المكان على الخريطة
      </a>
      {error ? (
        <p className="text-sm text-red-800" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  )
}
