import { useEffect } from "react"
import { Link, useParams } from "react-router-dom"
import { StoryActions } from "../components/StoryActions"
import { Invitation } from "../components/Invitation"
import { decodeDraft } from "../lib/codec"
import { readLast } from "../lib/storage"

export function Done() {
  const { code = "" } = useParams()
  const draft = decodeDraft(code)
  const order = readLast()
  useEffect(() => {
    document.title = draft ? `دعوة ${draft.groom} و${draft.bride}` : "الدعوة"
  }, [draft])

  if (!draft) {
    return (
      <main id="main" className="mx-auto max-w-lg px-4 py-20 text-center">
        <h1 className="font-display text-4xl">اللينك ده مش صالح</h1>
        <Link to="/templates" className="btn-gold mt-6 inline-flex">اختار دعوة جديدة</Link>
      </main>
    )
  }

  return (
    <main id="main" className="mx-auto grid max-w-4xl items-start gap-8 px-4 py-10 md:grid-cols-[minmax(0,380px)_1fr]">
      <div className="overflow-hidden rounded-[32px] shadow-xl ring-1 ring-black/10">
        <Invitation draft={draft} />
      </div>
      <section>
        <p className="text-sm font-bold text-gold">الدعوة جاهزة</p>
        <h1 className="mt-2 font-display text-5xl">تمام، تقدر تبعتها</h1>
        <p className="mt-3 leading-8 text-mute">
          حمّل الصورة وانشرها ستوري، أو ابعت اللينك. الضيف هيفتح نفس الدعوة من غير ما يعمل حساب.
        </p>
        {order && order.code === code ? <p className="mt-3 text-sm text-mute">رقم الطلب {order.id}</p> : null}
        <div className="mt-6 max-w-sm">
          <StoryActions draft={draft} code={code} />
        </div>
        <Link to="/templates" className="mt-6 inline-block font-bold text-gold">دعوة جديدة</Link>
      </section>
    </main>
  )
}
