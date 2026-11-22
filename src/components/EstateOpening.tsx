import { useEffect, useRef, useState } from "react"
import type { InviteDraft } from "../types"

type Props = {
  draft: InviteDraft
  step: number
  onOpen: () => void
  onComplete?: () => void
  onSkip?: () => void
}

const TOTAL_FRAMES = 36
const FRAME_PATHS = Array.from(
  { length: TOTAL_FRAMES },
  (_, i) => `/vaux/opening/frame_${String(i).padStart(2, "0")}.jpg`
)

export function EstateOpening({ draft, step, onOpen, onComplete, onSkip }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [showNames, setShowNames] = useState(false)
  const imagesRef = useRef<HTMLImageElement[]>([])

  // Preload images
  useEffect(() => {
    const imgs: HTMLImageElement[] = []

    FRAME_PATHS.forEach((path, idx) => {
      const img = new Image()
      img.src = path
      img.onload = () => {
        if (idx === 0 && canvasRef.current) {
          const ctx = canvasRef.current.getContext("2d")
          if (ctx) {
            ctx.drawImage(img, 0, 0, canvasRef.current.width, canvasRef.current.height)
          }
        }
      }
      imgs.push(img)
    })
    imagesRef.current = imgs
  }, [])

  // Handle animation sequence
  const handleStart = () => {
    if (isPlaying || step > 0) return
    setIsPlaying(true)
    onOpen()

    const canvas = canvasRef.current
    if (!canvas) {
      onComplete?.()
      return
    }
    const ctx = canvas.getContext("2d")
    if (!ctx) {
      onComplete?.()
      return
    }

    let frame = 0
    const fps = 22
    const interval = 1000 / fps
    let lastTime = performance.now()

    const render = (now: number) => {
      const delta = now - lastTime
      if (delta >= interval) {
        lastTime = now - (delta % interval)
        const img = imagesRef.current[frame]
        if (img && img.complete) {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
        }
        frame++
      }

      if (frame < TOTAL_FRAMES) {
        requestAnimationFrame(render)
      } else {
        // Final frame reached - reveal names then finish
        setShowNames(true)
        window.setTimeout(() => {
          onComplete?.()
        }, 900)
      }
    }

    requestAnimationFrame(render)
  }

  return (
    <main className="vaux-open-screen" aria-label="شاشة فتح الدعوة">
      <div className="vaux-canvas-wrapper" onClick={handleStart}>
        <canvas
          ref={canvasRef}
          width={720}
          height={1280}
          className="vaux-open-canvas"
        />

        {/* Dynamic couple names overlay on final frame */}
        <div
          className={`vaux-card-names-overlay ${showNames ? "is-visible" : ""}`}
          aria-hidden={!showNames}
        >
          <img
            src="/vaux/monogram_rose.png"
            alt=""
            className="vaux-overlay-monogram"
          />
          <h2 className="vaux-overlay-title">
            <span>{draft.groom}</span>
            <i>و</i>
            <span>{draft.bride}</span>
          </h2>
          <p className="vaux-overlay-kicker">
            {draft.hosts || "يتشرف الأهل بدعوتكم لحضور حفل الزفاف"}
          </p>
        </div>

        {/* Wax Seal Tap Target & Hint */}
        {!isPlaying && step === 0 && (
          <button
            type="button"
            className="vaux-seal-trigger"
            onClick={handleStart}
            aria-label="اضغط على الختم لفتح الدعوة"
          >
            <span className="vaux-seal-pulse" />
            <span className="vaux-seal-hint">اضغط لفتح الدعوة ✦</span>
          </button>
        )}

        {/* Skip button */}
        {onSkip && (
          <button
            type="button"
            className="vaux-skip-btn"
            onClick={(e) => {
              e.stopPropagation()
              onSkip()
            }}
          >
            تخطي المقدمة ←
          </button>
        )}
      </div>
    </main>
  )
}
