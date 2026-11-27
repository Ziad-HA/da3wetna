import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { App } from "./App"
import "./index.css"

// بعد أي نشر جديد، صفحة مفتوحة من قبله ممكن تطلب ملف قديم — نعمل تحديث مرة واحدة.
window.addEventListener("vite:preloadError", (event) => {
  const last = Number(sessionStorage.getItem("chunk-reload") ?? 0)
  if (Date.now() - last < 10_000) return
  event.preventDefault()
  sessionStorage.setItem("chunk-reload", String(Date.now()))
  window.location.reload()
})

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
