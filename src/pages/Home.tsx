import { useEffect } from "react"
import { Link } from "react-router-dom"
import { InviteThumb } from "../components/InviteThumb"
import { activeTemplates, faqs } from "../data"
import { draftFor } from "../data"
import { clearDraft, readLast } from "../lib/storage"

export function Home() {
  const last = readLast()

  useEffect(() => {
    document.title = "دعوتنا — دعوات أفراح رقمية"
  }, [])

  return (
    <main id="main" className="da3-home overflow-hidden bg-[#fffdfa] text-[#38252b]">
      <section className="relative isolate overflow-hidden bg-[radial-gradient(ellipse_at_8%_12%,#f7e6e9_0%,transparent_36%),radial-gradient(ellipse_at_92%_75%,#f5eee5_0%,transparent_34%),linear-gradient(135deg,#fffaf8_0%,#fff7f6_52%,#fffdfa_100%)]">
        <div aria-hidden="true" className="pointer-events-none absolute -left-32 top-10 h-80 w-80 rounded-full border border-[#d8aeb6]/30" />
        <div aria-hidden="true" className="pointer-events-none absolute -right-28 -bottom-36 h-[28rem] w-[28rem] rounded-full border border-[#d8aeb6]/25" />
        <div className="relative mx-auto grid max-w-6xl items-center gap-8 px-4 pb-12 pt-10 sm:gap-12 sm:pb-20 sm:pt-16 md:grid-cols-[1.02fr_.98fr] md:gap-14 md:py-24">
          <div className="order-2 text-center md:order-1 md:text-right">
            <p className="inline-flex items-center gap-2 text-[10px] font-bold tracking-[.12em] text-[#a65a69] sm:text-xs">✦ صُنعت في مصر · لقصص الحب ✦</p>
            <h1 className="mx-auto mt-4 max-w-2xl font-display text-[2.65rem] leading-[1.28] text-[#422b32] sm:mt-5 sm:text-6xl md:mx-0 md:text-[4.2rem]">
              دعوات بجمال حلو
              <span className="block text-[#a94e62]">قد قصة حبكم.</span>
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-8 text-[#806b70] sm:mt-6 sm:text-base sm:leading-9 md:mx-0">
              ابعت لكل ضيف دعوة خاصة بيه — بيفتحها باسمه، تتشارك على واتساب، فيها مكان الفرح وزر تأكيد الحضور. وخلي تفاصيل يومكم أقرب لكل اللي بتحبوهم.
            </p>
            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row md:justify-start">
              <Link to="/templates" className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#a94e62] px-8 text-sm font-bold text-white shadow-[0_12px_30px_rgba(169,78,98,.22)] transition hover:-translate-y-0.5 hover:bg-[#913e52]">اعمل دعوتك <span className="mr-3">←</span></Link>
              <Link to="/preview/estate" className="inline-flex min-h-12 items-center justify-center rounded-full border border-[#dfc6c9] bg-white/75 px-8 text-sm font-bold text-[#65434b] transition hover:border-[#b87986] hover:bg-white">شوف نموذج الدعوة</Link>
            </div>
            {last ? <Link to={`/done/${last.code}`} className="mt-4 inline-block text-xs font-bold text-[#a64257] underline underline-offset-4">الرجوع لآخر دعوة محفوظة</Link> : null}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-3 text-[11px] font-semibold text-[#806b70] sm:mt-10 sm:text-xs md:justify-start">
              <span>✓ من غير أبليكيشن</span><span>✓ ضيوفك مش محتاجين حساب</span><span>✓ متظبطة على الواتساب</span><span>✓ الدفع بالجنيه المصري</span>
            </div>
          </div>

          <div className="relative order-1 mx-auto flex min-h-[340px] w-full max-w-[430px] items-center justify-center sm:min-h-[500px] md:order-2 md:min-h-[570px]">
            <div aria-hidden="true" className="absolute h-[270px] w-[270px] rounded-full bg-[radial-gradient(circle,#f1d9de_0%,rgba(241,217,222,.45)_55%,transparent_76%)] sm:h-[430px] sm:w-[430px]" />
            <div className="relative z-10 w-[min(220px,62vw)] rotate-[1deg] rounded-[2rem] border-[7px] border-[#30282a] bg-[#30282a] p-1.5 shadow-[0_35px_80px_rgba(74,45,51,.22)] sm:w-[min(290px,70vw)]">
              <div className="overflow-hidden rounded-[1.45rem] bg-[#fffaf7]">
                <div className="flex items-center justify-between bg-white px-4 py-2 text-[9px] text-[#806b70]"><span>9:41</span><span>●●● ◖</span></div>
                <div className="relative p-3 sm:p-4">
                  <div className="absolute inset-3 rounded-[1.2rem] border border-[#d9bd91]/60" />
                  <div className="relative flex min-h-[255px] flex-col items-center justify-center bg-[radial-gradient(ellipse_at_50%_35%,#f9e8e9_0%,#fffaf6_70%)] px-3 py-6 text-center sm:min-h-[340px]">
                    <span className="text-[9px] font-semibold tracking-[.18em] text-[#b17b6a]">إلى الغالي</span>
                    <p className="mt-2 font-display text-xl text-[#6a3c49] sm:text-2xl">خالد</p>
                    <p className="mt-4 text-[9px] text-[#94757b]">يسعدنا دعوتك للاحتفال بزفاف</p>
                    <p className="mt-3 font-display text-3xl leading-tight text-[#87475a] sm:text-4xl">صالح <span className="text-[#bd9a68]">&</span> ندى</p>
                    <div className="my-4 h-px w-16 bg-[#d7b989]" />
                    <p className="text-[9px] text-[#94757b]">الخميس · 15 أكتوبر 2026</p>
                    <p className="mt-2 text-[10px] font-bold text-[#6a3c49]">قصر رويال ماكسيم</p>
                    <p className="mt-1 text-[8px] text-[#94757b]">القاهرة الجديدة</p>
                    <span className="mt-5 rounded-full bg-[#a94e62] px-5 py-2 text-[9px] font-bold text-white">أكّد حضورك</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute -left-1 top-[17%] z-20 rounded-2xl border border-[#f0dce1] bg-white/95 px-3 py-2.5 shadow-[0_12px_35px_rgba(74,45,51,.09)] sm:-left-2 sm:px-4">
              <p className="text-[9px] font-bold text-[#a94e62] sm:text-[10px]">ليلى فتحت الدعوة</p><p className="mt-1 text-[8px] text-[#9b8589]">من ثانيتين</p>
            </div>
            <div className="absolute -right-1 bottom-[15%] z-20 rounded-2xl border border-[#f0dce1] bg-white/95 px-3 py-2.5 shadow-[0_12px_35px_rgba(74,45,51,.09)] sm:-right-3 sm:px-4">
              <p className="text-[8px] text-[#9b8589]">عدد المؤكدين</p><p className="mt-0.5 font-display text-2xl text-[#a94e62]">12 <span className="font-sans text-[9px] text-[#54816a]">+3 النهارده</span></p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-[#f0e3e3] bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-8 gap-y-3 px-4 py-5 text-[10px] font-semibold text-[#8a7479] sm:gap-x-12 sm:py-6 sm:text-xs">
          <span>مصممة للأفراح المصرية</span><span>القاهرة والإسكندرية</span><span>الساحل الشمالي</span><span>عربي وإنجليزي</span><span>مشاركة سهلة على واتساب</span>
        </div>
      </section>

      <section id="how-it-works" className="mx-auto max-w-6xl px-4 py-16 sm:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-[10px] font-bold tracking-[.16em] text-[#b36a78] sm:text-xs">إزاي بتشتغل</p>
          <h2 className="mt-3 font-display text-3xl text-[#422b32] sm:text-5xl">تلات خطوات بسيطة، من الفكرة لحد ليلة العمر.</h2>
        </div>
        <div className="mt-10 grid gap-4 sm:mt-14 sm:grid-cols-3 sm:gap-6">
          {[
            ["01", "صمم دعوتك", "ارفع صورتكم، اكتب التاريخ والمكان، وضيف كلمتين من القلب. وشوف الدعوة بتتركب قدامك في المعاينة."],
            ["02", "ابعت لكل ضيف لينك خاص", "كل ضيف بيفتح دعوة بترحب بيه باسمه. اتشارك على واتساب بضغطة واحدة — من غير أبليكيشن."],
            ["03", "تابع مين جاي", "شوف اللي فاتح الدعوة واللي رد لحظة بلحظة. وعدد المؤكدين بيزيد كل ما حد يقول حاضر."],
          ].map(([number,title,description]) => (
            <article key={number} className="border-t border-[#dfc5c9] px-1 pb-3 pt-5 sm:pt-6">
              <p className="font-latin text-4xl text-[#bd8792]">{number}</p>
              <h3 className="mt-4 text-base font-extrabold text-[#493139] sm:text-lg">{title}</h3>
              <p className="mt-3 text-xs leading-8 text-[#806b70] sm:text-sm">{description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-[#faf3f1] py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div><p className="text-[10px] font-bold tracking-[.16em] text-[#b36a78] sm:text-xs">اختار اللي يشبهكم</p><h2 className="mt-3 font-display text-3xl text-[#422b32] sm:text-5xl">دعوات معمولة للحظاتكم.</h2></div>
            <Link to="/templates" className="text-xs font-bold text-[#a64257] sm:text-sm">شوف كل التصميمات ←</Link>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-4 sm:mt-12 sm:grid-cols-4 sm:gap-6">
            {activeTemplates.slice(0,4).map((template) => (
              <Link key={template.id} to={`/preview/${template.id}`} className="group min-w-0">
                <div className="overflow-hidden rounded-[1.4rem] border border-[#eadcda] bg-white p-2 shadow-[0_12px_35px_rgba(74,45,51,.045)] transition duration-300 group-hover:-translate-y-1 group-hover:shadow-[0_18px_40px_rgba(74,45,51,.1)] sm:rounded-[1.8rem] sm:p-3">
                  <div className="overflow-hidden rounded-xl"><InviteThumb draft={draftFor(template)} /></div>
                </div>
                <h3 className="mt-3 truncate text-xs font-extrabold text-[#493139] sm:text-sm">{template.name}</h3>
                <p className="mt-1 line-clamp-2 text-[10px] leading-5 text-[#8b777b] sm:text-xs">{template.blurb}</p>
                <span className="mt-2 inline-flex text-[10px] font-bold text-[#a64257] sm:text-xs">معاينة الدعوة ←</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section id="features" className="mx-auto max-w-6xl px-4 py-16 sm:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-[10px] font-bold tracking-[.16em] text-[#b36a78] sm:text-xs">المميزات</p>
          <h2 className="mt-3 font-display text-3xl text-[#422b32] sm:text-5xl">مصنوعة بالطريقة اللي فرحكم يستاهلها.</h2>
        </div>
        <div className="mt-10 grid gap-5 sm:mt-14 sm:grid-cols-2 sm:gap-8">
          <article className="rounded-[1.7rem] bg-[#faf3f1] p-6 sm:p-8">
            <div className="mb-7 flex min-h-40 items-center justify-center rounded-2xl border border-[#eadcda] bg-white p-5">
              <div className="w-40 rounded-xl border border-[#e9d8d7] bg-[#fffaf7] p-4 text-center shadow-sm">
                <p className="text-[9px] text-[#a67a7e]">أنت مدعو</p><p className="mt-2 font-display text-2xl text-[#87475a]">صالح & ندى</p><p className="mt-2 text-[9px] text-[#9a7c80]">إلى خالد</p><p className="mt-3 border-t border-[#eadcda] pt-3 text-[9px] text-[#9a7c80]">اضغط لفتح الدعوة</p>
              </div>
            </div>
            <p className="text-[10px] font-bold text-[#b36a78]">01 · دعوة لكل ضيف</p><h3 className="mt-2 text-lg font-extrabold text-[#493139]">متخصصة لكل ضيف.</h3><p className="mt-2 text-xs leading-8 text-[#806b70] sm:text-sm">دعوة خاصة، لكل ضيف لوحده. رحّب بضيوفك بطريقة شخصية وخلي مشاركة الدعوة سهلة من أول رسالة.</p>
          </article>
          <article className="rounded-[1.7rem] bg-[#faf3f1] p-6 sm:p-8">
            <div className="mb-7 flex min-h-40 items-center justify-center rounded-2xl border border-[#eadcda] bg-white p-5">
              <div className="w-full max-w-xs rounded-xl border border-[#eee0df] bg-white p-4 shadow-sm">
                <div className="flex items-center justify-between text-[9px] text-[#9a7c80]"><span>قائمة الضيوف</span><span>متابعة الردود</span></div>
                <div className="mt-4 grid grid-cols-3 gap-2 text-center">{[["120","الإجمالي"],["68","حاضرين"],["43","انتظار"]].map(([v,l])=><div key={l} className="rounded-lg bg-[#faf3f1] p-2"><p className="font-display text-xl text-[#a94e62]">{v}</p><p className="text-[8px] text-[#9a7c80]">{l}</p></div>)}</div>
                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#f2e6e5]"><div className="h-full w-[57%] rounded-full bg-[#b66d7c]" /></div>
                <p className="mt-2 text-[8px] text-[#9a7c80]">مثال توضيحي لشكل متابعة الردود</p>
              </div>
            </div>
            <p className="text-[10px] font-bold text-[#b36a78]">02 · متابعة الردود</p><h3 className="mt-2 text-lg font-extrabold text-[#493139]">تابع الردود لحظة بلحظة.</h3><p className="mt-2 text-xs leading-8 text-[#806b70] sm:text-sm">تابع مين أكد حضوره ومين لسه مستني، واعرف عدد الضيوف اللي هيشاركوك فرحتك.</p>
          </article>
          <article className="rounded-[1.7rem] bg-[#faf3f1] p-6 sm:p-8">
            <div className="mb-7 flex min-h-40 items-center justify-center rounded-2xl border border-[#eadcda] bg-white p-5">
              <div className="w-full max-w-xs rounded-xl border border-[#eee0df] bg-[#fffaf7] p-4 text-center">
                <span className="text-2xl text-[#b36a78]">⌖</span><p className="mt-2 text-xs font-extrabold text-[#493139]">مكان الاحتفال</p><p className="mt-1 text-[9px] text-[#9a7c80]">العنوان والاتجاهات في دعوتك</p><span className="mt-3 inline-flex rounded-full border border-[#e5cfd0] px-4 py-2 text-[9px] font-bold text-[#a94e62]">افتح المكان على الخريطة</span>
              </div>
            </div>
            <p className="text-[10px] font-bold text-[#b36a78]">03 · المكان والاتجاهات</p><h3 className="mt-2 text-lg font-extrabold text-[#493139]">مكان الفرح على بُعد ضغطة.</h3><p className="mt-2 text-xs leading-8 text-[#806b70] sm:text-sm">ضيف مكان الاحتفال في الدعوة، وخلي الوصول ليه أسهل على كل ضيوفك.</p>
          </article>
          <article className="rounded-[1.7rem] bg-[#faf3f1] p-6 sm:p-8">
            <div className="mb-7 flex min-h-40 items-center justify-center rounded-2xl border border-[#eadcda] bg-white p-5">
              <div className="w-full max-w-xs rounded-xl border border-[#eee0df] bg-[#fffaf7] p-4 text-center">
                <span className="text-3xl text-[#b36a78]">♫</span><p className="mt-2 text-xs font-extrabold text-[#493139]">موسيقى خلفية</p><p className="mt-1 text-[9px] text-[#9a7c80]">اختار المقطع اللي يعبّر عنكم</p><div className="mx-auto mt-4 h-1 w-4/5 rounded-full bg-[#eadcda]"><div className="h-full w-1/3 rounded-full bg-[#b66d7c]" /></div><p className="mt-3 text-[9px] text-[#9a7c80]">تشغيل وإيقاف الموسيقى</p>
              </div>
            </div>
            <p className="text-[10px] font-bold text-[#b36a78]">04 · موسيقى خلفية</p><h3 className="mt-2 text-lg font-extrabold text-[#493139]">خلي للمناسبة صوتها.</h3><p className="mt-2 text-xs leading-8 text-[#806b70] sm:text-sm">اختار موسيقى تناسب أجواء فرحكم، وخلي ضيوفك يعيشوا تفاصيل الدعوة بطريقتكم.</p>
          </article>
        </div>
      </section>

      <section className="bg-[#faf3f1] py-16 sm:py-20">
        <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 md:grid-cols-[1fr_auto]">
          <div><p className="text-[10px] font-bold tracking-[.16em] text-[#b36a78] sm:text-xs">جاهزين نبدأ؟</p><h2 className="mt-3 font-display text-3xl text-[#422b32] sm:text-5xl">خلي دعوتكم بداية حكاية حلوة.</h2><p className="mt-3 max-w-2xl text-xs leading-8 text-[#806b70] sm:text-sm">صمّم دعوتك وشوف المعاينة براحتك. اختار التصميم اللي يشبهكم وابدأ تجهيز تفاصيل يومكم.</p></div>
          <Link to="/templates" className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#a94e62] px-8 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#913e52]">اعمل دعوتك ←</Link>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-16 sm:py-24">
        <div className="text-center"><p className="text-[10px] font-bold tracking-[.16em] text-[#b36a78] sm:text-xs">محتاج تعرف أكتر؟</p><h2 className="mt-3 font-display text-3xl text-[#422b32] sm:text-5xl">أسئلة بتتكرر.</h2><p className="mt-3 text-xs leading-7 text-[#806b70] sm:text-sm">إجابات سريعة عن تصميم الدعوات والتعديل والدفع والمشاركة.</p></div>
        <div className="mt-8 grid gap-3 sm:mt-10">
          {faqs.slice(0,6).map((item,index) => (
            <details key={item.q} className="group border-b border-[#eadcda] py-2">
              <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-4 text-right text-xs font-bold text-[#493139] [&::-webkit-details-marker]:hidden sm:text-sm"><span>{item.q}</span><span className="text-lg text-[#b36a78] transition group-open:rotate-45">＋</span></summary>
              <p className="pb-4 pt-1 text-[11px] leading-7 text-[#806b70] sm:text-sm sm:leading-8">{item.a}</p>
            </details>
          ))}
        </div>
        <div className="mt-7 text-center"><Link to="/faq" className="text-xs font-bold text-[#a64257] underline underline-offset-4">كل الأسئلة الشائعة ←</Link></div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-10 sm:pb-16">
        <div className="grid gap-5 overflow-hidden rounded-[1.8rem] border border-[#e9d4d5] bg-[linear-gradient(125deg,#fff7f5_0%,#fff 55%,#f8efeb_100%)] p-6 sm:rounded-[2.2rem] sm:p-10 md:grid-cols-[1fr_auto] md:items-center md:gap-10">
          <div><p className="text-[10px] font-bold tracking-[.16em] text-[#b36a78] sm:text-xs">DA3WETNA PARTNERS</p><h2 className="mt-3 font-display text-2xl text-[#422b32] sm:text-4xl">بتشتغل في مجال الأفراح؟ خلّينا نكبر سوا.</h2><p className="mt-3 max-w-2xl text-xs leading-8 text-[#806b70] sm:text-sm">لو أنت مصور، Wedding Planner، أو مسؤول في قاعة أفراح، رشّح الدعوات الرقمية لعملائك وخلي تفاصيل فرحتهم أسهل وأجمل.</p><div className="mt-4 flex flex-wrap gap-2 text-[10px] font-bold text-[#806b70] sm:text-xs"><span className="rounded-full border border-[#eadcda] bg-white px-3 py-2">للمصورين</span><span className="rounded-full border border-[#eadcda] bg-white px-3 py-2">لقاعات الأفراح</span><span className="rounded-full border border-[#eadcda] bg-white px-3 py-2">لمنظمي المناسبات</span></div></div>
          <Link to="/partners" className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#a94e62] px-7 text-sm font-bold text-white transition hover:bg-[#913e52]">اعرف تفاصيل الشراكة ←</Link>
        </div>
      </section>
    </main>
  )
}
