import { useEffect } from "react"
import { Link } from "react-router-dom"

const steps = [
  ["01", "اختار تصميمك", "تصفح الدعوات واختار التصميم المناسب للفرح أو الخطوبة أو كتب الكتاب."],
  ["02", "اكتب تفاصيل المناسبة", "ضيف الأسماء والتاريخ والميعاد والمكان، وشوف التعديلات في المعاينة مباشرة."],
  ["03", "راجع دعوتك", "اتأكد إن كل التفاصيل مكتوبة صح وإن شكل الدعوة مناسب قبل ما تكمل."],
  ["04", "اختار الباقة وادفع", "حدد عدد الدعوات اللي محتاجها، وبعدها اتبع تعليمات الدفع في صفحة إتمام الطلب."],
  ["05", "استلم وشارك", "بعد تأكيد الطلب تقدر تستخدم الدعوة وتشاركها مع ضيوفك بالصورة أو بالرابط."],
]

export function How() {
  useEffect(() => { document.title = "طريقة الاستخدام — دعوتنا" }, [])
  return (
    <main id="main" className="min-h-[70vh]">
      <section className="border-b border-[#f0dce1] bg-[radial-gradient(ellipse_at_top_right,rgba(242,211,220,0.5),transparent_45%),linear-gradient(135deg,#fff5f6_0%,#fffaf7_60%,#fff_100%)] px-4 py-14 text-center md:py-20">
        <p className="text-sm font-bold text-[#b83b50]">خطوات بسيطة</p>
        <h1 className="mt-3 font-display text-4xl text-[#4a2d33] md:text-6xl">دعوتك جاهزة في كام خطوة</h1>
        <p className="mx-auto mt-4 max-w-2xl leading-8 text-[#806b70]">من اختيار التصميم لحد مشاركة الدعوة مع ضيوفك، كل حاجة واضحة وسهلة.</p>
      </section>
      <section className="mx-auto max-w-4xl px-4 py-12 md:py-16">
        <ol className="relative grid gap-4 before:absolute before:right-6 before:top-8 before:bottom-8 before:w-px before:bg-[#efd9df] sm:before:right-[3.45rem]">
          {steps.map(([number, title, description]) => <li key={number} className="flex gap-5 rounded-[26px] border border-[#f0dce1] bg-white p-5 md:gap-7 md:p-7"><div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[#fff0f2] font-display text-lg text-[#b83b50]">{number}</div><div><h2 className="text-lg font-extrabold text-[#4a2d33]">{title}</h2><p className="mt-2 leading-7 text-[#806b70]">{description}</p></div></li>)}
        </ol>
        <div className="mt-10 flex flex-wrap justify-center gap-3"><Link to="/templates" className="btn-gold">ابدأ واختار تصميمك</Link><Link to="/packages" className="btn-ghost">شوف الباقات</Link></div>
      </section>
    </main>
  )
}
