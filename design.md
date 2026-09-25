# Design system: Pranshu Kumar portfolio

## Concept

**"The whole signal chain."** Every project Pranshu has built runs from a physical signal to a decision: sensor, firmware, radio link, filter, controller, screen. The site is art-directed like an engineering drawing set that has been edited by a magazine: ruled sheets, figure captions, a title block in the footer, and diagrams computed from real parameters rather than illustrations.

Three rules drive every decision:

1. **Information is the decoration.** No ornament that does not carry a fact. The waveform on the home page is a synthetic input run through the real ParkinSense filter chain in the browser. The footer "title block" lists the actual sheet, author, location and revision.
2. **One accent, used to mean something.** Red marks the active state, the detected tremor, the flagship, the current page. It is never a background wash.
3. **Hierarchy before effect.** ParkinSense gets the only full-bleed band on the home page. Other projects step down in scale and treatment.

## Color

One dominant accent (signal red) on a warm graphite / paper neutral system. The red was chosen because it reads as instrumentation (warning markers, probe leads, oscilloscope channel colours) and because it is the colour of the cap and jacket in the portrait, which ties the photograph to the layout without any colour grading.

| Token | Dark (default) | Light | Use |
|---|---|---|---|
| `--background` | `#0E0E0D` | `#EFEDE7` | Page |
| `--surface` | `#151513` | `#E6E3DB` | Flagship band, next-project band, primary gauge |
| `--surface-hover` | `#1C1C1A` | `#DEDAD1` | Hover on surfaces and table rows |
| `--foreground` | `#ECE9E2` | `#121211` | Text, strong rules, traces |
| `--muted` | `#8F8C85` | `#5C5A55` | Secondary text, labels |
| `--faint` | `#5B5954` | `#8D8A83` | Index numbers, tertiary |
| `--border` | `#2A2926` | `#CFCBC1` | Hairlines |
| `--rule` | `rgba(236,233,226,.045)` | `rgba(18,18,17,.06)` | Sheet margin rules |
| `--accent` | `#FF4A2B` | `#C8270E` | The one accent |
| `--accent-contrast` | `#0E0E0D` | `#EFEDE7` | Text on accent |

Contrast: foreground on background is ~16:1 in both themes. Muted is ~5.6:1 (dark) and ~6:1 (light). The accent is 5.7:1 on dark and 4.7:1 on light, so it is safe for small labels.

Deliberately absent: gradients, glass, glows, a second accent, blue.

## Typography

| Role | Face | Setting |
|---|---|---|
| Display / structure | **Archivo** (variable, width axis) | `font-stretch: 66–72%`, weight 700–760, uppercase, line-height 0.84–0.95 |
| Voice / project names | **Instrument Serif** | Regular; ledes, pull statements, project titles |
| Data / labels | **JetBrains Mono** | 0.7rem, uppercase, tracking 0.08em |
| Body | Archivo at normal width | 1.0625rem / 1.55 |

Why: condensed Archivo gives the name and section heads the density of a drawing title block. Instrument Serif keeps project names in their real mixed case (ParkinSense, TremoSense) and gives the voice a human, editorial register. Mono is reserved for metadata and numbers-with-units so that everything "measured" looks measured.

Rules:
- Project names are always serif. Section headings are always condensed caps. Labels are always mono.
- Line length for prose is capped at 56–62ch; ledes at 24–36ch.
- Numerals use tabular figures.

Scale (fluid): label 0.7rem, small 0.875rem, body 1.0625rem, lede `clamp(1.45rem → 2.1rem)`, h3 `clamp(1.5rem → 2.1rem)`, h2 `clamp(2.6rem → 5.5rem)`, display `clamp(4.4rem → 14rem)`.

## Spacing and layout

- 4px base: `--s-1` 0.25rem … `--s-10` 8rem. Section rhythm `--section: clamp(4.5rem → 7.5rem)`.
- 12-column grid, max width 1440px, gutter `clamp(1rem → 3.5rem)`, column gap `clamp(1rem → 2rem)`.
- Two faint vertical rules sit in the page margins (the sheet border). They never cross text.
- Asymmetry is structural, not random: the hero splits 7/5 with the portrait running full height; TremoSense is offset two columns; case-study sections put a sticky label rail in columns 1–3 and content in 4–12.

## Border radius

**Zero, everywhere.** Engineering drawings, datasheets and PCB silkscreen are square. Rounded corners were the fastest route back to a template look, so there are none, including buttons and focus rings.

## Components

- **Section head**: accent index (01, 02 / A, B), condensed title, right-aligned aside, hairline beneath.
- **Figures**: every diagram has a caption stating what is documented and what is illustrative.
- **Spec rows** (`dl`): mono key, value, hairline. Used for hardware, outputs, metadata.
- **Stages**: ordered signal chain. Horizontal on desktop, vertical on phones; optional dashed feedback path for closed loops.
- **Links**: mono with a hairline underline that turns accent on hover, arrow nudges 4px. Buttons exist only on Contact.
- **No cards, no pills, no badges.** Grouping is done with rules and alignment.

## Photography

Only real images: the portrait (tight 4:5 crop, face and red jacket carry the accent), and project media from the repositories (ParkinSense wrist and enclosure photos, dashboard captures, TremoSense bench footage and Simulink plots). Photos sit in plain 1px-bordered frames with mono figure captions; no filters, no rounded corners.

## Motion

Premium means restrained. Four sequences, nothing else:

1. **Page load (home)**: name rises line by line from a mask, the portrait wipes up from its base, supporting metadata fades in last. Under 1.2s.
2. **Route change**: one accent hairline sweeps across the top; the page fades out in 160ms and in over 420ms. All route chunks are prefetched at idle so there is never a blank frame.
3. **Case-study open**: title rises from its mask, the accent rule under it extends, meta and figures follow within 250ms.
4. **Scroll**: one reveal (22px rise + fade, once) and left-to-right wipes on data traces. Stage chains light up in order once.

Easing `cubic-bezier(0.16, 1, 0.3, 1)`. No parallax, no scroll-jacking, no custom cursor. `prefers-reduced-motion` renders every element in its final state with no transitions.

## Accessibility

Semantic landmarks, skip link, visible 2px accent focus ring, WAI-ARIA tabs for the ParkinSense pipeline (arrow / Home / End keys), `aria-expanded` expanders on Experience, focus-trapped mobile menu with Escape, 44px touch targets, text alternatives for every diagram (and a hidden data table for the semester chart).

## References

No `/web_design_references` folder was provided. The design draws on engineering drawing conventions (title blocks, figure numbering, crop marks), component datasheets (TremoSense page) and editorial magazine layout.
