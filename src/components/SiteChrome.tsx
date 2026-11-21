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
    <header className="sticky top-0 z-40 border-b border-[#f0dce1]/80 bg-[#fffdfa]/90 backdrop-blur-xl">
      <div className="mx-auto flex h-[76px] max-w-6xl items-center justify-between gap-4 px-4">
        <Link to="/" className="flex items-center gap-2.5" aria-label="دعوتنا، الصفحة الرئيسية">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#fff0f2] text-[#b83b50]">
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
            className="inline-flex h-11 cursor-pointer items-center rounded-full border border-[#f0dce1] bg-white px-4 text-sm font-bold text-[#65434b] md:hidden"
            aria-expanded={open}
            aria-label={open ? "إغلاق القائمة" : "فتح القائمة"}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? "إغلاق" : "القائمة"}
          </button>
        </div>
      </div>
      {open ? (
        <nav className="grid gap-1 border-t border-[#f0dce1] bg-white px-4 py-3 md:hidden" aria-label="قائمة الموبايل">
          {links.map((link) =>
            link.href.startsWith("/#") ? (
              <a key={link.href} href={link.href} className="rounded-xl px-3 py-3 font-semibold text-[#65434b] hover:bg-[#fff5f6]" onClick={() => setOpen(false)}>
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
    <footer className="border-t border-[#f0dce1] bg-[#fff8f8]">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1.3fr_1fr]">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-[#fff0f2] text-[#b83b50]">
              <LogoMark className="h-7 w-7" />
            </span>
            <span className="font-display text-3xl text-[#4a2d33]">دعوتنا</span>
          </div>
          <p className="mt-4 max-w-sm leading-7 text-[#806b70]">
            كل فرحة وليها دعوة حلوة. صمّم دعوتك وشارك لحظتك مع كل اللي بتحبهم.
          </p>
        </div>
        <div className="grid content-start gap-3">
          <p className="font-bold text-[#4a2d33]">تصفح</p>
          <Link className="text-[#806b70] hover:text-[#a64257]" to="/templates">كل الدعوات</Link>
          <Link className="text-[#806b70] hover:text-[#a64257]" to="/how">طريقة الاستخدام</Link>
          <Link className="text-[#806b70] hover:text-[#a64257]" to="/packages">الباقات والأسعار</Link>
          <Link className="text-[#806b70] hover:text-[#a64257]" to="/faq">الأسئلة الشائعة</Link>
          <Link className="text-[#806b70] hover:text-[#a64257]" to="/privacy">سياسة الخصوصية</Link>
        </div>
        <div className="grid content-start gap-3">
          <p className="font-bold text-[#4a2d33]">مناسبات ودعوات</p>
          <Link className="text-[#806b70] hover:text-[#a64257]" to="/دعوة-زفاف-الإلكترونية">دعوة زفاف إلكترونية</Link>
          <Link className="text-[#806b70] hover:text-[#a64257]" to="/دعوة-فرح">دعوة فرح</Link>
          <Link className="text-[#806b70] hover:text-[#a64257]" to="/دعوة-خطوبة">دعوة خطوبة</Link>
          <Link className="text-[#806b70] hover:text-[#a64257]" to="/دعوة-كتب-كتاب">دعوة كتب كتاب</Link>
          <Link className="text-[#806b70] hover:text-[#a64257]" to="/دعوات-الكترونية">دعوات إلكترونية</Link>
          <Link className="text-[#806b70] hover:text-[#a64257]" to="/كروت-افراح">كروت أفراح</Link>
          <Link className="text-[#806b70] hover:text-[#a64257]" to="/صيغ-دعوة-زفاف">صيغ دعوة زفاف</Link>
        </div>
        <div className="grid content-start gap-3">
          <p className="font-bold text-[#4a2d33]">طرق الدفع</p>
          <p className="text-[#806b70]">فودافون كاش</p>
          <p className="text-[#806b70]">إنستاباي</p>
          <p className="text-[#806b70]">بطاقة بنكية</p>
        </div>
      </div>
      <p className="border-t border-[#f0dce1] px-4 py-4 text-center text-sm text-[#9a8187]">© {new Date().getFullYear()} دعوتنا — كل الحقوق محفوظة</p>
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
