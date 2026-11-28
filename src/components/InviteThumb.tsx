import { useEffect, useLayoutEffect, useRef, useState } from "react"
import type { InviteDraft } from "../types"
import { EstateCard } from "./EstateCard"
import { Invitation } from "./Invitation"

const BASE_W = 360
const BASE_H = 640

function CardCountdown({ draft }: { draft: InviteDraft }) {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(timer)
  }, [])
  const target = new Date(`${draft.date}T${draft.time || "00:00"}:00`).getTime()
  if (!draft.date || Number.isNaN(target)) return null
  const left = Math.max(0, target - now)
  if (left === 0) return <div className="invite-thumb-countdown invite-thumb-countdown-ended">فرحتنا بدأت ♡</div>
  const units = [
    [Math.floor(left / 86400000), "ي"],
    [Math.floor((left % 86400000) / 3600000), "س"],
    [Math.floor((left % 3600000) / 60000), "د"],
    [Math.floor((left % 60000) / 1000), "ث"],
  ] as const
  return (
    <div className="invite-thumb-countdown" dir="rtl" aria-label="الوقت المتبقي للمناسبة">
      <span>باقي على الفرحة</span>
      <div>
        {units.map(([value, label]) => (
          <strong key={label}>
            {value}
            <small>{label}</small>
          </strong>
        ))}
      </div>
    </div>
  )
}

export function InviteThumb({ draft }: { draft: InviteDraft }) {
  const box = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(0.45)

  useLayoutEffect(() => {
    const el = box.current
    if (!el) return
    const update = () => setScale(el.clientWidth / BASE_W)
    update()
    const observer = new ResizeObserver(update)
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  if (draft.templateId === "royal-blue" || draft.templateId === "emerald-fern") {
    return (
      <div ref={box} className="invite-thumb">
        <div className="invite-thumb-inner" style={{ width: BASE_W, height: BASE_H, transform: `scale(${scale})` }}>
          <Invitation draft={draft} />
        </div>
      </div>
    )
  }

  if (
    draft.templateId === "burgundy-velvet" ||
    draft.templateId === "magnolia-ivory"
  ) {
    return (
      <div ref={box} className="invite-thumb">
        <div style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden", borderRadius: 8 }}>
          <img
            src={`/envelopes/${draft.templateId}/envelope_closed.jpg`}
            alt=""
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
        </div>
      </div>
    )
  }

  if (draft.templateId === "estate") {
    // نفس كارت الدعوة اللي جوه
    return (
      <div ref={box} className="invite-thumb">
        {/* بنرسمه بمقاس الموبايل وبعدين نصغّره، فيطلع نسخة طبق الأصل */}
        <div className="invite-thumb-inner" style={{ width: BASE_W, height: BASE_H, transform: `scale(${scale})` }}>
          <div className="vaux-site vaux-estate-royal estate-thumb" dir="rtl" lang="ar">
            <EstateCard draft={draft} />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div ref={box} className="invite-thumb">
      <div className="invite-thumb-inner" style={{ width: BASE_W, height: BASE_H, transform: `scale(${scale})` }}>
        <Invitation draft={draft} />
      </div>
      <CardCountdown draft={draft} />
    </div>
  )
}
