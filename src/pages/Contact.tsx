import { Page } from '../components/Page'
import { CopyEmail } from '../components/CopyEmail'
import { Reveal } from '../components/Reveal'
import { Link } from 'react-router-dom'
import { contactLinks, personal, socials } from '../config/personal'
import { IndiaFlag, MailIcon, MessageIcon, PhoneIcon, UaeFlag, WhatsAppIcon } from '../components/ContactIcons'

const flags = { in: IndiaFlag, ae: UaeFlag } as const

/** Call, WhatsApp and Messages each offer both numbers; every option is its own link. */
const quick = [
  {
    id: 'call',
    name: 'Call me',
    text: 'Let’s have a conversation.',
    Icon: PhoneIcon,
    external: false,
    href: contactLinks.call,
    label: (c: string, n: string) => `Call me on my ${c} number, dial ${n}`,
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp',
    text: 'Quick messages, whenever convenient.',
    Icon: WhatsAppIcon,
    external: true,
    href: contactLinks.whatsapp,
    label: (c: string, n: string) => `WhatsApp my ${c} number ${n}, opens in a new tab`,
  },
  {
    id: 'sms',
    name: 'Messages',
    text: 'Send me a text.',
    Icon: MessageIcon,
    external: false,
    href: contactLinks.sms,
    label: (c: string, n: string) => `Text my ${c} number ${n}`,
  },
] as const

export default function Contact() {
  return (
    <Page
      title="Contact | Pranshu Kumar"
      description="Contact Pranshu Kumar directly: call, WhatsApp, text message or email. Also LinkedIn, GitHub and résumé."
      path="/contact"
    >
      <section className="wrap page-head contact-head">
        <span className="label label--accent">05 · Contact</span>
        <h1 className="page-head__title display">Get in touch</h1>
        <p className="page-head__lede serif">
          Choose whichever way is easiest for you: a call, a quick message, or an email.
        </p>
      </section>

      <section className="wrap contact" aria-label="Contact details">
        <div className="reach reach--quick">
          <h2 className="reach__h label">Quick &amp; personal</h2>
          <ul className="reach__list">
            {quick.map(({ id, name, text, Icon, external, href, label }, i) => (
              <Reveal as="li" key={id} delay={i * 0.06} className="cgroup">
                <div className="cgroup__head" id={`cg-${id}`}>
                  <span className="crow__icon">
                    <Icon />
                  </span>
                  <span className="crow__body">
                    <span className="crow__name serif">{name}</span>
                    <span className="crow__text">{text}</span>
                  </span>
                </div>
                <ul className="cgroup__opts" aria-labelledby={`cg-${id}`}>
                  {personal.phones.map((p) => {
                    const Flag = flags[p.id]
                    return (
                      <li key={p.id}>
                        <a
                          className="copt"
                          href={href(p)}
                          aria-label={label(p.label, p.display)}
                          {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                        >
                          <Flag />
                          <span className="copt__text">
                            <span className="copt__c">{p.label}</span>
                            <span className="copt__n">{p.display}</span>
                          </span>
                          <span className="copt__go" aria-hidden="true">
                            {external ? '↗' : '→'}
                          </span>
                        </a>
                      </li>
                    )
                  })}
                </ul>
              </Reveal>
            ))}
          </ul>
          <p className="reach__note">
            Pick the number that suits you. On a computer, Call and Messages open your phone or FaceTime app if one is
            set up; the numbers are shown so you can copy them.
          </p>
        </div>

        <div className="reach reach--pro">
          <h2 className="reach__h label label--accent">Professional enquiries</h2>
          <ul className="reach__list">
            <Reveal as="li" className="cgroup">
              <div className="cgroup__head" id="cg-email">
                <span className="crow__icon">
                  <MailIcon />
                </span>
                <span className="crow__body">
                  <span className="crow__name serif">Email</span>
                  <span className="crow__text">For professional enquiries and opportunities.</span>
                </span>
              </div>
              <div className="cgroup__opts cgroup__opts--one">
                <a className="copt copt--mail" href={contactLinks.email} aria-label={`Email ${personal.email}`}>
                  <span className="copt__text">
                    <span className="copt__c">Write to</span>
                    <span className="copt__n copt__n--mail">{personal.email}</span>
                  </span>
                  <span className="copt__go" aria-hidden="true">
                    →
                  </span>
                </a>
                <CopyEmail />
              </div>
            </Reveal>
          </ul>
          <p className="reach__note">
            Open to engineering, research and consulting opportunities in hardware, semiconductors, embedded systems,
            signal processing and AI. Graduating June 2027, VJTI.
          </p>
        </div>

        <div className="sheet sheet--two">
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
                <Link to="/resume" className="sheet__item">
                  <span className="label">Résumé</span>
                  <span className="sheet__v">
                    PDF, one or two pages <span className="sheet__go" aria-hidden="true">→</span>
                  </span>
                </Link>
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
