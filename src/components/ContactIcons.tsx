import type { ReactNode } from 'react'

/** Small line icons, drawn on a 24px grid in currentColor so they follow the theme and hover colour. */
function Icon({ children }: { children: ReactNode }) {
  return (
    <svg
      className="crow__svg"
      viewBox="0 0 24 24"
      width="24"
      height="24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {children}
    </svg>
  )
}

export const PhoneIcon = () => (
  <Icon>
    <path d="M5 4.5h3.2l1.4 3.6-1.9 1.3a11 11 0 0 0 5.9 5.9l1.3-1.9 3.6 1.4V19a1.5 1.5 0 0 1-1.6 1.5A15.5 15.5 0 0 1 3.5 6.1 1.5 1.5 0 0 1 5 4.5Z" />
  </Icon>
)

export const WhatsAppIcon = () => (
  <Icon>
    <path d="M12 3.5a8.5 8.5 0 0 0-7.3 12.8L3.5 20.5l4.3-1.1A8.5 8.5 0 1 0 12 3.5Z" />
    <path d="M9.2 8.6c.2-.4.5-.4.8-.4.2 0 .4.4.6 1s.1.8-.2 1.1l-.4.5a5.2 5.2 0 0 0 2.6 2.6l.5-.4c.3-.3.6-.3 1.1-.2s.9.4 1 .6c0 .3 0 .6-.4.8-1 .8-2.3.6-3.6-.1a7 7 0 0 1-3.1-3.1c-.7-1.3-.8-2.1 0-2.4Z" />
  </Icon>
)

export const MessageIcon = () => (
  <Icon>
    <path d="M4 5.5h16a1 1 0 0 1 1 1v9.5a1 1 0 0 1-1 1h-8l-4.5 3.5V17H4a1 1 0 0 1-1-1V6.5a1 1 0 0 1 1-1Z" />
    <path d="M8 10.8h.01M12 10.8h.01M16 10.8h.01" strokeWidth="2" />
  </Icon>
)

export const MailIcon = () => (
  <Icon>
    <rect x="3" y="5.5" width="18" height="13" rx="1.5" />
    <path d="m3.5 7 8.5 6 8.5-6" />
  </Icon>
)

/** Flags as small SVGs: emoji flags render as plain letters on Windows. */
export const IndiaFlag = () => (
  <svg className="flag" viewBox="0 0 24 16" width="24" height="16" aria-hidden="true" focusable="false">
    <rect width="24" height="16" fill="#fff" />
    <rect width="24" height="5.34" fill="#ff9933" />
    <rect y="10.66" width="24" height="5.34" fill="#138808" />
    <circle cx="12" cy="8" r="2" fill="none" stroke="#000080" strokeWidth="0.7" />
    <circle cx="12" cy="8" r="0.5" fill="#000080" />
  </svg>
)

export const UaeFlag = () => (
  <svg className="flag" viewBox="0 0 24 16" width="24" height="16" aria-hidden="true" focusable="false">
    <rect width="24" height="5.34" fill="#00732f" />
    <rect y="5.33" width="24" height="5.34" fill="#fff" />
    <rect y="10.66" width="24" height="5.34" fill="#000" />
    <rect width="6.5" height="16" fill="#ff0000" />
  </svg>
)
