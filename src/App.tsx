import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
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

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<SiteChrome />}>
          <Route path="/" element={<Home />} />
          <Route path="/templates" element={<Gallery />} />
          <Route path="/packages" element={<Packages />} />
          <Route path="/how" element={<How />} />
          <Route path="/faq" element={<FAQ />} />
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
        </Route>
        <Route path="/i/:code" element={<InviteView />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
