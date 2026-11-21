import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Invitation } from "../components/Invitation"
import { site } from "../config"
import { draftFor, templates } from "../data"
import { money } from "../lib/format"
import type { Occasion } from "../types"

const filters = ["الكل", "فرح", "خطوبة", "كتب كتاب", "حنة"] as const

export function Gallery() {
  const [filter, setFilter] = useState<(typeof filters)[number]>("الكل")
  useEffect(() => {
    document.title = "الدعوات — دعوتنا"
  }, [])
  const visible = templates.filter((item) => filter === "الكل" || item.category === (filter as Occasion))

  return (
    <main id="main" className="mx-auto max-w-6xl px-4 py-10 md:py-14">
      <div className="mx-auto max-w-3xl text-center">
        <p className="inline-flex rounded-full bg-[#fff0f2] px-4 py-2 text-sm font-bold text-[#a64257]">مجموعة دعوتنا</p>
        <h1 className="mt-4 font-display text-4xl text-[#4a2d33] md:text-6xl">اختار تصميم دعوتك</h1>
        <p className="mx-auto mt-4 max-w-2xl leading-8 text-[#806b70]">
          {templates.length} تصاميم مختلفة، وكل دعوة بـ {money(site.price)}. اختار اللي يعجبك وبعدها ضيف تفاصيل يومك.
        </p>
      </div>
      <div className="mt-8 flex justify-center gap-2 overflow-x-auto pb-2" role="tablist" aria-label="تصفية الدعوات">
        {filters.map((item) => (
          <button
            key={item}
            type="button"
            role="tab"
            aria-selected={filter === item}
            onClick={() => setFilter(item)}
            className={`h-10 shrink-0 cursor-pointer rounded-full px-5 text-sm font-bold transition ${filter === item ? "bg-[#b83b50] text-white shadow-sm" : "border border-[#f0dce1] bg-white text-[#806b70] hover:border-[#d9aab5] hover:text-[#a64257]"}`}
          >
            {item}
          </button>
        ))}
      </div>
      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((template) => (
          <article key={template.id} className="group relative rounded-[28px] border border-[#f0dce1] bg-white p-3 shadow-[0_8px_28px_rgba(91,48,60,0.045)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_16px_36px_rgba(91,48,60,0.10)]">
            {template.isNew ? (
              <span className="absolute right-5 top-5 z-10 rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-[#a64257] shadow-sm ring-1 ring-[#f0dce1]">جديد</span>
            ) : null}
            <Link to={`/editor/${template.id}`} className="block overflow-hidden rounded-[21px] bg-[#fff8f8]">
              <Invitation draft={draftFor(template)} />
            </Link>
            <div className="flex items-center justify-between gap-3 px-2 pb-2 pt-4">
              <div className="min-w-0">
                <h2 className="text-lg font-bold text-[#4a2d33]">{template.name}</h2>
                <p className="mt-1 text-sm text-[#806b70]">{template.blurb}</p>
              </div>
              <p className="shrink-0 rounded-full bg-[#fff0f2] px-3 py-1.5 text-sm font-bold text-[#a64257]">{money(site.price)}</p>
            </div>
            <Link to={`/editor/${template.id}`} className="btn-dark mb-1 mt-3 w-full">اختار التصميم</Link>
          </article>
        ))}
      </div>
      {visible.length === 0 ? (
        <p className="py-16 text-center text-[#806b70]">مفيش تصاميم في القسم ده حاليًا.</p>
      ) : null}
    </main>
  )
}
