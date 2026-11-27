import { lazy, Suspense, useEffect, useLayoutEffect } from "react"
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom"
import { SiteChrome } from "./components/SiteChrome"
import { Home } from "./pages/Home"

const Checkout = lazy(() => import("./pages/Checkout").then((m) => ({ default: m.Checkout })))
const Done = lazy(() => import("./pages/Done").then((m) => ({ default: m.Done })))
const Editor = lazy(() => import("./pages/Editor").then((m) => ({ default: m.Editor })))
const Gallery = lazy(() => import("./pages/Gallery").then((m) => ({ default: m.Gallery })))
const Packages = lazy(() => import("./pages/Packages").then((m) => ({ default: m.Packages })))
const Partners = lazy(() => import("./pages/Partners").then((m) => ({ default: m.Partners })))
const How = lazy(() => import("./pages/How").then((m) => ({ default: m.How })))
const FAQ = lazy(() => import("./pages/FAQ").then((m) => ({ default: m.FAQ })))
const InviteView = lazy(() => import("./pages/InviteView").then((m) => ({ default: m.InviteView })))
const SeoContentPage = lazy(() => import("./pages/SeoContentPage").then((m) => ({ default: m.SeoContentPage })))
const Privacy = lazy(() => import("./pages/Privacy").then((m) => ({ default: m.Privacy })))
const Account = lazy(() => import("./pages/Account").then((m) => ({ default: m.Account })))
const Auth = lazy(() => import("./pages/Auth").then((m) => ({ default: m.Auth })))
const Dashboard = lazy(() => import("./pages/Dashboard").then((m) => ({ default: m.Dashboard })))
const Admin = lazy(() => import("./pages/Admin").then((m) => ({ default: m.Admin })))
const PayResult = lazy(() => import("./pages/PayResult").then((m) => ({ default: m.PayResult })))
const TemplatePreview = lazy(() => import("./pages/TemplatePreview").then((m) => ({ default: m.TemplatePreview })))

function ScrollToTop() {
  const { pathname, search } = useLocation()

  useLayoutEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual"
    }
    window.scrollTo({ top: 0, left: 0, behavior: "auto" })
  }, [pathname, search])

  useEffect(() => {
    const handleInternalLinkClick = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) return

      const target = event.target
      if (!(target instanceof Element)) return

      const link = target.closest("a")
      if (!link || link.target === "_blank" || link.hasAttribute("download")) return

      const destination = new URL(link.href, window.location.href)
      if (destination.origin !== window.location.origin) return

      window.scrollTo({ top: 0, left: 0, behavior: "auto" })
    }

    document.addEventListener("click", handleInternalLinkClick, true)
    return () => document.removeEventListener("click", handleInternalLinkClick, true)
  }, [])

  return null
}

function PageLoading() {
  return <div className="grid min-h-[60dvh] place-items-center text-sm font-bold text-[#a64257]" role="status">جاري التحميل…</div>
}

export function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Suspense fallback={<PageLoading />}>
      <Routes>
        <Route element={<SiteChrome />}>
          <Route path="/" element={<Home />} />
          <Route path="/templates" element={<Gallery />} />
          <Route path="/packages" element={<Packages />} />
          <Route path="/partners" element={<Partners />} />
          <Route path="/how" element={<How />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/account" element={<Account />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/دعوة-زفاف-الإلكترونية" element={<SeoContentPage pageKey="/دعوة-زفاف-الإلكترونية" />} />
          <Route path="/دعوة-فرح" element={<SeoContentPage pageKey="/دعوة-فرح" />} />
          <Route path="/دعوة-خطوبة" element={<SeoContentPage pageKey="/دعوة-خطوبة" />} />
          <Route path="/دعوات-الكترونية" element={<SeoContentPage pageKey="/دعوات-الكترونية" />} />
          <Route path="/كروت-افراح" element={<SeoContentPage pageKey="/كروت-افراح" />} />
          <Route path="/صيغ-دعوة-زفاف" element={<SeoContentPage pageKey="/صيغ-دعوة-زفاف" />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/editor/:id" element={<Editor />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/done/:code" element={<Done />} />
          <Route path="/dashboard/:token" element={<Dashboard />} />
          <Route path="/pay-result" element={<PayResult />} />
          <Route path="/admin" element={<Admin />} />
        </Route>
        <Route path="/preview/:id" element={<TemplatePreview />} />
        <Route path="/i/:code" element={<InviteView />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
