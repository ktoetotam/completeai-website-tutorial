import React from 'react'
import { Answer, Challenge } from '../types'

interface Props {
  answers: Answer[]
  challenges: Challenge[]
  onRestart: () => void
  onHome: () => void
}

const getSkillLevel = (pct: number) => {
  if (pct >= 86) return { label: 'Expert',     color: 'level-expert',     course: 'AI Threat Intelligence Updates',     desc: 'Excellent detection abilities. Stay current with emerging AI threats and advanced defensive strategies.' }
  if (pct >= 66) return { label: 'Proficient',  color: 'level-proficient',  course: 'AI Security for Organizations',      desc: 'Strong detection skills. Consider specialised training to handle sophisticated attacks and train your team.' }
  if (pct >= 41) return { label: 'Developing',  color: 'level-developing',  course: 'Advanced AI Detection Workshop',     desc: 'You recognise some AI fakes but miss others. Advanced training can sharpen your detection abilities.' }
  return               { label: 'Beginner',    color: 'level-beginner',    course: 'AI Fundamentals for Business Leaders', desc: 'AI detection requires understanding how these technologies work. Foundational courses will help you build the knowledge to protect your business.' }
}

const categoryLabels: Record<string, string> = {
  document: '📄 Documents',
  video:    '🎥 Video',
  audio:    '🎙️ Audio',
  image:    '🖼️ Images',
}

const GameSummary: React.FC<Props> = ({ answers, challenges, onRestart, onHome }) => {
  const total   = answers.length
  const correct = answers.filter((a) => a.correct).length
  const pct     = Math.round((correct / total) * 100)
  const skill   = getSkillLevel(pct)

  // Per-category breakdown
  const categories = ['document', 'video', 'audio', 'image']
  const catStats = categories.map((cat) => {
    const catAnswers = answers.filter((a) => {
      const ch = challenges.find((c) => c.id === a.challengeId)
      return ch?.category === cat
    })
    if (catAnswers.length === 0) return null
    const catCorrect = catAnswers.filter((a) => a.correct).length
    return {
      cat,
      correct: catCorrect,
      total: catAnswers.length,
      pct: Math.round((catCorrect / catAnswers.length) * 100),
    }
  }).filter(Boolean) as { cat: string; correct: number; total: number; pct: number }[]

  const strongest = [...catStats].sort((a, b) => b.pct - a.pct)[0]
  const weakest   = [...catStats].sort((a, b) => a.pct - b.pct)[0]

  return (
    <div className="summary">
      {/* ── Header ── */}
      <div className="summary-header">
        <div className="summary-score-ring">
          <svg viewBox="0 0 120 120" className="summary-ring-svg">
            <circle cx="60" cy="60" r="52" className="summary-ring-bg" />
            <circle
              cx="60" cy="60" r="52"
              className="summary-ring-fill"
              strokeDasharray={`${(pct / 100) * 327} 327`}
              strokeDashoffset="0"
              transform="rotate(-90 60 60)"
            />
          </svg>
          <div className="summary-score-text">
            <span className="summary-score-num">{pct}%</span>
            <span className="summary-score-label">Accuracy</span>
          </div>
        </div>
        <div className="summary-header-text">
          <div className={`summary-skill-badge ${skill.color}`}>{skill.label}</div>
          <h2 className="summary-title">
            {correct} of {total} correct
          </h2>
          <p className="summary-desc">{skill.desc}</p>
        </div>
      </div>

      {/* ── Category breakdown ── */}
      <div className="summary-section">
        <div className="summary-section-title">Performance by category</div>
        <div className="summary-cats">
          {catStats.map((cs) => (
            <div className="summary-cat" key={cs.cat}>
              <div className="summary-cat-label">{categoryLabels[cs.cat]}</div>
              <div className="summary-cat-bar-wrap">
                <div className="summary-cat-bar">
                  <div
                    className="summary-cat-bar-fill"
                    style={{ width: `${cs.pct}%` }}
                  />
                </div>
                <span className="summary-cat-pct">{cs.pct}%</span>
              </div>
              <div className="summary-cat-detail">{cs.correct}/{cs.total} correct</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Insights ── */}
      <div className="summary-insights">
        {strongest && (
          <div className="summary-insight summary-insight-good">
            <div className="summary-insight-label">✓ Strongest Area</div>
            <div className="summary-insight-value">{categoryLabels[strongest.cat]} — {strongest.pct}%</div>
          </div>
        )}
        {weakest && weakest.cat !== strongest?.cat && (
          <div className="summary-insight summary-insight-improve">
            <div className="summary-insight-label">↑ Area to Improve</div>
            <div className="summary-insight-value">{categoryLabels[weakest.cat]} — {weakest.pct}%</div>
          </div>
        )}
      </div>

      {/* ── Course recommendation ── */}
      <div className="summary-course">
        <div className="summary-course-label">Recommended next step</div>
        <div className="summary-course-name">{skill.course}</div>
        <p className="summary-course-cta">
          Strengthen your detection skills with AI Realist training — evidence-based, no vendor hype.
        </p>
        <button className="btn btn-primary">Strengthen Your Detection Skills</button>
      </div>

      {/* ── Actions ── */}
      <div className="summary-actions">
        <button className="btn btn-ghost" onClick={onRestart}>Try Again</button>
        <button className="btn btn-ghost" onClick={onHome}>Back to Home</button>
      </div>
    </div>
  )
}

export default GameSummary
