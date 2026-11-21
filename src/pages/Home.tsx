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
      <section className="relative isolate overflow-hidden bg-[radial-gradient(ellipse_at_15%_15%,#ffe1e8_0%,transparent_38%),radial-gradient(ellipse_at_90%_80%,#f7e7d8_0%,transparent_35%),linear-gradient(135deg,#fff8f8_0%,#fff0f3_48%,#fffaf6_100%)]">
        <style>{`
          @keyframes heart-drift { 0%,100% { transform: translate3d(0,0,0) rotate(-8deg); } 50% { transform: translate3d(9px,-17px,0) rotate(8deg); } }
          @keyframes petal-fall { 0% { transform: translate3d(0,-18px,0) rotate(0deg); opacity:0; } 18% { opacity:.8; } 85% { opacity:.55; } 100% { transform: translate3d(22px,95px,0) rotate(120deg); opacity:0; } }
          @keyframes soft-orbit { 0%,100% { transform: translateY(0) rotate(2deg); } 50% { transform: translateY(-10px) rotate(-1deg); } }
          @keyframes sparkle { 0%,100% { opacity:.35; transform:scale(.8); } 50% { opacity:1; transform:scale(1.15); } }
          .hero-heart { animation: heart-drift 5s ease-in-out infinite; }
          .hero-petal { animation: petal-fall 8s linear infinite; }
          .hero-orbit { animation: soft-orbit 6s ease-in-out infinite; }
          .hero-sparkle { animation: sparkle 2.8s ease-in-out infinite; }
          @media (prefers-reduced-motion: reduce) { .hero-heart,.hero-petal,.hero-orbit,.hero-sparkle { animation:none !important; } }
        `}</style>
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
          <span className="hero-heart absolute left-[7%] top-[18%] text-4xl text-[#e7a3b1]/70">♥</span>
          <span className="hero-heart absolute left-[43%] top-[10%] text-xl text-[#c98b98]/60" style={{ animationDelay: "-2s" }}>♡</span>
          <span className="hero-heart absolute right-[8%] top-[16%] text-5xl text-[#e8a9b7]/65" style={{ animationDelay: "-1s" }}>♡</span>
          <span className="hero-heart absolute right-[42%] bottom-[12%] text-2xl text-[#c98b98]/50" style={{ animationDelay: "-3s" }}>♥</span>
          <span className="hero-petal absolute left-[22%] top-[8%] text-xl text-[#d69aa6]" style={{ animationDelay: "-1s" }}>✿</span>
          <span className="hero-petal absolute right-[23%] top-[4%] text-2xl text-[#d69aa6]" style={{ animationDelay: "-4s" }}>✧</span>
          <span className="hero-petal absolute right-[10%] top-[48%] text-lg text-[#d69aa6]" style={{ animationDelay: "-6s" }}>✿</span>
          <span className="hero-sparkle absolute left-[49%] top-[38%] text-xl text-[#c89a55]">✦</span>
          <span className="hero-sparkle absolute right-[5%] bottom-[17%] text-2xl text-[#c89a55]" style={{ animationDelay: "-1.2s" }}>✧</span>
        </div>
        <div className="pointer-events-none absolute -right-28 -top-36 h-[28rem] w-[28rem] rounded-full border border-white/70" />
        <div className="pointer-events-none absolute -right-16 -top-24 h-[22rem] w-[22rem] rounded-full border border-[#e8c3cb]/45" />
        <div className="relative mx-auto grid max-w-6xl items-center gap-5 px-4 py-10 sm:gap-8 sm:py-14 md:grid-cols-[1.05fr_0.95fr] md:gap-12 md:py-24">
          <div className="relative z-10 text-center md:text-right">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#e9cbd1] bg-white/85 px-4 py-2 text-sm font-semibold text-[#9e4659] shadow-[0_5px_20px_rgba(142,76,91,0.06)]">
              <span className="text-[#c18b4c]">❀</span>
              تفاصيل تليق بيوم العمر
              <span className="text-[#c18b4c]">❀</span>
            </span>
            <h1 className="mt-5 font-display text-[2.65rem] leading-[1.25] text-[#4a2d33] text-balance sm:text-5xl md:mt-7 md:text-[4.6rem]">
              خلي دعوتك
              <span className="relative mt-1 block text-[#b83b50]">
                تحكي فرحتك
                <svg aria-hidden="true" viewBox="0 0 300 16" className="mx-auto mt-1 h-3 w-56 md:mx-0 md:w-64" fill="none">
                  <path d="M3 11C72 1 204 1 296 9" stroke="#d69b75" strokeWidth="3" strokeLinecap="round" />
                </svg>
              </span>
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-[#806b70] sm:text-base sm:leading-8 md:mx-0 md:mt-6 md:text-lg">
              اختار تصميم بتحبه، ضيف تفاصيل يومك، وشارك دعوتك مع كل الناس اللي بتحبهم — بصورة أنيقة أو لينك واحد.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-2.5 sm:gap-3 md:mt-8 md:justify-start">
              <Link to="/templates" className="btn-gold shadow-[0_10px_26px_rgba(184,59,80,0.2)] transition duration-300 hover:-translate-y-1">اختار دعوتك <span className="mr-1">←</span></Link>
              <a href="/how" className="btn-ghost border-[#e5cbd0] bg-white/80 text-[#65434b] transition duration-300 hover:-translate-y-1">اعرف الطريقة</a>
            </div>
            {last ? (
              <Link to={`/done/${last.code}`} className="mt-5 inline-block text-sm font-semibold text-[#a34256] underline-offset-4 hover:underline">
                رجّع آخر دعوة اشتغلت عليها
              </Link>
            ) : null}
            <div className="mt-6 flex flex-wrap justify-center gap-x-4 gap-y-2 text-xs text-[#806b70] sm:text-sm md:mt-9 md:justify-start">
              <span className="inline-flex items-center gap-2"><span className="text-[#b83b50]">♡</span> تعديل فوري</span>
              <span className="inline-flex items-center gap-2"><span className="text-[#b83b50]">♡</span> صورة ستوري</span>
              <span className="inline-flex items-center gap-2"><span className="text-[#b83b50]">♡</span> لينك للضيوف</span>
            </div>
          </div>
          <div className="relative mx-auto flex min-h-[350px] w-full max-w-[420px] items-center justify-center sm:min-h-[410px] md:min-h-[540px]">
            <div aria-hidden="true" className="absolute h-[260px] w-[260px] rounded-full bg-[radial-gradient(circle,#f1cbd3_0%,rgba(241,203,211,0.35)_52%,transparent_72%)] sm:h-[330px] sm:w-[330px] md:h-[430px] md:w-[430px]" />
            <div aria-hidden="true" className="absolute h-[285px] w-[285px] rounded-full border border-dashed border-[#d9aab4]/55 sm:h-[365px] sm:w-[365px] md:h-[465px] md:w-[465px]" />
            <div aria-hidden="true" className="absolute bottom-[3%] left-1/2 h-[88%] w-[76%] -translate-x-1/2 rounded-t-[48%] border border-b-0 border-[#c9a36d]/55 bg-[linear-gradient(180deg,rgba(255,255,255,0.42),rgba(255,242,244,0.08))] shadow-[inset_0_0_35px_rgba(255,255,255,0.45)] sm:w-[72%] md:w-[78%]" />
            <div aria-hidden="true" className="absolute left-1/2 top-[5%] z-[1] -translate-x-1/2 text-center">
              <span className="inline-flex items-center gap-2 rounded-full border border-[#d9bd91]/65 bg-[#fffaf2]/90 px-3 py-1.5 text-[10px] font-semibold tracking-[0.18em] text-[#a77c43] shadow-sm sm:text-xs">
                <span>✧</span> WEDDING INVITATION <span>✧</span>
              </span>
            </div>
            <svg aria-hidden="true" viewBox="0 0 420 130" className="pointer-events-none absolute -top-1 left-1/2 z-[2] w-[92%] -translate-x-1/2 overflow-visible sm:w-full" fill="none">
              <path d="M12 18C94 108 326 108 408 18" stroke="#c9a36d" strokeOpacity=".65" strokeWidth="1.5" strokeDasharray="2 5"/>
              <path d="M12 18l-5 13m5-13 13 4M408 18l5 13m-5-13-13 4" stroke="#c9a36d" strokeOpacity=".55" strokeWidth="1.5" strokeLinecap="round"/>
              {[42,76,112,150,190,230,270,308,344,378].map((x, i) => (
                <g key={x} transform={`translate(${x} ${42 + Math.sin(i * 0.55) * 24})`}>
                  <path d="M0 0c-7 8-8 15-3 21m3-21c7 8 8 15 3 21" stroke="#83a17c" strokeWidth="1.5" strokeLinecap="round"/>
                  <circle cy="-2" r="4" fill="#e7a8b4"/>
                  <circle cx="-4" cy="-5" r="3.2" fill="#f4d9df"/>
                  <circle cx="4" cy="-5" r="3.2" fill="#f4d9df"/>
                  <circle cy="-8" r="3.2" fill="#f4d9df"/>
                  <circle r="1.5" fill="#c79a58"/>
                </g>
              ))}
            </svg>
            <div aria-hidden="true" className="absolute bottom-[9%] left-[2%] z-[2] hidden text-5xl text-[#c98e9d]/75 sm:block">❀</div>
            <div aria-hidden="true" className="absolute right-[1%] top-[30%] z-[2] hidden rotate-12 text-4xl text-[#c98e9d]/70 sm:block">✿</div>
            <div className="hero-orbit relative z-10 rotate-[2deg]">
              <div className="phone !w-[min(230px,62vw)] !rounded-[34px] !border-[6px] !border-white !bg-white !p-1.5 !shadow-[0_24px_65px_rgba(91,48,60,0.2)] sm:!w-[min(260px,68vw)] md:!w-[min(280px,70vw)] md:!rounded-[42px] md:!border-[7px] md:!p-2">
                <div className="phone-screen h-full w-full overflow-hidden rounded-[25px] md:!rounded-[30px]">
                  <div className="invite-frame">
                    <Invitation draft={draftFor(templates[1])} />
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute left-0 top-[15%] z-20 rounded-xl border border-white/90 bg-white/95 px-2.5 py-2 shadow-[0_8px_24px_rgba(91,48,60,0.1)] backdrop-blur-sm sm:left-1 sm:top-[18%] sm:rounded-2xl sm:px-4 sm:py-3 md:left-[-1%]">
              <p className="text-xs text-[#9b7a81]">تفاصيل يومكم</p>
              <p className="mt-1 font-bold text-[#9e4055]">في دعوة واحدة ♡</p>
            </div>
            <div className="absolute bottom-[12%] right-0 z-20 rounded-xl border border-[#f0dce1] bg-white/95 px-2.5 py-2 shadow-[0_8px_24px_rgba(91,48,60,0.1)] backdrop-blur-sm sm:right-1 sm:rounded-2xl sm:px-4 sm:py-3 md:right-[-2%]">
              <p className="text-xs text-[#9b7a81]">دعوة معمولة بحب</p>
              <p className="mt-0.5 font-display text-xl text-[#9e4055]">يوم العمر ♡</p>
            </div>
            <span aria-hidden="true" className="hero-heart absolute right-[8%] top-[7%] z-20 text-3xl text-[#d98b9c] drop-shadow-sm sm:text-5xl">♥</span>
            <span aria-hidden="true" className="hero-heart absolute bottom-[7%] left-[8%] z-20 text-2xl text-[#d98b9c] sm:text-3xl" style={{ animationDelay: "-2.5s" }}>♡</span>
            <span aria-hidden="true" className="hero-sparkle absolute left-[17%] top-[35%] z-20 text-3xl text-[#c89a55]">✧</span>
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
