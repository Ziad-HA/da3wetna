import { useState } from "react"
import type { InviteDraft, Template } from "../types"
import { Invitation } from "./Invitation"

type Props = {
  themeId: "royal-blue" | "emerald-fern" | "burgundy-velvet" | "magnolia-ivory"
  draft: InviteDraft
  template: Template
  onOpen?: () => void
  onComplete?: () => void
  onSkip?: () => void
}

const themeData: Record<Props["themeId"], { name: string; bg: string; sealTop: string }> = {
  "royal-blue": {
    name: "أزرق ملكي وذهبي",
    bg: "#0d1b2a",
    sealTop: "47.5%",
  },
  "emerald-fern": {
    name: "أخضر زمردي وسرخس",
    bg: "#10281b",
    sealTop: "49.3%",
  },
  "burgundy-velvet": {
    name: "عنابي مخملي وورد",
    bg: "#2b0f1a",
    sealTop: "48.6%",
  },
  "magnolia-ivory": {
    name: "عاجي ومجنوليا بارزة",
    bg: "#f3ede3",
    sealTop: "49%",
  },
}

export function RealisticEnvelopeOpening({
  themeId,
  draft,
  onOpen,
  onComplete,
  onSkip,
}: Props) {
  const [phase, setPhase] = useState<"closed" | "opening" | "rising" | "done">("closed")
  const config = themeData[themeId]
  const assetBase = `/envelopes/${themeId}`

  const handleStart = () => {
    if (phase !== "closed") return
    setPhase("opening")
    onOpen?.()

    // Step 1: Flap flips open slowly (0s -> 1.3s)
    // Step 2: Light burst and card rises out of pocket in slow motion (1.2s -> 3.3s)
    window.setTimeout(() => {
      setPhase("rising")
    }, 1100)

    // Step 3: Complete transition to full invite (3.6s)
    window.setTimeout(() => {
      setPhase("done")
      onComplete?.()
    }, 3600)
  }

  const isFlapOpen = phase === "opening" || phase === "rising" || phase === "done"
  const isCardRising = phase === "rising" || phase === "done"

  return (
    <main
      className="real-env-screen"
      style={{ backgroundColor: config.bg }}
      aria-label="شاشة فتح الظرف التفاعلي"
    >
      <div className="real-env-stage">
        <div
          className={`real-env-envelope ${isFlapOpen ? "is-open" : ""} ${isCardRising ? "is-rising" : ""}`}
          onClick={phase === "closed" ? handleStart : undefined}
        >
          {/* 1. Back wall / Liner */}
          <div className="real-env-back">
            <img src={`${assetBase}/liner.jpg`} alt="" className="real-env-liner-img" />
          </div>

          {/* Light Burst & Aura emanating from inside the envelope */}
          <div className={`real-env-glow-burst ${isFlapOpen ? "is-active" : ""}`} aria-hidden="true" />
          <div className={`real-env-light-beam ${isFlapOpen ? "is-active" : ""}`} aria-hidden="true" />

          {/* 2. Invitation Card inside the pocket */}
          <div className={`real-env-card-slot ${isCardRising ? "card-raised" : ""}`}>
            <div className="real-env-card-inner">
              <Invitation draft={draft} />
            </div>
            {/* Shimmer light pass across the card */}
            <div className={`real-env-card-shimmer ${isCardRising ? "shimmer-run" : ""}`} aria-hidden="true" />
          </div>

          {/* 3. Front Pocket (covers the bottom part of the card) */}
          <div className="real-env-pocket">
            <img src={`${assetBase}/pocket.png`} alt="" className="real-env-pocket-img" />
          </div>

          {/* 4. Top Flap that rotates open in 3D */}
          <div className={`real-env-flap ${isFlapOpen ? "flap-open" : ""}`}>
            <div className="real-env-flap-front">
              <img src={`${assetBase}/flap.png`} alt="" className="real-env-flap-img" />
            </div>
            <div className="real-env-flap-back">
              <img src={`${assetBase}/liner.jpg`} alt="" className="real-env-flap-back-img" />
            </div>
          </div>

          {/* 5. Wax Seal button at center */}
          <div
            className={`real-env-seal-wrapper ${isFlapOpen ? "seal-broken" : ""}`}
            style={{ top: config.sealTop }}
          >
            <button
              type="button"
              className="real-env-seal-btn"
              onClick={handleStart}
              aria-label="اضغط لفتح الظرف"
            >
              <img src={`${assetBase}/seal.png`} alt="ختم الشمع" className="real-env-seal-img" />
              {phase === "closed" && (
                <>
                  <span className="real-env-seal-glow" />
                  <span className="real-env-seal-label">اضغط لفتح الدعوة ✦</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Skip button */}
        {onSkip && (
          <button
            type="button"
            className="real-env-skip-btn"
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
