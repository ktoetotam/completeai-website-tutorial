import React, { useState } from 'react'

// ── Data from interface-copy.md & challenge-examples.md ──────────────────────

const howItWorks = [
  {
    step: '01',
    title: 'Face Real Scenarios',
    desc: 'Review documents, audio, and video samples based on actual workplace situations — the same kinds your organisation encounters daily.',
  },
  {
    step: '02',
    title: 'Make Your Call',
    desc: 'Decide what's real and what's AI-generated. No trick questions — just the evidence in front of you.',
  },
  {
    step: '03',
    title: 'Learn the Red Flags',
    desc: 'Discover the specific indicators that reveal AI fakes: timing artifacts, pattern perfection, contextual errors.',
  },
  {
    step: '04',
    title: 'Protect Your Business',
    desc: 'Apply detection skills to prevent fraud and deception before it reaches your organisation.',
  },
]

const categories = [
  {
    icon: '📄',
    title: 'Document Challenges',
    intro: 'AI can now generate convincing business documents. Here's what to watch for in your daily paperwork.',
    types: ['Invoice verification', 'Contract authenticity', 'Email correspondence', 'Financial statements', 'Legal documents'],
    difficulty: 'Beginner → Expert',
  },
  {
    icon: '🎥',
    title: 'Video Call Challenges',
    intro: 'Deepfake technology can impersonate colleagues and clients in video calls. Learn to spot the tells.',
    types: ['Executive impersonation', 'Client meeting recordings', 'Training video authenticity', 'Presentation recordings', 'Interview footage'],
    difficulty: 'Intermediate → Expert',
  },
  {
    icon: '🎙️',
    title: 'Audio Challenges',
    intro: 'Voice cloning can replicate anyone's speech patterns. Protect yourself from audio fraud.',
    types: ['Phone call verification', 'Voicemail authenticity', 'Meeting recordings', 'Interview audio', 'Instruction recordings'],
    difficulty: 'Advanced',
  },
  {
    icon: '🖼️',
    title: 'Image Challenges',
    intro: 'AI-generated images can create false evidence and misleading visuals. Here's how to verify what you see.',
    types: ['Document photos', 'Product images', 'Profile pictures', 'Event photos', 'Evidence images'],
    difficulty: 'Intermediate',
  },
]

const skillLevels = [
  {
    range: '0 – 40%',
    label: 'Beginner',
    desc: 'Learning the basics of AI detection.',
    course: 'AI Fundamentals for Business Leaders',
    color: 'level-beginner',
  },
  {
    range: '41 – 65%',
    label: 'Developing',
    desc: 'Building recognition skills.',
    course: 'Advanced AI Detection Workshop',
    color: 'level-developing',
  },
  {
    range: '66 – 85%',
    label: 'Proficient',
    desc: 'Strong detection abilities.',
    course: 'AI Security for Organizations',
    color: 'level-proficient',
  },
  {
    range: '86 – 100%',
    label: 'Expert',
    desc: 'Advanced AI fake identification.',
    course: 'AI Threat Intelligence Updates',
    color: 'level-expert',
  },
]

const detectionSkills = [
  { num: '01', title: 'Pattern Recognition', desc: 'Systematic vs. natural variations' },
  { num: '02', title: 'Technical Artifacts', desc: 'Digital generation indicators' },
  { num: '03', title: 'Contextual Analysis', desc: 'Situational appropriateness' },
  { num: '04', title: 'Quality Assessment', desc: 'Natural vs. artificial perfection' },
  { num: '05', title: 'Behavioral Analysis', desc: 'Human vs. AI patterns' },
]

// ── Components ────────────────────────────────────────────────────────────────

const Nav: React.FC = () => (
  <nav className="nav">
    <div className="nav-inner container">
      <a href="#" className="nav-logo">
        Fake<span className="accent">Spotter</span>
        <span className="nav-by"> by AI Realist</span>
      </a>
      <ul className="nav-links">
        <li><a href="#how-it-works">How It Works</a></li>
        <li><a href="#categories">Challenges</a></li>
        <li><a href="#skills">Your Score</a></li>
        <li><a href="#start" className="btn btn-sm">Start Challenge</a></li>
      </ul>
    </div>
  </nav>
)

const Hero: React.FC = () => (
  <section className="hero" id="start">
    <div className="container hero-inner">
      <div className="hero-badge">10 Challenges · 4 Categories · Adaptive Difficulty</div>
      <h1 className="hero-title">
        Can you spot the AI fakes<br />
        <span className="accent">in your workplace?</span>
      </h1>
      <p className="hero-sub">
        Test your ability to identify AI-generated documents, calls, and media
        that could fool your business. Learn the red flags that matter.
      </p>
      <div className="hero-actions">
        <a href="#how-it-works" className="btn btn-primary">Start Detection Challenge</a>
        <a href="#categories" className="btn btn-ghost">See Challenges</a>
      </div>
      <div className="hero-stats">
        <div className="hero-stat">
          <span className="stat-num">10</span>
          <span className="stat-label">Challenges</span>
        </div>
        <div className="hero-stat-divider" />
        <div className="hero-stat">
          <span className="stat-num">4</span>
          <span className="stat-label">Media Types</span>
        </div>
        <div className="hero-stat-divider" />
        <div className="hero-stat">
          <span className="stat-num">30–80%</span>
          <span className="stat-label">Detection Rate Range</span>
        </div>
      </div>
    </div>
    <div className="hero-bg-text" aria-hidden="true">FAKE?</div>
  </section>
)

const Problem: React.FC = () => (
  <section className="section section-dark">
    <div className="container problem-inner">
      <div className="problem-text">
        <span className="section-label light">The Reality</span>
        <h2 className="section-title light">AI fraud is already in your inbox.</h2>
        <p className="problem-body">
          Business professionals face a new reality: AI can now create convincing
          fake invoices, clone voices for fraudulent calls, and generate realistic
          documents. The question isn't whether this technology exists — it's
          whether you can recognise it when it targets your organisation.
        </p>
      </div>
      <div className="problem-cards">
        <div className="problem-card">
          <div className="problem-card-icon">📋</div>
          <div className="problem-card-title">Fake Invoices</div>
          <div className="problem-card-desc">AI-generated billing documents with near-perfect formatting</div>
        </div>
        <div className="problem-card">
          <div className="problem-card-icon">🎭</div>
          <div className="problem-card-title">Voice Clones</div>
          <div className="problem-card-desc">Synthetic audio impersonating executives and clients</div>
        </div>
        <div className="problem-card">
          <div className="problem-card-icon">🎬</div>
          <div className="problem-card-title">Deepfake Video</div>
          <div className="problem-card-desc">Realistic video calls using faces of people you trust</div>
        </div>
        <div className="problem-card">
          <div className="problem-card-icon">📑</div>
          <div className="problem-card-title">Forged Contracts</div>
          <div className="problem-card-desc">Legal documents generated to pass casual review</div>
        </div>
      </div>
    </div>
  </section>
)

const HowItWorks: React.FC = () => (
  <section className="section" id="how-it-works">
    <div className="container">
      <span className="section-label">Process</span>
      <h2 className="section-title">How it works.</h2>
      <p className="section-intro">
        Each challenge is based on actual workplace scenarios. Accuracy matters more than speed.
      </p>
      <div className="steps-grid">
        {howItWorks.map((s) => (
          <div className="step-card" key={s.step}>
            <div className="step-num">{s.step}</div>
            <h3 className="step-title">{s.title}</h3>
            <p className="step-desc">{s.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
)

const Categories: React.FC = () => (
  <section className="section section-alt" id="categories">
    <div className="container">
      <span className="section-label">Challenge Types</span>
      <h2 className="section-title">Four categories. Real scenarios.</h2>
      <p className="section-intro">
        Each category targets a different type of AI fraud your organisation may encounter.
      </p>
      <div className="cat-grid">
        {categories.map((c) => (
          <div className="cat-card" key={c.title}>
            <div className="cat-icon">{c.icon}</div>
            <h3 className="cat-title">{c.title}</h3>
            <p className="cat-intro">{c.intro}</p>
            <ul className="cat-types">
              {c.types.map((t) => (
                <li key={t}><span className="cat-bullet">→</span>{t}</li>
              ))}
            </ul>
            <div className="cat-difficulty">Difficulty: {c.difficulty}</div>
          </div>
        ))}
      </div>
    </div>
  </section>
)

const DetectionSkills: React.FC = () => (
  <section className="section">
    <div className="container">
      <span className="section-label">What You'll Learn</span>
      <h2 className="section-title">Five detection skills, one challenge set.</h2>
      <p className="section-intro">
        Each challenge builds a specific capability. By challenge 10, you'll apply all five.
      </p>
      <div className="skills-grid">
        {detectionSkills.map((s) => (
          <div className="skill-card" key={s.num}>
            <div className="skill-num">{s.num}</div>
            <div>
              <div className="skill-title">{s.title}</div>
              <div className="skill-desc">{s.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
)

const SkillLevels: React.FC = () => (
  <section className="section section-alt" id="skills">
    <div className="container">
      <span className="section-label">Scoring</span>
      <h2 className="section-title">Where do you stand?</h2>
      <p className="section-intro">
        Your accuracy score determines your skill level and unlocks targeted course recommendations.
      </p>
      <div className="levels-grid">
        {skillLevels.map((l) => (
          <div className={`level-card ${l.color}`} key={l.label}>
            <div className="level-range">{l.range}</div>
            <div className="level-label">{l.label}</div>
            <p className="level-desc">{l.desc}</p>
            <div className="level-course">
              <span className="level-course-label">Recommended:</span>
              <span className="level-course-name">{l.course}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
)

const CTA: React.FC = () => {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) setSubmitted(true)
  }
  return (
    <section className="section cta-section">
      <div className="container cta-inner">
        <span className="section-label light">Stay Sharp</span>
        <h2 className="section-title light">
          New challenges.<br />Emerging threats.<br />Straight to your inbox.
        </h2>
        <p className="cta-sub">
          AI fraud techniques evolve weekly. Get evidence-based detection updates
          from AI Realist — no vendor ads, no hype, no fluff.
        </p>
        {submitted ? (
          <div className="cta-success">You're on the list. Expect honest analysis, not spam.</div>
        ) : (
          <form className="cta-form" onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="cta-input"
            />
            <button type="submit" className="btn btn-primary">Subscribe Free</button>
          </form>
        )}
        <p className="cta-fine">
          Strengthen Your Detection Skills · Learn More About AI Realist Training · Download Detection Checklist
        </p>
      </div>
    </section>
  )
}

const Footer: React.FC = () => (
  <footer className="footer">
    <div className="container footer-inner">
      <div className="footer-logo">
        Fake<span className="accent">Spotter</span>
        <span className="footer-by"> by AI Realist</span>
      </div>
      <p className="footer-tagline">Independent · Evidence-Based · No Vendor Bias</p>
      <p className="footer-copy">
        © {new Date().getFullYear()} AI Realist. No sponsored content, ever. Educational tone — serious but accessible.
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
      <Problem />
      <HowItWorks />
      <Categories />
      <DetectionSkills />
      <SkillLevels />
      <CTA />
    </main>
    <Footer />
  </>
)

export default App
