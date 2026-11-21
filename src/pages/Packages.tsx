import { useEffect } from "react"
import { Link } from "react-router-dom"
import { packages } from "../config"
import { money } from "../lib/format"
import { selectPackage } from "../lib/storage"

export function Packages() {
  useEffect(() => { document.title = "الباقات والأسعار — دعوتنا" }, [])
  return (
    <main id="main" className="min-h-[70vh] bg-[#fffafb]">
      <section className="border-b border-[#f0dce1] bg-[#fff5f6] px-4 py-16 text-center md:py-20">
        <p className="text-sm font-bold text-[#b83b50]">باقات دعوتنا</p>
        <h1 className="mt-3 font-display text-4xl text-[#4a2d33] md:text-6xl">اختار الباقة المناسبة لفرحتك</h1>
        <p className="mx-auto mt-4 max-w-2xl leading-8 text-[#806b70]">ابدأ بدعوة واحدة أو اختار باقة متعددة لو عندك أكتر من مناسبة أو نسخة.</p>
      </section>
      <section className="mx-auto max-w-6xl px-4 py-12 md:py-16">
        <div className="grid items-stretch gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {packages.map((item) => {
            const featured = item.id === "plus"
            return (
              <article key={item.id} className={"flex flex-col rounded-[26px] border bg-white p-5 transition hover:-translate-y-1 hover:shadow-[0_14px_32px_rgba(166,66,87,0.09)] " + (featured ? "border-[#d9a3ae] shadow-[0_10px_28px_rgba(166,66,87,0.08)]" : "border-[#f0dce1]")}>
                <span className="self-start rounded-full bg-[#fff0f2] px-3 py-1.5 text-xs font-extrabold text-[#a64257]">{item.id === "single" ? item.discount : item.label || "باقة مرنة"}</span>
                <h2 className="mt-4 text-xl font-extrabold text-[#4a2d33]">{item.name}</h2>
                <p className="mt-2 min-h-12 text-sm leading-6 text-[#806b70]">{item.description}</p>
                <div className="mt-6 flex flex-wrap items-end gap-2 border-b border-[#f3e7e9] pb-5">
                  <strong className="font-display text-4xl text-[#a64257]">{money(item.price)}</strong>
                  {item.oldPrice ? <span className="mb-1 text-sm text-[#a99599] line-through">{money(item.oldPrice)}</span> : null}
                  <span className="mb-1 text-xs text-[#806b70]">ج.م · دفعة واحدة</span>
                </div>
                <div className="mt-5 flex-1 rounded-2xl bg-[#fff8f8] p-4">
                  <p className="font-bold text-[#4a2d33]">تنشئ {item.quantity} {item.quantity === 1 ? "دعوة" : "دعوات مختلفة"}</p>
                  <p className="mt-1 text-sm font-semibold text-[#a64257]">حوالي {money(Math.round(item.price / item.quantity))} ج.م للدعوة</p>
                  <p className="mt-3 text-sm leading-6 text-[#806b70]">وتبعتها لعدد لا نهائي من الناس.</p>
                  <div className="mt-4 border-t border-[#f0dce1] pt-4">
                    <p className="font-bold text-[#4a2d33]">مميزات الباقة</p>
                    {item.features.map((feature) => <p key={feature} className="mt-2 flex gap-2 text-sm leading-6 text-[#665258]"><span className="text-[#b83b50]">✓</span><span>{feature}</span></p>)}
                    {item.id === "single" ? <div className="mt-2">{["أكتر من 10 خطوط عربي وإنجليزي", "تغيير أي صورة في الدعوة", "موسيقى من اختيارك", "إخفاء أي قسم مش عايزه"].map((feature) => <p key={feature} className="mt-2 flex gap-2 text-sm leading-6 text-[#665258]"><span className="text-[#b83b50]">✓</span><span>{feature}</span></p>)}</div> : null}
                  </div>
                  <div className="mt-4 border-t border-[#f0dce1] pt-4">
                    {(item.id === "single" ? ["معاك مدى الحياة", "تعديل 30 يوم من التفعيل"] : ["كل دعوة مستقلة بتفاصيلها", "روابط منفصلة لكل دعوة"]).map((benefit) => <p key={benefit} className="mt-2 text-sm font-semibold text-[#665258]">• {benefit}</p>)}
                  </div>
                </div>
                <p className="mt-3 text-center text-xs leading-5 text-[#806b70]">تحويل يدوي — بنفعّلها بعد مراجعة الإيصال</p>
                <Link to="/templates" onClick={() => selectPackage(item.id)} className={"mt-4 inline-flex min-h-11 items-center justify-center rounded-full px-4 py-3 text-sm font-bold transition " + (featured ? "bg-[#a64257] text-white hover:bg-[#91384b]" : "border border-[#e8c8cf] bg-white text-[#a64257] hover:bg-[#fff0f2]")}>اختار الباقة</Link>
              </article>
            )
          })}
        </div>
      </section>
    </main>
  )
}
