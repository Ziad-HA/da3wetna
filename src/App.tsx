import { useEffect, useLayoutEffect } from "react"
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom"
import { SiteChrome } from "./components/SiteChrome"
import { Checkout } from "./pages/Checkout"
import { Done } from "./pages/Done"
import { Editor } from "./pages/Editor"
import { Gallery } from "./pages/Gallery"
import { Home } from "./pages/Home"
import { Packages } from "./pages/Packages"
import { How } from "./pages/How"
import { FAQ } from "./pages/FAQ"
import { InviteView } from "./pages/InviteView"
import { SeoContentPage } from "./pages/SeoContentPage"
import { Privacy } from "./pages/Privacy"
import { Account } from "./pages/Account"
import { Dashboard } from "./pages/Dashboard"
import { Admin } from "./pages/Admin"
import { PayResult } from "./pages/PayResult"
import { TemplatePreview } from "./pages/TemplatePreview"

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

export function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route element={<SiteChrome />}>
          <Route path="/" element={<Home />} />
          <Route path="/templates" element={<Gallery />} />
          <Route path="/packages" element={<Packages />} />
          <Route path="/how" element={<How />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/account" element={<Account />} />
          <Route path="/دعوة-زفاف-الإلكترونية" element={<SeoContentPage pageKey="/دعوة-زفاف-الإلكترونية" />} />
          <Route path="/دعوة-فرح" element={<SeoContentPage pageKey="/دعوة-فرح" />} />
          <Route path="/دعوة-خطوبة" element={<SeoContentPage pageKey="/دعوة-خطوبة" />} />
          <Route path="/دعوة-كتب-كتاب" element={<SeoContentPage pageKey="/دعوة-كتب-كتاب" />} />
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
    </BrowserRouter>
  )
}
