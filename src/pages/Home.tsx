import { useEffect } from "react"
import { Link } from "react-router-dom"
import { Invitation } from "../components/Invitation"
import { Chevron, IconLink, IconPen, IconStory, IconWallet } from "../components/Icons"
import { site } from "../config"
import { draftFor, faqs, templates } from "../data"
import { money } from "../lib/format"
import { readLast } from "../lib/storage"

const features = [
  { icon: IconPen, title: "تعديل بنفسك", text: "اضغط على أي كلمة واكتب الاسم والتاريخ والمكان. مفيش حد لازم يوافق." },
  { icon: IconStory, title: "ستوري واتساب", text: "بعد الدفع تنزّل صورة طويلة جاهزة تنشرها ستوري من غير ما تقصها." },
  { icon: IconLink, title: "لينك للضيوف", text: "لينك واحد يفتح الدعوة عند أي حد، باسم العروسين وتفاصيل الفرح." },
  { icon: IconWallet, title: "دفع سهل", text: "فودافون كاش، إنستاباي، أو بطاقة. الدعوة بتتفتح بعد التأكيد." },
]

export function Home() {
  const last = readLast()
  useEffect(() => {
    document.title = "دعوتنا — دعوات أفراح رقمية"
  }, [])

  return (
    <main id="main">
      <section className="relative overflow-hidden bg-forest text-cream">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_80%_0%,rgba(246,221,229,0.22),transparent_46%),radial-gradient(ellipse_at_10%_90%,rgba(233,185,200,0.28),transparent_42%)]" />
        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 md:grid-cols-[1.15fr_0.85fr] md:py-24">
          <div>
            <p className="inline-flex rounded-full border border-gold-2/40 px-3 py-1 text-sm text-gold-2">كل فرحة وليها دعوة حلوة</p>
            <h1 className="mt-5 font-display text-5xl leading-[1.25] text-balance md:text-7xl">
              دعوة فرحك
              <span className="block">في لينك واحد</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-[#FFF0F2]">
              عشر دعوات جاهزة. تكتب الأسماء والتاريخ والمكان بنفسك، وتدفع، وتستلم ستوري واتساب أو لينك تبعتُه للضيوف.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/templates" className="btn-gold">اختار الدعوة</Link>
              <a href="#how" className="btn-ghost border-white/30 text-cream">إزاي بتتم</a>
            </div>
            {last ? (
              <Link to={`/done/${last.code}`} className="mt-6 inline-block text-sm text-gold-2 underline-offset-4 hover:underline">
                رجّع آخر دعوة
              </Link>
            ) : null}
          </div>
          <div className="flex justify-center">
            <div className="float">
              <div className="phone">
                <div className="notch" />
                <div className="phone-screen">
                  <div className="invite-frame h-full">
                    <Invitation draft={draftFor(templates[3])} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-line bg-card">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-4 px-4 py-6 text-center text-sm font-semibold md:grid-cols-4">
          <p>١٠ تصاميم جاهزة</p>
          <p>تعديل من غير انتظار</p>
          <p>ستوري + لينك</p>
          <p>{money(site.price)} للدعوة</p>
        </div>
      </section>

      <section id="how" className="mx-auto max-w-6xl px-4 py-16">
        <p className="text-sm font-bold text-gold">ثلاث خطوات</p>
        <h2 className="mt-2 font-display text-4xl md:text-5xl">من الاختيار للواتساب</h2>
        <ol className="mt-8 grid gap-4 md:grid-cols-3">
          {[
            ["١", "اختار التصميم", "من عشر دعوات، كل واحدة بشكل مختلف."],
            ["٢", "اكتب التفاصيل", "الأسماء، التاريخ، المكان، وجملة الدعوة."],
            ["٣", "ادفع واستلم", "ستوري تنزّله، ولينك تبعتُه لأي ضيف."],
          ].map(([step, title, text]) => (
            <li key={step} className="rounded-3xl border border-line bg-card p-6">
              <span className="grid h-11 w-11 place-items-center rounded-full bg-forest font-display text-xl text-gold-2">{step}</span>
              <h3 className="mt-4 text-xl font-bold">{title}</h3>
              <p className="mt-2 leading-7 text-mute">{text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="bg-forest py-16 text-cream">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="font-display text-4xl md:text-5xl">دعوتك، بتفاصيلك أنت</h2>
          <p className="mt-3 max-w-2xl leading-8 text-[#FFF0F2]">مفيش تعديل بطلب، ومفيش انتظار. اللي هتكتبه هو اللي هيظهر للضيوف.</p>
          <div className="mt-8 grid gap-4 md:grid-cols-4">
            {features.map((feature) => (
              <article key={feature.title} className="rounded-3xl border border-white/10 bg-white/5 p-5">
                <feature.icon className="h-7 w-7 text-gold-2" />
                <h3 className="mt-4 text-lg font-bold">{feature.title}</h3>
                <p className="mt-2 text-sm leading-7 text-[#F8E7EA]">{feature.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-bold text-gold">التصاميم</p>
            <h2 className="mt-2 font-display text-4xl">اختار شكل الدعوة</h2>
          </div>
          <Link to="/templates" className="hidden font-bold text-gold sm:inline">كل الدعوات</Link>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
          {templates.slice(0, 4).map((template) => (
            <Link key={template.id} to={`/editor/${template.id}`} className="group block">
              <div className="overflow-hidden rounded-[28px] border border-line bg-card shadow-sm transition duration-200 group-hover:-translate-y-1 group-hover:shadow-lg">
                <Invitation draft={draftFor(template)} />
              </div>
              <h3 className="mt-3 font-bold">{template.name}</h3>
              <p className="text-sm text-mute">{template.blurb}</p>
            </Link>
          ))}
        </div>
        <Link to="/templates" className="btn-dark mt-8 inline-flex">شوف الـ ١٠ دعوات</Link>
      </section>

      <section id="price" className="px-4 pb-16">
        <div className="mx-auto max-w-3xl rounded-[32px] bg-card px-6 py-10 text-center shadow-sm ring-1 ring-line md:px-12">
          <p className="text-sm font-bold text-gold">سعر واحد وواضح</p>
          <p className="mt-3 font-display text-6xl">{money(site.price)}</p>
          <p className="mt-2 text-lg">للدعوة الواحدة</p>
          <ul className="mx-auto mt-6 grid max-w-md gap-2 text-mute">
            <li>تعديل كل النصوص قبل الدفع</li>
            <li>تحميل صورة ستوري واتساب</li>
            <li>لينك يفتح الدعوة عند الضيف</li>
          </ul>
          <Link to="/templates" className="btn-gold mt-8">ابدأ الدعوة</Link>
        </div>
      </section>

      <section id="faq" className="mx-auto max-w-3xl px-4 pb-20">
        <h2 className="text-center font-display text-4xl">أسئلة قبل ما تشتري</h2>
        <div className="mt-8 grid gap-3">
          {faqs.map((item) => (
            <details key={item.q} className="group rounded-2xl border border-line bg-card">
              <summary className="flex min-h-14 cursor-pointer items-center justify-between gap-4 px-5 py-4 font-bold">
                {item.q}
                <Chevron className="h-5 w-5 shrink-0 transition-transform group-open:rotate-180" />
              </summary>
              <p className="px-5 pb-5 leading-8 text-mute">{item.a}</p>
            </details>
          ))}
        </div>
      </section>
    </main>
  )
}
