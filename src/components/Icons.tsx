type IconProps = { className?: string }

export function LogoMark({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 48 48" aria-hidden="true">
      <circle cx="24" cy="24" r="16" fill="none" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="24" cy="24" r="11.5" fill="none" stroke="currentColor" strokeWidth="0.7" />
      <path d="M24 14.5l1.8 5.4 5.5.2-4.4 3.4 1.6 5.4L24 26.2l-4.5 2.7 1.6-5.4-4.4-3.4 5.5-.2z" fill="currentColor" />
    </svg>
  )
}

export function Chevron({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

export function IconPen({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 20l1.2-4.2L16.4 4.6a1.6 1.6 0 0 1 2.2 0l.8.8a1.6 1.6 0 0 1 0 2.2L8.2 18.8z" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path d="M13.8 6.2l4 4" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  )
}

export function IconLink({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M10 13a5 5 0 0 0 7.1.1l1.4-1.5a5 5 0 0 0-7.1-7.1L10 6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M14 11a5 5 0 0 0-7.1-.1L5.5 12.4a5 5 0 0 0 7.1 7.1L14 18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}

export function IconStory({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <rect x="7" y="3" width="10" height="18" rx="2.2" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path d="M10 18.5h4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}

export function IconWallet({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3" y="6" width="18" height="13" rx="2" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path d="M3 10h18" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="16.5" cy="14.5" r="1" fill="currentColor" />
    </svg>
  )
}

export function IconCard({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3" y="5.5" width="18" height="13" rx="2" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path d="M3 9.5h18" stroke="currentColor" strokeWidth="1.6" />
      <path d="M6.5 14.5h5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}

export function IconBank({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 10h16M6 10v7M12 10v7M18 10v7M4 17h16M12 4l8 6H4z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  )
}

export function WhatsAppIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M12.04 3C7.31 3 3.5 6.76 3.5 11.42c0 1.48.4 2.92 1.15 4.19L3.4 21l5.55-1.2a8.7 8.7 0 0 0 3.09.56h.01c4.73 0 8.54-3.76 8.54-8.42C20.59 6.76 16.77 3 12.04 3zm4.96 11.9c-.21.58-1.2 1.1-1.67 1.16-.43.06-.97.09-1.57-.1-.36-.11-.83-.27-1.43-.53-2.52-1.09-4.16-3.63-4.29-3.8-.12-.17-1.02-1.36-1.02-2.59s.64-1.84.87-2.09c.21-.23.47-.29.63-.29h.45c.14 0 .34-.05.53.4.21.5.71 1.73.77 1.86.06.12.1.27.02.43-.08.17-.12.27-.24.41-.12.14-.25.32-.36.43-.12.12-.24.24-.1.47.14.23.62 1.02 1.33 1.65.92.82 1.69 1.08 1.93 1.2.24.12.38.1.52-.06.14-.17.6-.7.76-.94.16-.23.32-.2.53-.12.21.08 1.35.64 1.58.75.23.12.39.17.45.27.06.1.06.58-.15 1.16z"
      />
    </svg>
  )
}
