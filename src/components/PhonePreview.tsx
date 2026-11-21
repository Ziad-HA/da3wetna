import type { ReactNode } from "react"

type Props = {
  children: ReactNode
  className?: string
}

/** A realistic phone mockup for invitation previews. */
export function PhonePreview({ children, className = "" }: Props) {
  return (
    <div className={`phone-preview relative mx-auto w-full ${className}`}>
      <div className="phone-preview-frame relative overflow-hidden rounded-[2.15rem] border-[5px] border-[#29252a] bg-[#29252a] p-[5px] shadow-[0_18px_42px_rgba(63,35,43,.24),inset_0_0_0_1px_rgba(255,255,255,.24)] sm:rounded-[2.6rem] sm:border-[7px] sm:p-[7px]">
        <div className="phone-preview-screen relative flex h-full flex-col overflow-hidden rounded-[1.75rem] bg-[#fffaf9] sm:rounded-[2.1rem]">
          <div className="relative z-10 flex h-[7.5%] shrink-0 items-center justify-between px-[8%] text-[7px] font-bold text-[#4a2d33] sm:text-[9px]" aria-hidden="true">
            <span>9:41</span>
            <span className="absolute left-1/2 top-1/2 h-[11px] w-[29%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#201d21] sm:h-[14px]" />
            <span className="flex items-center gap-1"><span>▮▮▮</span><span>◖</span><span>▰</span></span>
          </div>
          <div className="flex min-h-0 flex-1 items-center justify-center overflow-hidden px-[1.5%]">
            <div className="phone-preview-invite aspect-[9/16] w-full overflow-hidden rounded-[2px]">
              {children}
            </div>
          </div>
          <div className="flex h-[6.5%] shrink-0 items-center justify-center" aria-hidden="true">
            <span className="h-[3px] w-[29%] rounded-full bg-[#302b30]/75 sm:h-1" />
          </div>
        </div>
      </div>
      <span className="pointer-events-none absolute -inset-x-2 -bottom-3 -z-10 h-8 rounded-[50%] bg-[#a64257]/10 blur-xl" />
    </div>
  )
}
