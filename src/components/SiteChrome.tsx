import { Suspense, useEffect, useState } from "react"
import { Link, NavLink, Outlet, useLocation } from "react-router-dom"
import { site } from "../config"
import { LogoMark, WhatsAppIcon } from "./Icons"
import { faqs } from "../data"

// Header invitation CTA intentionally removed; navigation stays focused on the main pages.
const links = [
  { href: "/templates", label: "الدعوات" },
  { href: "/how", label: "طريقة الاستخدام" },
  { href: "/packages", label: "الباقات" },
  { href: "/faq", label: "الأسئلة الشائعة" },
  { href: "/partners", label: "شراكات" },
]

export function SiteChrome() {
  const { pathname } = useLocation()
  const showAtmosphere = !/^\/(editor|checkout|done)(\/|$)/.test(pathname)

  return (
    <>
      {showAtmosphere ? <RomanticAtmosphere /> : null}
      <a className="skip" href="#main">تخطي إلى المحتوى</a>
      <Header />
      <Suspense fallback={<main className="min-h-[70dvh]" aria-busy="true" />}>
        <Outlet />
      </Suspense>
      <Footer />
      <HelpButton />
      <BottomNavigation />
    </>
  )
}


function RomanticAtmosphere() {
  return (
    <div className="da3-atmosphere" aria-hidden="true">
      <span className="da3-floating-petal">✿</span>
      <span className="da3-floating-petal">♡</span>
      <span className="da3-floating-petal">✧</span>
      <span className="da3-floating-petal">❀</span>
      <span className="da3-floating-petal">♡</span>
      <span className="da3-floating-petal">✿</span>
    </div>
  )
}

function Header() {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()
  useEffect(() => setOpen(false), [pathname])

  return (
    <header className="da3-site-header sticky top-0 z-40 border-b border-[#f0dce1]/80 bg-[#fffdfa]/95 shadow-[0_4px_22px_rgba(74,45,51,0.035)] backdrop-blur-xl">
      <div className="mx-auto flex h-[70px] max-w-6xl items-center justify-between gap-3 px-4 sm:h-[76px]">
        <Link to="/" className="group flex shrink-0 items-center gap-2.5" aria-label="دعوتنا، الصفحة الرئيسية">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#fff0f2] text-[#b83b50] ring-1 ring-[#f3dfe3] transition duration-300 group-hover:-rotate-3 group-hover:scale-105">
            <LogoMark className="h-6 w-6 sm:h-8 sm:w-8" />
          </span>
          <span className="grid leading-none">
            <span className="font-display text-[1.8rem] text-[#4a2d33]">دعوتنا</span>
            <span className="mt-0.5 font-latin text-[0.48rem] tracking-[0.2em] sm:mt-1 sm:text-[0.62rem] sm:tracking-[0.3em] text-[#a45b69]">{site.nameEn}</span>
          </span>
        </Link>
        <nav className="hidden items-center gap-1 rounded-full border border-[#f0dce1] bg-white/80 p-1 md:flex" aria-label="التنقل">
          {links.map((link) =>
            link.href.startsWith("/#") ? (
              <a key={link.href} href={link.href} className="rounded-full px-4 py-2 text-sm font-semibold text-[#806b70] transition hover:bg-[#fff0f2] hover:text-[#a64257]">
                {link.label}
              </a>
            ) : (
              <NavLink
                key={link.href}
                to={link.href}
                className={({ isActive }) =>
                  `rounded-full px-4 py-2 text-sm font-semibold transition ${isActive ? "bg-[#fff0f2] text-[#a64257]" : "text-[#806b70] hover:bg-[#fff8f8]"}`
                }
              >
                {link.label}
              </NavLink>
            ),
          )}
        </nav>
        <div className="flex items-center gap-2">
          <a href={`https://wa.me/${site.whatsapp}?text=${encodeURIComponent("السلام عليكم، محتاج مساعدة من دعوتنا")}`} target="_blank" rel="noreferrer" className="hidden h-10 items-center gap-2 rounded-full border border-[#d8eadf] bg-[#f2faf5] px-4 text-sm font-bold text-[#247747] transition hover:-translate-y-0.5 hover:bg-[#e9f7ee] lg:inline-flex">
            <WhatsAppIcon className="h-4 w-4" /> واتساب
          </a>
          <button
            type="button"
            className="inline-flex h-10 cursor-pointer items-center gap-1.5 rounded-full border border-[#f0dce1] bg-white px-3 text-xs font-bold text-[#65434b] shadow-sm transition hover:border-[#d9aab5] hover:bg-[#fff8f8] md:hidden"
            aria-expanded={open}
            aria-label={open ? "إغلاق القائمة" : "فتح القائمة"}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? "إغلاق ✕" : "☰"}
          </button>
        </div>
      </div>
      {open ? (
        <nav className="grid gap-1 border-t border-[#f0dce1] bg-[#fffdfa] px-4 py-3 shadow-[0_14px_24px_rgba(74,45,51,0.06)] md:hidden" aria-label="قائمة الموبايل">
          {links.map((link) =>
            link.href.startsWith("/#") ? (
              <a key={link.href} href={link.href} className="rounded-xl px-3 py-3 font-semibold text-[#65434b] transition hover:bg-[#fff5f6] hover:text-[#a64257]" onClick={() => setOpen(false)}>
                {link.label}
              </a>
            ) : (
              <Link key={link.href} to={link.href} className="rounded-xl px-3 py-3 font-semibold text-[#65434b] hover:bg-[#fff5f6]">
                {link.label}
              </Link>
            ),
          )}
          <a href={`https://wa.me/${site.whatsapp}?text=${encodeURIComponent("السلام عليكم، محتاج مساعدة من دعوتنا")}`} target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-[#eaf7ee] px-4 py-3 font-bold text-[#247747]">
            <WhatsAppIcon className="h-5 w-5" /> تواصل واتساب
          </a>
        </nav>
      ) : null}
    </header>
  )
}

function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-[#efd9df] bg-[linear-gradient(180deg,#fff8f8_0%,#fffdfb_100%)]">
      <div className="pointer-events-none absolute -left-24 -top-28 h-72 w-72 rounded-full bg-[#f8e4e8]/60 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-64 w-64 rounded-full bg-[#f4e8d5]/45 blur-3xl" />

      <div className="relative mx-auto max-w-6xl px-4 pb-5 pt-7 sm:pb-7 sm:pt-16">
        <div className="grid grid-cols-2 gap-2.5 border-b border-[#efdde1] pb-4 sm:grid-cols-2 sm:gap-9 sm:pb-10 lg:grid-cols-[1.35fr_0.8fr_1.25fr_0.8fr] lg:gap-8">
          <div>
            <Link to="/" className="inline-flex items-center gap-2 sm:gap-3" aria-label="دعوتنا، الصفحة الرئيسية">
              <span className="grid h-9 w-9 place-items-center rounded-xl sm:h-12 sm:w-12 sm:rounded-2xl bg-[#fff0f2] text-[#b83b50] ring-1 ring-[#f2dce1]">
                <LogoMark className="h-8 w-8" />
              </span>
              <span className="grid leading-none">
                <span className="font-display text-xl text-[#4a2d33] sm:text-3xl">دعوتنا</span>
                <span className="mt-1 font-latin text-[0.62rem] tracking-[0.3em] text-[#a45b69]">{site.nameEn}</span>
              </span>
            </Link>
            <p className="mt-2 max-w-xs text-[11px] leading-5 text-[#806b70] sm:mt-4 sm:text-sm sm:leading-7">
              كل فرحة وليها دعوة حلوة. صمّم دعوتك أونلاين بسهولة وشارك لحظتك مع كل اللي بتحبهم.
            </p>
          </div>

          <div className="grid content-start gap-1.5 rounded-2xl border border-[#f2e2e5] bg-white/65 p-3 text-[11px] sm:gap-3 sm:rounded-none sm:border-0 sm:bg-transparent sm:p-0 sm:text-sm">
            <p className="mb-1 flex items-center gap-1.5 font-bold text-[11px] text-[#4a2d33] sm:mb-1 sm:text-sm"><span className="h-1.5 w-1.5 rounded-full bg-[#c66d7d]" />روابط سريعة</p>
            <Link className="text-[11px] leading-4 text-[#806b70] transition hover:translate-x-[-2px] hover:text-[#a64257] sm:text-sm sm:leading-normal" to="/templates">كل الدعوات</Link>
            <Link className="text-[11px] leading-4 text-[#806b70] transition hover:translate-x-[-2px] hover:text-[#a64257] sm:text-sm sm:leading-normal" to="/how">طريقة الاستخدام</Link>
            <Link className="text-[11px] leading-5 text-[#806b70] transition hover:translate-x-[-2px] hover:text-[#a64257] sm:text-sm sm:leading-normal" to="/packages">الباقات</Link>
            <Link className="text-[#806b70] transition hover:translate-x-[-2px] hover:text-[#a64257]" to="/faq">الأسئلة الشائعة</Link>
            <Link className="text-[#806b70] transition hover:translate-x-[-2px] hover:text-[#a64257]" to="/partners">شراكات دعوتنا</Link>
            <Link className="text-[#806b70] transition hover:translate-x-[-2px] hover:text-[#a64257]" to="/privacy">سياسة الخصوصية</Link>
          </div>

          <div className="grid content-start gap-1.5 rounded-2xl border border-[#f2e2e5] bg-white/65 p-3 text-[11px] sm:gap-3 sm:rounded-none sm:border-0 sm:bg-transparent sm:p-0 sm:text-sm">
            <p className="mb-1 flex items-center gap-1.5 font-bold text-[11px] text-[#4a2d33] sm:mb-1 sm:text-sm"><span className="h-1.5 w-1.5 rounded-full bg-[#c66d7d]" />دعوات لكل مناسبة</p>
            <div className="grid grid-cols-2 gap-x-1.5 gap-y-1 sm:gap-x-4 sm:gap-y-3">
              <Link className="text-[11px] leading-5 text-[#806b70] transition hover:text-[#a64257] sm:text-sm sm:leading-normal" to="/دعوة-زفاف-الإلكترونية">دعوة زفاف إلكترونية</Link>
              <Link className="text-[11px] leading-5 text-[#806b70] transition hover:text-[#a64257] sm:text-sm sm:leading-normal" to="/دعوة-فرح">دعوة فرح</Link>
              <Link className="text-[#806b70] transition hover:text-[#a64257]" to="/دعوة-خطوبة">دعوة خطوبة</Link>
              <Link className="text-[#806b70] transition hover:text-[#a64257]" to="/دعوات-الكترونية">دعوات إلكترونية</Link>
              <Link className="text-[#806b70] transition hover:text-[#a64257]" to="/كروت-افراح">كروت أفراح</Link>
              <Link className="text-[#806b70] transition hover:text-[#a64257]" to="/صيغ-دعوة-زفاف">صيغ دعوة زفاف</Link>
            </div>
          </div>

          <div className="grid content-start gap-1.5 rounded-2xl border border-[#f2e2e5] bg-white/65 p-3 text-sm sm:gap-3 sm:rounded-none sm:border-0 sm:bg-transparent sm:p-0">
            <p className="mb-1 flex items-center gap-1.5 text-[11px] font-bold text-[#4a2d33] sm:mb-1 sm:text-sm"><span className="h-1.5 w-1.5 rounded-full bg-[#c66d7d]" />طرق الدفع</p>
            <p className="text-[11px] leading-4 text-[#806b70] sm:text-sm">فودافون كاش</p>
            <p className="text-[11px] text-[#806b70] sm:text-sm">إنستاباي</p>
            <p className="text-[11px] leading-4 text-[#a18a8f] sm:text-sm">الدفع بالبطاقة قريبًا</p>
            <p className="mt-0 text-[11px] leading-3.5 text-[#a18a8f] sm:mt-2 sm:text-xs sm:leading-6">تواصل معانا لو محتاج مساعدة في اختيار دعوتك.</p>
            <a href={`https://wa.me/${site.whatsapp}?text=${encodeURIComponent("السلام عليكم، عندي استفسار عن دعوتنا")}`} target="_blank" rel="noreferrer" dir="ltr" className="mt-0.5 inline-flex min-h-7 w-fit items-center gap-1 rounded-full border border-[#d8eadf] bg-[#f2faf5] px-2 py-1 text-[11px] font-semibold text-[#247747] transition hover:bg-[#e9f7ee] sm:gap-2 sm:px-3 sm:py-2 sm:text-sm">
              <WhatsAppIcon className="h-4 w-4" /> 01276390301
            </a>
            <a href={"mailto:" + site.email} dir="ltr" className="mt-1 inline-flex min-h-7 w-fit items-center gap-1 rounded-full border border-[#f0dce1] bg-white px-2 py-1 text-[11px] font-semibold text-[#806b70] transition hover:border-[#d9aab5] hover:text-[#a64257] sm:gap-2 sm:px-3 sm:py-2 sm:text-sm">
              {site.email}
            </a>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-1.5 pt-3 text-center text-[11px] text-[#9a8187] sm:flex-row sm:gap-3 sm:pt-5 sm:text-xs sm:text-right">
          <p>© {new Date().getFullYear()} دعوتنا — كل الحقوق محفوظة</p>
          <p>اتعمل بكل حب عشان لحظاتكم الحلوة <span className="text-[#b83b50]">♥</span></p>
        </div>
      </div>
    </footer>
  )
}

function HelpButton() {
  const { pathname } = useLocation()
  if (pathname.startsWith("/editor") || pathname.startsWith("/checkout")) return null
  const href = `https://wa.me/${site.whatsapp}?text=${encodeURIComponent("السلام عليكم، عايز أسأل عن دعوات دعوتنا")}`
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label="تواصل معنا عبر واتساب"
      title="تواصل معنا عبر واتساب"
      className="fixed bottom-24 right-4 z-40 inline-flex h-12 w-12 items-center justify-center rounded-full border-[3px] border-white bg-[#20b85a] text-white shadow-[0_6px_24px_rgba(22,163,74,0.35)] transition hover:-translate-y-1 hover:scale-105 active:scale-95 md:bottom-6 md:left-6 md:right-auto md:h-14 md:w-auto md:gap-2 md:rounded-full md:px-4"
    >
      <WhatsAppIcon className="h-6 w-6 md:h-5 md:w-5" />
      <span className="hidden text-sm font-bold md:inline">كلمنا واتساب</span>
    </a>
  )
}


function BottomNavigation() {
  const [supportOpen, setSupportOpen] = useState(false)
  const { pathname } = useLocation()
  const hidden = pathname.startsWith("/editor") || pathname.startsWith("/checkout") || pathname.startsWith("/i/")
  useEffect(() => setSupportOpen(false), [pathname])
  if (hidden) return null

  const itemClass = "flex min-w-0 min-h-[52px] flex-1 flex-col items-center justify-center gap-1 rounded-xl px-1 py-1 text-[11px] font-bold leading-tight transition active:scale-95"
  const activeClass = "bg-[#fff0f2] text-[#a64257]"
  const idleClass = "text-[#90777d] hover:bg-[#fff8f8]"

  return (
    <>
      <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-[#f0dce1] bg-[#fffdfa]/95 px-2 pb-[max(env(safe-area-inset-bottom),5px)] pt-1.5 shadow-[0_-5px_20px_rgba(74,45,51,0.07)] backdrop-blur-2xl md:hidden" aria-label="التنقل الرئيسي">
        <div className="mx-auto flex max-w-lg items-center gap-1">
          <NavLink to="/" end className={({ isActive }) => `${itemClass} ${isActive ? activeClass : idleClass}`}>
            <BottomIcon type="home" /><span>الرئيسية</span>
          </NavLink>
          <NavLink to="/templates" className={({ isActive }) => `${itemClass} ${isActive ? activeClass : idleClass}`}>
            <BottomIcon type="invite" /><span>الدعوات</span>
          </NavLink>
          <NavLink to="/packages" className={({ isActive }) => `${itemClass} ${isActive ? activeClass : idleClass}`}>
            <BottomIcon type="package" /><span>الباقات</span>
          </NavLink>
          <NavLink to="/account" className={({ isActive }) => `${itemClass} ${isActive ? activeClass : idleClass}`}>
            <BottomIcon type="account" /><span>حسابي</span>
          </NavLink>
          <button type="button" onClick={() => setSupportOpen(true)} className={`${itemClass} ${supportOpen ? activeClass : idleClass}`}>
            <BottomIcon type="help" /><span>مساعدة</span>
          </button>
        </div>
      </nav>
      {supportOpen ? (
        <div className="fixed inset-0 z-[70] flex items-end justify-center bg-[#342027]/35 p-0 backdrop-blur-[3px] md:items-center md:p-4" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setSupportOpen(false) }}>
          <section role="dialog" aria-modal="true" aria-labelledby="support-title" className="w-full max-w-xl overflow-hidden rounded-t-[28px] border border-[#f0dce1] bg-[#fffdfa] shadow-[0_-15px_60px_rgba(53,33,38,0.18)] md:rounded-[28px]">
            <div className="mx-auto mt-3 h-1.5 w-12 rounded-full bg-[#ead3d9] md:hidden" />
            <div className="flex items-center justify-between border-b border-[#f4e5e8] px-5 py-4 sm:px-6">
              <div><p className="text-xs font-bold tracking-wider text-[#b36a78]">DA3WETNA SUPPORT</p><h2 id="support-title" className="mt-1 font-display text-2xl text-[#4a2d33]">محتاج مساعدة؟</h2></div>
              <button type="button" onClick={() => setSupportOpen(false)} aria-label="إغلاق الدعم" className="grid h-10 w-10 place-items-center rounded-full bg-[#fff0f2] text-lg text-[#a64257]">×</button>
            </div>
            <div className="max-h-[52vh] space-y-4 overflow-y-auto px-5 py-4 sm:px-6">
              <p className="text-sm leading-7 text-[#806b70]">جمعنالك إجابات سريعة لأشهر الأسئلة. ولو محتاج مساعدة شخصية ابعتلنا على واتساب.</p>
              <div className="grid gap-2">
                {faqs.slice(0, 5).map((item) => <details key={item.q} className="group rounded-2xl border border-[#f0dce1] bg-white"><summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-sm font-bold text-[#4a2d33]"><span>{item.q}</span><span className="text-[#b83b50] transition group-open:rotate-45">＋</span></summary><p className="border-t border-[#f7eaed] px-4 py-3 text-sm leading-7 text-[#806b70]">{item.a}</p></details>)}
              </div>
              <Link to="/faq" onClick={() => setSupportOpen(false)} className="block text-center text-sm font-bold text-[#a64257] underline underline-offset-4">عرض كل الأسئلة الشائعة</Link>
            </div>
            <div className="border-t border-[#f4e5e8] bg-[#fff8f8] p-4 sm:p-5">
              <a href={`https://wa.me/${site.whatsapp}?text=${encodeURIComponent("السلام عليكم، محتاج مساعدة من دعوتنا")}`} target="_blank" rel="noreferrer" className="flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#21864c] px-5 text-sm font-bold text-white transition hover:bg-[#176d3d]"><WhatsAppIcon className="h-5 w-5" /> كلمنا على واتساب</a>
            </div>
          </section>
        </div>
      ) : null}
    </>
  )
}

function BottomIcon({ type }: { type: "home" | "invite" | "package" | "help" | "account" }) {
  const common = "h-[19px] w-[19px]"
  if (type === "home") return <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m3.5 10 8.5-7 8.5 7v9a1.5 1.5 0 0 1-1.5 1.5h-14A1.5 1.5 0 0 1 3.5 19v-9Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/><path d="M9 20.5v-6h6v6" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/></svg>
  if (type === "invite") return <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="4" y="3.5" width="16" height="17" rx="2.5" stroke="currentColor" strokeWidth="1.6"/><path d="M8 8h8M8 12h5M8 16h8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>
  if (type === "package") return <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m12 3 8 4.2v9.6L12 21l-8-4.2V7.2L12 3Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/><path d="m4.5 7.5 7.5 4 7.5-4M12 11.5V21M8 5.2l8 4.1" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/></svg>
  if (type === "help") return <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6"/><path d="M9.6 9a2.5 2.5 0 1 1 4.3 1.8c-1.1 1-1.9 1.2-1.9 2.7M12 17.2v.1" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/></svg>
  return <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="8" r="3.2" stroke="currentColor" strokeWidth="1.6"/><path d="M5 20c.6-3.2 3.1-5 7-5s6.4 1.8 7 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>
}
