import { useEffect, useState } from "react"
import { Link, NavLink, Outlet, useLocation } from "react-router-dom"
import { site } from "../config"
import { LogoMark, WhatsAppIcon } from "./Icons"

const links = [
  { href: "/templates", label: "الدعوات" },
  { href: "/how", label: "طريقة الاستخدام" },
  { href: "/packages", label: "الباقات" },
  { href: "/faq", label: "الأسئلة الشائعة" },
]

export function SiteChrome() {
  return (
    <>
      <a className="skip" href="#main">تخطي إلى المحتوى</a>
      <Header />
      <Outlet />
      <Footer />
      <HelpButton />
    </>
  )
}

function Header() {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()
  useEffect(() => setOpen(false), [pathname])

  return (
    <header className="sticky top-0 z-40 border-b border-[#f0dce1]/80 bg-[#fffdfa]/95 shadow-[0_4px_22px_rgba(74,45,51,0.035)] backdrop-blur-xl">
      <div className="mx-auto flex h-[70px] max-w-6xl items-center justify-between gap-3 px-4 sm:h-[76px]">
        <Link to="/" className="group flex shrink-0 items-center gap-2.5" aria-label="دعوتنا، الصفحة الرئيسية">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#fff0f2] text-[#b83b50] ring-1 ring-[#f3dfe3] transition duration-300 group-hover:-rotate-3 group-hover:scale-105">
            <LogoMark className="h-8 w-8" />
          </span>
          <span className="grid leading-none">
            <span className="font-display text-[1.8rem] text-[#4a2d33]">دعوتنا</span>
            <span className="mt-1 font-latin text-[0.62rem] tracking-[0.3em] text-[#a45b69]">{site.nameEn}</span>
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
          <Link to="/templates" className="btn-gold hidden h-11 px-5 text-sm sm:inline-flex">اختار دعوتك</Link>
          <button
            type="button"
            className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-full border border-[#f0dce1] bg-white px-4 text-sm font-bold text-[#65434b] shadow-sm transition hover:border-[#d9aab5] hover:bg-[#fff8f8] md:hidden"
            aria-expanded={open}
            aria-label={open ? "إغلاق القائمة" : "فتح القائمة"}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? "إغلاق ✕" : "القائمة ☰"}
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

      <div className="relative mx-auto max-w-6xl px-4 pb-7 pt-12 sm:pt-16">
        <div className="mb-10 flex flex-col gap-6 rounded-[28px] border border-[#f0dce1] bg-white/75 p-6 shadow-[0_12px_40px_rgba(115,65,77,0.05)] sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div className="max-w-xl">
            <p className="mb-2 text-xs font-bold tracking-[0.18em] text-[#b36a78]">YOUR MOMENT, YOUR INVITATION</p>
            <h2 className="font-display text-3xl leading-tight text-[#4a2d33] sm:text-4xl">خلي دعوتك بداية حكاية حلوة</h2>
            <p className="mt-2 text-sm leading-7 text-[#806b70]">اختار التصميم اللي يشبه فرحتك وشارك دعوتك مع كل اللي بتحبهم.</p>
          </div>
          <Link to="/templates" className="btn-gold shrink-0 px-7">اكتشف الدعوات <span className="mr-2" aria-hidden="true">←</span></Link>
        </div>

        <div className="grid gap-9 border-b border-[#efdde1] pb-10 sm:grid-cols-2 lg:grid-cols-[1.35fr_0.8fr_1.25fr_0.8fr] lg:gap-8">
          <div>
            <Link to="/" className="inline-flex items-center gap-3" aria-label="دعوتنا، الصفحة الرئيسية">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#fff0f2] text-[#b83b50] ring-1 ring-[#f2dce1]">
                <LogoMark className="h-8 w-8" />
              </span>
              <span className="grid leading-none">
                <span className="font-display text-3xl text-[#4a2d33]">دعوتنا</span>
                <span className="mt-1 font-latin text-[0.62rem] tracking-[0.3em] text-[#a45b69]">{site.nameEn}</span>
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-7 text-[#806b70]">
              كل فرحة وليها دعوة حلوة. صمّم دعوتك أونلاين بسهولة وشارك لحظتك مع كل اللي بتحبهم.
            </p>
          </div>

          <div className="grid content-start gap-3 text-sm">
            <p className="mb-1 font-bold text-[#4a2d33]">روابط سريعة</p>
            <Link className="text-[#806b70] transition hover:translate-x-[-2px] hover:text-[#a64257]" to="/templates">كل الدعوات</Link>
            <Link className="text-[#806b70] transition hover:translate-x-[-2px] hover:text-[#a64257]" to="/how">طريقة الاستخدام</Link>
            <Link className="text-[#806b70] transition hover:translate-x-[-2px] hover:text-[#a64257]" to="/packages">الباقات والأسعار</Link>
            <Link className="text-[#806b70] transition hover:translate-x-[-2px] hover:text-[#a64257]" to="/faq">الأسئلة الشائعة</Link>
            <Link className="text-[#806b70] transition hover:translate-x-[-2px] hover:text-[#a64257]" to="/privacy">سياسة الخصوصية</Link>
          </div>

          <div className="grid content-start gap-3 text-sm">
            <p className="mb-1 font-bold text-[#4a2d33]">دعوات لكل مناسبة</p>
            <div className="grid grid-cols-2 gap-x-4 gap-y-3">
              <Link className="text-[#806b70] transition hover:text-[#a64257]" to="/دعوة-زفاف-الإلكترونية">دعوة زفاف إلكترونية</Link>
              <Link className="text-[#806b70] transition hover:text-[#a64257]" to="/دعوة-فرح">دعوة فرح</Link>
              <Link className="text-[#806b70] transition hover:text-[#a64257]" to="/دعوة-خطوبة">دعوة خطوبة</Link>
              <Link className="text-[#806b70] transition hover:text-[#a64257]" to="/دعوة-كتب-كتاب">دعوة كتب كتاب</Link>
              <Link className="text-[#806b70] transition hover:text-[#a64257]" to="/دعوات-الكترونية">دعوات إلكترونية</Link>
              <Link className="text-[#806b70] transition hover:text-[#a64257]" to="/كروت-افراح">كروت أفراح</Link>
              <Link className="text-[#806b70] transition hover:text-[#a64257]" to="/صيغ-دعوة-زفاف">صيغ دعوة زفاف</Link>
            </div>
          </div>

          <div className="grid content-start gap-3 text-sm">
            <p className="mb-1 font-bold text-[#4a2d33]">طرق الدفع</p>
            <p className="text-[#806b70]">فودافون كاش</p>
            <p className="text-[#806b70]">إنستاباي</p>
            <p className="text-[#806b70]">بطاقة بنكية</p>
            <p className="mt-2 text-xs leading-6 text-[#a18a8f]">تواصل معانا لو محتاج مساعدة في اختيار دعوتك.</p>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-3 pt-5 text-center text-xs text-[#9a8187] sm:flex-row sm:text-right">
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
      className="fixed bottom-4 left-4 z-40 inline-flex h-12 items-center gap-2 rounded-full border border-white/70 bg-white px-4 text-sm font-bold text-[#4a2d33] shadow-[0_8px_28px_rgba(74,45,51,0.16)] transition hover:-translate-y-0.5"
    >
      <span className="grid h-7 w-7 place-items-center rounded-full bg-[#1fa855] text-white">
        <WhatsAppIcon className="h-4 w-4" />
      </span>
      محتاج مساعدة؟
    </a>
  )
}
