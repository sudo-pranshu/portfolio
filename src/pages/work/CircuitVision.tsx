import { Page } from '../../components/Page'
import { CaseHeader, CaseLinks, CaseSection, NextProject } from '../../components/Case'
import { Photo } from '../../components/Photo'
import { Stages } from '../../components/diagrams/Stages'
import { BeforeAfter } from '../../components/cv/BeforeAfter'
import { CVPipeline } from '../../components/cv/CVPipeline'
import { getProject } from '../../data/projects'

const p = getProject('circuitvision')!

/** Source: github.com/sudo-pranshu/CircuitVision (README, docs/PROJECT_STATUS.md, EXPERIMENTS.md, results/). */
const results: [string, string, string][] = [
  ['Detection, unseen drafter: mAP50 / mAP50-95', '0.904 / 0.611', 'Real CGHD, 96 photos, 1,628 symbols'],
  ['Detection precision / recall', '0.886 / 0.875', 'Real CGHD'],
  ['Correct circuit, ground-truth boxes', '37.5 %', 'Real CGHD, 48 analog photos'],
  ['Correct circuit, detector boxes', '10.4 %', 'Real CGHD, 48 analog photos'],
  ['OCR on handwritten labels, exact', '0.021', 'Real CGHD'],
  ['Exact wire topology, 11 photo conditions', '0.994', 'Synthetic, known graphs'],
  ['End to end with ground-truth boxes', '18 / 18', 'Synthetic drafters'],
  ['Text → netlist, held-out sentences', '0.90 exact', 'Hand-written, evaluated once'],
  ['Text → netlist, teammate’s blind set', '0.75 exact', 'Hand-written, evaluated once'],
  ['Unit and regression tests', '136 pass', '—'],
]

export default function CircuitVision() {
  return (
    <Page
      title="CircuitVision | Hand-Drawn Circuit to SPICE Netlist | Pranshu Kumar"
      description="CircuitVision: a YOLOv8, OpenCV, HOG + SVM and EasyOCR pipeline that turns photos of hand-drawn circuits into validated SPICE netlists simulated in ngspice, plus an HMM-based text-to-netlist path."
      path="/work/circuitvision"
      className="case case--cv"
    >
      <CaseHeader p={p} flagship />

      <section className="wrap cabstract">
        <p className="cabstract__lede serif">{p.summary}</p>
        <p className="cabstract__note muted">
          Every result is labelled real (CGHD photos), synthetic (generated with known answers) or hand-written test
          sentences, and the numbers on this page come straight from the files in the repository.
        </p>
      </section>

      <section className="wrap cv-hero" aria-label="Before and after">
        <BeforeAfter />
      </section>

      <CaseSection n="01" title="Why" kicker="Drawing is fast; netlists are not." id="why">
        <p className="prose">
          Students and engineers sketch circuits by hand, then retype them as netlists to simulate them. That step is
          slow and error-prone. CircuitVision reads the sketch directly: which components are there, which way round
          they are, how the wires connect them and what values are written next to them, and it refuses to hand back a
          netlist that doesn’t parse or can’t be simulated.
        </p>
      </CaseSection>

      <CaseSection n="02" title="The image pipeline" kicker="Explore each stage." wide id="pipeline">
        <CVPipeline />
      </CaseSection>

      <CaseSection n="03" title="Text to netlist" kicker="The same back end, from a sentence." wide id="nlp">
        <Stages
          label="Text to netlist stages"
          dense
          stages={[
            { name: 'Tokenise', detail: 'Values like 4k7, 330R' },
            { name: 'HMM tagger', detail: 'Viterbi decoding' },
            { name: 'Chunk', detail: 'Components and values' },
            { name: 'Parse', detail: 'Series, parallel, nesting' },
            { name: 'Netlist', detail: 'Same checks + ngspice' },
          ]}
        />
        <p className="prose csec__p">
          “A 9V battery driving a 1k resistor in series with a 2k resistor in parallel with a 3k resistor” becomes a
          checked netlist. It covers series and parallel descriptions, reports missing values instead of guessing, and
          doesn’t yet handle bridges or circuits that need named nodes.
        </p>
      </CaseSection>

      <CaseSection n="04" title="Results" kicker="Real, synthetic and hand-written, kept apart." wide id="results">
        <div className="tscroll">
          <table className="dsheet">
            <caption className="sr-only">CircuitVision results</caption>
            <thead>
              <tr>
                <th scope="col" className="label">
                  Measure
                </th>
                <th scope="col" className="label">
                  Value
                </th>
                <th scope="col" className="label">
                  Data
                </th>
              </tr>
            </thead>
            <tbody>
              {results.map(([a, b, c]) => (
                <tr key={a}>
                  <th scope="row">{a}</th>
                  <td className="dsheet__v">{b}</td>
                  <td className="muted">{c}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="prose csec__p">
          Detection is strong; full reconstruction on real photos is not yet. Training stopped early at epoch 73 of 100
          and the best epoch, 43, is the one evaluated. The main downstream failure is battery terminals during wire
          tracing, then OCR on handwriting. Half the test photos are logic-gate diagrams with nothing to reconstruct.
        </p>
        <Photo
          src="assets/work/cv-user-photos"
          width={1400}
          height={858}
          alt="Two real user photos with CircuitVision overlays: a circuit on plain paper with its topology recovered, and one on ruled notebook paper where ruling lines are traced as wires"
          caption="User testing: on plain paper the topology is recovered; on ruled paper the lines are traced as wires"
        />
      </CaseSection>

      <CaseSection n="05" title="Limits and next steps" kicker="Stated in the repo, repeated here." wide id="next">
        <div className="notes">
          <div className="notes__col">
            <span className="label label--accent">Scope</span>
            <h3 className="notes__t">Two-terminal parts</h3>
            <p>Transistors, ICs, switches and lamps are masked, not modelled. AC sources are excluded rather than simulated as DC.</p>
          </div>
          <div className="notes__col">
            <span className="label label--accent">Measurement</span>
            <h3 className="notes__t">No real ground-truth graphs</h3>
            <p>
              CGHD has no circuit graphs, so exact topology is measured on synthetic data and real topology through
              proxies and 12 hand-checked reference netlists.
            </p>
          </div>
          <div className="notes__col">
            <span className="label label--accent">Next</span>
            <h3 className="notes__t">Batteries, handwriting, paper</h3>
            <p>Battery terminals in tracing, value reading on real handwriting, and ruled-paper backgrounds.</p>
          </div>
        </div>
        <ul className="contrib">
          {p.contributions?.map((c) => (
            <li key={c}>{c}</li>
          ))}
        </ul>
      </CaseSection>

      <CaseLinks p={p} />
      <NextProject slug={p.slug} />
    </Page>
  )
}
