import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Invitation } from "../components/Invitation"
import { packages, type PackageId } from "../config"
import { draftFor, templates } from "../data"
import { money } from "../lib/format"
import { clearDraft, readActivePackage, readSelectedPackage, selectPackage } from "../lib/storage"
import type { Occasion } from "../types"

const filters = ["الكل", "فرح", "خطوبة", "كتب كتاب", "حنة"] as const

export function Gallery() {
  const activeOrder = readActivePackage()
  const activeBundle = activeOrder ? packages.find((item) => item.id === activeOrder.packageId) : undefined
  const hasUnusedInvites = Boolean(activeOrder && activeBundle && activeOrder.used < activeBundle.quantity)
  const [filter, setFilter] = useState<(typeof filters)[number]>("الكل")
  const [selected, setSelected] = useState<PackageId>(() => hasUnusedInvites && activeOrder ? activeOrder.packageId : readSelectedPackage())

  useEffect(() => {
    document.title = "الباقات والتصاميم — دعوتنا"
  }, [])

  const visible = templates.filter((item) => filter === "الكل" || item.category === (filter as Occasion))

  function choosePackage(id: PackageId) {
    if (hasUnusedInvites && activeOrder && id !== activeOrder.packageId) return
    setSelected(id)
    selectPackage(id)
  }

  return (
    <main id="main" className="mx-auto max-w-6xl px-4 py-10 md:py-14">
      <div className="mx-auto max-w-3xl text-center">
        <p className="inline-flex rounded-full bg-[#fff0f2] px-4 py-2 text-sm font-bold text-[#a64257]">باقات دعوتنا</p>
        <h1 className="mt-4 font-display text-4xl text-[#4a2d33] md:text-6xl">اختار الباقة اللي تناسبك</h1>
        <p className="mx-auto mt-4 max-w-2xl leading-8 text-[#806b70]">
          اختار عدد الدعوات اللي محتاجها، وبعدها اختار تصميمك وابدأ تخصّص كل دعوة لوحدها.
        </p>
      </div>

      <section className="mt-10 grid items-stretch gap-4 sm:grid-cols-2 lg:grid-cols-4" aria-label="باقات الدعوات">
        {packages.map((item) => {
          const active = selected === item.id
          const featured = item.id === "plus"
          return (
            <article key={item.id} className={`relative flex flex-col rounded-[26px] border p-5 transition duration-200 ${featured ? "border-[#183d32] bg-[#102d25] text-white shadow-[0_16px_36px_rgba(16,45,37,0.18)] lg:-translate-y-2" : "border-[#eadde0] bg-white text-[#4a2d33]"} ${active ? "ring-2 ring-[#b83b50] ring-offset-2" : ""}`}>
              {item.id === "single" ? (
                <>
                  <span className="mb-3 self-start rounded-full bg-[#fae8eb] px-3 py-1 text-xs font-extrabold text-[#bd4058]">خصم 37%</span>
                  <h2 className="text-xl font-extrabold">{item.name}</h2>
                  <p className="mt-2 min-h-12 text-sm leading-6 text-[#806b70]">{item.description}</p>
                  <div className="mt-5 flex items-end gap-2">
                    <strong className="font-display text-4xl text-[#08745d]">{money(item.price)}</strong>
                    <span className="mb-1 text-sm text-[#a99599] line-through">{money(item.oldPrice)}</span>
                    <span className="mb-1 text-sm text-[#806b70]">ج.م · دفعة واحدة</span>
                  </div>
                  <div className="mt-5 flex-1 rounded-2xl bg-[#fbf7f3] p-4">
                    <p className="font-bold text-[#4a2d33]">تنشئ 1 دعوة مميزة</p>
                    <p className="mt-1 text-sm text-[#08745d]">≈ {money(item.price)} ج.م للدعوة</p>
                    <p className="mt-3 text-sm font-semibold leading-6 text-[#08745d]">وتبعتها لعدد لا نهائي من الناس</p>
                    <div className="mt-4 border-t border-[#eadde0] pt-4">
                      <p className="font-bold text-[#4a2d33]">اللي هتقدر تعمله</p>
                      {item.features.map((feature) => (
                        <p key={feature} className="mt-2 flex gap-2 text-sm leading-6 text-[#08745d]">
                          <span aria-hidden="true">✓</span><span>{feature}</span>
                        </p>
                      ))}
                    </div>
                    <div className="mt-4 border-t border-[#eadde0] pt-4">
                      {item.benefits.map((benefit) => (
                        <p key={benefit} className="mt-2 text-sm font-semibold text-[#4a2d33]">• {benefit}</p>
                      ))}
                    </div>
                  </div>
                  <p className="mt-3 text-center text-xs font-semibold leading-5 text-[#806b70]">{item.paymentNote}</p>
                </>
              ) : (
                <>
                  {item.label ? <span className={`mb-3 self-start rounded-full px-3 py-1 text-xs font-bold ${featured ? "bg-[#d9bd7b]/15 text-[#e8d39e]" : "bg-[#fff0f2] text-[#a64257]"}`}>{item.label}</span> : <span className="mb-3 h-6" />}
                  <h2 className="text-xl font-bold">{item.name}</h2>
                  <p className={`mt-2 min-h-12 text-sm leading-6 ${featured ? "text-white/70" : "text-[#806b70]"}`}>{item.description}</p>
                  <div className="mt-5 flex items-end gap-2">
                    <strong className={`font-display text-4xl ${featured ? "text-[#e8d39e]" : "text-[#08745d]"}`}>{money(item.price)}</strong>
                    <span className={`mb-1 text-sm line-through ${featured ? "text-white/45" : "text-[#a99599]"}`}>{money(item.oldPrice)}</span>
                  </div>
                  <p className={`mt-1 text-xs ${featured ? "text-white/60" : "text-[#806b70]"}`}>دفع مرة واحدة · {item.quantity} دعوات</p>
                  <div className={`mt-5 flex-1 rounded-2xl p-3 ${featured ? "bg-white/[0.07]" : "bg-[#fbf7f3]"}`}>
                    <p className="text-sm font-bold">الباقة تشمل</p>
                    {item.features.map((feature) => (
                      <p key={feature} className={`mt-2 text-sm leading-6 ${featured ? "text-white/80" : "text-[#08745d]"}`}>✓ {feature}</p>
                    ))}
                    <p className={`mt-3 border-t pt-3 text-sm font-bold ${featured ? "border-white/10 text-[#e8d39e]" : "border-[#eee3e3] text-[#08745d]"}`}>
                      ≈ {money(Math.round(item.price / item.quantity))} للدعوة
                    </p>
                  </div>
                </>
              )}
              <button
                type="button"
                onClick={() => choosePackage(item.id)}
                disabled={hasUnusedInvites && activeOrder?.packageId !== item.id}
                aria-pressed={active}
                className={`mt-4 min-h-11 w-full rounded-full px-4 text-sm font-bold transition ${featured ? "bg-[#e8d39e] text-[#17382e] hover:bg-[#f0dfb6]" : "bg-[#a64257] text-white hover:bg-[#91384b]"}`}
              >
                {active ? (item.id === "single" ? "✓ الباقة المختارة" : "✓ الباقة المختارة") : hasUnusedInvites ? "الباقة الحالية غير مكتملة" : item.id === "single" ? "اطلب الباقة" : "اختار الباقة"}
              </button>
            </article>
          )
        })}
      </section>

      <div className="mx-auto mt-14 max-w-3xl text-center">
        <p className="text-sm font-bold text-[#b83b50]">الخطوة اللي بعدها</p>
        <h2 className="mt-2 font-display text-3xl text-[#4a2d33] md:text-4xl">اختار تصميم دعوتك</h2>
        <p className="mt-3 leading-7 text-[#806b70]">
          الباقة المختارة: <strong className="text-[#a64257]">{packages.find((item) => item.id === selected)?.name}</strong> — تقدر تعمل {packages.find((item) => item.id === selected)?.quantity} {selected === "single" ? "دعوة" : "دعوات"} مختلفة.
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
            <Link to={`/editor/${template.id}`} onClick={clearDraft} className="block overflow-hidden rounded-[21px] bg-[#fff8f8]">
              <Invitation draft={draftFor(template)} />
            </Link>
            <div className="flex items-center justify-between gap-3 px-2 pb-2 pt-4">
              <div className="min-w-0">
                <h3 className="text-lg font-bold text-[#4a2d33]">{template.name}</h3>
                <p className="mt-1 text-sm text-[#806b70]">{template.blurb}</p>
              </div>
            </div>
            <Link to={`/editor/${template.id}`} onClick={clearDraft} className="btn-dark mb-1 mt-3 w-full">اختار التصميم</Link>
          </article>
        ))}
      </div>
      {visible.length === 0 ? (
        <p className="py-16 text-center text-[#806b70]">مفيش تصاميم في القسم ده حاليًا.</p>
      ) : null}
    </main>
  )
}
