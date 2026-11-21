import { useEffect, useMemo, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { StoryActions } from "../components/StoryActions"
import { Invitation } from "../components/Invitation"
import { getTemplate } from "../data"
import { decodeDraft } from "../lib/codec"

export function InviteView() {
  const { code = "" } = useParams()
  const draft = decodeDraft(code)
  const template = draft ? getTemplate(draft.templateId) : undefined
  const [now, setNow] = useState(() => Date.now())
  const eventDate = useMemo(() => draft?.date ? new Date(`${draft.date}T${draft.time || "00:00"}:00`) : null, [draft?.date, draft?.time])
  const remaining = eventDate && !Number.isNaN(eventDate.getTime()) ? Math.max(0, eventDate.getTime() - now) : 0
  const days = Math.floor(remaining / 86400000)
  const hours = Math.floor((remaining % 86400000) / 3600000)
  const minutes = Math.floor((remaining % 3600000) / 60000)
  const seconds = Math.floor((remaining % 60000) / 1000)
  const safeUrl = (value: string) => { try { const url = new URL(value); return url.protocol === "https:" || url.protocol === "http:" ? url.href : "" } catch { return "" } }
  const musicUrl = draft ? safeUrl(draft.musicUrl) : ""
  const photos = draft ? [draft.photoOne, draft.photoTwo].map(safeUrl).filter(Boolean) : []
  const rsvpNumber = draft?.rsvpPhone.replace(/\\D/g, "") || ""
  const rsvpLink = draft && rsvpNumber ? `https://wa.me/${rsvpNumber}?text=${encodeURIComponent(`أهلاً، حابب أأكد حضوري لمناسبة ${draft.groom} و${draft.bride}.`)}` : ""

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {
    document.title = draft ? `دعوة ${draft.groom} و${draft.bride}` : "دعوة"
  }, [draft])

  if (!draft || !template) {
    return (
      <main className="grid min-h-dvh place-items-center bg-cream px-4 text-center">
        <div>
          <h1 className="font-display text-4xl">الدعوة دي مش متاحة</h1>
          <Link to="/" className="btn-gold mt-6 inline-flex">اعمل دعوة من دعوتنا</Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-dvh px-4 py-8" style={{ background: template.vars.shell, color: template.vars.ink }}>
      <div className="mx-auto grid w-full max-w-md justify-items-center gap-5">
        <div className="text-center">
          <p className="font-display text-2xl">دعوة {draft.occasion}</p>
          <p className="mt-2 text-sm opacity-80">يسعدنا وجودكم ومشاركتنا أجمل لحظاتنا ♡</p>
        </div>
        <div className="w-full overflow-hidden rounded-[28px] shadow-2xl">
          <Invitation draft={draft} />
        </div>
        <section className="w-full rounded-[26px] border border-white/70 bg-white/75 p-4 text-center shadow-lg backdrop-blur">
          <p className="text-xs font-bold tracking-wide opacity-70">الوقت المتبقي على فرحتنا</p>
          {eventDate && !Number.isNaN(eventDate.getTime()) ? <div className="mt-3 grid grid-cols-4 gap-2" dir="rtl">{[[days,"يوم"],[hours,"ساعة"],[minutes,"دقيقة"],[seconds,"ثانية"]].map(([value,label]) => <div key={String(label)} className="rounded-2xl bg-white px-1 py-3 shadow-sm"><strong className="block font-display text-2xl text-[#a64257]">{String(value).padStart(2,"0")}</strong><span className="mt-1 block text-[10px] text-[#806b70]">{label}</span></div>)}</div> : <p className="mt-3 text-sm">ميعاد المناسبة هيتحدد قريبًا</p>}
        </section>
        {musicUrl ? <section className="w-full rounded-[24px] border border-white/70 bg-white/80 p-4 text-center shadow-lg"><p className="mb-2 text-sm font-bold text-[#4a2d33]">موسيقى الدعوة ♫</p><audio className="w-full" controls preload="none" src={musicUrl}>المتصفح لا يدعم تشغيل الصوت.</audio></section> : null}
        {photos.length ? <section className="w-full rounded-[24px] border border-white/70 bg-white/80 p-4 shadow-lg"><p className="mb-3 text-center font-bold text-[#4a2d33]">لحظات من حكايتنا ♡</p><div className="grid grid-cols-2 gap-2">{photos.map((photo, index) => <img key={photo} src={photo} alt={`صورة من المناسبة ${index + 1}`} loading="lazy" className="aspect-[4/5] w-full rounded-2xl object-cover" />)}</div></section> : null}
        {rsvpLink ? <a href={rsvpLink} target="_blank" rel="noreferrer" className="btn-gold w-full justify-center">أكد حضورك على واتساب ♡</a> : null}
        <div className="w-full"><StoryActions draft={draft} code={code} /></div>
        <section className="w-full rounded-[26px] border border-white/70 bg-white/80 p-4 text-center shadow-lg">
          <p className="font-bold text-[#4a2d33]">احتفظ بالدعوة وشاركها</p>
          <p className="mt-1 text-xs text-[#806b70]">امسح رمز QR لفتح نفس الدعوة بسهولة.</p>
          <img className="mx-auto mt-3 h-36 w-36 rounded-xl border border-[#f0dce1] bg-white p-2" loading="lazy" alt="رمز QR لفتح الدعوة" src={`https://api.qrserver.com/v1/create-qr-code/?size=240x240&margin=8&data=${encodeURIComponent(`${window.location.origin}/i/${code}`)}`} />
          <p className="mt-2 break-all text-[10px] text-[#9a8187]">{`${window.location.origin}/i/${code}`}</p>
        </section>
        <Link to="/" className="text-sm font-bold underline-offset-4 hover:underline">دعوة من دعوتنا</Link>
      </div>
    </main>
  )
}
