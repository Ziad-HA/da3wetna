import { useEffect, useMemo, useState, type ReactNode } from "react"
import { formatArabicDate } from "../lib/format"
import { mapLink } from "../lib/maps"
import type { InviteDraft } from "../types"

type Props = { draft: InviteDraft; rsvp?: ReactNode; shareUrl?: string }

export function GardenInvite({ draft, rsvp }: Props) {
  const [now, setNow] = useState(Date.now())
  useEffect(() => { const timer = window.setInterval(() => setNow(Date.now()), 1000); return () => window.clearInterval(timer) }, [])
  const target = new Date(`${draft.date}T${draft.time || "18:00"}:00`).getTime()
  const remaining = Math.max(0, target - now)
  const days = Math.floor(remaining / 86400000)
  const hours = Math.floor((remaining % 86400000) / 3600000)
  const minutes = Math.floor((remaining % 3600000) / 60000)
  const seconds = Math.floor((remaining % 60000) / 1000)
  const date = useMemo(() => formatArabicDate(draft.date), [draft.date])
  const location = mapLink(draft)
  return <article className="garden-invite" dir="rtl" lang="ar">
    <section className="garden-hero">
      <GardenBotanical className="garden-botanical garden-botanical-top" />
      <div className="garden-hero-monogram">❦</div>
      <p className="garden-eyebrow">بكل الحب والفرح</p>
      <h1><span>{draft.groom}</span><i>و</i><span>{draft.bride}</span></h1>
      <p className="garden-intro">يتشرفان بدعوتكم لمشاركتهما فرحة العمر</p>
      <div className="garden-date-line"><span>{date}</span><b>✦</b><span>{draft.time || "18:00"}</span></div>
      <PalaceArt />
      <p className="garden-venue">{draft.venue}</p>
      <p className="garden-city">{draft.city}</p>
      <a className="garden-outline-btn" href={location} target="_blank" rel="noreferrer">عرض الموقع على الخريطة</a>
      <GardenBotanical className="garden-botanical garden-botanical-bottom" />
    </section>

    <section className="garden-section garden-countdown">
      <p className="garden-eyebrow">اللحظة المنتظرة</p><h2>باقي على فرحتنا</h2>
      <div className="garden-count-grid">{[[days,"يوم"],[hours,"ساعة"],[minutes,"دقيقة"],[seconds,"ثانية"]].map(([n,label]) => <div key={String(label)}><strong>{Number(n).toLocaleString("ar-EG")}</strong><span>{label}</span></div>)}</div>
    </section>

    <section className="garden-section garden-note">
      <p className="garden-eyebrow">رسالة من القلب</p><h2>أحبابنا وأهلنا</h2>
      <p>فرحتنا ما تكملش غير بوجودكم وسطنا. مستنيينكم تشاركونا أجمل يوم في حياتنا، وتكونوا جزء من ذكرياتنا الحلوة.</p>
      <span className="garden-flower-mark">❀</span>
    </section>

    <section className="garden-section garden-celebration">
      <p className="garden-eyebrow">تفاصيل الاحتفال</p><h2>ميعادنا ومكاننا</h2>
      <PalaceArt />
      <h3>{draft.venue}</h3><p>{draft.city}</p><p className="garden-event-date">{date} · الساعة {draft.time || "18:00"}</p>
      <a className="garden-solid-btn" href={location} target="_blank" rel="noreferrer">افتح اللوكيشن</a>
    </section>

    {rsvp ? <section className="garden-section garden-rsvp"><p className="garden-eyebrow">يسعدنا تأكيد حضوركم</p><h2>هتنورونا؟</h2>{rsvp}</section> : null}
    <section className="garden-section garden-footer">
      <span className="garden-flower-mark">❦</span><h2>{draft.groom} <i>و</i> {draft.bride}</h2>
      <p>وجودكم أجمل هدية لينا</p>
      <p className="garden-credit">بكل حب · دعوتنا</p>
    </section>
  </article>
}

function GardenBotanical({ className = "" }: { className?: string }) {
  return <svg className={className} viewBox="0 0 720 280" fill="none" aria-hidden="true">
    <g stroke="#71836b" strokeWidth="2" opacity=".8"><path d="M-20 250C100 220 80 100 210 18M10 270C120 220 180 180 260 80M740 250C620 220 640 100 510 18M710 270C600 220 540 180 460 80"/></g>
    {Array.from({length:8},(_,i)=><g key={i} transform={`translate(${80+i*78} ${30+(i%3)*54}) rotate(${i%2?35:-35})`} fill="#a9b99d" opacity=".72"><ellipse rx="13" ry="31"/><path d="M0 0v-29" stroke="#73896f" strokeWidth="1.4"/></g>)}
    {Array.from({length:6},(_,i)=><g key={i} transform={`translate(${35+i*128} ${185-(i%2)*34})`} fill="#fffdf5" stroke="#c7c6aa" strokeWidth="1"><circle r="8"/>{Array.from({length:5},(_,j)=><ellipse key={j} cy="-17" rx="7" ry="13" transform={`rotate(${j*72})`}/>)}</g>)}
  </svg>
}

function PalaceArt() {
  return <svg className="garden-palace" viewBox="0 0 520 220" fill="none" aria-hidden="true">
    <g stroke="#87917a" strokeWidth="2" fill="#e8e4d3">
      <path d="M55 174V88l45-28 45 28v86M150 174V65l35-34 35 34v109M220 174V82l40-28 40 28v92M300 174V65l35-34 35 34v109M370 174V88l45-28 45 28v86"/>
      <path d="M42 174h436M25 188h470M85 88h30M170 65h30M245 82h30M320 65h30M400 88h30"/>
      {Array.from({length:9},(_,i)=><rect key={i} x={75+i*43} y={108} width="17" height="43" rx="8" fill="#c5cbb7"/>)}
      <path d="M230 174v-49q30-45 60 0v49" fill="#b9c3ad"/>
      <path d="M20 190q70-38 125 0M375 190q70-38 125 0" stroke="#84947c"/>
    </g>
    <g fill="#879777"><circle cx="35" cy="150" r="27"/><circle cx="485" cy="150" r="27"/><circle cx="65" cy="166" r="20"/><circle cx="455" cy="166" r="20"/></g>
  </svg>
}
