import { Page } from '../components/Page'
import { Reveal } from '../components/Reveal'
import { SemesterPanel } from '../components/diagrams/SemesterPanel'
import { education, semesters } from '../data/career'

export default function Education() {
  const best = [...semesters].sort((a, b) => b.sgpa - a.sgpa)[0]
  return (
    <Page
      title="Education | Pranshu Kumar"
      description="B.Tech in Electronics & Telecommunication Engineering at VJTI Mumbai with a minor in AI & ML. CGPA 9.17 after six semesters; academic branch topper in first year."
      path="/education"
    >
      <section className="wrap page-head edu-head">
        <span className="label label--accent">04 · Education</span>
        <h1 className="page-head__title display">VJTI, Mumbai</h1>
        <div className="edu-head__grid">
          <dl className="edu-facts">
            <div>
              <dt className="label">Institute</dt>
              <dd>{education.school}</dd>
            </div>
            <div>
              <dt className="label">Degree</dt>
              <dd>
                {education.degree}, {education.branch}
              </dd>
            </div>
            <div>
              <dt className="label">Minor</dt>
              <dd>{education.minor}</dd>
            </div>
            <div>
              <dt className="label">Expected</dt>
              <dd>{education.graduation}</dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="wrap section edu" aria-label="Academic record">
        <div className="gauges">
          <div className="gauge gauge--main">
            <span className="label">Cumulative GPA</span>
            <span className="num gauge__v">{education.cgpa.toFixed(2)}</span>
            <span className="gauge__of">out of 10, after semester VI</span>
          </div>
          <div className="gauge">
            <span className="label">Best semester</span>
            <span className="num gauge__v gauge__v--s">{best.sgpa.toFixed(2)}</span>
            <span className="gauge__of">SGPA, semester {best.n}</span>
          </div>
          <div className="gauge">
            <span className="label">Credits earned</span>
            <span className="num gauge__v gauge__v--s">{education.creditsEarned}</span>
            <span className="gauge__of">through semester VI</span>
          </div>
          <div className="gauge">
            <span className="label">Standing</span>
            <span className="gauge__t">Branch topper</span>
            <span className="gauge__of">First year</span>
          </div>
        </div>

        <Reveal className="edu__panel">
          <SemesterPanel />
        </Reveal>
      </section>
    </Page>
  )
}
