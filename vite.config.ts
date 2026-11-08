import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'

/**
 * Public site URL used for canonical links and Open Graph tags.
 * Order: explicit VITE_SITE_URL, then Vercel's production domain (set automatically on Vercel builds),
 * then localhost for local builds.
 */
const vercelDomain = process.env.VERCEL_PROJECT_PRODUCTION_URL
process.env.VITE_SITE_URL ??= vercelDomain ? `https://${vercelDomain}` : 'http://localhost:4173'

/** One id per build, baked into the bundle and published as /version.json so open tabs can tell when a newer deploy exists. */
const buildId = Date.now().toString(36)
const versionFile = (): Plugin => ({
  name: 'version-file',
  apply: 'build',
  generateBundle() {
    this.emitFile({ type: 'asset', fileName: 'version.json', source: JSON.stringify({ id: buildId }) })
  },
})

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), versionFile()],
  define: { __BUILD_ID__: JSON.stringify(buildId) },
})
