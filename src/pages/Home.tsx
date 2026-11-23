import { useEffect } from "react"
import { Link } from "react-router-dom"
import { InviteThumb } from "../components/InviteThumb"
import { packages } from "../config"
import { activeTemplates, faqs } from "../data"
import { draftFor } from "../data"
import { money } from "../lib/format"
import { clearDraft, readLast } from "../lib/storage"

export function Home() {
  const last = readLast()

  useEffect(() => {
    document.title = "دعوتنا — دعوات أفراح رقمية"
  }, [])

  return (
    <main id="main" className="da3-home overflow-hidden">
      <section className="da3-home-hero relative isolate overflow-hidden bg-[radial-gradient(ellipse_at_12%_8%,#f8e5e9_0%,transparent_42%),radial-gradient(ellipse_at_88%_80%,#f5eadb_0%,transparent_38%),linear-gradient(135deg,#fffaf9_0%,#fff4f5_55%,#fffdfa_100%)]">
        <div aria-hidden="true" className="pointer-events-none absolute -right-24 -top-28 h-72 w-72 rounded-full border border-[#d9aab5]/40 sm:h-96 sm:w-96" />
        <div aria-hidden="true" className="pointer-events-none absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-[#f3dce1]/55 blur-3xl" />
        <div className="relative mx-auto grid max-w-6xl items-center gap-5 px-4 py-8 sm:gap-10 sm:py-14 md:grid-cols-2 md:py-20">
          <div className="order-2 text-center md:order-1 md:text-right">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#ead2d6] bg-white/80 px-3 py-2 text-[11px] font-bold text-[#a64257] shadow-sm sm:text-sm">✦ تفاصيل تليق بيوم العمر ✦</span>
            <h1 className="mx-auto mt-4 max-w-xl font-display text-[2.35rem] leading-[1.35] text-[#4a2d33] sm:text-5xl md:mx-0 md:text-6xl">
              لكل فرحة حكاية،
              <span className="block text-[#b64b60]">ولكل حكاية دعوة</span>
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-8 text-[#806b70] sm:text-base md:mx-0">
              اختاروا تصميم يشبهكم، اكتبوا تفاصيل يومكم، وشوفوا دعوتكم بتتكوّن قدامكم لحظة بلحظة. وبعدها شاركوها مع كل اللي بتحبوهم.
            </p>
            <div className="mt-6 flex flex-col justify-center gap-2.5 sm:flex-row md:justify-start">
              <Link to="/templates" className="btn-gold min-h-12 justify-center px-6 shadow-[0_10px_25px_rgba(166,66,87,.18)]">ابدأوا تصميم دعوتكم <span className="mr-2">←</span></Link>
              <Link to="/how" className="btn-ghost min-h-12 justify-center border-[#e8cbd1] bg-white/80 px-6 text-[#65434b]">اعرفوا طريقة الاستخدام</Link>
            </div>
            {last ? <Link to={`/done/${last.code}`} className="mt-4 inline-block text-xs font-bold text-[#a64257] underline underline-offset-4 sm:text-sm">الرجوع لآخر دعوة محفوظة</Link> : null}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[11px] font-semibold text-[#806b70] sm:text-sm md:justify-start">
              <span>✓ معاينة مباشرة</span><span>✓ تخصيص سهل</span><span>✓ مشاركة بلينك</span>
            </div>
          </div>

          <div className="relative order-1 mx-auto flex min-h-[290px] w-full max-w-[390px] items-center justify-center sm:min-h-[440px] md:order-2 md:min-h-[520px]">
            <div aria-hidden="true" className="absolute h-[250px] w-[250px] rounded-full bg-[radial-gradient(circle,#f0d2d9_0%,rgba(240,210,217,.45)_55%,transparent_75%)] sm:h-[390px] sm:w-[390px]" />
            <div aria-hidden="true" className="absolute h-[250px] w-[250px] rounded-[48%] border border-[#c6a15b]/55 bg-white/25 shadow-[inset_0_0_45px_rgba(255,255,255,.8)] sm:h-[390px] sm:w-[390px]" />
            <span aria-hidden="true" className="absolute right-[10%] top-[15%] z-10 animate-pulse text-3xl text-[#c6a15b]">✧</span>
            <span aria-hidden="true" className="absolute bottom-[14%] left-[9%] z-10 text-3xl text-[#d18d9b]">♡</span>
            <div className="home-hero-invitation relative z-10 w-[min(235px,64vw)] rotate-[1deg] sm:w-[min(300px,58vw)]">
              <div className="home-invitation-paper overflow-hidden"><InviteThumb draft={draftFor(activeTemplates[1])} /></div>
            </div>
            <div className="absolute right-0 top-1/2 z-20 hidden -translate-y-1/2 flex-col gap-2 rounded-2xl border border-[#ead7c5] bg-white/90 px-2 py-3 text-center shadow-lg backdrop-blur sm:flex">
              {[["Aa","الكلام"],["Tt","الخط"],["▧","الصور"],["♫","الموسيقى"],["◉","الألوان"],["◷","الميعاد"]].map(([symbol,label]) => <div key={label} className="w-10"><span className="block font-display text-base text-[#b64b60]">{symbol}</span><span className="block text-[8px] text-[#806b70]">{label}</span></div>)}
            </div>
            <span aria-hidden="true" className="absolute left-[5%] top-[24%] hidden rounded-full border border-[#f0dce1] bg-white/90 px-3 py-2 text-xs font-bold text-[#a64257] shadow-sm sm:block">دعوتكم بطريقتكم ♡</span>
          </div>
        </div>
      </section>

      <section className="border-y border-[#f0dce1] bg-white">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-3 px-4 py-5 text-center sm:grid-cols-4 sm:gap-5 sm:py-7">
          {[[String(activeTemplates.length), "تصميم متنوع"], ["فوري", "معاينة وتعديل"], ["لينك", "للمشاركة مع الضيوف"], [money(packages[0].price), "تبدأ الأسعار من"]].map(([value,label]) => (
            <div key={label}><p className="font-display text-2xl text-[#a64257] sm:text-3xl">{value}</p><p className="mt-1 text-[11px] text-[#806b70] sm:text-sm">{label}</p></div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-9 sm:py-12">
        <div className="flex items-end justify-between gap-3">
          <div><p className="text-xs font-bold text-[#b83b50] sm:text-sm">اختيارات من مجموعتنا</p><h2 className="mt-1 font-display text-2xl text-[#4a2d33] sm:text-4xl">تصميمات تستاهل فرحتكم</h2></div>
          <Link to="/templates" className="shrink-0 text-xs font-bold text-[#a64257] sm:text-sm">كل التصميمات ←</Link>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-5">
          {activeTemplates.slice(0,5).map((template) => (
            <Link key={template.id} to={`/editor/${template.id}`} onClick={clearDraft} className="group min-w-0">
              <div className="home-template-art overflow-hidden">
                <InviteThumb draft={draftFor(template)} />
              </div>
              <h3 className="mt-2 truncate text-xs font-extrabold text-[#4a2d33] sm:text-sm">{template.name}</h3>
              <p className="mt-1 line-clamp-2 text-[10px] leading-5 text-[#806b70] sm:text-xs">{template.blurb}</p>
              <span className="mt-2 inline-flex text-[10px] font-bold text-[#a64257] sm:text-xs">اختار التصميم ←</span>
            </Link>
          ))}
        </div>
        <div className="mt-6 flex justify-center">
          <Link to="/preview/estate" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-[#d9b8a0] bg-white/90 px-7 text-sm font-extrabold text-[#a64257] shadow-[0_8px_24px_rgba(94,28,42,.08)] transition hover:-translate-y-0.5 hover:border-[#b88b65] hover:bg-[#fff8f5]">
            اتفرّج على الدعوة <span aria-hidden="true">♡</span>
          </Link>
        </div>
      </section>


      <section className="mx-auto max-w-6xl px-4 py-9 sm:py-14">
        <div className="relative overflow-hidden rounded-[26px] border border-[#e8c8cf] bg-[linear-gradient(135deg,#fff0f3_0%,#fffaf8_58%,#f8eee5_100%)] p-5 shadow-[0_14px_40px_rgba(91,48,60,.06)] sm:rounded-[34px] sm:p-9 md:p-11">
          <div className="text-center">
            <p className="text-xs font-extrabold text-[#b36a78] sm:text-sm">✦ الباقة المميزة ✦</p>
            <h2 className="mt-2 font-display text-2xl leading-relaxed text-[#4a2d33] sm:text-4xl">دعوتك، بتحكم أكبر في كل تفصيلة</h2>
            <p className="mx-auto mt-2 max-w-2xl text-xs leading-7 text-[#806b70] sm:text-base sm:leading-8">مع باقة الدعوة الواحدة تقدر تخصص دعوتك بنفسك بسهولة، وتخليها أقرب لذوقكم وتفاصيل فرحتكم.</p>
          </div>
          <div className="mt-6 grid gap-3 sm:mt-8 sm:grid-cols-2 lg:grid-cols-3">
            {[
              ["♫","موسيقى من اختيارك","اختار الموسيقى اللي تحبها لخلفية دعوتك."],
              ["Aa","خطوط متنوعة","أكتر من 10 خطوط عربي وإنجليزي تختار منهم."],
              ["▧","صورك الخاصة","استخدم صور الخطوبة أو جلسة التصوير أو أي صور تناسبكم."],
              ["✧","تصميمات متنوعة","اختار من مجموعة تصميمات وأشكال مختلفة."],
              ["◉","تحكم في الأقسام","اخفي أي قسم مش محتاجه وخلي الدعوة على ذوقك."],
              ["♡","دعوتك معاك","الدعوة تفضل معاك مدى الحياة، مع إمكانية التعديل لمدة 30 يوم من التفعيل."],
            ].map(([symbol,title,description]) => (
              <div key={title} className="flex gap-3 rounded-2xl border border-white bg-white/80 p-4 shadow-sm">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#fff0f2] font-display text-lg text-[#b64b60]">{symbol}</span>
                <div><h3 className="text-sm font-extrabold text-[#4a2d33]">{title}</h3><p className="mt-1 text-[11px] leading-6 text-[#806b70] sm:text-xs">{description}</p></div>
              </div>
            ))}
          </div>
          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link to="/packages" className="btn-gold min-h-11 w-full justify-center px-6 sm:w-auto">شوف تفاصيل الباقات والأسعار ←</Link>
            <span className="text-[10px] text-[#90777d] sm:text-xs">تخصيص الدعوة من المحرر، من غير خبرة تقنية</span>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-9 sm:pb-14">
        <div className="grid gap-5 overflow-hidden rounded-[26px] border border-[#efd9df] bg-[linear-gradient(125deg,#fff7f7_0%,#fff 52%,#f8edf0_100%)] p-5 sm:rounded-[34px] sm:p-9 md:grid-cols-[1fr_220px] md:items-center md:p-11">
          <div>
            <p className="text-xs font-extrabold text-[#b36a78] sm:text-sm">شغل مخصص ليك</p>
            <h2 className="mt-2 font-display text-2xl leading-relaxed text-[#4a2d33] sm:text-4xl">عايز حاجة متعمولة ليك إنت بالظبط؟</h2>
            <p className="mt-2 max-w-2xl text-xs leading-7 text-[#806b70] sm:text-sm sm:leading-8">مش لازم تكون دعوة من تصميماتنا. لو عندك فكرة لموقع أو تصميم خاص، نتكلم ونشوف أنسب تنفيذ وميزانية ليك.</p>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {["موقع كامل لشغلك أو مشروعك","تصميم دعوة مش موجود عندنا من الصفر","ألوان وشكل حصري على ذوقك","صفحات هبوط ومتاجر إلكترونية وأنظمة حجز","تعديلات وتطويرات حسب الاتفاق","تواصل مباشر مع الشخص اللي بينفذ الشغل"].map((item) => <p key={item} className="flex items-start gap-2 text-[11px] leading-6 text-[#665258] sm:text-xs"><span className="text-[#b83b50]">✓</span>{item}</p>)}
            </div>
          </div>
          <div className="flex flex-col items-center justify-center rounded-2xl border border-[#f0dce1] bg-white/85 p-4 text-center sm:p-5">
            <span className="grid h-12 w-12 place-items-center rounded-full bg-[#e8f7ed] text-2xl text-[#26834c]">✆</span>
            <p className="mt-3 text-sm font-extrabold text-[#4a2d33]">خلينا نتكلم عن فكرتك</p>
            <p className="mt-1 text-[11px] leading-5 text-[#806b70]">ابعت تفاصيل بسيطة على واتساب، ونبدأ نتفق على المطلوب.</p>
            <a href="https://wa.me/201276390301?text=%D8%A7%D9%84%D8%B3%D9%84%D8%A7%D9%85%20%D8%B9%D9%84%D9%8A%D9%83%D9%85%D8%8C%20%D8%B9%D8%A7%D9%8A%D8%B2%20%D8%A3%D8%B9%D9%85%D9%84%20%D9%85%D9%88%D9%82%D8%B9%20%D8%A3%D9%88%20%D8%AA%D8%B5%D9%85%D9%8A%D9%85%20%D9%85%D8%AE%D8%B5%D8%B5.%20%D9%85%D9%85%D9%83%D9%86%20%D9%86%D8%AA%D9%83%D9%84%D9%85%D8%9F" target="_blank" rel="noreferrer" className="mt-4 inline-flex min-h-11 w-full items-center justify-center rounded-full bg-[#218c50] px-4 text-xs font-extrabold text-white transition hover:bg-[#197641]">كلّمني على واتساب ←</a>
            <p className="mt-2 text-[10px] font-semibold text-[#806b70]" dir="ltr">01276390301</p>
            <p className="mt-1 text-[9px] text-[#a18a8f]">من غير أي التزام</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 pb-10 sm:pb-16">
        <div className="text-center">
          <p className="text-xs font-extrabold text-[#b36a78] sm:text-sm">عندك سؤال؟</p>
          <h2 className="mt-2 font-display text-2xl text-[#4a2d33] sm:text-4xl">الأسئلة الشائعة</h2>
          <p className="mt-2 text-xs leading-6 text-[#806b70] sm:text-sm">جمعنالك إجابات سريعة عن الدعوات والتعديل والدفع والمشاركة.</p>
        </div>
        <div className="mt-5 grid gap-2.5 sm:mt-7 sm:gap-3">
          {faqs.map((item,index) => (
            <details key={item.q} className="group rounded-2xl border border-[#f0dce1] bg-white shadow-sm transition open:border-[#e5c1ca]">
              <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-right text-xs font-bold text-[#4a2d33] [&::-webkit-details-marker]:hidden sm:min-h-16 sm:px-5 sm:text-sm">
                <span className="flex items-center gap-3"><span className="font-display text-xs text-[#bd8792]">{String(index+1).padStart(2,"0")}</span>{item.q}</span>
                <span className="shrink-0 text-lg text-[#b83b50] transition-transform group-open:rotate-180">⌄</span>
              </summary>
              <p className="border-t border-[#f7eaed] px-4 py-3 text-[11px] leading-7 text-[#806b70] sm:px-5 sm:py-4 sm:text-sm sm:leading-8">{item.a}</p>
            </details>
          ))}
        </div>
        <div className="mt-5 flex flex-col items-center justify-center gap-2 text-center sm:flex-row">
          <p className="text-[11px] text-[#806b70] sm:text-xs">لسه محتاج تعرف حاجة؟</p>
          <a href="https://wa.me/201276390301" target="_blank" rel="noreferrer" className="text-xs font-extrabold text-[#a64257] underline underline-offset-4">تواصل معانا على واتساب</a>
        </div>
      </section>

      <section className="mx-3 mb-9 overflow-hidden rounded-[24px] border border-[#efd9df] bg-[linear-gradient(120deg,#fff2f4_0%,#fffdfa_55%,#f8efe5_100%)] sm:mx-auto sm:mb-14 sm:max-w-6xl sm:rounded-[32px]">
        <div className="flex flex-col items-center justify-between gap-4 px-5 py-6 text-center sm:flex-row sm:px-9 sm:py-8 sm:text-right">
          <div><p className="text-xs font-bold text-[#a64257] sm:text-sm">باقات واضحة من غير اشتراكات</p><h2 className="mt-1 font-display text-2xl text-[#4a2d33] sm:text-3xl">ابدأ دعوتك من {money(packages[0].price)} جنيه</h2><p className="mt-1 text-xs leading-6 text-[#806b70] sm:text-sm">اختار عدد الدعوات المناسب، وكل دعوة ليها تصميمها ورابطها.</p></div>
          <Link to="/packages" className="btn-gold min-h-11 shrink-0 justify-center px-6">شوف الباقات والأسعار ←</Link>
        </div>
      </section>
    </main>
  )
}
