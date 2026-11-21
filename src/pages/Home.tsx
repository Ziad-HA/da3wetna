import { useEffect } from "react"
import { Link } from "react-router-dom"
import { Invitation } from "../components/Invitation"
import { IconLink, IconPen, IconStory, IconWallet } from "../components/Icons"
import { packages } from "../config"
import { draftFor, faqs, templates } from "../data"
import { money } from "../lib/format"
import { clearDraft, readLast } from "../lib/storage"

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
      <section className="relative isolate overflow-hidden bg-[#fff9f7]">
        <style>{`
          @keyframes invitation-float { 0%,100% { transform: translateY(0) rotate(1deg); } 50% { transform: translateY(-9px) rotate(-.5deg); } }
          @keyframes flower-sway { 0%,100% { transform: rotate(-3deg); } 50% { transform: rotate(3deg); } }
          @keyframes glint { 0%,100% { opacity:.35; } 50% { opacity:.9; } }
          .invitation-float { animation: invitation-float 6s ease-in-out infinite; }
          .flower-sway { transform-origin: top center; animation: flower-sway 5s ease-in-out infinite; }
          .hero-glint { animation: glint 3s ease-in-out infinite; }
          @media (prefers-reduced-motion: reduce) { .invitation-float,.flower-sway,.hero-glint { animation:none !important; } }
        `}</style>
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="absolute -right-32 -top-36 h-[32rem] w-[32rem] rounded-full bg-[#f7dce1]/55 blur-3xl" />
          <div className="absolute -bottom-48 -left-28 h-[30rem] w-[30rem] rounded-full bg-[#f4e6d9]/70 blur-3xl" />
          <div className="absolute inset-0 opacity-[.22] [background-image:radial-gradient(#c9958e_0.7px,transparent_0.7px)] [background-size:22px_22px] [mask-image:linear-gradient(to_bottom,black,transparent_78%)]" />
        </div>
        <div className="relative mx-auto grid max-w-6xl items-center gap-8 px-4 pb-12 pt-10 sm:gap-10 sm:pb-16 sm:pt-14 md:grid-cols-[1fr_0.95fr] md:gap-12 md:py-24">
          <div className="relative z-10 text-center md:text-right">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#e8c9c8] bg-white/80 px-4 py-2 text-xs font-bold tracking-wide text-[#9d5962] shadow-sm sm:text-sm">
              <span className="text-[#bd965e]">✦</span>
              دعوات إلكترونية بتفاصيل مميزة
              <span className="text-[#bd965e]">✦</span>
            </span>
            <h1 className="mt-6 font-display text-[2.8rem] leading-[1.22] text-[#493238] text-balance sm:text-5xl md:mt-7 md:text-[4.45rem]">
              فرحتكم تستاهل
              <span className="mt-1 block text-[#b64b60]">دعوة تفضل في البال</span>
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-sm leading-8 text-[#806d70] sm:text-base md:mx-0 md:mt-6 md:text-lg">
              صمّموا دعوة فرحكم بسهولة. اختاروا الشكل، اكتبوا تفاصيل يومكم، وشاركوا دعوتكم مع الأهل والأصحاب في لينك واحد.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3 md:justify-start">
              <Link to="/templates" className="btn-gold min-w-40 justify-center shadow-[0_10px_26px_rgba(182,75,96,0.18)] transition duration-300 hover:-translate-y-1">اختاروا التصميم <span className="mr-1">←</span></Link>
              <Link to="/how" className="btn-ghost min-w-36 justify-center border-[#e5cbd0] bg-white/80 text-[#65434b] transition duration-300 hover:-translate-y-1">اعرفوا الطريقة</Link>
            </div>
            {last ? (
              <Link to={`/done/${last.code}`} className="mt-5 inline-block text-sm font-semibold text-[#a34256] underline-offset-4 hover:underline">
                ارجع لآخر دعوة اشتغلت عليها
              </Link>
            ) : null}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs font-medium text-[#806b70] sm:text-sm md:justify-start">
              <span className="inline-flex items-center gap-2"><span className="grid h-5 w-5 place-items-center rounded-full bg-[#f5e4e7] text-[#ae5365]">✓</span> تعديل مباشر</span>
              <span className="inline-flex items-center gap-2"><span className="grid h-5 w-5 place-items-center rounded-full bg-[#f5e4e7] text-[#ae5365]">✓</span> صورة للستوري</span>
              <span className="inline-flex items-center gap-2"><span className="grid h-5 w-5 place-items-center rounded-full bg-[#f5e4e7] text-[#ae5365]">✓</span> لينك خاص بدعوتكم</span>
            </div>
          </div>

          <div className="relative mx-auto flex min-h-[370px] w-full max-w-[470px] items-center justify-center sm:min-h-[455px] md:min-h-[550px]">
            <div aria-hidden="true" className="absolute h-[285px] w-[285px] rounded-full bg-[radial-gradient(circle,#f2d5db_0%,rgba(242,213,219,0.45)_52%,transparent_72%)] sm:h-[370px] sm:w-[370px] md:h-[455px] md:w-[455px]" />
            <div aria-hidden="true" className="absolute h-[300px] w-[300px] rounded-full border border-[#d8b9a5]/60 sm:h-[390px] sm:w-[390px] md:h-[475px] md:w-[475px]" />
            <div aria-hidden="true" className="absolute bottom-[4%] left-1/2 h-[88%] w-[76%] -translate-x-1/2 rounded-t-[48%] border border-b-0 border-[#c9a36d]/60 bg-[linear-gradient(180deg,rgba(255,255,255,0.58),rgba(255,245,242,0.12))] shadow-[inset_0_0_45px_rgba(255,255,255,0.6)]" />
            <div aria-hidden="true" className="absolute left-1/2 top-[2%] z-[2] -translate-x-1/2 text-center">
              <span className="inline-flex items-center gap-2 rounded-full border border-[#d9bd91]/70 bg-[#fffaf2]/95 px-3 py-1.5 text-[9px] font-semibold tracking-[0.2em] text-[#a77c43] shadow-sm sm:text-[10px]">
                <span>✧</span> MADE FOR YOUR DAY <span>✧</span>
              </span>
            </div>
            <svg aria-hidden="true" viewBox="0 0 420 112" className="flower-sway pointer-events-none absolute -top-1 left-1/2 z-[3] w-[88%] -translate-x-1/2 overflow-visible sm:w-[94%]" fill="none">
              <path d="M10 8C92 91 328 91 410 8" stroke="#b99a75" strokeOpacity=".75" strokeWidth="1.4"/>
              {[38,76,116,158,202,244,286,326,366,398].map((x,i) => (
                <g key={x} transform={`translate(${x} ${26 + Math.sin(i * .55) * 22})`}>
                  <path d="M0 0c-6 7-7 12-3 17m3-17c6 7 7 12 3 17" stroke="#82977d" strokeWidth="1.3" strokeLinecap="round"/>
                  <circle cy="-2" r="3.5" fill="#d98f9e"/>
                  <circle cx="-4" cy="-5" r="3" fill="#f1cbd2"/>
                  <circle cx="4" cy="-5" r="3" fill="#f1cbd2"/>
                  <circle cy="-8" r="3" fill="#f1cbd2"/>
                  <circle r="1.3" fill="#bd965e"/>
                </g>
              ))}
            </svg>
            <span aria-hidden="true" className="hero-glint absolute left-[8%] top-[29%] z-[2] text-2xl text-[#c29a62]">✧</span>
            <span aria-hidden="true" className="hero-glint absolute right-[8%] bottom-[22%] z-[2] text-3xl text-[#c29a62]" style={{animationDelay:"-1.4s"}}>✦</span>
            <div className="invitation-float relative z-10 rotate-[1deg]">
              <div className="phone !w-[min(238px,64vw)] !rounded-[35px] !border-[6px] !border-white !bg-white !p-1.5 !shadow-[0_28px_75px_rgba(91,48,60,0.22)] sm:!w-[min(270px,68vw)] md:!w-[min(292px,70vw)] md:!rounded-[42px] md:!border-[7px] md:!p-2">
                <div className="phone-screen h-full w-full overflow-hidden rounded-[26px] md:!rounded-[30px]">
                  <div className="invite-frame">
                    <Invitation draft={draftFor(templates[1])} />
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute left-0 top-[17%] z-20 rounded-2xl border border-[#f0dce1] bg-white/95 px-3 py-2.5 shadow-[0_12px_30px_rgba(91,48,60,0.09)] backdrop-blur sm:left-[-1%] sm:px-4 sm:py-3">
              <p className="text-[10px] text-[#9b7a81] sm:text-xs">كل التفاصيل في مكان واحد</p>
              <p className="mt-1 text-xs font-bold text-[#9e4055] sm:text-sm">دعوتكم، بطريقتكم ♡</p>
            </div>
            <div className="absolute bottom-[12%] right-0 z-20 rounded-2xl border border-[#ead7c5] bg-[#fffdf9]/95 px-3 py-2.5 shadow-[0_12px_30px_rgba(91,48,60,0.09)] backdrop-blur sm:right-[-1%] sm:px-4 sm:py-3">
              <p className="text-[10px] text-[#9b7a81] sm:text-xs">جاهزة للمشاركة</p>
              <p className="mt-1 font-display text-lg text-[#9e4055] sm:text-xl">يوم العمر</p>
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
            [money(packages[0].price), "باقات تبدأ من"],
          ].map(([value, label]) => (
            <div key={label}>
              <p className="font-display text-2xl text-[#a64257] md:text-3xl">{value}</p>
              <p className="mt-1 text-sm text-[#806b70]">{label}</p>
            </div>
          ))}
        </div>
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
            <Link key={template.id} to={`/editor/${template.id}`} onClick={clearDraft} className="group block">
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

      <section className="border-y border-[#f0dce1] bg-[#fff8f8] py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-bold text-[#b83b50]">لكل مناسبة حكاية</p>
            <h2 className="mt-3 font-display text-4xl text-[#4a2d33] md:text-5xl">دعوتك على مزاج فرحتك</h2>
            <p className="mt-3 leading-8 text-[#806b70]">سواء بتجهّزوا للفرح أو الخطوبة أو كتب الكتاب، هتلاقوا تصميم يناسب مناسبتكم.</p>
          </div>
          <div className="mt-9 grid gap-4 sm:grid-cols-3">
            {[
              { title: "دعوات أفراح", text: "تصميمات أنيقة ليوم العمر وتفاصيله.", icon: "♡" },
              { title: "دعوات خطوبة", text: "شاركوا بداية حكايتكم مع القريبين منكم.", icon: "✦" },
              { title: "دعوات كتب كتاب", text: "دعوة بسيطة وراقية للمناسبة الغالية.", icon: "❋" },
            ].map((item) => (
              <Link key={item.title} to="/templates" className="group rounded-[26px] border border-[#f0dce1] bg-white p-6 transition hover:-translate-y-1 hover:shadow-[0_14px_32px_rgba(166,66,87,0.08)]">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#fff0f2] font-display text-2xl text-[#b83b50]">{item.icon}</span>
                <h3 className="mt-5 text-lg font-extrabold text-[#4a2d33]">{item.title}</h3>
                <p className="mt-2 text-sm leading-7 text-[#806b70]">{item.text}</p>
                <span className="mt-5 inline-block text-sm font-bold text-[#a64257]">اكتشف التصميمات ←</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 md:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-bold text-[#b83b50]">من أول اختيار لحد ما تبعت دعوتك</p>
          <h2 className="mt-3 font-display text-4xl text-[#4a2d33] md:text-5xl">الحكاية أسهل مما تتخيل</h2>
          <p className="mt-3 leading-8 text-[#806b70]">كل الخطوات واضحة، وتقدر تشوف شكل دعوتك قبل ما تكمل طلبك.</p>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {[
            { n: "١", title: "اختار التصميم", text: "اتفرّج على التصميمات واختار الشكل الأقرب لذوقكم." },
            { n: "٢", title: "ضيف تفاصيلكم", text: "اكتب الأسماء والميعاد والمكان، وشوف التعديلات مباشرة." },
            { n: "٣", title: "كمّل طلبك وشارك", text: "اختار الباقة وطريقة الدفع، وبعد التأكيد جهّز دعوتك للمشاركة." },
          ].map((step) => (
            <article key={step.n} className="rounded-[26px] border border-[#f0dce1] bg-white p-6">
              <span className="font-display text-4xl text-[#c78391]">{step.n}</span>
              <h3 className="mt-4 text-lg font-extrabold text-[#4a2d33]">{step.title}</h3>
              <p className="mt-2 text-sm leading-7 text-[#806b70]">{step.text}</p>
            </article>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link to="/how" className="font-bold text-[#a64257] hover:underline">اعرف تفاصيل طريقة الاستخدام ←</Link>
        </div>
      </section>

      <section className="bg-[#fff5f6] py-16 md:py-20">
        <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 md:grid-cols-[1fr_auto]">
          <div>
            <p className="text-sm font-bold text-[#b83b50]">باقات واضحة من البداية</p>
            <h2 className="mt-3 font-display text-4xl text-[#4a2d33] md:text-5xl">ابدأ بدعوة واحدة أو اختار باقة أكبر</h2>
            <p className="mt-3 max-w-2xl leading-8 text-[#806b70]">اختار عدد الدعوات اللي يناسب احتياجك. كل باقة موضّح فيها مميزاتها وسعرها قبل ما تبدأ.</p>
            <p className="mt-5 text-sm font-semibold text-[#806b70]">الباقات بتبدأ من <strong className="text-2xl text-[#a64257]">{money(packages[0].price)} ج.م</strong></p>
          </div>
          <Link to="/packages" className="btn-gold justify-center px-8">قارن الباقات والأسعار</Link>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-16 md:py-20">
        <div className="text-center">
          <p className="text-sm font-bold text-[#b83b50]">عندك سؤال؟</p>
          <h2 className="mt-3 font-display text-4xl text-[#4a2d33] md:text-5xl">إجابات تهمك قبل ما تبدأ</h2>
        </div>
        <div className="mt-8 divide-y divide-[#f0dce1] rounded-[26px] border border-[#f0dce1] bg-white px-5">
          {faqs.slice(0, 4).map((faq) => (
            <details key={faq.q} className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-bold text-[#4a2d33] marker:hidden">
                {faq.q}
                <span className="text-xl text-[#b83b50] transition group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-[#806b70]">{faq.a}</p>
            </details>
          ))}
        </div>
        <div className="mt-6 text-center">
          <Link to="/faq" className="font-bold text-[#a64257] hover:underline">شوف كل الأسئلة الشائعة ←</Link>
        </div>
      </section>

    </main>
  )
}
