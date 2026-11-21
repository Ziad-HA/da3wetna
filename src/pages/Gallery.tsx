import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { packages } from "../config"
import { draftFor, templates } from "../data"
import { clearDraft, readActivePackage, readSelectedPackage } from "../lib/storage"
import type { Occasion } from "../types"

const filters = ["الكل", "فرح", "خطوبة", "كتب كتاب", "حنة"] as const

export function Gallery() {
  const activeOrder = readActivePackage()
  const activeBundle = activeOrder ? packages.find((item) => item.id === activeOrder.packageId) : undefined
  const hasUnusedInvites = Boolean(activeOrder && activeBundle && activeOrder.used < activeBundle.quantity)
  const [filter, setFilter] = useState<(typeof filters)[number]>("الكل")
  const selected = hasUnusedInvites && activeOrder ? activeOrder.packageId : readSelectedPackage()
  const visible = templates.filter((item) => filter === "الكل" || item.category === (filter as Occasion))

  useEffect(() => {
    document.title = "اختار تصميم دعوتك — دعوتنا"
  }, [])

  return (
    <main id="main" className="gallery-page mx-auto min-h-screen max-w-7xl px-3 pb-12 pt-5 sm:px-5 sm:pt-8 md:px-8 md:pt-12">
      <section className="gallery-hero relative isolate overflow-hidden rounded-[28px] border border-[#f1dce2] px-5 py-7 text-center sm:rounded-[36px] sm:px-10 sm:py-12">
        <span className="pointer-events-none absolute -left-12 -top-16 -z-10 h-44 w-44 rounded-full border border-[#d9aab5]/40 sm:h-64 sm:w-64" />
        <span className="pointer-events-none absolute -bottom-20 -right-10 -z-10 h-52 w-52 rounded-full bg-[#f6dfe5]/70 blur-2xl sm:h-72 sm:w-72" />
        <div className="mx-auto max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#edcbd4] bg-white/80 px-3 py-1.5 text-[11px] font-extrabold tracking-wide text-[#a64257] sm:text-xs">
            <span className="h-1.5 w-1.5 rounded-full bg-[#b83b50]" />
            معرض دعوتنا
          </span>
          <h1 className="mt-4 font-display text-[2rem] leading-[1.35] text-[#4a2d33] sm:mt-5 sm:text-5xl md:text-6xl">اختار شكل فرحتك</h1>
          <p className="mx-auto mt-2 max-w-lg text-sm leading-7 text-[#806b70] sm:mt-4 sm:text-base sm:leading-8">
            تصميمات معمولة للحظاتكم الحلوة. اختار اللي شبهكم وخصص كل التفاصيل بنفسك.
          </p>
          <div className="mx-auto mt-5 flex max-w-md items-center justify-between gap-3 rounded-2xl border border-white/90 bg-white/75 px-4 py-3 text-right shadow-[0_8px_24px_rgba(120,65,80,.06)] backdrop-blur sm:mt-7">
            <div className="min-w-0">
              <p className="text-[10px] font-semibold text-[#9a8187] sm:text-xs">الباقة الحالية</p>
              <p className="mt-0.5 truncate text-sm font-extrabold text-[#4a2d33]">{packages.find((item) => item.id === selected)?.name}</p>
            </div>
            <Link to="/packages" className="shrink-0 rounded-xl bg-[#fff0f2] px-3 py-2 text-xs font-bold text-[#a64257] transition hover:bg-[#f9e1e6]">تغيير الباقة</Link>
          </div>
        </div>
        <div className="pointer-events-none absolute right-5 top-5 hidden text-3xl text-[#c6a15b]/70 sm:block">✿</div>
        <div className="pointer-events-none absolute bottom-5 left-7 hidden text-2xl text-[#b83b50]/35 sm:block">♡</div>
      </section>

      <section className="mt-7 sm:mt-11">
        <div className="flex items-end justify-between gap-3 px-1">
          <div>
            <p className="text-[10px] font-extrabold tracking-[.16em] text-[#b36a78] sm:text-xs">اختار المناسبة</p>
            <h2 className="mt-1 font-display text-2xl text-[#4a2d33] sm:text-3xl">التصميمات المتاحة</h2>
          </div>
          <span className="mb-1 rounded-full bg-white px-3 py-1.5 text-[11px] font-bold text-[#90777d] ring-1 ring-[#f0dce1]">{visible.length} تصميم</span>
        </div>

        <div className="gallery-filters -mx-3 mt-4 flex snap-x gap-2 overflow-x-auto px-3 pb-2 sm:mx-0 sm:mt-5 sm:flex-wrap sm:overflow-visible sm:px-0" role="tablist" aria-label="تصفية الدعوات">
          {filters.map((item) => (
            <button
              key={item}
              type="button"
              role="tab"
              aria-selected={filter === item}
              onClick={() => setFilter(item)}
              className={`min-h-10 shrink-0 snap-start rounded-full px-4 text-xs font-bold transition sm:min-h-11 sm:px-5 sm:text-sm ${filter === item ? "bg-[#a64257] text-white shadow-[0_5px_14px_rgba(166,66,87,.18)]" : "border border-[#f0dce1] bg-white text-[#806b70] hover:border-[#d9aab5] hover:text-[#a64257]"}`}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="mt-4 grid grid-cols-2 items-start gap-3 sm:mt-6 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
          {visible.map((template, index) => (
            <article key={template.id} className="gallery-card group relative min-w-0 overflow-hidden rounded-[20px] border border-[#f0dce1] bg-white p-2 shadow-[0_5px_20px_rgba(91,48,60,.045)] transition duration-300 hover:-translate-y-1 hover:border-[#dfb8c2] hover:shadow-[0_16px_34px_rgba(91,48,60,.10)] sm:rounded-[26px] sm:p-3">
              <Link to={`/editor/${template.id}`} onClick={clearDraft} className="gallery-preview relative block overflow-hidden rounded-[15px] bg-[#fff5f6] sm:rounded-[20px]" aria-label={`معاينة تصميم ${template.name}`}>
                <Invitation draft={draftFor(template)} />
                <span className="gallery-preview-hint absolute inset-x-2 bottom-2 flex items-center justify-center rounded-full bg-white/90 px-2 py-2 text-[10px] font-bold text-[#8b5260] opacity-100 shadow-sm backdrop-blur sm:inset-x-4 sm:bottom-4 sm:py-2.5 sm:text-xs sm:opacity-0 sm:transition group-hover:opacity-100">اضغط لمعاينة التصميم</span>
              </Link>
              <div className="px-1 pb-1 pt-3 sm:px-2 sm:pt-4">
                <div className="flex min-h-[42px] items-start justify-between gap-1.5">
                  <div className="min-w-0">
                    <h3 className="truncate text-xs font-extrabold text-[#4a2d33] sm:text-base">{template.name}</h3>
                    <p className="mt-1 line-clamp-2 text-[10px] leading-4 text-[#90777d] sm:text-xs sm:leading-5">{template.blurb}</p>
                  </div>
                  {template.isNew ? <span className="shrink-0 rounded-full bg-[#fff0f2] px-2 py-1 text-[9px] font-extrabold text-[#a64257] sm:text-[10px]">جديد</span> : null}
                </div>
                <Link to={`/editor/${template.id}`} onClick={clearDraft} className="mt-3 flex min-h-10 items-center justify-center gap-1.5 rounded-xl bg-[#4a2d33] px-2 text-[11px] font-bold text-white transition hover:bg-[#a64257] active:scale-[.98] sm:mt-4 sm:min-h-11 sm:rounded-full sm:text-sm">
                  اختار التصميم <span aria-hidden="true">←</span>
                </Link>
              </div>
            </article>
          ))}
        </div>
        {visible.length === 0 ? (
          <div className="mt-6 rounded-3xl border border-dashed border-[#e8c8cf] bg-white/70 px-5 py-12 text-center">
            <span className="text-3xl text-[#c68b98]">♡</span>
            <p className="mt-3 font-bold text-[#4a2d33]">مفيش تصميمات في القسم ده حاليًا</p>
            <button type="button" onClick={() => setFilter("الكل")} className="mt-4 text-sm font-bold text-[#a64257] underline underline-offset-4">عرض كل التصميمات</button>
          </div>
        ) : null}
      </section>
    </main>
  )
}
