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
    document.title = "الدعوات — زفّة"
  }, [])
  const visible = templates.filter((item) => filter === "الكل" || item.category === (filter as Occasion))

  return (
    <main id="main" className="mx-auto max-w-6xl px-4 py-12">
      <p className="text-sm font-bold text-gold">عشر دعوات جاهزة</p>
      <h1 className="mt-2 font-display text-5xl">اختار تصميم دعوتك</h1>
      <p className="mt-3 max-w-2xl leading-8 text-mute">كل الدعوات بـ {money(site.price)}. بعد الاختيار تكتب التفاصيل بنفسك وتشوفها على طول.</p>
      <div className="mt-6 flex gap-2 overflow-x-auto pb-2" role="tablist" aria-label="تصفية الدعوات">
        {filters.map((item) => (
          <button
            key={item}
            type="button"
            role="tab"
            aria-selected={filter === item}
            onClick={() => setFilter(item)}
            className={`h-11 shrink-0 cursor-pointer rounded-full px-4 font-bold ${filter === item ? "bg-ink text-cream" : "bg-card text-ink ring-1 ring-line"}`}
          >
            {item}
          </button>
        ))}
      </div>
      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((template) => (
          <article key={template.id} className="relative rounded-[28px] border border-line bg-card p-3 shadow-sm">
            {template.isNew ? (
              <span className="absolute top-5 right-5 z-10 rounded-full bg-[#7c1d32] px-3 py-1 text-xs font-bold text-white">جديد</span>
            ) : null}
            <Link to={`/editor/${template.id}`} className="block overflow-hidden rounded-[22px]">
              <Invitation draft={draftFor(template)} />
            </Link>
            <div className="flex items-end justify-between gap-3 px-2 py-4">
              <div>
                <h2 className="text-xl font-bold">{template.name}</h2>
                <p className="text-sm text-mute">{template.blurb}</p>
              </div>
              <p className="shrink-0 font-bold text-gold">{money(site.price)}</p>
            </div>
            <Link to={`/editor/${template.id}`} className="btn-dark mb-2 w-full">عدّل الدعوة</Link>
          </article>
        ))}
      </div>
    </main>
  )
}
