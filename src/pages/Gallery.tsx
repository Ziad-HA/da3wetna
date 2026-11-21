import { useEffect, useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { Invitation } from "../components/Invitation"
import { PhonePreview } from "../components/PhonePreview"
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
  const [query, setQuery] = useState("")
  const [favoritesOnly, setFavoritesOnly] = useState(false)
  const [favorites, setFavorites] = useState<string[]>(() => { try { return JSON.parse(localStorage.getItem("da3wetna-favorites") || "[]") as string[] } catch { return [] } })
  const selected = hasUnusedInvites && activeOrder ? activeOrder.packageId : readSelectedPackage()
  const visible = useMemo(() => templates.filter((item) => (filter === "الكل" || item.category === (filter as Occasion)) && (!favoritesOnly || favorites.includes(item.id)) && (!query.trim() || `${item.name} ${item.blurb} ${item.category}`.toLowerCase().includes(query.trim().toLowerCase()))), [filter, favoritesOnly, favorites, query])

  function toggleFavorite(id: string) {
    setFavorites((current) => {
      const next = current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
      localStorage.setItem("da3wetna-favorites", JSON.stringify(next))
      return next
    })
  }

  useEffect(() => {
    document.title = "تصميمات الدعوات — دعوتنا"
  }, [])

  return (
    <main id="main" className="mx-auto min-h-screen max-w-7xl px-3 pb-14 pt-5 sm:px-6 sm:pt-9 lg:px-8">
      <section className="relative overflow-hidden rounded-[22px] bg-[#f8e9ec] px-4 py-5 sm:rounded-[34px] sm:px-10 sm:py-10 lg:px-14">
        <div className="pointer-events-none absolute -left-16 -top-20 h-56 w-56 rounded-full border border-[#d9aab5]/50 sm:h-72 sm:w-72" />
        <div className="pointer-events-none absolute -bottom-24 right-[42%] h-56 w-56 rounded-full bg-white/55 blur-3xl" />
        <div className="relative grid grid-cols-[minmax(0,1fr)_104px] items-center gap-3 sm:gap-6 md:grid-cols-[1.2fr_.8fr] md:gap-10">
          <div className="min-w-0 text-right md:text-right">
            <p className="text-[10px] font-extrabold tracking-[.2em] text-[#a64257] sm:text-xs">DA3WETNA • INVITATION STUDIO</p>
            <h1 className="mt-2 font-display text-[1.45rem] leading-[1.45] text-[#4a2d33] sm:text-5xl lg:text-6xl">كل فرحة وليها<br className="hidden md:block" /> تصميم يشبهها</h1>
            <p className="mt-2 max-w-xl text-[11px] leading-6 text-[#806b70] sm:text-base sm:leading-8 md:mx-0">
              اختار من مجموعة تصميماتنا، وشوف شكل دعوتك قبل ما تبدأ تضيف تفاصيل فرحتك.
            </p>
            <div className="mt-3 flex flex-col items-stretch gap-2 sm:flex-row sm:items-center md:justify-start">
              <a href="#designs" className="inline-flex min-h-9 items-center justify-center rounded-full bg-[#a64257] px-3 text-[11px] font-bold text-white shadow-[0_7px_18px_rgba(166,66,87,.18)] transition hover:-translate-y-0.5 hover:bg-[#91384b]">تصفح التصميمات <span className="mr-2">↓</span></a>
              <div className="hidden items-center justify-center gap-2 rounded-full border border-white/80 bg-white/65 sm:flex px-4 py-2.5 text-xs text-[#806b70]">
                <span className="font-extrabold text-[#4a2d33]">{templates.length}</span> تصميم متاح
                <span className="mx-1 text-[#d8aab5]">•</span>
                <span>تخصيص سهل</span>
              </div>
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-[104px] sm:max-w-[285px]">
            <div className="absolute -inset-1 rotate-[-5deg] rounded-[14px] sm:-inset-3 sm:rounded-[22px] border border-white/80 bg-white/25" />
            <div className="relative rotate-[1deg] overflow-hidden rounded-[10px] border-[3px] sm:rotate-[2deg] sm:rounded-[18px] sm:border-[7px] border-white bg-white shadow-[0_22px_55px_rgba(94,49,61,.18)]">
              <PhonePreview className="w-[min(100%,150px)] sm:w-[min(100%,250px)]"><Invitation draft={draftFor(templates[0])} /></PhonePreview>
            </div>
            <span className="absolute -bottom-2 -left-2 grid h-7 w-7 sm:-bottom-4 sm:-left-5 sm:h-12 sm:w-12 place-items-center rounded-full border-4 border-[#f8e9ec] bg-white text-2xl text-[#b83b50] shadow-md">♡</span>
            <span className="absolute -right-2 top-2 hidden rounded-full border border-white bg-white/90 sm:block sm:-right-5 sm:top-5 px-3 py-2 text-[10px] font-bold text-[#a64257] shadow-sm">دعوتك تبدأ من هنا</span>
          </div>
        </div>
      </section>

      <section id="designs" className="scroll-mt-24 pt-8 sm:pt-12">
        <div className="flex items-center justify-between gap-2 sm:items-end sm:gap-4">
          <div>
            <p className="text-[10px] font-extrabold tracking-[.18em] text-[#b36a78] sm:text-xs">THE COLLECTION</p>
            <h2 className="mt-1 font-display text-xl text-[#4a2d33] sm:text-3xl">اختار المناسبة</h2>
            <p className="mt-1 hidden text-xs text-[#90777d] sm:block sm:text-sm">فلتر التصميمات حسب نوع مناسبتك.</p>
          </div>
          <div className="flex shrink-0 items-center gap-2 rounded-xl border border-[#f0dce1] bg-white px-2.5 py-2 sm:gap-3 sm:rounded-2xl sm:px-3 sm:py-2.5 sm:min-w-[230px]">
            <div className="min-w-0">
              <p className="hidden text-[10px] text-[#a18a8f] sm:block">باقتك الحالية</p>
              <p className="max-w-[82px] truncate text-[10px] font-extrabold text-[#4a2d33] sm:max-w-none sm:text-xs">{packages.find((item) => item.id === selected)?.name}</p>
            </div>
            <Link to="/packages" className="shrink-0 rounded-lg bg-[#fff0f2] px-2.5 py-2 text-[10px] font-bold text-[#a64257] transition hover:bg-[#f8e1e6]">تغيير</Link>
          </div>
        </div>

        <div className="mt-5 grid gap-2 sm:grid-cols-[1fr_auto]">
          <label className="relative block min-w-0"><span className="sr-only">ابحث عن تصميم</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="ابحث عن تصميم..." className="min-h-12 w-full rounded-2xl border border-[#f0dce1] bg-white px-4 pl-11 text-sm text-[#4a2d33] outline-none transition focus:border-[#c98c9a] focus:ring-4 focus:ring-[#f8e8ec]" />{query ? <button type="button" onClick={() => setQuery("")} aria-label="مسح البحث" className="absolute left-2 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full bg-[#fff0f2] text-lg text-[#a64257]">×</button> : null}</label>
          <button type="button" onClick={() => setFavoritesOnly((value) => !value)} aria-pressed={favoritesOnly} className={`min-h-12 rounded-2xl border px-4 text-xs font-bold transition ${favoritesOnly ? "border-[#a64257] bg-[#a64257] text-white" : "border-[#f0dce1] bg-white text-[#a64257]"}`}>♡ المفضلة ({favorites.length})</button>
        </div>

        <div className="mt-3 flex snap-x gap-2 overflow-x-auto pb-2 sm:mt-5 sm:flex-wrap sm:overflow-visible" role="tablist" aria-label="تصفية الدعوات">
          {filters.map((item) => (
            <button key={item} type="button" role="tab" aria-selected={filter === item} onClick={() => setFilter(item)}
              className={`min-h-9 shrink-0 snap-start rounded-full px-4 text-[11px] font-bold transition sm:min-h-11 sm:text-sm ${filter === item ? "bg-[#4a2d33] text-white shadow-md" : "border border-[#f0dce1] bg-white text-[#806b70] hover:border-[#d9aab5] hover:text-[#a64257]"}`}>
              {item}
            </button>
          ))}
        </div>

        <div className="mb-3 mt-3 flex items-center justify-between px-1">
          <p className="text-xs font-bold text-[#806b70]">التصميمات المتاحة</p>
          <span className="text-[11px] text-[#a18a8f]">{visible.length} نتيجة</span>
        </div>

        <div className="grid grid-cols-2 items-start gap-2.5 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
          {visible.map((template) => (
            <article key={template.id} className="group min-w-0 overflow-hidden rounded-[16px] border border-[#f0dce1] bg-white p-1.5 shadow-[0_5px_22px_rgba(91,48,60,.045)] transition duration-300 hover:-translate-y-1 hover:border-[#dfb8c2] hover:shadow-[0_16px_34px_rgba(91,48,60,.10)] sm:rounded-[26px] sm:p-3">
              <div className="relative overflow-hidden rounded-[11px] bg-[#fff5f6] sm:rounded-[19px]">
                <Link to={`/editor/${template.id}`} onClick={clearDraft} className="block" aria-label={`اختار تصميم ${template.name}`}>
                <PhonePreview className="w-[min(100%,172px)] sm:w-[min(100%,230px)]"><Invitation draft={draftFor(template)} /></PhonePreview>
                <span className="absolute inset-x-2 bottom-2 rounded-full bg-white/90 px-2 py-2 text-center text-[9px] font-bold text-[#8b5260] shadow-sm backdrop-blur sm:inset-x-4 sm:bottom-4 sm:py-2.5 sm:text-xs sm:opacity-0 sm:transition group-hover:opacity-100">معاينة واختيار</span>
                {template.isNew ? <span className="absolute right-2 top-2 rounded-full bg-white/95 px-2.5 py-1 text-[9px] font-extrabold text-[#a64257] shadow-sm sm:right-3 sm:top-3 sm:text-[10px]">جديد</span> : null}
                </Link>
                <button type="button" onClick={() => toggleFavorite(template.id)} aria-label={favorites.includes(template.id) ? "إزالة من المفضلة" : "إضافة للمفضلة"} aria-pressed={favorites.includes(template.id)} className={`absolute left-2 top-2 grid h-9 w-9 place-items-center rounded-full border border-white/80 text-xl shadow-md backdrop-blur transition active:scale-90 sm:left-3 sm:top-3 ${favorites.includes(template.id) ? "bg-[#a64257] text-white" : "bg-white/90 text-[#a64257]"}`}>{favorites.includes(template.id) ? "♥" : "♡"}</button>
              </div>
              <div className="px-0.5 pb-1 pt-2 sm:px-2 sm:pt-4">
                <h3 className="truncate text-[11px] font-extrabold text-[#4a2d33] sm:text-base">{template.name}</h3>
                <p className="mt-1 line-clamp-2 min-h-8 text-[9px] leading-[1.45] text-[#90777d] sm:min-h-10 sm:text-xs sm:leading-5">{template.blurb}</p>
                <Link to={`/editor/${template.id}`} onClick={clearDraft} className="mt-2 flex min-h-9 items-center justify-center rounded-lg bg-[#fff0f2] px-1.5 text-[10px] font-extrabold text-[#a64257] transition hover:bg-[#a64257] hover:text-white active:scale-[.98] sm:mt-4 sm:min-h-11 sm:rounded-full sm:text-sm">اختار التصميم <span className="mr-1">←</span></Link>
              </div>
            </article>
          ))}
        </div>

        {visible.length === 0 ? (
          <div className="mt-6 rounded-3xl border border-dashed border-[#e8c8cf] bg-white/70 px-5 py-12 text-center">
            <span className="text-3xl text-[#c68b98]">♡</span>
            <p className="mt-3 font-bold text-[#4a2d33]">مفيش تصميمات مطابقة للبحث أو الفلتر ده</p>
            <button type="button" onClick={() => { setFilter("الكل"); setQuery(""); setFavoritesOnly(false) }} className="mt-4 rounded-full bg-[#a64257] px-5 py-3 text-sm font-bold text-white shadow-sm">عرض كل التصميمات</button>
          </div>
        ) : null}
      </section>
    </main>
  )
}
