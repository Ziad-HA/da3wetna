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
      <section className="da3-hero relative isolate overflow-hidden">
        <style>{`
          @keyframes da3-float { 0%,100% { transform:translate3d(0,0,0) rotate(1deg) } 50% { transform:translate3d(0,-12px,0) rotate(-1deg) } }
          @keyframes da3-drift { 0%,100% { transform:translateY(0) rotate(0) } 50% { transform:translateY(-8px) rotate(5deg) } }
          @keyframes da3-glow { 0%,100% { opacity:.42; transform:scale(.96) } 50% { opacity:.9; transform:scale(1.06) } }
          @keyframes da3-rise { from { opacity:0; transform:translateY(16px) } to { opacity:1; transform:translateY(0) } }
          @keyframes da3-rail { 0%,100% { transform:translateY(0) } 50% { transform:translateY(-7px) } }
          .da3-phone-float { animation:da3-float 7s ease-in-out infinite }
          .da3-petal { animation:da3-drift 6s ease-in-out infinite }
          .da3-spark { animation:da3-glow 3.2s ease-in-out infinite }
          .da3-copy > * { animation:da3-rise .7s both }
          .da3-copy > *:nth-child(2) { animation-delay:.08s }
          .da3-copy > *:nth-child(3) { animation-delay:.16s }
          .da3-copy > *:nth-child(4) { animation-delay:.24s }
          .da3-tool-rail { animation:da3-rail 6s ease-in-out infinite }
          @media(max-width:420px) { .da3-tool-rail { right:0!important; transform:scale(.88); transform-origin:right center } }
          @media(prefers-reduced-motion:reduce) { .da3-phone-float,.da3-petal,.da3-spark,.da3-copy > *,.da3-tool-rail { animation:none!important } }
        `}</style>
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -right-40 -top-44 h-[34rem] w-[34rem] rounded-full bg-[#f3d8df]/70 blur-[90px]" />
          <div className="absolute -bottom-52 -left-32 h-[34rem] w-[34rem] rounded-full bg-[#f4e8d9]/75 blur-[100px]" />
          <div className="absolute inset-0 opacity-[.16] [background-image:radial-gradient(#b98b83_.7px,transparent_.7px)] [background-size:24px_24px]" />
          <span className="da3-petal absolute right-[8%] top-[22%] text-3xl text-[#d69aa5]">✿</span>
          <span className="da3-petal absolute bottom-[18%] left-[8%] text-2xl text-[#c6a15b]" style={{animationDelay:"-2s"}}>✧</span>
          <span className="da3-spark absolute right-[45%] top-[12%] text-xl text-[#c6a15b]">✦</span>
        </div>

        <div className="relative mx-auto grid max-w-6xl items-center gap-5 px-4 pb-12 pt-8 sm:gap-8 sm:pb-16 sm:pt-12 md:grid-cols-[1.02fr_.98fr] md:gap-10 md:py-20 lg:gap-14">
          <div className="da3-copy relative z-10 order-2 text-center md:order-1 md:text-right">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#e7c9c9] bg-white/75 px-4 py-2 shadow-[0_5px_20px_rgba(91,48,60,.05)] backdrop-blur">
              <span className="text-[#bd965e]">✦</span>
              <span className="text-xs font-bold tracking-wide text-[#9d5962] sm:text-sm">تفاصيل تليق بيوم العمر</span>
              <span className="text-[#bd965e]">✦</span>
            </div>
            <h1 className="mx-auto mt-5 max-w-[650px] font-display text-[2.65rem] leading-[1.3] text-[#493238] text-balance sm:text-5xl md:mx-0 md:mt-6 md:text-[4.25rem] md:leading-[1.22]">
              لكل فرحة حكاية،
              <span className="relative mt-1 block text-[#b64b60]">
                ولكل حكاية دعوة
                <svg aria-hidden="true" viewBox="0 0 320 16" className="mx-auto mt-1 h-3 w-52 text-[#c6a15b] md:mx-0 md:w-64"><path d="M3 11C82 1 227 1 317 10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
              </span>
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-sm leading-8 text-[#806d70] sm:text-base md:mx-0 md:mt-6 md:text-lg">
              خلّوا أول تفاصيل فرحتكم تبدأ بدعوة تشبهكم. اختاروا التصميم، اكتبوا بيانات يومكم، وشاركوا لينك أنيق مع كل اللي بتحبوهم.
            </p>
            <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row md:justify-start">
              <Link to="/templates" className="btn-gold min-h-12 min-w-44 justify-center shadow-[0_12px_28px_rgba(182,75,96,.22)] transition duration-300 hover:-translate-y-1">ابدأوا تصميم دعوتكم <span className="mr-2">←</span></Link>
              <Link to="/how" className="btn-ghost min-h-12 min-w-36 justify-center border-[#e5cbd0] bg-white/80 text-[#65434b] transition duration-300 hover:-translate-y-1">شوفوا بتشتغل إزاي</Link>
            </div>
            {last ? <Link to={`/done/${last.code}`} className="mt-5 inline-block text-sm font-semibold text-[#a34256] underline-offset-4 hover:underline">ارجع لآخر دعوة اشتغلت عليها</Link> : null}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-3 text-xs font-semibold text-[#806b70] sm:text-sm md:justify-start">
              <span className="inline-flex items-center gap-2"><span className="grid h-5 w-5 place-items-center rounded-full bg-[#f5e4e7] text-[#ae5365]">✓</span> تعديل سهل ومباشر</span>
              <span className="inline-flex items-center gap-2"><span className="grid h-5 w-5 place-items-center rounded-full bg-[#f5e4e7] text-[#ae5365]">✓</span> صورة للستوري</span>
              <span className="inline-flex items-center gap-2"><span className="grid h-5 w-5 place-items-center rounded-full bg-[#f5e4e7] text-[#ae5365]">✓</span> لينك خاص لضيوفكم</span>
            </div>
          </div>

          <div className="relative order-1 mx-auto flex min-h-[390px] w-full max-w-[500px] items-center justify-center sm:min-h-[500px] md:order-2 md:min-h-[570px]">
            <div aria-hidden="true" className="absolute left-1/2 top-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,#f0d2d9_0%,rgba(240,210,217,.5)_52%,transparent_73%)] sm:h-[390px] sm:w-[390px] md:h-[470px] md:w-[470px]"/>
            <div aria-hidden="true" className="absolute left-1/2 top-1/2 h-[310px] w-[310px] -translate-x-1/2 -translate-y-1/2 rounded-t-[48%] rounded-b-[45%] border border-[#c6a15b]/55 bg-[linear-gradient(145deg,rgba(255,255,255,.65),rgba(255,246,242,.12))] shadow-[inset_0_0_50px_rgba(255,255,255,.7)] sm:h-[405px] sm:w-[405px] md:h-[485px] md:w-[485px]"/>
            <div aria-hidden="true" className="absolute left-1/2 top-[7%] z-[2] -translate-x-1/2 text-center">
              <span className="inline-flex items-center gap-2 rounded-full border border-[#d9bd91]/80 bg-[#fffaf2]/95 px-3 py-1.5 text-[9px] font-semibold tracking-[.2em] text-[#a77c43] shadow-sm sm:text-[10px]">✧ WEDDING INVITATION ✧</span>
            </div>
            <svg aria-hidden="true" viewBox="0 0 440 130" className="pointer-events-none absolute left-1/2 top-[5%] z-[3] w-[92%] -translate-x-1/2 overflow-visible sm:top-[4%]">
              <path d="M8 5C95 112 345 112 432 5" stroke="#b99a75" strokeOpacity=".8" strokeWidth="1.5" fill="none"/>
              {[30,65,102,142,184,226,268,308,348,386,418].map((x,i)=><g key={x} transform={`translate(${x} ${22+Math.sin(i*.55)*25})`}>
                <path d="M0 0c-7 8-7 13-3 18m3-18c7 8 7 13 3 18" stroke="#82977d" strokeWidth="1.3" strokeLinecap="round" fill="none"/>
                <circle cy="-3" r="4" fill="#d98f9e"/><circle cx="-4" cy="-6" r="3.2" fill="#f1cbd2"/><circle cx="4" cy="-6" r="3.2" fill="#f1cbd2"/><circle cy="-9" r="3.2" fill="#f1cbd2"/><circle r="1.4" fill="#bd965e"/>
              </g>)}
            </svg>
            <span aria-hidden="true" className="da3-spark absolute left-[7%] top-[31%] z-[4] text-3xl text-[#c29a62]">✧</span>
            <span aria-hidden="true" className="da3-spark absolute right-[7%] bottom-[24%] z-[4] text-3xl text-[#c29a62]" style={{animationDelay:"-1.5s"}}>✦</span>
            <span aria-hidden="true" className="da3-petal absolute right-[11%] top-[24%] z-[4] text-2xl text-[#d18d9b]">♡</span>
            <span aria-hidden="true" className="da3-petal absolute bottom-[19%] left-[13%] z-[4] text-2xl text-[#d18d9b]" style={{animationDelay:"-2.8s"}}>♡</span>
            <div className="da3-phone-float relative z-10 rotate-[1deg]">
              <div className="phone !w-[min(230px,61vw)] !rounded-[34px] !border-[6px] !border-white !bg-white !p-1.5 !shadow-[0_32px_85px_rgba(91,48,60,.25)] sm:!w-[min(270px,65vw)] md:!w-[min(292px,68vw)] md:!rounded-[42px] md:!border-[7px] md:!p-2">
                <div className="phone-screen h-full w-full overflow-hidden rounded-[26px] md:!rounded-[30px]">
                  <div className="invite-frame"><Invitation draft={draftFor(templates[1])}/></div>
                </div>
              </div>
            </div>

            <div aria-hidden="true" className="da3-tool-rail absolute right-[1%] top-1/2 z-20 flex -translate-y-1/2 flex-col items-center gap-2 rounded-[25px] border border-[#ead7c5] bg-white/85 px-2 py-3 shadow-[0_16px_40px_rgba(91,48,60,.13)] backdrop-blur-md sm:right-[0%] sm:gap-2.5 sm:px-2.5 sm:py-4">
              {[
                ["Aa", "الكلام"],
                ["Tt", "الخط"],
                ["▧", "الصور"],
                ["♫", "الموسيقى"],
                ["◉", "الألوان"],
                ["◷", "الميعاد"],
              ].map(([symbol, label]) => (
                <div key={label} className="flex w-11 flex-col items-center gap-0.5 rounded-xl px-1 py-1 text-center transition-colors hover:bg-[#fff0f2]">
                  <span className="font-display text-base leading-5 text-[#b64b60]">{symbol}</span>
                  <span className="text-[8px] font-semibold leading-3 text-[#806b70] sm:text-[9px]">{label}</span>
                </div>
              ))}
            </div>

            <div className="absolute left-0 top-[22%] z-20 rounded-2xl border border-[#f0dce1] bg-white/95 px-3 py-2.5 shadow-[0_14px_35px_rgba(91,48,60,.11)] backdrop-blur sm:left-[-1%] sm:px-4 sm:py-3">
              <p className="text-[10px] text-[#9b7a81] sm:text-xs">تفاصيلكم في تصميم واحد</p>
              <p className="mt-1 text-xs font-bold text-[#9e4055] sm:text-sm">حكايتكم، بطريقتكم ♡</p>
            </div>
            <div className="absolute bottom-[13%] right-0 z-20 rounded-2xl border border-[#ead7c5] bg-[#fffdf9]/95 px-3 py-2.5 shadow-[0_14px_35px_rgba(91,48,60,.11)] backdrop-blur sm:right-[-1%] sm:px-4 sm:py-3">
              <p className="text-[10px] text-[#9b7a81] sm:text-xs">لينك واحد لكل ضيوفكم</p>
              <p className="mt-1 font-display text-lg text-[#9e4055] sm:text-xl">يوم العمر</p>
            </div>
          </div>
        </div>
        <div className="relative mx-auto -mt-1 flex max-w-6xl justify-center px-4 pb-7 md:pb-10">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#ead8d7] bg-white/65 px-4 py-2 text-[11px] font-semibold text-[#9b7a81] shadow-sm">
            <span className="text-[#bd965e]">✦</span> دعوة رقمية تليق بفرحتكم <span className="text-[#bd965e]">✦</span>
          </span>
        </div>
      </section>


      <section className="relative border-y border-[#f0dce1] bg-white shadow-[0_8px_28px_rgba(91,48,60,.035)]">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-3 px-4 py-5 text-center sm:gap-5 sm:py-7 md:grid-cols-4">
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

      <section className="relative overflow-hidden bg-[linear-gradient(180deg,#fff5f6_0%,#fffafa_100%)] py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-bold text-[#b83b50]">كل اللي تحتاجه</p>
            <h2 className="mt-3 font-display text-4xl text-[#4a2d33] md:text-5xl">تفاصيل صغيرة تفرق</h2>
            <p className="mt-3 leading-8 text-[#806b70]">تجربة بسيطة تخليك تركز في فرحتك، مش في تجهيز الدعوة.</p>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <article key={feature.title} className="group rounded-[26px] border border-[#f0dce1] bg-white p-6 shadow-[0_8px_28px_rgba(91,48,60,.035)] transition duration-300 hover:-translate-y-1 hover:border-[#e2bdc6] hover:shadow-[0_18px_40px_rgba(91,48,60,.09)]">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#fff0f2] text-[#b83b50] transition duration-300 group-hover:rotate-[-4deg] group-hover:scale-105">
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
              <div className="overflow-hidden rounded-[26px] border border-[#f0dce1] bg-white p-2 shadow-[0_8px_26px_rgba(91,48,60,.05)] transition duration-300 group-hover:-translate-y-1 group-hover:border-[#e2bdc6] group-hover:shadow-[0_18px_38px_rgba(91,48,60,.12)]">
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
            <article key={step.n} className="relative overflow-hidden rounded-[26px] border border-[#f0dce1] bg-white p-6 shadow-[0_8px_28px_rgba(91,48,60,.04)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_16px_36px_rgba(91,48,60,.08)]">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#fff0f2] font-display text-2xl text-[#b64b60] ring-1 ring-[#f0dce1]">{step.n}</span>
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
