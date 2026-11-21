import { useEffect } from "react"
import { Link, useParams } from "react-router-dom"
import { StoryActions } from "../components/StoryActions"
import { Invitation } from "../components/Invitation"
import { getTemplate } from "../data"
import { decodeDraft } from "../lib/codec"

export function InviteView() {
  const { code = "" } = useParams()
  const draft = decodeDraft(code)
  const template = draft ? getTemplate(draft.templateId) : undefined

  useEffect(() => {
    document.title = draft ? `دعوة ${draft.groom} و${draft.bride}` : "دعوة"
  }, [draft])

  if (!draft || !template) {
    return (
      <main className="grid min-h-dvh place-items-center bg-cream px-4 text-center">
        <div>
          <h1 className="font-display text-4xl">الدعوة دي مش متاحة</h1>
          <Link to="/" className="btn-gold mt-6 inline-flex">اعمل دعوة من دعوتنا</Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-dvh px-4 py-8" style={{ background: template.vars.shell, color: template.vars.ink }}>
      <div className="mx-auto grid w-full max-w-md justify-items-center gap-5">
        <p className="font-display text-2xl">دعوة {draft.occasion}</p>
        <div className="w-full overflow-hidden rounded-[28px] shadow-2xl">
          <Invitation draft={draft} />
        </div>
        <div className="w-full">
          <StoryActions draft={draft} code={code} />
        </div>
        <Link to="/" className="text-sm font-bold underline-offset-4 hover:underline">دعوة من دعوتنا</Link>
      </div>
    </main>
  )
}
