import { Page } from '../components/Page'
import { CopyEmail } from '../components/CopyEmail'
import { personal, socials } from '../config/personal'

export default function Contact() {
  return (
    <Page
      title="Contact | Pranshu Kumar"
      description="Contact Pranshu Kumar: email, phone in India and the UAE, LinkedIn, GitHub, and résumé."
      path="/contact"
    >
      <section className="wrap page-head contact-head">
        <span className="label label--accent">05 · Contact</span>
        <h1 className="page-head__title display">Get in touch</h1>
        <p className="page-head__lede serif">
          Open to engineering, research and consulting opportunities in hardware, semiconductors, embedded systems,
          signal processing and AI.
        </p>
      </section>

      <section className="wrap contact" aria-label="Contact details">
        <div className="contact__mail">
          <span className="label">Email, the fastest route</span>
          <a href={`mailto:${personal.email}`} className="contact__addr">
            {personal.email}
          </a>
          <div className="contact__actions">
            <CopyEmail />
            <a className="link" href={`mailto:${personal.email}`}>
              Open in mail app <span className="arrow">↗</span>
            </a>
          </div>
        </div>

        <div className="sheet">
          <div className="sheet__col">
            <h2 className="sheet__h label">Call</h2>
            <ul>
              {personal.phones.map((p) => (
                <li key={p.href}>
                  <a href={p.href} className="sheet__item">
                    <span className="label">{p.label}</span>
                    <span className="sheet__v">{p.display}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="sheet__col">
            <h2 className="sheet__h label">Profiles</h2>
            <ul>
              {socials.map((s) => (
                <li key={s.label}>
                  <a href={s.href} className="sheet__item" target="_blank" rel="noopener noreferrer">
                    <span className="label">{s.label}</span>
                    <span className="sheet__v">
                      {s.handle} <span className="sheet__go" aria-hidden="true">↗</span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="sheet__col">
            <h2 className="sheet__h label">On paper</h2>
            <ul>
              <li>
                <a href={personal.resume} className="sheet__item" target="_blank" rel="noopener" download="Pranshu-Kumar-Resume.pdf">
                  <span className="label">Résumé</span>
                  <span className="sheet__v">
                    PDF, two pages <span className="sheet__go" aria-hidden="true">↓</span>
                  </span>
                </a>
              </li>
              <li>
                <div className="sheet__item sheet__item--static">
                  <span className="label">Based</span>
                  <span className="sheet__v">{personal.location}</span>
                </div>
              </li>
              <li>
                <div className="sheet__item sheet__item--static">
                  <span className="label">Graduating</span>
                  <span className="sheet__v">June 2027, VJTI</span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </Page>
  )
}
