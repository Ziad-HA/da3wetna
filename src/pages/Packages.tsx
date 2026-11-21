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
      <section className="border-b border-[#f0dce1] bg-[radial-gradient(ellipse_at_top,white_0%,#fff5f6_70%)] px-4 py-8 text-center sm:py-14 md:py-20">
        <p className="inline-flex rounded-full border border-[#f0dce1] bg-white px-3 py-1 text-[11px] font-bold text-[#b83b50] sm:text-sm">باقات دعوتنا</p>
        <h1 className="mt-2.5 font-display text-[27px] leading-tight text-[#4a2d33] sm:mt-3 sm:text-4xl md:text-6xl">اختار الباقة المناسبة لفرحتك</h1>
        <p className="mx-auto mt-2 max-w-xl text-xs leading-6 text-[#806b70] sm:mt-4 sm:text-base sm:leading-8">كل اللي تحتاجه عشان تبعت دعوتك بشكل مميز وسهل.</p>
      </section>
      <section className="mx-auto max-w-6xl px-3 py-5 sm:px-4 sm:py-12 md:py-16">\n        <div className="mx-auto mb-4 max-w-3xl rounded-2xl border border-[#f0dce1] bg-white/90 px-4 py-3 text-center shadow-[0_6px_20px_rgba(91,48,60,.04)] sm:mb-7 sm:rounded-3xl sm:px-6 sm:py-4">\n          <p className="text-xs font-extrabold text-[#a64257] sm:text-sm">اختيارك بسيط وواضح</p>\n          <p className="mt-1 text-[11px] leading-6 text-[#806b70] sm:text-sm">كل الأسعار دفعة واحدة، ومفيش اشتراك شهري. اختار عدد الدعوات اللي محتاجها، وبعدها كمل تصميمك.</p>\n        </div>
        <div className="mx-auto grid max-w-md items-stretch gap-2.5 sm:max-w-none sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
          {packages.map((item) => {
            const featured = item.id === "plus"
            const extras = item.id === "single" ? ["أكتر من 10 خطوط عربي وإنجليزي", "تغيير أي صورة في الدعوة", "موسيقى من اختيارك", "إخفاء أي قسم مش عايزه"] : []
            const benefits = item.id === "single" ? ["معاك مدى الحياة", "تعديل 30 يوم من التفعيل"] : ["كل دعوة مستقلة بتفاصيلها", "روابط منفصلة لكل دعوة"]
            return (
              <article key={item.id} className={"relative flex flex-col overflow-hidden rounded-2xl border bg-white p-3 shadow-[0_5px_18px_rgba(91,48,60,0.045)] sm:rounded-[26px] sm:p-5 " + (featured ? "border-[#d9a3ae] ring-1 ring-[#f4e2e6] sm:shadow-[0_10px_28px_rgba(166,66,87,0.08)]" : "border-[#f0dce1]")}>
                <div className="flex items-center justify-between gap-2">
                  <span className="rounded-full bg-[#fff0f2] px-2.5 py-1 text-[9px] font-extrabold text-[#a64257] sm:px-3 sm:py-1.5 sm:text-xs">{item.id === "single" ? item.discount : item.label || "باقة مرنة"}</span>
                  {featured ? <span className="rounded-full bg-[#a64257] px-2.5 py-1 text-[9px] font-bold text-white">الأكثر تميزًا</span> : null}
                </div>
                <div className="mt-2 flex items-center justify-between gap-3 sm:mt-4 sm:block">
                  <div className="min-w-0">
                    <h2 className="text-base font-extrabold text-[#4a2d33] sm:text-xl">{item.name}</h2>
                    <p className="mt-0.5 text-[10px] leading-4 text-[#806b70] sm:mt-2 sm:text-sm sm:leading-6">{item.description}</p>
                  </div>
                  <div className="shrink-0 text-left sm:mt-5 sm:border-b sm:border-[#f3e7e9] sm:pb-5">
                    <div className="flex items-baseline justify-end gap-1.5 sm:justify-start">
                      <strong className="font-display text-[27px] leading-none text-[#a64257] sm:text-4xl">{money(item.price)}</strong>
                      <span className="text-[9px] text-[#806b70] sm:text-xs">ج.م</span>
                    </div>
                    {item.oldPrice ? <p className="mt-1 text-[10px] text-[#a99599] line-through sm:text-sm">{money(item.oldPrice)}</p> : null}
                    <p className="mt-1 text-[9px] text-[#806b70] sm:text-xs">دفعة واحدة</p>
                  </div>
                </div>
                <div className="mt-2.5 flex items-center justify-between rounded-xl bg-[#fff7f8] px-3 py-2 sm:mt-4 sm:rounded-2xl sm:p-4">
                  <div>
                    <p className="text-xs font-extrabold text-[#4a2d33] sm:text-base">{item.quantity} {item.quantity === 1 ? "دعوة" : "دعوات مختلفة"}</p>
                    <p className="mt-0.5 text-[9px] text-[#806b70] sm:mt-1 sm:text-xs">تبعتها لعدد لا نهائي من الناس</p>
                  </div>
                  <p className="text-left text-[10px] font-bold text-[#a64257] sm:text-sm">{money(Math.round(item.price / item.quantity))} ج.م <span className="block text-[9px] font-normal text-[#806b70]">للدعوة</span></p>
                </div>
                <details className="group mt-2.5 rounded-xl border border-[#f3e4e8] px-3 py-2 sm:hidden">
                  <summary className="flex cursor-pointer list-none items-center justify-between text-xs font-bold text-[#a64257] [&::-webkit-details-marker]:hidden">
                    <span>تفاصيل ومميزات الباقة</span><span className="text-base transition-transform group-open:rotate-180">⌄</span>
                  </summary>
                  <div className="mt-2 border-t border-[#f3e4e8] pt-2">
                    <p className="text-[11px] font-bold text-[#4a2d33]">مميزات الباقة</p>
                    {item.features.map((feature) => <p key={feature} className="mt-1 flex gap-2 text-[10px] leading-5 text-[#665258]"><span className="text-[#b83b50]">✓</span><span>{feature}</span></p>)}
                    {extras.map((feature) => <p key={feature} className="mt-1 flex gap-2 text-[10px] leading-5 text-[#665258]"><span className="text-[#b83b50]">✓</span><span>{feature}</span></p>)}
                    {benefits.map((benefit) => <p key={benefit} className="mt-1 text-[10px] leading-5 text-[#665258]">• {benefit}</p>)}
                  </div>
                </details>
                <div className="mt-4 hidden flex-1 rounded-2xl border border-[#faedf0] bg-[#fff9fa] p-4 sm:block">
                  <p className="text-sm font-bold text-[#4a2d33]">مميزات الباقة</p>
                  {item.features.map((feature) => <p key={feature} className="mt-2 flex gap-2 text-sm leading-6 text-[#665258]"><span className="text-[#b83b50]">✓</span><span>{feature}</span></p>)}
                  {extras.map((feature) => <p key={feature} className="mt-2 flex gap-2 text-sm leading-6 text-[#665258]"><span className="text-[#b83b50]">✓</span><span>{feature}</span></p>)}
                  <div className="mt-4 border-t border-[#f0dce1] pt-3">{benefits.map((benefit) => <p key={benefit} className="mt-2 text-sm font-semibold text-[#665258]">• {benefit}</p>)}</div>
                </div>
                <p className="mt-2 text-center text-[9px] leading-4 text-[#806b70] sm:mt-3 sm:text-xs sm:leading-5">التفعيل بعد مراجعة إيصال التحويل يدويًا</p>
                <Link to={returnTo} onClick={() => selectPackage(item.id)} className={"mt-2 inline-flex min-h-10 items-center justify-center rounded-full px-4 py-2 text-xs font-bold transition active:scale-[0.98] sm:mt-4 sm:min-h-11 sm:py-3 sm:text-sm " + (featured ? "bg-[#a64257] text-white hover:bg-[#91384b]" : "border border-[#e8c8cf] bg-white text-[#a64257] hover:bg-[#fff0f2]")}>اختار الباقة</Link>
              </article>
            )
          })}
        </div>
      </section>
    </main>
  )
}
