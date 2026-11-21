import { useLayoutEffect, useRef, useState } from "react"
import type { InviteDraft } from "../types"
import { Invitation } from "./Invitation"

/** حجم التصميم الأصلي للدعوة. */
const BASE_W = 360
const BASE_H = 640

/**
 * معاينة مصغّرة للدعوة: بنرسمها بمقاسها الأصلي (360×640) وبعدين نصغّرها بـ scale.
 * كده الخطوط ماتبقاش أصغر من الحد الأدنى بتاع المتصفح (كروم بيكبّر أي خط أقل من ~6px
 * فالكلام كان بيتكسر ويطلع برّه الكارت في الشبكة بعمودين على الموبايل).
 */
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

  return (
    <div ref={box} className="invite-thumb">
      <div className="invite-thumb-inner" style={{ width: BASE_W, height: BASE_H, transform: `scale(${scale})` }}>
        <Invitation draft={draft} />
      </div>
    </div>
  )
}
