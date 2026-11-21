import { useEffect } from "react"
import { Link } from "react-router-dom"
import { Invitation } from "../components/Invitation"
import { Chevron, IconLink, IconPen, IconStory, IconWallet } from "../components/Icons"
import { site } from "../config"
import { draftFor, faqs, templates } from "../data"
import { money } from "../lib/format"
import { readLast } from "../lib/storage"

const features = [
  { icon: IconPen, title: "تعديل بنفسك", text: "اكتب الأسماء والتاريخ والمكان بنفسك، وشوف شكل الدعوة بيتغير قدامك." },
  { icon: IconStory, title: "ستوري واتساب", text: "حمّل صورة جاهزة بمقاس الستوري، من غير قص أو تعديل." },
  { icon: IconLink, title: "لينك للضيوف", text: "شارك لينك واحد يفتح الدعوة عند كل ضيوفك." },
  { icon: IconWallet, title: "دفع سهل", text: "اختار وسيلة الدفع المناسبة ليك، واستلم دعوتك بعد التأكيد." },
]

export function Home() {
  const last = readLast()
  useEffect(() => {
    document.title = "دعوتنا — دعوات أفراح رقمية"
  }, [])

  return (
    <main id="main">
      <section className="relative overflow-hidden bg-[#fff5f6]">
        <div className="pointer-events-none absolute -right-28 -top-32 h-96 w-96 rounded-full bg-[#f3cbd4]/45 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-40 -left-20 h-96 w-96 rounded-full bg-[#f6e6d1]/60 blur-3xl" />
        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 py-14 md:grid-cols-[1.08fr_0.92fr] md:py-20">
          <div className="text-center md:text-right">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#e9cbd1] bg-white/75 px-4 py-2 text-sm font-semibold text-[#9e4659]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#b83b50]" />
              كل فرحة وليها دعوة حلوة
            </span>
            <h1 className="mt-6 font-display text-5xl leading-[1.3] text-[#4a2d33] text-balance md:text-7xl">
              خلي دعوتك
              <span className="block text-[#b83b50]">تحكي فرحتك</span>
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-base leading-8 text-[#806b70] md:mx-0 md:text-lg">
              اختار تصميم بتحبه، ضيف تفاصيل يومك، وشارك دعوتك مع كل الناس اللي بتحبهم — بصورة أنيقة أو لينك واحد.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3 md:justify-start">
              <Link to="/templates" className="btn-gold shadow-[0_8px_22px_rgba(184,59,80,0.18)]">اختار دعوتك</Link>
              <a href="#how" className="btn-ghost border-[#e5cbd0] bg-white/70 text-[#65434b]">اعرف الطريقة</a>
            </div>
            {last ? (
              <Link to={`/done/${last.code}`} className="mt-5 inline-block text-sm font-semibold text-[#a34256] underline-offset-4 hover:underline">
                رجّع آخر دعوة اشتغلت عليها
              </Link>
            ) : null}
            <div className="mt-9 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-[#806b70] md:justify-start">
              <span>✓ تعديل فوري</span>
              <span>✓ صورة ستوري</span>
              <span>✓ لينك للضيوف</span>
            </div>
          </div>
          <div className="relative flex justify-center">
            <div className="absolute inset-x-8 top-10 bottom-0 rounded-[48%] bg-[#edc8d0]/50 blur-2xl" />
            <div className="float relative rotate-[2deg]">
              <div className="rounded-[42px] border-[7px] border-white bg-white p-2 shadow-[0_24px_70px_rgba(91,48,60,0.18)]">
                <div className="phone-screen overflow-hidden rounded-[30px]">
                  <div className="invite-frame">
                    <Invitation draft={draftFor(templates[1])} />
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-5 -left-10 rounded-2xl border border-[#f0dce1] bg-white px-4 py-3 shadow-lg">
                <p className="text-xs text-[#9b7a81]">دعوة معمولة بحب</p>
                <p className="mt-0.5 font-display text-xl text-[#9e4055]">يوم العمر ♡</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-[#f0dce1] bg-white">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-5 px-4 py-6 text-center md:grid-cols-4">
          {[
            ["١٠", "تصاميم متنوعة"],
            ["فوري", "تعديل بنفسك"],
            ["٢", "طرق للمشاركة"],
            [money(site.price), "سعر واضح للدعوة"],
          ].map(([value, label]) => (
            <div key={label}>
              <p className="font-display text-2xl text-[#a64257] md:text-3xl">{value}</p>
              <p className="mt-1 text-sm text-[#806b70]">{label}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="how" className="mx-auto max-w-6xl px-4 py-16 md:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-bold text-[#b83b50]">ببساطة ومن غير تعقيد</p>
          <h2 className="mt-3 font-display text-4xl text-[#4a2d33] md:text-5xl">دعوتك في ٣ خطوات</h2>
          <p className="mt-3 leading-8 text-[#806b70]">كل حاجة بتعملها بنفسك، من أول اختيار التصميم لحد مشاركة الدعوة.</p>
        </div>
        <ol className="mt-10 grid gap-4 md:grid-cols-3">
          {[
            ["١", "اختار التصميم", "شوف التصاميم واختار الأقرب لذوقك."],
            ["٢", "ضيف التفاصيل", "اكتب الأسماء والميعاد والمكان وشوف المعاينة."],
            ["٣", "استلم وشارك", "بعد الدفع حمّل الصورة أو انسخ لينك الدعوة."],
          ].map(([step, title, text]) => (
            <li key={step} className="rounded-[26px] border border-[#f0dce1] bg-white p-6 shadow-[0_8px_30px_rgba(91,48,60,0.035)]">
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#fff0f2] font-display text-xl text-[#b83b50]">{step}</span>
              <h3 className="mt-5 text-lg font-bold text-[#4a2d33]">{title}</h3>
              <p className="mt-2 leading-7 text-[#806b70]">{text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="bg-[#fff5f6] py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-bold text-[#b83b50]">كل اللي تحتاجه</p>
            <h2 className="mt-3 font-display text-4xl text-[#4a2d33] md:text-5xl">تفاصيل صغيرة تفرق</h2>
            <p className="mt-3 leading-8 text-[#806b70]">تجربة بسيطة تخليك تركز في فرحتك، مش في تجهيز الدعوة.</p>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <article key={feature.title} className="rounded-[26px] border border-[#f0dce1] bg-white p-6">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#fff0f2] text-[#b83b50]">
                  <feature.icon className="h-6 w-6" />
                </span>
                <h3 className="mt-5 font-bold text-[#4a2d33]">{feature.title}</h3>
                <p className="mt-2 text-sm leading-7 text-[#806b70]">{feature.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 md:py-20">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-bold text-[#b83b50]">اختياراتنا ليك</p>
            <h2 className="mt-2 font-display text-4xl text-[#4a2d33]">شوف بعض التصاميم</h2>
          </div>
          <Link to="/templates" className="hidden font-bold text-[#a64257] sm:inline">كل الدعوات ←</Link>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-5">
          {templates.slice(0, 4).map((template) => (
            <Link key={template.id} to={`/editor/${template.id}`} className="group block">
              <div className="overflow-hidden rounded-[26px] border border-[#f0dce1] bg-white p-2 shadow-sm transition duration-300 group-hover:-translate-y-1 group-hover:shadow-lg">
                <div className="overflow-hidden rounded-[19px]">
                  <Invitation draft={draftFor(template)} />
                </div>
              </div>
              <h3 className="mt-3 font-bold text-[#4a2d33]">{template.name}</h3>
              <p className="mt-1 text-sm text-[#806b70]">{template.blurb}</p>
            </Link>
          ))}
        </div>
        <Link to="/templates" className="btn-dark mt-8">شوف كل التصاميم</Link>
      </section>

      <section id="price" className="px-4 pb-16 md:pb-20">
        <div className="mx-auto max-w-4xl overflow-hidden rounded-[34px] border border-[#f0dce1] bg-white shadow-[0_16px_50px_rgba(91,48,60,0.07)]">
          <div className="grid md:grid-cols-[1fr_auto] md:items-center">
            <div className="p-7 text-center md:p-10 md:text-right">
              <p className="text-sm font-bold text-[#b83b50]">من غير مصاريف مخفية</p>
              <h2 className="mt-2 font-display text-4xl text-[#4a2d33]">سعر بسيط وواضح</h2>
              <p className="mt-3 leading-7 text-[#806b70]">كل اللي تحتاجه عشان تبعت دعوتك بشكل يليق بيومك.</p>
              <ul className="mt-5 grid gap-2 text-sm text-[#806b70]">
                <li>✓ تعديل التفاصيل قبل الدفع</li>
                <li>✓ صورة جاهزة لستوري واتساب</li>
                <li>✓ لينك خاص لمشاركة الدعوة</li>
              </ul>
            </div>
            <div className="border-t border-[#f0dce1] bg-[#fff5f6] p-7 text-center md:min-w-64 md:border-r md:border-t-0 md:p-10">
              <p className="text-sm text-[#806b70]">الدعوة الواحدة</p>
              <p className="mt-2 font-display text-5xl text-[#a64257]">{money(site.price)}</p>
              <Link to="/templates" className="btn-gold mt-5 w-full">ابدأ دلوقتي</Link>
            </div>
          </div>
        </div>
      </section>

      <section id="faq" className="mx-auto max-w-3xl px-4 pb-20">
        <div className="text-center">
          <p className="text-sm font-bold text-[#b83b50]">محتاج تعرف حاجة؟</p>
          <h2 className="mt-2 font-display text-4xl text-[#4a2d33]">أسئلة شائعة</h2>
        </div>
        <div className="mt-8 grid gap-3">
          {faqs.map((item) => (
            <details key={item.q} className="group rounded-2xl border border-[#f0dce1] bg-white">
              <summary className="flex min-h-14 cursor-pointer items-center justify-between gap-4 px-5 py-4 font-bold text-[#4a2d33]">
                {item.q}
                <Chevron className="h-5 w-5 shrink-0 text-[#b83b50] transition-transform group-open:rotate-180" />
              </summary>
              <p className="px-5 pb-5 leading-8 text-[#806b70]">{item.a}</p>
            </details>
          ))}
        </div>
      </section>
    </main>
  )
}
