import { useEffect } from "react"
import { Link } from "react-router-dom"
import { InviteThumb } from "../components/InviteThumb"
import { activeTemplates, draftFor } from "../data"
import { clearDraft, readLast } from "../lib/storage"

export function Home() {
  const last = readLast()

  useEffect(() => {
    document.title = "دعوتنا — دعوات الفرح والخطوبة وكتب الكتاب"
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
              اختاروا دعوة للفرح أو الخطوبة أو كتب الكتاب، اكتبوا تفاصيل مناسبتكم، وشوفوا المعاينة قبل ما تشاركوها مع كل اللي بتحبوهم.
            </p>
            <div className="mt-6 flex flex-col justify-center gap-2.5 sm:flex-row md:justify-start">
              <Link to="/templates" className="btn-gold min-h-12 justify-center px-6 shadow-[0_10px_25px_rgba(166,66,87,.18)]">اختاروا دعوتكم <span className="mr-2">←</span></Link>
              <Link to="/how" className="btn-ghost min-h-12 justify-center border-[#e8cbd1] bg-white/80 px-6 text-[#65434b]">طريقة الاستخدام</Link>
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
            <span aria-hidden="true" className="absolute left-[5%] top-[24%] hidden rounded-full border border-[#f0dce1] bg-white/90 px-3 py-2 text-xs font-bold text-[#a64257] shadow-sm sm:block">دعوتكم بطريقتكم ♡</span>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pt-8 sm:pt-10">
        <div className="text-center">
          <p className="text-xs font-bold text-[#b83b50] sm:text-sm">اختاروا مناسبتكم</p>
          <h2 className="mt-1 font-display text-2xl text-[#4a2d33] sm:text-3xl">دعوات لكل خطوة في حكايتكم</h2>
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <Link to="/templates?occasion=فرح" className="group rounded-2xl border border-[#f0dce1] bg-white p-5 text-center transition hover:-translate-y-1 hover:border-[#d9a3ae]">
            <span className="mx-auto grid h-11 w-11 place-items-center rounded-full bg-[#fff0f2] text-xl text-[#a64257]">💍</span>
            <h3 className="mt-3 font-display text-xl font-bold text-[#4a2d33]">فرح</h3>
            <p className="mt-1 text-xs text-[#806b70]">دعوة تليق بيوم العمر</p>
            <span className="mt-3 inline-flex text-xs font-bold text-[#a64257]">شوف التصميمات ←</span>
          </Link>
          <Link to="/templates?occasion=خطوبة" className="group rounded-2xl border border-[#f0dce1] bg-white p-5 text-center transition hover:-translate-y-1 hover:border-[#d9a3ae]">
            <span className="mx-auto grid h-11 w-11 place-items-center rounded-full bg-[#fff0f2] text-xl text-[#a64257]">♡</span>
            <h3 className="mt-3 font-display text-xl font-bold text-[#4a2d33]">خطوبة</h3>
            <p className="mt-1 text-xs text-[#806b70]">احتفلوا ببداية الحكاية</p>
            <span className="mt-3 inline-flex text-xs font-bold text-[#a64257]">شوف التصميمات ←</span>
          </Link>
          <Link to="/templates?occasion=كتب%20كتاب" className="group rounded-2xl border border-[#f0dce1] bg-white p-5 text-center transition hover:-translate-y-1 hover:border-[#d9a3ae]">
            <span className="mx-auto grid h-11 w-11 place-items-center rounded-full bg-[#fff0f2] text-xl text-[#a64257]">✦</span>
            <h3 className="mt-3 font-display text-xl font-bold text-[#4a2d33]">كتب كتاب</h3>
            <p className="mt-1 text-xs text-[#806b70]">شاركوا فرحة كتب الكتاب</p>
            <span className="mt-3 inline-flex text-xs font-bold text-[#a64257]">شوف التصميمات ←</span>
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-9 sm:py-12">
        <div className="flex items-end justify-between gap-3">
          <div><p className="text-xs font-bold text-[#b83b50] sm:text-sm">اختيارات من مجموعتنا</p><h2 className="mt-1 font-display text-2xl text-[#4a2d33] sm:text-4xl">تصميمات تستاهل فرحتكم</h2></div>
          <Link to="/templates" className="shrink-0 text-xs font-bold text-[#a64257] sm:text-sm">كل التصميمات ←</Link>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-5">
          {activeTemplates.slice(0,4).map((template) => (
            <article key={template.id} className="group min-w-0">
              <Link to={`/preview/${template.id}`} className="block" aria-label={`معاينة ${template.name}`}>
                <div className="home-template-art overflow-hidden"><InviteThumb draft={draftFor(template)} /></div>
              </Link>
              <h3 className="mt-2 truncate text-xs font-extrabold text-[#4a2d33] sm:text-sm">{template.name}</h3>
              <p className="mt-1 line-clamp-2 text-[10px] leading-5 text-[#806b70] sm:text-xs">{template.blurb}</p>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <Link to={`/preview/${template.id}`} className="inline-flex min-h-9 items-center justify-center rounded-full border border-[#f0dce1] bg-white px-2 text-[10px] font-bold text-[#806b70] transition hover:border-[#d9aab5] hover:text-[#a64257] sm:text-xs">معاينة</Link>
                <Link to={`/editor/${template.id}`} onClick={clearDraft} className="inline-flex min-h-9 items-center justify-center rounded-full bg-[#fff0f2] px-2 text-[10px] font-bold text-[#a64257] transition hover:bg-[#a64257] hover:text-white sm:text-xs">صمّم الآن</Link>
              </div>
            </article>
          ))}
        </div>
        <div className="mt-7 text-center"><Link to="/templates" className="btn-gold inline-flex min-h-11 justify-center px-7">شوف كل الدعوات</Link></div>
      </section>

      <section className="border-y border-[#f0dce1] bg-white">
        <div className="mx-auto grid max-w-6xl gap-3 px-4 py-6 sm:grid-cols-3 sm:gap-5 sm:py-8">
          <Link to="/packages" className="rounded-2xl border border-[#f0dce1] bg-[#fff9fa] p-4 text-center transition hover:-translate-y-1"><span className="text-xs font-bold text-[#b36a78]">الباقات والأسعار</span><h2 className="mt-1 font-display text-xl text-[#4a2d33]">اختار الباقة المناسبة</h2><span className="mt-2 inline-block text-xs font-bold text-[#a64257]">اعرف التفاصيل ←</span></Link>
          <Link to="/partners" className="rounded-2xl border border-[#f0dce1] bg-[#fff9fa] p-4 text-center transition hover:-translate-y-1"><span className="text-xs font-bold text-[#b36a78]">لأصحاب البيزنس</span><h2 className="mt-1 font-display text-xl text-[#4a2d33]">شراكات دعوتنا</h2><span className="mt-2 inline-block text-xs font-bold text-[#a64257]">اعرف تفاصيل الشراكة ←</span></Link>
          <Link to="/contact" className="rounded-2xl border border-[#f0dce1] bg-[#fff9fa] p-4 text-center transition hover:-translate-y-1"><span className="text-xs font-bold text-[#b36a78]">محتاج مساعدة؟</span><h2 className="mt-1 font-display text-xl text-[#4a2d33]">تواصل معانا</h2><span className="mt-2 inline-block text-xs font-bold text-[#a64257]">طرق التواصل ←</span></Link>
        </div>
      </section>
    </main>
  )
}
