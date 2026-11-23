import type { ReactNode } from "react"

type Props = { children: ReactNode; className?: string }

/** Romantic stationery frame for the live invitation preview. */
export function PhonePreview({ children, className = "" }: Props) {
  return (
    <div className={`romantic-preview relative mx-auto w-full ${className}`}>
      <div className="romantic-preview-shadow" aria-hidden="true" />
      <div className="romantic-preview-frame">
        <span className="romantic-preview-ornament romantic-preview-ornament-top" aria-hidden="true">❦</span>
        <span className="romantic-preview-ornament romantic-preview-ornament-bottom" aria-hidden="true">❦</span>
        <div className="romantic-preview-paper">
          <div className="romantic-preview-inner">{children}</div>
        </div>
      </div>
      <p className="mt-3 text-center font-display text-xs tracking-[.18em] text-[#9b7580]">دعوتكم بكل حب ♡</p>
    </div>
  )
}
