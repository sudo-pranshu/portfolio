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
    { label: 'India', display: '+91 91673 06770', href: 'tel:+919167306770' },
    { label: 'UAE', display: '+971 52 201 2130', href: 'tel:+971522012130' },
  ],
  linkedin: 'https://www.linkedin.com/in/notpranshu/',
  github: 'https://github.com/sudo-pranshu',
  instagram: 'https://www.instagram.com/prvnshu/',
  resume: `${base}assets/resume.pdf`,
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
