import { useEffect } from "react"
import { Link } from "react-router-dom"
import { Invitation } from "../components/Invitation"
import { PhonePreview } from "../components/PhonePreview"
import { packages } from "../config"
import { draftFor, templates } from "../data"
import { money } from "../lib/format"
import { clearDraft, readLast } from "../lib/storage"

export function Home() {
  const last = readLast()

  useEffect(() => {
    document.title = "دعوتنا — دعوات أفراح رقمية"
  }, [])

  return (
    <main id="main" className="overflow-hidden">
      <section className="relative isolate overflow-hidden bg-[radial-gradient(ellipse_at_12%_8%,#f8e5e9_0%,transparent_42%),radial-gradient(ellipse_at_88%_80%,#f5eadb_0%,transparent_38%),linear-gradient(135deg,#fffaf9_0%,#fff4f5_55%,#fffdfa_100%)]">
        <div aria-hidden="true" className="pointer-events-none absolute -right-24 -top-28 h-72 w-72 rounded-full border border-[#d9aab5]/40 sm:h-96 sm:w-96" />
        <div aria-hidden="true" className="pointer-events-none absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-[#f3dce1]/55 blur-3xl" />
        <div className="relative mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16 md:py-24">
          <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/2 h-[min(78vw,560px)] w-[min(78vw,560px)] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#d9aab5]/25" />
          <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/2 h-[min(62vw,430px)] w-[min(62vw,430px)] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#c6a15b]/20" />
          <span aria-hidden="true" className="pointer-events-none absolute right-[8%] top-[12%] text-2xl text-[#c6a15b] sm:right-[16%] sm:top-[18%] sm:text-4xl">✧</span>
          <span aria-hidden="true" className="pointer-events-none absolute bottom-[13%] left-[7%] text-3xl text-[#d18d9b] sm:left-[15%] sm:text-5xl">♡</span>
          <div className="relative mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#ead2d6] bg-white/85 px-3 py-2 text-[11px] font-bold text-[#a64257] shadow-sm sm:px-4 sm:text-sm">✦ تفاصيل تليق بيوم العمر ✦</span>
            <h1 className="mx-auto mt-5 max-w-3xl font-display text-[2.15rem] leading-[1.45] text-[#4a2d33] sm:mt-6 sm:text-5xl sm:leading-[1.35] md:text-6xl">
              لكل فرحة حكاية،
              <span className="block text-[#b64b60]">ولكل حكاية دعوة</span>
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-[13px] leading-8 text-[#806b70] sm:mt-5 sm:text-base sm:leading-9">
              اختاروا تصميم يشبهكم، اكتبوا تفاصيل يومكم، وشوفوا دعوتكم بتتكوّن قدامكم لحظة بلحظة. وبعدها شاركوها مع كل اللي بتحبوهم.
            </p>
            <div className="mx-auto mt-6 flex w-full max-w-md flex-col justify-center gap-3 sm:mt-8 sm:max-w-none sm:flex-row">
              <Link to="/templates" className="btn-gold min-h-12 w-full justify-center px-6 shadow-[0_10px_25px_rgba(166,66,87,.18)] sm:w-auto">ابدأوا تصميم دعوتكم <span className="mr-2">←</span></Link>
              <Link to="/how" className="btn-ghost min-h-12 w-full justify-center border-[#e8cbd1] bg-white/85 px-6 text-[#65434b] sm:w-auto">اعرفوا طريقة الاستخدام</Link>
            </div>
            {last ? <Link to={`/done/${last.code}`} className="mt-4 inline-block text-xs font-bold text-[#a64257] underline underline-offset-4 sm:text-sm">الرجوع لآخر دعوة محفوظة</Link> : null}
            <div className="mt-7 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[11px] font-semibold text-[#806b70] sm:mt-9 sm:gap-x-7 sm:text-sm">
              <span>✓ معاينة مباشرة</span><span>✓ تخصيص سهل</span><span>✓ مشاركة بلينك</span>
            </div>
            <div aria-hidden="true" className="mx-auto mt-8 flex max-w-xs items-center justify-center gap-3 text-[#c6a15b]/70 sm:mt-10">
              <span className="h-px flex-1 bg-gradient-to-l from-transparent to-[#c6a15b]/50" />
              <span className="text-lg">❧</span>
              <span className="h-px flex-1 bg-gradient-to-r from-transparent to-[#c6a15b]/50" />
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-[#f0dce1] bg-white">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-3 px-4 py-5 text-center sm:grid-cols-4 sm:gap-5 sm:py-7">
          {[[String(templates.length), "تصميم متنوع"], ["فوري", "معاينة وتعديل"], ["لينك", "للمشاركة مع الضيوف"], [money(packages[0].price), "تبدأ الأسعار من"]].map(([value,label]) => (
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
          {templates.slice(0,4).map((template) => (
            <Link key={template.id} to={`/editor/${template.id}`} onClick={clearDraft} className="group min-w-0">
              <div className="overflow-hidden rounded-[18px] border border-[#f0dce1] bg-white p-1.5 shadow-[0_7px_22px_rgba(91,48,60,.05)] transition duration-300 group-hover:-translate-y-1 group-hover:shadow-[0_15px_32px_rgba(91,48,60,.11)] sm:rounded-[24px] sm:p-2">
                <PhonePreview className="w-[min(100%,170px)] sm:w-[min(100%,220px)]"><Invitation draft={draftFor(template)} /></PhonePreview>
              </div>
              <h3 className="mt-2 truncate text-xs font-extrabold text-[#4a2d33] sm:text-sm">{template.name}</h3>
              <p className="mt-1 line-clamp-2 text-[10px] leading-5 text-[#806b70] sm:text-xs">{template.blurb}</p>
              <span className="mt-2 inline-flex text-[10px] font-bold text-[#a64257] sm:text-xs">اختار التصميم ←</span>
            </Link>
          ))}
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
