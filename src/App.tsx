import React, { useState } from 'react'

// ── Data derived from AI_Realist_Brand_Voice_Profile.md ──────────────────────

const values = [
  {
    label: 'Evidence-Based',
    score: '7/10',
    description:
      'Every claim is grounded in peer-reviewed research, reproducible results, and transparent methodology — not vendor white papers.',
  },
  {
    label: 'Independent',
    score: '10/10',
    description:
      'No products to sell, no partnerships to protect. Our assessments carry no vendor agenda — just honest evaluation.',
  },
  {
    label: 'Realistic',
    score: '8/10',
    description:
      'Current capabilities, real-world limitations, and practical applications. We set expectations that hold up after the demo.',
  },
  {
    label: 'Accessible',
    score: '6/10',
    description:
      'Expert guidance delivered as a knowledgeable peer, not a distant academic. No jargon without explanation.',
  },
]

const doExamples = [
  '"Based on current research, this tool shows promise for specific use cases, with important limitations to consider."',
  '"Our analysis of peer-reviewed studies suggests realistic expectations for implementation."',
  '"Independent evaluation reveals both capabilities and constraints of this technology."',
]

const dontExamples = [
  '"This groundbreaking AI will revolutionize your business!"',
  '"RIP traditional methods — this changes everything!"',
  '"Cutting-edge breakthrough disrupts the entire industry!"',
]

const preferredTerms = [
  'Evidence-based',
  'Peer-reviewed',
  'Realistic expectations',
  'Practical applications',
  'Current capabilities',
  'Limitations',
  'Transparent methodology',
  'Independent assessment',
  'Real-world implementation',
]

const avoidTerms = [
  'Groundbreaking',
  'Revolutionary',
  'Game-changing',
  'Disruption',
  'Breakthrough',
  'Next-generation',
  'Cutting-edge (when vague)',
  'RIP [Company]',
]

const references = [
  {
    name: 'Gary Marcus',
    description: 'Thoughtful AI skepticism grounded in cognitive science',
  },
  {
    name: 'Emily Bender',
    description: 'Academic rigor applied to practical AI concerns',
  },
  {
    name: 'Andriy Burkov',
    description: 'Clear, educational approach to complex AI concepts',
  },
]

// ── Components ────────────────────────────────────────────────────────────────

const Nav: React.FC = () => (
  <nav className="nav">
    <div className="nav-inner container">
      <a href="#" className="nav-logo">
        AI <span className="accent">Realist</span>
      </a>
      <ul className="nav-links">
        <li><a href="#about">About</a></li>
        <li><a href="#values">Our Approach</a></li>
        <li><a href="#tone">Tone Guide</a></li>
        <li><a href="#newsletter" className="btn btn-sm">Subscribe</a></li>
      </ul>
    </div>
  </nav>
)

const Hero: React.FC = () => (
  <section className="hero">
    <div className="container hero-inner">
      <div className="hero-badge">Independent · Evidence-Based · No Vendor Bias</div>
      <h1 className="hero-title">
        AI guidance without<br />
        <span className="accent">the hype.</span>
      </h1>
      <p className="hero-sub">
        We help business leaders make informed AI decisions based on peer-reviewed
        research and real-world experience — not marketing claims.
      </p>
      <div className="hero-actions">
        <a href="#newsletter" className="btn btn-primary">Get the Newsletter</a>
        <a href="#about" className="btn btn-ghost">Learn More</a>
      </div>
    </div>
    <div className="hero-bg-text" aria-hidden="true">REALIST</div>
  </section>
)

const About: React.FC = () => (
  <section className="section section-alt" id="about">
    <div className="container">
      <div className="two-col">
        <div>
          <span className="section-label">Who We Are</span>
          <h2 className="section-title">The independent voice AI needs.</h2>
          <p>
            The AI industry is flooded with breathless announcements and
            vendor-funded analysis. Business leaders are left navigating a
            landscape where it's nearly impossible to separate substance from
            spin.
          </p>
          <p>
            AI Realist exists to change that. We provide independent, honest,
            hype-free guidance grounded in years of research and a deep
            understanding of how large language models actually work — not how
            their makers say they work.
          </p>
        </div>
        <div className="about-cards">
          <div className="about-card">
            <div className="about-card-label">Mission</div>
            <p>
              Provide independent, honest guidance that helps decision-makers
              navigate AI noise and make informed choices.
            </p>
          </div>
          <div className="about-card">
            <div className="about-card-label">Vision</div>
            <p>
              Transform AI communication from hype-driven marketing to
              evidence-based, realistic assessment of capabilities and
              limitations.
            </p>
          </div>
          <div className="about-card">
            <div className="about-card-label">Audience</div>
            <p>
              Non-technical business leaders who need to integrate AI but
              struggle to distinguish truth from marketing hype.
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
)

const Values: React.FC = () => (
  <section className="section" id="values">
    <div className="container">
      <span className="section-label">Our Approach</span>
      <h2 className="section-title">How we think about AI.</h2>
      <p className="section-intro">
        Four dimensions shape every piece of analysis we publish.
      </p>
      <div className="values-grid">
        {values.map((v) => (
          <div className="value-card" key={v.label}>
            <div className="value-score">{v.score}</div>
            <h3 className="value-title">{v.label}</h3>
            <p className="value-desc">{v.description}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
)

const Tone: React.FC = () => {
  const [tab, setTab] = useState<'do' | 'dont'>('do')
  return (
    <section className="section section-alt" id="tone">
      <div className="container">
        <span className="section-label">Tone Guide</span>
        <h2 className="section-title">What honest AI writing sounds like.</h2>
        <p className="section-intro">
          The difference between hype and substance is often just word choice.
        </p>
        <div className="tone-tabs">
          <button
            className={`tone-tab ${tab === 'do' ? 'active' : ''}`}
            onClick={() => setTab('do')}
          >
            ✓ On-Brand
          </button>
          <button
            className={`tone-tab ${tab === 'dont' ? 'active dont' : 'dont'}`}
            onClick={() => setTab('dont')}
          >
            ✗ Off-Brand
          </button>
        </div>
        <div className="tone-examples">
          {(tab === 'do' ? doExamples : dontExamples).map((ex, i) => (
            <div key={i} className={`tone-example ${tab === 'dont' ? 'bad' : ''}`}>
              <span className="tone-icon">{tab === 'do' ? '✓' : '✗'}</span>
              <p>{ex}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

const Vocabulary: React.FC = () => (
  <section className="section" id="vocabulary">
    <div className="container">
      <span className="section-label">Vocabulary</span>
      <h2 className="section-title">Words matter.</h2>
      <div className="vocab-grid">
        <div className="vocab-col">
          <div className="vocab-header preferred">Preferred Terms</div>
          <ul className="vocab-list">
            {preferredTerms.map((t) => (
              <li key={t}>
                <span className="vocab-check">✓</span> {t}
              </li>
            ))}
          </ul>
        </div>
        <div className="vocab-col">
          <div className="vocab-header avoid">Terms to Avoid</div>
          <ul className="vocab-list avoid-list">
            {avoidTerms.map((t) => (
              <li key={t}>
                <span className="vocab-x">✗</span> {t}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  </section>
)

const References: React.FC = () => (
  <section className="section section-alt">
    <div className="container">
      <span className="section-label">Influences</span>
      <h2 className="section-title">Voices we respect.</h2>
      <div className="ref-grid">
        {references.map((r) => (
          <div className="ref-card" key={r.name}>
            <div className="ref-initial">{r.name[0]}</div>
            <div>
              <div className="ref-name">{r.name}</div>
              <div className="ref-desc">{r.description}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
)

const Newsletter: React.FC = () => {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) setSubmitted(true)
  }

  return (
    <section className="section newsletter" id="newsletter">
      <div className="container newsletter-inner">
        <span className="section-label light">Stay Informed</span>
        <h2 className="section-title light">
          Cut through the noise.<br />Subscribe free.
        </h2>
        <p className="newsletter-sub">
          Evidence-based AI analysis delivered to your inbox. No vendor ads,
          no hype, no fluff — just honest assessments you can act on.
        </p>
        {submitted ? (
          <div className="newsletter-success">
            You're on the list. Expect honest analysis, not spam.
          </div>
        ) : (
          <form className="newsletter-form" onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="newsletter-input"
            />
            <button type="submit" className="btn btn-primary">Subscribe</button>
          </form>
        )}
      </div>
    </section>
  )
}

const Footer: React.FC = () => (
  <footer className="footer">
    <div className="container footer-inner">
      <div className="footer-logo">
        AI <span className="accent">Realist</span>
      </div>
      <p className="footer-tagline">
        Independent · Evidence-Based · No Vendor Bias
      </p>
      <p className="footer-copy">
        © {new Date().getFullYear()} AI Realist. No sponsored content, ever.
      </p>
    </div>
  </footer>
)

// ── App ───────────────────────────────────────────────────────────────────────

const App: React.FC = () => (
  <>
    <Nav />
    <main>
      <Hero />
      <About />
      <Values />
      <Tone />
      <Vocabulary />
      <References />
      <Newsletter />
    </main>
    <Footer />
  </>
)

export default App
