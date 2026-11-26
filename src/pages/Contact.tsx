import { useEffect } from "react"
import { site } from "../config"
import { WhatsAppIcon } from "../components/Icons"

export function Contact() {
  useEffect(() => { document.title = "تواصل مع دعوتنا" }, [])
  const message = "السلام عليكم، محتاج مساعدة بخصوص دعوات دعوتنا."
  return (
    <main id="main" className="min-h-[70vh]">
      <section className="border-b border-[#f0dce1] bg-[radial-gradient(ellipse_at_top_right,rgba(242,211,220,0.5),transparent_45%),linear-gradient(135deg,#fff5f6_0%,#fffaf7_60%,#fff_100%)] px-4 py-14 text-center md:py-20">
        <p className="text-sm font-bold text-[#b83b50]">WE'RE HERE TO HELP</p>
        <h1 className="mt-3 font-display text-4xl text-[#4a2d33] md:text-6xl">خلّينا نساعدك</h1>
        <p className="mx-auto mt-4 max-w-2xl leading-8 text-[#806b70]">لو عندك سؤال عن اختيار التصميم أو التعديل أو الباقات أو الطلب، ابعتلنا وهنساعدك.</p>
      </section>
      <section className="mx-auto grid max-w-4xl gap-4 px-4 py-12 sm:grid-cols-2 md:py-16">
        <a href={`https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`} target="_blank" rel="noreferrer" className="rounded-3xl border border-[#d8eadf] bg-[#f2faf5] p-7 text-center transition hover:-translate-y-1">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-white text-[#247747]"><WhatsAppIcon className="h-7 w-7" /></span>
          <h2 className="mt-4 text-lg font-extrabold text-[#315c42]">واتساب</h2>
          <p className="mt-2 text-sm text-[#527460]" dir="ltr">01276390301</p>
          <span className="mt-4 inline-block text-sm font-bold text-[#247747]">ابدأ محادثة ←</span>
        </a>
        <a href={`mailto:${site.email}`} className="rounded-3xl border border-[#f0dce1] bg-white p-7 text-center transition hover:-translate-y-1">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-[#fff0f2] text-[#a64257] text-2xl">✉</span>
          <h2 className="mt-4 text-lg font-extrabold text-[#4a2d33]">البريد الإلكتروني</h2>
          <p className="mt-2 break-all text-sm text-[#806b70]" dir="ltr">{site.email}</p>
          <span className="mt-4 inline-block text-sm font-bold text-[#a64257]">ابعت إيميل ←</span>
        </a>
      </section>
    </main>
  )
}
