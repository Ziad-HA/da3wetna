import { useEffect, useRef, type CSSProperties } from "react"
import { formatArabicDate } from "../lib/format"
import { mapLink } from "../lib/maps"
import type { InviteDraft, Template } from "../types"

const weekdays = ["س", "ح", "ن", "ث", "ر", "خ", "ج"] // السبت أول الأسبوع
const num = (n: number | string) => Number(n).toLocaleString("ar-EG", { useGrouping: false })
const clean = (value: string) => { try { const u = new URL(value); return u.protocol === "https:" || u.protocol === "http:" ? u.href : "" } catch { return "" } }

function parseProgram(raw: string) {
  return raw.split("\n").map((line) => line.trim()).filter(Boolean).slice(0, 8).map((line) => {
    const i = line.indexOf("|")
    return i < 0 ? { time: "", label: line } : { time: line.slice(0, i).trim(), label: line.slice(i + 1).trim() }
  })
}

function Calendar({ iso }: { iso: string }) {
  const date = new Date(`${iso}T00:00:00`)
  if (!iso || Number.isNaN(date.getTime())) return null
  const first = (new Date(date.getFullYear(), date.getMonth(), 1).getDay() + 1) % 7
  const total = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  const cells = [...Array.from({ length: first }, () => 0), ...Array.from({ length: total }, (_, i) => i + 1)]
  return (
    <div className="strip-cal" role="img" aria-label={formatArabicDate(iso)}>
      <p className="strip-cal-month">{new Intl.DateTimeFormat("ar-EG", { month: "long", year: "numeric" }).format(date)}</p>
      <div className="strip-cal-grid">
        {weekdays.map((d) => <b key={d}>{d}</b>)}
        {cells.map((d, i) => <span key={i} data-on={d === date.getDate() ? "1" : undefined}>{d ? num(d) : ""}</span>)}
      </div>
    </div>
  )
}

type Props = { draft: InviteDraft; template: Template; autoScroll: boolean }

/** شريط الدعوة الطويل: بيطلع من الظرف وبينزل لتحت لوحده لحد ما الضيف يلمس الشاشة. */
export function StripInvite({ draft, template, autoScroll }: Props) {
  const ref = useRef<HTMLElement>(null)
  const photo = clean(draft.photoOne)
  const gallery = [clean(draft.photoTwo), ...draft.gallery.split(/\s+/).map(clean)].filter(Boolean).slice(0, 6)
  const program = parseProgram(draft.program)
  const place = [draft.venue, draft.city].filter(Boolean).join(" · ")
  const style = { "--paper": template.vars.paper, "--ink": template.vars.ink, "--gold": template.vars.gold, "--soft": template.vars.soft } as CSSProperties

  useEffect(() => {
    if (!autoScroll || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    let stopped = false
    let raf = 0
    let pos = window.scrollY
    let last = 0
    const stop = () => { stopped = true; cancelAnimationFrame(raf) }
    const events: (keyof WindowEventMap)[] = ["touchstart", "wheel", "keydown", "pointerdown"]
    events.forEach((e) => window.addEventListener(e, stop, { passive: true, once: true }))
    const tick = (t: number) => {
      if (stopped) return
      const dt = last ? Math.min(50, t - last) : 16
      last = t
      const el = ref.current
      const end = el ? el.offsetTop + el.offsetHeight - window.innerHeight * 0.75 : 0
      if (pos >= end) return
      pos += dt * 0.055 // ~٥٥ بكسل في الثانية
      window.scrollTo(0, Math.round(pos))
      raf = requestAnimationFrame(tick)
    }
    const start = window.setTimeout(() => { pos = window.scrollY; raf = requestAnimationFrame(tick) }, 1700)
    return () => { stopped = true; window.clearTimeout(start); cancelAnimationFrame(raf); events.forEach((e) => window.removeEventListener(e, stop)) }
  }, [autoScroll])

  return (
    <article ref={ref} className="strip" style={style}>
      <section className="strip-sec strip-hero">
        <p className="strip-kicker">{draft.opening || "بسم الله الرحمن الرحيم"}</p>
        <span className="strip-orn" aria-hidden="true">❦</span>
        <p className="strip-small">{draft.hosts || "يتشرف الأهل بدعوتكم"}</p>
        <h1 className="strip-names">{draft.groom}<i>و</i>{draft.bride}</h1>
        <p className="strip-script">لحضور {draft.occasion}</p>
        {photo ? <div className="strip-arch"><img src={photo} alt="" loading="eager" /></div> : <div className="strip-arch strip-arch-empty" aria-hidden="true"><span>♡</span></div>}
        <p className="strip-msg">{draft.message || "ونكون سعداء بوجودكم في يومنا"}</p>
      </section>

      <section className="strip-sec">
        <h2 className="strip-title">احجز الموعد</h2>
        <p className="strip-date">{formatArabicDate(draft.date)}</p>
        {draft.time ? <p className="strip-small">الساعة {draft.time}</p> : null}
        <Calendar iso={draft.date} />
      </section>

      {program.length ? (
        <section className="strip-sec strip-dark">
          <h2 className="strip-title">برنامج الحفل</h2>
          <ol className="strip-program">
            {program.map((p, i) => (
              <li key={i}><span className="strip-dot" aria-hidden="true">{icons[i % icons.length]}</span><div>{p.time ? <strong>{p.time}</strong> : null}<span>{p.label}</span></div></li>
            ))}
          </ol>
        </section>
      ) : null}

      <section className="strip-sec">
        <h2 className="strip-title">المكان</h2>
        <p className="strip-venue">{place}</p>
        <a className="strip-btn" href={mapLink(draft)} target="_blank" rel="noreferrer">📍 اتجاهات المكان</a>
      </section>

      {gallery.length ? (
        <section className="strip-sec">
          <h2 className="strip-title">معرض الصور</h2>
          <div className="strip-gallery">{gallery.map((g) => <img key={g} src={g} alt="" loading="lazy" />)}</div>
        </section>
      ) : null}

      <section className="strip-sec strip-dark strip-end">
        <span className="strip-orn" aria-hidden="true">❦</span>
        <p className="strip-script">شكرًا لحضوركم</p>
        <p className="strip-names strip-names-sm">{draft.groom}<i>و</i>{draft.bride}</p>
        <p className="strip-small">وجودكم يكمّل فرحتنا ♡</p>
      </section>
    </article>
  )
}
