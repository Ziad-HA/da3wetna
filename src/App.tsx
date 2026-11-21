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
