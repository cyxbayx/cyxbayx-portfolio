import { useEffect, useRef, useState } from 'react'
import './App.css'
import profilePhoto from './assets/profile.png'

const NAV_LINKS = [
  { href: '#home', label: 'Home' },
  { href: '#about', label: 'About' },
  { href: '#hall-of-fame', label: 'Hall of Fame' },
  { href: '#certifications', label: 'Certifications' },
  { href: '#contact', label: 'Contact' },
]

const TOOLS = ['Kali Linux', 'Burp Suite', 'Wazuh', 'Metasploit', 'Nmap', 'Nuclei', 'SQLMap', 'Wireshark']

const COMPETENCIES = [
  'Web Application Analysis',
  'OWASP Top 10',
  'Network Reconnaissance',
  'Scripting & Automation',
]

const HALL_OF_FAME = [
  {
    org: 'DKI Jakarta Provincial CSIRT',
    vuln: 'Broken Link Hijacking (BLH)',
    status: 'Appreciation Certificate',
    loa: 'Jakarta.pdf',
  },
  {
    org: 'Ministry of Trade Republic of Indonesia',
    vuln: 'Cross-Site Scripting (XSS)',
    status: 'Appreciation Certificate',
    loa: 'Sertifikat-Vulnerabilitas-Kemendag.pdf',
  },
  {
    org: 'Rembang Regency Government CSIRT',
    vuln: 'HTML Injection, IDOR & Sensitive Data Exposure',
    status: 'Appreciation Certificate',
    loa: 'Kabupaten-Rembang.png',
  },
  {
    org: 'PT Bank Rakyat Indonesia (BRI)',
    vuln: 'Open Redirect (Production)',
    status: 'Appreciation Certificate',
    loa: 'BRI.pdf',
  },
  {
    org: 'Maryland State Government (via Bugcrowd)',
    vuln: 'Broken Link Hijacking (BLH)',
    status: 'Report Verified',
    loa: 'Bugcrowd-maryland.gov.png',
  },
  {
    org: 'NASA (via Bugcrowd)',
    vuln: 'Broken Link Hijacking (BLH)',
    status: 'Appreciation Certificate',
    loa: 'NASALetterOfAppreciation.pdf',
  },
  {
    org: 'PT Sentra Vidya Utama',
    vuln: 'Open Redirect (Production)',
    status: 'Bounty Awarded',
    loa: 'PT.Sentra Vidya Utama .png',
  },
  {
    org: 'BBC News',
    vuln: 'Insecure Design (Production)',
    status: 'Hall of Fame + Merchandise',
    loa: 'BBCNews.png',
  },
]

const STATUS_CLASS = {
  'Appreciation Certificate': 'status-cert',
  'Report Verified': 'status-verified',
  'Bounty Awarded': 'status-bounty',
  'Hall of Fame + Merchandise': 'status-fame',
}

const EyeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M1.5 12s4-7 10.5-7 10.5 7 10.5 7-4 7-10.5 7S1.5 12 1.5 12z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
)

const COURSES = [
  { name: 'Basic Pentest – Ethical Hacking', state: 'Completed' },
  { name: 'CompTIA Security+', state: 'Completed' },
]

const CERTIFICATIONS = [{ name: 'CompTIA Security+', state: 'In Progress' }]

const CertIcon = ({ done }) =>
  done ? (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="9" />
      <path d="M8.5 12.5l2.5 2.5 5-5" />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.5 2" />
    </svg>
  )

const STATS = [
  { label: 'Vulnerabilities Reported', value: HALL_OF_FAME.length, suffix: '+' },
  {
    label: 'Appreciation Certificates',
    value: HALL_OF_FAME.filter((h) => h.status === 'Appreciation Certificate').length,
    suffix: '',
  },
  { label: 'Organizations Tested', value: HALL_OF_FAME.length, suffix: '+' },
  {
    label: 'Hall of Fame Entries',
    value: HALL_OF_FAME.filter((h) => h.status.includes('Hall of Fame')).length,
    suffix: '',
  },
]

function useCountUp(target, start) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    if (!start) return
    if (target === 0) {
      setValue(0)
      return
    }
    let frame
    const duration = 1200
    const startTime = performance.now()
    const tick = (now) => {
      const progress = Math.min((now - startTime) / duration, 1)
      setValue(Math.round(progress * target))
      if (progress < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [start, target])
  return value
}

function StatCard({ label, value, suffix, delay = 0 }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  const count = useCountUp(value, visible)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true)
      },
      { threshold: 0.4 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      className={`stat-card ${visible ? 'is-visible' : ''}`}
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <span className="stat-value">
        {count}
        {suffix}
      </span>
      <span className="stat-label">{label}</span>
    </div>
  )
}

function Reveal({ children, className = '', delay = 0, as: Tag = 'div', eager = false, ...rest }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (eager) {
      setVisible(true)
      return
    }
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.unobserve(el)
        }
      },
      { threshold: 0.15 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [eager])

  return (
    <Tag
      ref={ref}
      className={`reveal ${visible ? 'is-visible' : ''} ${className}`.trim()}
      style={{ transitionDelay: `${delay}ms` }}
      {...rest}
    >
      {children}
    </Tag>
  )
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <>
      <header className="nav">
        <a className="brand" href="#home">
          <span className="brand-caret">&gt;</span>cyxbayx<span className="brand-at">@</span>sec
        </a>
        <nav className={`nav-links ${menuOpen ? 'open' : ''}`}>
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href} onClick={() => setMenuOpen(false)}>
              {link.label}
            </a>
          ))}
        </nav>
        <button
          className="nav-toggle"
          aria-label="Toggle navigation"
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>
      </header>

      <main>
        <section id="home" className="hero">
          <div className="hero-glow" aria-hidden="true" />
          <div className="hero-content">
            <Reveal as="p" className="hero-kicker" eager>
              $ whoami
            </Reveal>
            <Reveal as="h1" className="hero-title" eager delay={120}>
              Bayu Adji Wilarno
            </Reveal>
            <Reveal as="p" className="hero-tagline" eager delay={240}>
              Penetration Tester &amp; Security Defender <span className="dot">&bull;</span> Bug
              Bounty Hunter
            </Reveal>
            <Reveal as="p" className="hero-subtitle" eager delay={360}>
              Offensive and defensive security expertise in web application security and
              vulnerability research
              <span className="blink-cursor" aria-hidden="true" />
            </Reveal>
            <Reveal className="hero-actions" eager delay={480}>
              <a className="btn btn-primary" href="#about">
                ./explore --profile
              </a>
              <a
                className="btn btn-ghost"
                href={`${import.meta.env.BASE_URL}${encodeURIComponent('CV Bayu Adji Wilarno - ITSecurity - English.pdf')}`}
                download="Bayu-Adji-Wilarno-CV.pdf"
              >
                Download CV
              </a>
            </Reveal>
          </div>
        </section>

        <section id="about" className="about">
          <Reveal className="section-heading">
            <span className="section-tag">01 // profile</span>
            <h2>About Me</h2>
          </Reveal>
          <div className="about-grid">
            <Reveal className="about-photo">
              <div className="photo-frame">
                <img className="photo-img" src={profilePhoto} alt="Bayu Adji Wilarno" />
              </div>
            </Reveal>
            <Reveal className="about-text" delay={150}>
              <p className="about-lead">
                &ldquo;In a world where every line of code can be a doorway and every request a
                potential weapon, I choose to stand on the side that understands both how systems
                break and how to keep them standing.&rdquo;
              </p>
              <p>
                My journey started in offensive security &mdash; hunting for vulnerabilities,
                thinking like an attacker, and reporting real-world flaws to organizations across
                government, banking, and international institutions. That mindset now carries
                into defensive security operations, where I apply the same instincts to help
                systems hold the line.
              </p>
              <blockquote>
                The best defense starts by thinking like the attacker &mdash; and acting like a
                guardian.
              </blockquote>

              <div className="tools-block">
                <h3>Tools</h3>
                <ul className="tag-list">
                  {TOOLS.map((tool) => (
                    <li key={tool}>{tool}</li>
                  ))}
                </ul>
              </div>

              <div className="tools-block">
                <h3>Core Competencies</h3>
                <ul className="tag-list tag-list-alt">
                  {COMPETENCIES.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </section>

        <section className="stats">
          <div className="stats-grid">
            {STATS.map((stat, i) => (
              <StatCard key={stat.label} {...stat} delay={i * 100} />
            ))}
          </div>
        </section>

        <section id="hall-of-fame" className="hall-of-fame">
          <Reveal className="section-heading">
            <span className="section-tag">02 // disclosures</span>
            <h2>Hall of Fame</h2>
          </Reveal>
          <Reveal className="table-wrap" delay={150}>
            <table>
              <thead>
                <tr>
                  <th>Organization</th>
                  <th>Vulnerability Type</th>
                  <th>Status</th>
                  <th>LoA</th>
                </tr>
              </thead>
              <tbody>
                {HALL_OF_FAME.map((row) => (
                  <tr key={row.org}>
                    <td data-label="Organization">{row.org}</td>
                    <td data-label="Vulnerability Type">{row.vuln}</td>
                    <td data-label="Status">
                      <span className={`status-pill ${STATUS_CLASS[row.status] ?? ''}`}>
                        {row.status}
                      </span>
                    </td>
                    <td data-label="LoA">
                      {row.loa && (
                        <a
                          className="loa-link"
                          href={`${import.meta.env.BASE_URL}LoA/${encodeURIComponent(row.loa)}`}
                          target="_blank"
                          rel="noreferrer"
                          aria-label={`Lihat LoA dari ${row.org}`}
                        >
                          <EyeIcon />
                        </a>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Reveal>
          <Reveal as="p" className="table-note" delay={250}>
            * All vulnerabilities were reported through responsible disclosure programs and
            coordinated with the respective organizations.
          </Reveal>
        </section>

        <section id="certifications" className="certifications">
          <Reveal className="section-heading">
            <span className="section-tag">03 // education</span>
            <h2>Certifications</h2>
          </Reveal>
          <div className="cert-columns">
            <div className="cert-column">
              <Reveal className="cert-column-header">
                <svg
                  className="cert-column-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  aria-hidden="true"
                >
                  <path d="M2 8l10-5 10 5-10 5-10-5z" />
                  <path d="M6 10.5V16c0 1.5 2.7 3 6 3s6-1.5 6-3v-5.5" />
                </svg>
                <span className="cert-column-prompt">$ cat courses.log</span>
              </Reveal>
              <ul className="cert-list">
                {COURSES.map((cert, i) => (
                  <Reveal as="li" key={cert.name} delay={i * 100}>
                    <div
                      className={`cert-card ${cert.state === 'Completed' ? 'cert-card--done' : 'cert-card--progress'} ${i % 2 === 0 ? 'tilt-left' : 'tilt-right'}`}
                    >
                      <h3>{cert.name}</h3>
                      <div className="cert-meta">
                        <span className="cert-type">Course</span>
                        <span className={`cert-state ${cert.state === 'Completed' ? 'is-done' : 'is-progress'}`}>
                          <CertIcon done={cert.state === 'Completed'} />
                          {cert.state}
                        </span>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </ul>
            </div>

            <div className="cert-column">
              <Reveal className="cert-column-header" delay={100}>
                <svg
                  className="cert-column-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  aria-hidden="true"
                >
                  <path d="M12 2l7 3v6c0 4.5-3 8-7 9-4-1-7-4.5-7-9V5l7-3z" />
                </svg>
                <span className="cert-column-prompt">$ cat certifications.log</span>
              </Reveal>
              <ul className="cert-list">
                {CERTIFICATIONS.map((cert, i) => (
                  <Reveal as="li" key={cert.name} delay={i * 100}>
                    <div
                      className={`cert-card ${cert.state === 'Completed' ? 'cert-card--done' : 'cert-card--progress'} ${i % 2 === 0 ? 'tilt-left' : 'tilt-right'}`}
                    >
                      <h3>{cert.name}</h3>
                      <div className="cert-meta">
                        <span className={`cert-state ${cert.state === 'Completed' ? 'is-done' : 'is-progress'}`}>
                          <CertIcon done={cert.state === 'Completed'} />
                          {cert.state}
                        </span>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </main>

      <footer id="contact" className="footer">
        <div className="footer-glow" aria-hidden="true" />
        <Reveal className="footer-inner">
          <p className="footer-brand">
            <span className="brand-caret">&gt;</span>cyxbayx<span className="brand-at">@</span>sec
          </p>
          <ul className="footer-links">
            <li>
              <a href="mailto:masbaykarir@gmail.com">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                masbaykarir@gmail.com
              </a>
            </li>
            <li>
              <a
                href="https://www.linkedin.com/in/bayuawilarno/"
                target="_blank"
                rel="noreferrer"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4V8h4v1.5A6 6 0 0 1 16 8z" />
                  <rect x="2" y="9" width="4" height="12" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
                LinkedIn
              </a>
            </li>
            <li>
              <a href="https://github.com/cyxbayx" target="_blank" rel="noreferrer">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                </svg>
                GitHub
              </a>
            </li>
          </ul>
          <p className="footer-copy">&copy; 2026 Bayu Adji Wilarno. All rights reserved.</p>
        </Reveal>
      </footer>
    </>
  )
}

export default App
