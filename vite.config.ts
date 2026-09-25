import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

/**
 * Public site URL used for canonical links and Open Graph tags.
 * Order: explicit VITE_SITE_URL, then Vercel's production domain (set automatically on Vercel builds),
 * then localhost for local builds.
 */
const vercelDomain = process.env.VERCEL_PROJECT_PRODUCTION_URL
process.env.VITE_SITE_URL ??= vercelDomain ? `https://${vercelDomain}` : 'http://localhost:4173'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
})
