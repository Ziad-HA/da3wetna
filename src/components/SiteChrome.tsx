import { useEffect, useState } from "react"
import { Link, NavLink, Outlet, useLocation } from "react-router-dom"
import { site } from "../config"
import { LogoMark, WhatsAppIcon } from "./Icons"

const links = [
  { href: "/templates", label: "الدعوات" },
  { href: "/#how", label: "الطريقة" },
  { href: "/#price", label: "السعر" },
  { href: "/#faq", label: "أسئلة" },
]

export function SiteChrome() {
  return (
    <>
      <a className="skip" href="#main">
        تخطي إلى المحتوى
      </a>
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
    <header className="sticky top-0 z-40 border-b border-line/80 bg-cream/90 backdrop-blur-md">
      <div className="mx-auto flex h-[72px] max-w-6xl items-center justify-between gap-4 px-4">
        <Link to="/" className="flex items-center gap-2 text-gold" aria-label="دعوتنا، الصفحة الرئيسية">
          <LogoMark className="h-10 w-10" />
          <span className="grid leading-none">
            <span className="font-display text-[1.7rem] text-ink">دعوتنا</span>
            <span className="font-latin text-[0.7rem] tracking-[0.28em] text-gold">{site.nameEn}</span>
          </span>
        </Link>
        <nav className="hidden items-center gap-1 md:flex" aria-label="التنقل">
          {links.map((link) =>
            link.href.startsWith("/#") ? (
              <a key={link.href} href={link.href} className="cursor-pointer rounded-full px-3 py-2 text-sm font-semibold text-ink">
                {link.label}
              </a>
            ) : (
              <NavLink
                key={link.href}
                to={link.href}
                className={({ isActive }) =>
                  `cursor-pointer rounded-full px-3 py-2 text-sm font-semibold ${isActive ? "bg-white text-gold" : "text-ink"}`
                }
              >
                {link.label}
              </NavLink>
            ),
          )}
        </nav>
        <div className="flex items-center gap-2">
          <Link to="/templates" className="btn-gold hidden h-11 px-4 text-sm sm:inline-flex">
            اختار دعوتك
          </Link>
          <button
            type="button"
            className="inline-flex h-11 cursor-pointer items-center rounded-full border border-line bg-card px-4 text-sm font-bold md:hidden"
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
          >
            القائمة
          </button>
        </div>
      </div>
      {open ? (
        <nav className="grid gap-1 border-t border-line px-4 py-3 md:hidden" aria-label="قائمة الموبايل">
          {links.map((link) =>
            link.href.startsWith("/#") ? (
              <a key={link.href} href={link.href} className="rounded-xl px-3 py-3 font-semibold" onClick={() => setOpen(false)}>
                {link.label}
              </a>
            ) : (
              <Link key={link.href} to={link.href} className="rounded-xl px-3 py-3 font-semibold">
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
    <footer className="border-t border-line bg-cream">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-2 text-gold">
            <LogoMark className="h-9 w-9" />
            <span className="font-display text-3xl text-ink">دعوتنا</span>
          </div>
          <p className="mt-3 max-w-sm leading-7 text-mute">
            دعوات أفراح جاهزة. أنت تكتب الأسماء والتفاصيل، وتستلم ستوري واتساب ولينك للضيوف.
          </p>
        </div>
        <div className="grid content-start gap-2">
          <p className="font-bold">الموقع</p>
          <a className="text-mute" href="/templates">الدعوات</a>
          <a className="text-mute" href="/#how">الطريقة</a>
          <a className="text-mute" href="/#price">السعر</a>
        </div>
        <div className="grid content-start gap-2">
          <p className="font-bold">الدفع</p>
          <p className="text-mute">فودافون كاش</p>
          <p className="text-mute">إنستاباي</p>
          <p className="text-mute">بطاقة بنكية</p>
        </div>
      </div>
      <p className="border-t border-line px-4 py-4 text-center text-sm text-mute">© {new Date().getFullYear()} دعوتنا</p>
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
      className="fixed bottom-4 left-4 z-40 inline-flex h-12 items-center gap-2 rounded-full bg-ink px-4 text-sm font-bold text-cream shadow-lg"
    >
      <span className="grid h-7 w-7 place-items-center rounded-full bg-[#1fa855] text-white">
        <WhatsAppIcon className="h-4 w-4" />
      </span>
      محتاج مساعدة؟
    </a>
  )
}
