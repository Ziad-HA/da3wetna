import { useEffect } from "react"
import { Link, useSearchParams } from "react-router-dom"
import { packages } from "../config"
import { money } from "../lib/format"
import { selectPackage } from "../lib/storage"

export function Packages() {
  const [searchParams] = useSearchParams()
  const requestedReturn = searchParams.get("return")
  const returnTo = requestedReturn?.startsWith("/") && !requestedReturn.startsWith("//") ? requestedReturn : "/templates"

  useEffect(() => { document.title = "الباقات والأسعار — دعوتنا" }, [])
  return (
    <main id="main" className="min-h-[70vh] bg-[#fffafb]">
      <section className="border-b border-[#f0dce1] bg-[#fff5f6] px-4 py-16 text-center md:py-20">
        <p className="text-sm font-bold text-[#b83b50]">باقات دعوتنا</p>
        <h1 className="mt-3 font-display text-4xl text-[#4a2d33] md:text-6xl">اختار الباقة المناسبة لفرحتك</h1>
        <p className="mx-auto mt-4 max-w-2xl leading-8 text-[#806b70]">ابدأ بدعوة واحدة أو اختار باقة متعددة لو عندك أكتر من مناسبة أو نسخة.</p>
      </section>
      <section className="mx-auto max-w-6xl px-3 py-7 sm:px-4 sm:py-12 md:py-16">
        <div className="grid items-stretch gap-3 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
          {packages.map((item) => {
            const featured = item.id === "plus"
            return (
              <article key={item.id} className={"relative flex flex-col rounded-[20px] border bg-white p-3.5 shadow-[0_6px_20px_rgba(91,48,60,0.035)] transition duration-300 sm:rounded-[26px] sm:p-5 hover:-translate-y-1 hover:shadow-[0_18px_42px_rgba(166,66,87,0.11)] " + (featured ? "border-[#d9a3ae] ring-1 ring-[#f4e2e6] shadow-[0_10px_28px_rgba(166,66,87,0.08)]" : "border-[#f0dce1]")}>
                <span className="self-start rounded-full bg-[#fff0f2] px-2.5 py-1 text-[10px] font-extrabold text-[#a64257] sm:px-3 sm:py-1.5 sm:text-xs">{item.id === "single" ? item.discount : item.label || "باقة مرنة"}</span>
                <h2 className="mt-2.5 text-lg font-extrabold text-[#4a2d33] sm:mt-4 sm:text-xl">{item.name}</h2>
                <p className="mt-1.5 text-xs leading-5 text-[#806b70] sm:mt-2 sm:min-h-12 sm:text-sm sm:leading-6">{item.description}</p>
                <div className="mt-3 flex flex-wrap items-end gap-1.5 border-b border-[#f3e7e9] pb-3 sm:mt-6 sm:gap-2 sm:pb-5">
                  <strong className="font-display text-3xl text-[#a64257] sm:text-4xl">{money(item.price)}</strong>
                  {item.oldPrice ? <span className="mb-0.5 text-xs text-[#a99599] line-through sm:mb-1 sm:text-sm">{money(item.oldPrice)}</span> : null}
                  <span className="mb-0.5 text-[10px] text-[#806b70] sm:mb-1 sm:text-xs">ج.م · دفعة واحدة</span>
                </div>
                <div className="mt-3 flex-1 rounded-xl bg-[#fff8f8] p-3 sm:mt-5 sm:rounded-2xl sm:p-4">
                  <p className="text-sm font-bold text-[#4a2d33] sm:text-base">تنشئ {item.quantity} {item.quantity === 1 ? "دعوة" : "دعوات مختلفة"}</p>
                  <p className="mt-1 text-xs font-semibold text-[#a64257] sm:text-sm">حوالي {money(Math.round(item.price / item.quantity))} ج.م للدعوة</p>
                  <p className="mt-2 text-xs leading-5 text-[#806b70] sm:mt-3 sm:text-sm sm:leading-6">وتبعتها لعدد لا نهائي من الناس.</p>
                  <div className="mt-3 border-t border-[#f0dce1] pt-3 sm:mt-4 sm:pt-4">
                    <p className="text-sm font-bold text-[#4a2d33] sm:text-base">مميزات الباقة</p>
                    {item.features.map((feature) => <p key={feature} className="mt-1.5 flex gap-2 text-xs leading-5 text-[#665258] sm:mt-2 sm:text-sm sm:leading-6"><span className="text-[#b83b50]">✓</span><span>{feature}</span></p>)}
                    {item.id === "single" ? <div className="mt-2">{["أكتر من 10 خطوط عربي وإنجليزي", "تغيير أي صورة في الدعوة", "موسيقى من اختيارك", "إخفاء أي قسم مش عايزه"].map((feature) => <p key={feature} className="mt-2 flex gap-2 text-sm leading-6 text-[#665258]"><span className="text-[#b83b50]">✓</span><span>{feature}</span></p>)}</div> : null}
                  </div>
                  <div className="mt-3 border-t border-[#f0dce1] pt-3 sm:mt-4 sm:pt-4">
                    {(item.id === "single" ? ["معاك مدى الحياة", "تعديل 30 يوم من التفعيل"] : ["كل دعوة مستقلة بتفاصيلها", "روابط منفصلة لكل دعوة"]).map((benefit) => <p key={benefit} className="mt-1.5 text-xs font-semibold text-[#665258] sm:mt-2 sm:text-sm">• {benefit}</p>)}
                  </div>
                </div>
                <p className="mt-2 text-center text-[10px] leading-4 text-[#806b70] sm:mt-3 sm:text-xs sm:leading-5">تحويل يدوي — بنفعّلها بعد مراجعة الإيصال</p>
                <Link to={returnTo} onClick={() => selectPackage(item.id)} className={"mt-3 inline-flex min-h-10 items-center justify-center rounded-full px-4 py-2.5 text-xs font-bold transition sm:mt-4 sm:min-h-11 sm:py-3 sm:text-sm " + (featured ? "bg-[#a64257] text-white hover:bg-[#91384b]" : "border border-[#e8c8cf] bg-white text-[#a64257] hover:bg-[#fff0f2]")}>اختار الباقة</Link>
              </article>
            )
          })}
        </div>
      </section>
    </main>
  )
}
