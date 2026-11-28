import { useEffect } from "react"
import { Link } from "react-router-dom"
import { Chevron } from "../components/Icons"
import { faqs } from "../data"

export function FAQ() {
  useEffect(() => { document.title = "الأسئلة الشائعة — دعوتي" }, [])
  return (
    <main id="main" className="min-h-[70vh] bg-[#fffafb]">
      <section className="border-b border-[#f0dce1] bg-[radial-gradient(ellipse_at_top_right,rgba(242,211,220,0.5),transparent_45%),linear-gradient(135deg,#fff5f6_0%,#fffaf7_60%,#fff_100%)] px-4 py-14 text-center md:py-20">
        <p className="text-sm font-bold text-[#b83b50]">إجابات تهمك</p>
        <h1 className="mt-3 font-display text-4xl text-[#4a2d33] md:text-6xl">الأسئلة الشائعة</h1>
        <p className="mx-auto mt-4 max-w-2xl leading-8 text-[#806b70]">إجابات أهم الأسئلة عن تصميم الدعوة والتعديل والدفع والمشاركة.</p>
      </section>
      <section className="mx-auto max-w-3xl px-4 py-12 md:py-16">
        <div className="grid gap-3">
          {faqs.map((item, index) => <details key={item.q} className="group rounded-2xl border border-[#f0dce1] bg-white shadow-[0_5px_18px_rgba(74,45,51,0.025)] transition duration-200 hover:border-[#e5c1ca] open:border-[#e5c1ca] open:shadow-[0_10px_28px_rgba(166,66,87,0.06)]"><summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 font-bold text-[#4a2d33]"><span className="flex items-center gap-3"><span className="font-display text-sm text-[#bd8792]">{String(index + 1).padStart(2, "0")}</span>{item.q}</span><Chevron className="h-5 w-5 shrink-0 text-[#b83b50] transition-transform group-open:rotate-180" /></summary><p className="border-t border-[#f7eaed] px-5 py-4 leading-8 text-[#806b70]">{item.a}</p></details>)}
        </div>
        <div className="mt-10 rounded-[26px] bg-[#fff0f2] p-6 text-center"><h2 className="text-lg font-bold text-[#4a2d33]">لسه عندك سؤال؟</h2><p className="mt-2 text-sm leading-7 text-[#806b70]">تقدر تتواصل معانا وهنساعدك تعرف تبدأ إزاي.</p><Link to="/packages" className="mt-4 inline-flex rounded-full bg-[#a64257] px-6 py-3 text-sm font-bold text-white">راجع الباقات</Link></div>
      </section>
    </main>
  )
}
