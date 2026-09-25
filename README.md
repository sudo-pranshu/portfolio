# Pranshu Kumar: portfolio

React 19 + TypeScript + Vite, React Router, Motion. Hand-written CSS on design tokens (no CSS framework). See `design.md` for the visual system.

## Run

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # outputs dist/
npm run preview    # serve the production build
```

## Edit content

| What | Where |
|---|---|
| Name, email, phones, social links, résumé path, photo, site URL | `src/config/personal.ts` |
| Projects (title, figures, stack, `github`, `demo`, `images`) | `src/data/projects.ts` |
| Experience, semesters, skills, domain matrix, achievements, areas of interest | `src/data/career.ts` |
| Navigation order | `src/config/nav.ts` |
| Case-study long-form copy and diagrams | `src/pages/work/*.tsx` |
| Colours, type, spacing | `src/styles/tokens.css` |
| Fonts (self-hosted Latin subsets, OFL) | `src/assets/fonts/`, `src/styles/fonts.css` |

- **Photo**: `public/assets/profile.jpg` (+ `profile.webp`). The current file is an art-directed 4:5 crop of the original. Replace both files to change it.
- **Résumé**: `public/assets/resume.pdf`.
- **Project repos / demos**: set `github` or `demo` on a project in `projects.ts`; the case study shows the link automatically. While `null`, it links to the GitHub profile instead.
- **Domain**: the site URL for canonical and Open Graph tags is set at build time. On Vercel it comes from the project's production domain automatically; elsewhere set `VITE_SITE_URL` (for example `VITE_SITE_URL=https://example.com npm run build`).

## Routes

`/`, `/work`, `/work/parkinsense`, `/work/tremosense`, `/work/navisight`, `/work/rl-autonomous-car`, `/work/wall-e`, `/work/traffic-management`, `/about`, `/experience`, `/education`, `/contact`, plus a 404.

Skills and achievements live on `/about` rather than a separate `/skills` page, to keep the navigation to five items and avoid a page that would only be a list.

## Deploy (Vercel)

1. Push this folder to a GitHub repository.
2. In Vercel: **Add New → Project → Import** that repository. Vercel reads `vercel.json`, so leave the settings as detected (framework Vite, build `npm run build`, output `dist`) and press **Deploy**.
3. Every push to `main` redeploys. Pull requests get preview URLs.

`vercel.json` rewrites every non-asset path to `index.html`, so direct links such as `/work/parkinsense` and browser refresh work. Canonical and Open Graph URLs are filled in at build time from Vercel's production domain, including a custom domain once you add one.

Other hosts: `public/_redirects` covers Netlify and Cloudflare Pages; for GitHub Pages copy `dist/index.html` to `dist/404.html`; for any host without rewrites, `npm run build:static` outputs `dist-static/` with hash URLs.

## Structure

```
src/
  animations/   shared easing and variants
  components/   Nav, Footer, Page, Portrait, Case*, Reveal, SecHead, CopyEmail
    diagrams/   SignalFigure (live DSP), PipelineExplorer, PacketTiming, LockStates,
                BandPlot, Stages, LineFollower, DomainMatrix, TimeRuler, SemesterPanel
  config/       personal.ts, nav.ts
  data/         projects.ts, career.ts
  hooks/        useSeo, useTheme
  pages/        Home, Work, About, Experience, Education, Contact, NotFound, work/*
  styles/       tokens, base, shell, home, pages, case, diagrams
```

## Content sources

- **Résumé** and **VJTI semester grade reports**: education, experience, NaviSight, Wall-E.
- **Public GitHub repositories** (take precedence over the résumé where they disagree):
  - ParkinSense: `sudo-pranshu/ParkinSense` (README, photos, dashboard captures, power figures)
  - TremoSense: `rkt-1597/TremoSense-Project` (README, firmware, Simulink results, demo footage)
  - RL Autonomous Car: `sudo-pranshu/rl-autonomous-car` (source code)
  - Automated Traffic Management System: `sudo-pranshu/Automated-Traffic-Management-System` (source code)
- Derived numbers (packet rate, sample spacing) are labelled as derived. Simulation results are labelled as simulated. The motion-pipeline waveform uses a synthetic input and says so on the page.
- Project media lives in `public/assets/work/`.
