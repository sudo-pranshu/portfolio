/**
 * Single source of truth for identity, contact and social links.
 * Edit here; nothing else in the codebase hard-codes these values.
 */
const base = import.meta.env.BASE_URL

/** Resolve a file in /public against the build base, so hash-routed static builds work too. */
export const asset = (path: string) => `${base}${path}`

export const personal = {
  name: 'Pranshu Kumar',
  firstName: 'Pranshu',
  lastName: 'Kumar',
  location: 'Mumbai / Dubai',
  email: 'pranshu.innovate@gmail.com',
  phones: [
    { id: 'in', label: 'India', display: '+91 91673 06770', e164: '+919167306770', digits: '919167306770', href: 'tel:+919167306770' },
    { id: 'ae', label: 'UAE', display: '+971 52 201 2130', e164: '+971522012130', digits: '971522012130', href: 'tel:+971522012130' },
  ],
  linkedin: 'https://www.linkedin.com/in/notpranshu/',
  github: 'https://github.com/sudo-pranshu',
  instagram: 'https://www.instagram.com/prvnshu/',
  resume: `${base}assets/resume.pdf`,
  resumeTwoPage: `${base}assets/resume-2page.pdf`,
  photo: {
    jpg: `${base}assets/profile.jpg`,
    webp: `${base}assets/profile.webp`,
    alt: 'Pranshu Kumar in a red cap and red jacket, standing on a wet street under an overcast sky',
  },
  /** Canonical / Open Graph base. Set at build time (see vite.config.ts). */
  siteUrl: import.meta.env.VITE_SITE_URL as string,
} as const

export const socials = [
  { label: 'LinkedIn', handle: 'notpranshu', href: personal.linkedin },
  { label: 'GitHub', handle: 'sudo-pranshu', href: personal.github },
  { label: 'Instagram', handle: 'prvnshu', href: personal.instagram },
] as const

/** Direct-contact URLs per number. WhatsApp's prefilled text is a draft; the visitor still taps send. */
const waText = 'Hi Pranshu, I came across your portfolio and wanted to connect!'
export const contactLinks = {
  call: (p: { e164: string }) => `tel:${p.e164}`,
  whatsapp: (p: { digits: string }) => `https://wa.me/${p.digits}?text=${encodeURIComponent(waText)}`,
  sms: (p: { e164: string }) => `sms:${p.e164}`,
  email: `mailto:${personal.email}`,
} as const
