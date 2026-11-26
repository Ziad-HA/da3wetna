import { useEffect } from "react"
import { Link } from "react-router-dom"
import { site } from "../config"

const services = [
  ["تصميم دعوة خاصة", "لو عندك شكل معين في بالك، نقدر نتكلم عن تنفيذ تصميم يناسب ذوقك وتفاصيل مناسبتك."],
  ["موقع أو صفحة لمشروعك", "صفحة تعريفية أو موقع يعرض خدماتك ومعلومات التواصل بشكل منظم."],
  ["متجر أو نظام حجز", "تطوير تجربة مناسبة لاحتياج مشروعك، بعد الاتفاق على التفاصيل والنطاق."],
]

export function Custom() {
  useEffect(() => { document.title = "طلبات التصميم المخصص — دعوتنا" }, [])
  const message = "السلام عليكم، عندي طلب تصميم أو تنفيذ مخصص وعايز أعرف التفاصيل."
  return (
    <main id="main" className="min-h-[70vh]">
      <section className="border-b border-[#f0dce1] bg-[radial-gradient(ellipse_at_top_right,rgba(242,211,220,0.5),transparent_45%),linear-gradient(135deg,#fff5f6_0%,#fffaf7_60%,#fff_100%)] px-4 py-14 text-center md:py-20">
        <p className="text-sm font-bold text-[#b83b50]">CUSTOM REQUESTS</p>
        <h1 className="mt-3 font-display text-4xl text-[#4a2d33] md:text-6xl">عندك فكرة مختلفة؟</h1>
        <p className="mx-auto mt-4 max-w-2xl leading-8 text-[#806b70]">احكيلنا فكرتك، ونتناقش في المطلوب وإمكانية تنفيذه والتكلفة قبل ما نبدأ.</p>
        <a href={`https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`} target="_blank" rel="noreferrer" className="btn-gold mt-7 inline-flex min-h-12 justify-center px-7">احكيلنا فكرتك على واتساب ←</a>
      </section>
      <section className="mx-auto max-w-5xl px-4 py-12 md:py-16">
        <div className="grid gap-4 md:grid-cols-3">
          {services.map(([title, description], index) => <article key={title} className="rounded-3xl border border-[#f0dce1] bg-white p-6 shadow-[0_8px_24px_rgba(115,65,77,.045)]"><span className="font-display text-2xl text-[#c58b97]">0{index + 1}</span><h2 className="mt-3 text-lg font-extrabold text-[#4a2d33]">{title}</h2><p className="mt-2 text-sm leading-7 text-[#806b70]">{description}</p></article>)}
        </div>
        <div className="mt-8 rounded-3xl bg-[#fff7f7] p-6 text-center"><p className="text-sm leading-7 text-[#806b70]">كل طلب بيتراجع بشكل منفصل، وبنحدد السعر والمدة بعد فهم المطلوب. إرسال الاستفسار مش معناه بدء تنفيذ أو التزام بالدفع.</p><Link to="/contact" className="mt-4 inline-flex text-sm font-bold text-[#a64257] underline underline-offset-4">لو عندك استفسار عام، تواصل معانا</Link></div>
      </section>
    </main>
  )
}
