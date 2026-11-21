import type { ReactNode } from "react"

type Props = {
  children: ReactNode
  className?: string
}

/** A detailed, device-inspired phone mockup for invitation previews. */
export function PhonePreview({ children, className = "" }: Props) {
  return (
    <div className={`phone-preview relative mx-auto aspect-[9/19.5] w-full ${className}`}>
      {/* Side controls sit behind the metal frame, like a real handset. */}
      <span aria-hidden="true" className="absolute -left-[3px] top-[18%] z-0 h-[7%] w-[4px] rounded-l-full bg-[#77747a] shadow-inner" />
      <span aria-hidden="true" className="absolute -left-[3px] top-[28%] z-0 h-[11%] w-[4px] rounded-l-full bg-[#77747a] shadow-inner" />
      <span aria-hidden="true" className="absolute -right-[3px] top-[25%] z-0 h-[14%] w-[4px] rounded-r-full bg-[#77747a] shadow-inner" />

      <div className="phone-preview-frame relative z-[1] h-full w-full rounded-[2.35rem] border-[5px] border-[#77747d] bg-[linear-gradient(135deg,#f4f2f4_0%,#77747d_12%,#242329_27%,#55525a_75%,#d9d6dc_100%)] p-[4px] shadow-[0_22px_48px_rgba(42,27,34,.30),inset_0_0_0_1px_rgba(255,255,255,.65)] sm:rounded-[2.8rem] sm:border-[7px] sm:p-[6px]">
        <div className="phone-preview-screen relative flex h-full flex-col overflow-hidden rounded-[1.9rem] bg-[#fffaf9] ring-1 ring-black/10 sm:rounded-[2.25rem]">
          {/* Status bar and Dynamic-Island-inspired camera area */}
          <div className="phone-preview-status relative z-20 flex h-[7.2%] min-h-[17px] shrink-0 items-center justify-between px-[9%] pt-[1%] text-[7px] font-bold text-[#29252a] sm:text-[9px]" aria-hidden="true">
            <span className="tracking-tight">9:41</span>
            <span className="flex items-center gap-[3px] text-[7px] sm:text-[9px]"><span>▮▮▮</span><span>◖</span><span>▰</span></span>
            <span className="absolute left-1/2 top-[42%] h-[15px] w-[34%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#111116] shadow-[inset_0_1px_2px_rgba(255,255,255,.12)] sm:h-[19px]">
              <i className="absolute right-[13%] top-1/2 h-[4px] w-[4px] -translate-y-1/2 rounded-full bg-[#283044] ring-1 ring-[#343746] sm:h-[5px] sm:w-[5px]" />
            </span>
          </div>

          <div className="flex min-h-0 flex-1 items-center justify-center overflow-hidden px-[1.4%]">
            <div className="phone-preview-invite aspect-[9/16] w-full overflow-hidden rounded-[3px] bg-white shadow-[0_0_0_1px_rgba(30,20,25,.05)]">
              {children}
            </div>
          </div>

          <div className="phone-preview-homebar relative flex h-[6.2%] shrink-0 items-center justify-center bg-[#fffaf9]" aria-hidden="true">
            <span className="h-[3px] w-[29%] rounded-full bg-[#29252a]/80 sm:h-1" />
          </div>
        </div>
      </div>
      <span className="pointer-events-none absolute -inset-x-3 -bottom-4 -z-10 h-9 rounded-[50%] bg-[#8e5361]/20 blur-xl" />
    </div>
  )
}
