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
        <h1 className="font-display text-4xl text-[#4a2d33]">اللينك ده مش صالح</h1>
        <Link to="/templates" className="btn-gold mt-6 inline-flex">اختار دعوة جديدة</Link>
      </main>
    )
  }

  return (
    <main id="main" className="mx-auto max-w-5xl px-4 py-10 md:py-16">
      <div className="mx-auto mb-9 max-w-2xl text-center">
        <span className="inline-flex rounded-full bg-[#edf7ef] px-4 py-2 text-sm font-bold text-[#38764a]">الدعوة جاهزة للمشاركة</span>
        <h1 className="mt-4 font-display text-4xl text-[#4a2d33] md:text-5xl">فرحتكم تكمل بوجودهم</h1>
        <p className="mt-3 leading-8 text-[#806b70]">حمّل صورة الدعوة لستوري واتساب، أو انسخ اللينك وابعته للضيوف.</p>
      </div>
      <div className="grid items-start gap-8 md:grid-cols-[minmax(0,340px)_1fr]">
        <div className="mx-auto w-full max-w-[340px] overflow-hidden rounded-[28px] bg-white p-2 shadow-[0_14px_40px_rgba(74,45,51,0.10)] ring-1 ring-[#f0dce1]">
          <Invitation draft={draft} />
        </div>
        <section className="rounded-[28px] border border-[#f0dce1] bg-white p-6 md:p-8">
          <p className="text-sm font-bold text-[#a64257]">مبروك</p>
          <h2 className="mt-2 font-display text-3xl text-[#4a2d33]">{draft.groom} و{draft.bride}</h2>
          <p className="mt-2 leading-7 text-[#806b70]">دعوتكم بقت جاهزة. اختار طريقة المشاركة اللي تريحك.</p>
          {order && order.code === code ? <p className="mt-4 text-xs text-[#9a8187]">رقم الطلب: {order.id}</p> : null}
          <div className="mt-6 max-w-sm">
            <StoryActions draft={draft} code={code} />
          </div>
          <div className="mt-7 border-t border-[#f3e6e9] pt-5">
            <Link to="/templates" className="text-sm font-bold text-[#a64257] hover:underline">اعمل دعوة جديدة ←</Link>
          </div>
        </section>
      </div>
    </main>
  )
}
