import { useEffect } from "react"
import { Link } from "react-router-dom"
import { site } from "../config"

const partnerTypes = [
  ["01", "المصورين", "ضيفوا خدمة الدعوة الرقمية لرحلة العميل من جلسة تصوير الخطوبة لحد يوم الفرح."],
  ["02", "قاعات ومواقع الاحتفال", "قدّموا طريقة سهلة لمشاركة تفاصيل المكان والميعاد في الخطوبة وكتب الكتاب والفرح."],
  ["03", "Wedding Planners", "خلّوا تجربة تنظيم المناسبة متكاملة، من التخطيط لحد إرسال الدعوات."],
  ["04", "منظمي المناسبات", "رشّحوا دعوات مخصصة للخطوبة وكتب الكتاب والفرح."],
]

const steps = [
  ["تواصل معانا", "ابعتلنا نوع شغلك وطريقة تعاونك المقترحة."],
  ["نتفق على التفاصيل", "نحدد طريقة الترشيح وآلية تتبع العملاء والمكافآت قبل بدء التعاون."],
  ["ابدأ الترشيح", "شارك نماذج دعوتنا مع العملاء المهتمين، وإحنا نساعدهم في اختيار الدعوة المناسبة."],
]

export function Partners() {
  useEffect(() => { document.title = "شراكات دعوتنا — للمصورين ومنظمي المناسبات" }, [])
  const message = "السلام عليكم، أنا مهتم أكون شريك مع دعوتنا. مجال شغلي: "
  return (
    <main id="main" className="min-h-screen">
      <section className="relative isolate overflow-hidden border-b border-[#f0dce1] bg-[radial-gradient(ellipse_at_12%_8%,#f8e5e9_0%,transparent_42%),radial-gradient(ellipse_at_88%_80%,#f5eadb_0%,transparent_38%),linear-gradient(135deg,#fffaf9_0%,#fff4f5_55%,#fffdfa_100%)] px-4 py-14 text-center sm:py-20">
        <span className="inline-flex rounded-full border border-[#ead2d6] bg-white/80 px-4 py-2 text-xs font-bold text-[#a64257]">DA3WETNA PARTNERS</span>
        <h1 className="mx-auto mt-5 max-w-4xl font-display text-3xl leading-[1.5] text-[#4a2d33] sm:text-5xl md:text-6xl">خلّي كل فرحة تبدأ<br/><span className="text-[#b64b60]">بدعوة تليق بيها</span></h1>
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-8 text-[#806b70] sm:text-base">بنفتح باب التعاون مع المصورين وقاعات الاحتفال ومنظمي المناسبات. رشّح دعوتنا لعملائك في الخطوبة وكتب الكتاب والفرح، وقدّم لهم تجربة دعوة رقمية سهلة ومميزة.</p>
        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          <a href={`https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`} target="_blank" rel="noreferrer" className="btn-gold min-h-12 justify-center px-7">ابدأ شراكة معانا ←</a>
          <Link to="/templates" className="btn-ghost min-h-12 justify-center px-7">شوف نماذج الدعوات</Link>
        </div>
        <p className="mt-4 text-[11px] text-[#9a8187]">التفاصيل والمكافآت بتتحدد بالاتفاق قبل بدء التعاون.</p>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
        <div className="text-center">
          <p className="text-xs font-bold text-[#b36a78]">مين يقدر ينضم؟</p>
          <h2 className="mt-2 font-display text-2xl text-[#4a2d33] sm:text-4xl">شراكة مناسبة لشغلك</h2>
        </div>
        <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {partnerTypes.map(([number,title,description]) => <article key={number} className="rounded-3xl border border-[#f0dce1] bg-white p-5 shadow-[0_8px_24px_rgba(115,65,77,.045)]">
            <span className="font-display text-2xl text-[#c58b97]">{number}</span>
            <h3 className="mt-3 text-base font-extrabold text-[#4a2d33]">{title}</h3>
            <p className="mt-2 text-xs leading-7 text-[#806b70]">{description}</p>
          </article>)}
        </div>
      </section>

      <section className="bg-[#fff7f7] px-4 py-12 sm:py-16">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <p className="text-xs font-bold text-[#b36a78]">ببساطة</p>
            <h2 className="mt-2 font-display text-2xl text-[#4a2d33] sm:text-4xl">نبدأ التعاون إزاي؟</h2>
          </div>
          <div className="mt-7 grid gap-3 md:grid-cols-3">
            {steps.map(([title,description],index) => <article key={title} className="rounded-3xl border border-[#f0dce1] bg-white p-5 text-center">
              <span className="mx-auto grid h-11 w-11 place-items-center rounded-full bg-[#fff0f2] font-display text-lg text-[#a64257]">{index+1}</span>
              <h3 className="mt-3 font-extrabold text-[#4a2d33]">{title}</h3>
              <p className="mt-2 text-xs leading-7 text-[#806b70]">{description}</p>
            </article>)}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-12 text-center sm:py-16">
        <p className="text-xs font-bold text-[#b36a78]">جاهز نتكلم؟</p>
        <h2 className="mt-2 font-display text-2xl text-[#4a2d33] sm:text-4xl">خلّينا نعمل تجربة أحلى لعملائك</h2>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-8 text-[#806b70]">ابعتلنا رسالة فيها مجال شغلك، المدينة، وفكرة بسيطة عن طريقة التعاون اللي تناسبك.</p>
        <a href={`https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`} target="_blank" rel="noreferrer" className="btn-gold mt-6 inline-flex min-h-12 justify-center px-8">تواصل واتساب ←</a>
      </section>
    </main>
  )
}
