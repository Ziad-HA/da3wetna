import type { ReactNode } from "react"

type Props = {
  children: ReactNode
  className?: string
}

/** A realistic Android-style phone mockup for invitation previews. */
export function PhonePreview({ children, className = "" }: Props) {
  return (
    <div className={`phone-preview relative mx-auto aspect-[9/19.5] w-full ${className}`}>
      {/* Slim physical side buttons, kept behind the phone frame. */}
      <span aria-hidden="true" className="absolute -left-[3px] top-[17%] z-0 h-[6%] w-[4px] rounded-l-full bg-[#25262a]" />
      <span aria-hidden="true" className="absolute -left-[3px] top-[26%] z-0 h-[10%] w-[4px] rounded-l-full bg-[#25262a]" />
      <span aria-hidden="true" className="absolute -right-[3px] top-[23%] z-0 h-[15%] w-[4px] rounded-r-full bg-[#25262a]" />

      <div className="phone-preview-frame relative z-[1] h-full w-full rounded-[1.8rem] border-[5px] border-[#24252a] bg-[linear-gradient(145deg,#55565c_0%,#17181c_18%,#090a0d_70%,#3c3d43_100%)] p-[4px] shadow-[0_22px_48px_rgba(25,20,25,.32),inset_0_0_0_1px_rgba(255,255,255,.22)] sm:rounded-[2.15rem] sm:border-[6px] sm:p-[5px]">
        <div className="phone-preview-screen relative flex h-full flex-col overflow-hidden rounded-[1.4rem] bg-[#fffaf9] ring-1 ring-black/15 sm:rounded-[1.75rem]">
          {/* Android-style status bar with a small centered punch-hole camera. */}
          <div className="phone-preview-status relative z-20 flex h-[6.4%] min-h-[17px] shrink-0 items-center justify-between px-[8%] pt-[1%] text-[7px] font-semibold text-[#29252a] sm:text-[9px]" aria-hidden="true">
            <span className="tracking-tight">9:41</span>
            <span className="absolute left-1/2 top-[35%] h-[6px] w-[6px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#111216] ring-[2px] ring-[#d8d8da] sm:h-[7px] sm:w-[7px]" />
            <span className="flex items-center gap-[3px] text-[7px] sm:text-[9px]"><span>▮▮▮</span><span>◖</span><span>▰</span></span>
          </div>

          <div className="flex min-h-0 flex-1 items-center justify-center overflow-hidden px-[1.4%]">
            <div className="phone-preview-invite aspect-[9/16] w-full overflow-hidden rounded-[3px] bg-white shadow-[0_0_0_1px_rgba(30,20,25,.05)]">
              {children}
            </div>
          </div>

          {/* Android gesture navigation bar, rather than the iPhone home indicator. */}
          <div className="phone-preview-homebar relative flex h-[5.5%] shrink-0 items-center justify-center bg-[#fffaf9]" aria-hidden="true">
            <span className="h-[3px] w-[24%] rounded-full bg-[#29252a]/75 sm:h-1" />
          </div>
        </div>
      </div>
      <span className="pointer-events-none absolute -inset-x-3 -bottom-4 -z-10 h-9 rounded-[50%] bg-[#8e5361]/20 blur-xl" />
    </div>
  )
}
