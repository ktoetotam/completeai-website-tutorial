import React, { useState } from 'react'
import { Confidence } from '../types'

const RED_FLAG_OPTIONS = [
  'Inconsistent details',
  'Technical artifacts',
  'Unnatural patterns',
  'Contextual errors',
  'Quality inconsistencies',
  'Timing anomalies',
  'Suspicious metadata',
  'Domain / source mismatch',
]

const CONFIDENCE_OPTIONS: { value: Confidence; label: string; range: string }[] = [
  { value: 'very',      label: 'Very Confident',     range: '90–100%' },
  { value: 'confident', label: 'Confident',           range: '70–89%' },
  { value: 'somewhat',  label: 'Somewhat Confident',  range: '50–69%' },
  { value: 'uncertain', label: 'Uncertain',           range: 'Below 50%' },
]

interface Props {
  onSubmit: (choice: 'real' | 'ai', confidence: Confidence, flags: string[]) => void
}

const ResponsePanel: React.FC<Props> = ({ onSubmit }) => {
  const [choice,     setChoice]     = useState<'real' | 'ai' | null>(null)
  const [confidence, setConfidence] = useState<Confidence | null>(null)
  const [flags,      setFlags]      = useState<string[]>([])

  const toggleFlag = (flag: string) =>
    setFlags((prev) =>
      prev.includes(flag) ? prev.filter((f) => f !== flag) : [...prev, flag]
    )

  const canSubmit = choice !== null && confidence !== null

  const handleSubmit = () => {
    if (!choice || !confidence) return
    onSubmit(choice, confidence, flags)
  }

  return (
    <div className="rpanel">
      {/* ── Step 1: Real vs AI ── */}
      <div className="rpanel-section">
        <div className="rpanel-step">Step 1 of 3</div>
        <div className="rpanel-label">Your assessment</div>
        <div className="rpanel-choices">
          <button
            className={`rpanel-choice rpanel-choice-real ${choice === 'real' ? 'selected' : ''}`}
            onClick={() => setChoice('real')}
          >
            <span className="rpanel-choice-icon">✓</span>
            <span className="rpanel-choice-text">Real</span>
            <span className="rpanel-choice-sub">This appears authentic</span>
          </button>
          <button
            className={`rpanel-choice rpanel-choice-ai ${choice === 'ai' ? 'selected' : ''}`}
            onClick={() => setChoice('ai')}
          >
            <span className="rpanel-choice-icon">⚡</span>
            <span className="rpanel-choice-text">AI-Generated</span>
            <span className="rpanel-choice-sub">Shows signs of AI creation</span>
          </button>
        </div>
      </div>

      {/* ── Step 2: Confidence ── */}
      {choice && (
        <div className="rpanel-section rpanel-section-fade">
          <div className="rpanel-step">Step 2 of 3</div>
          <div className="rpanel-label">How confident are you?</div>
          <div className="rpanel-confidence">
            {CONFIDENCE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                className={`rpanel-conf-btn ${confidence === opt.value ? 'selected' : ''}`}
                onClick={() => setConfidence(opt.value)}
              >
                <span className="rpanel-conf-label">{opt.label}</span>
                <span className="rpanel-conf-range">{opt.range}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Step 3: Red Flags ── */}
      {confidence && (
        <div className="rpanel-section rpanel-section-fade">
          <div className="rpanel-step">Step 3 of 3 — Optional</div>
          <div className="rpanel-label">What made you suspicious? <span className="rpanel-opt">(select all that apply)</span></div>
          <div className="rpanel-flags">
            {RED_FLAG_OPTIONS.map((flag) => (
              <button
                key={flag}
                className={`rpanel-flag ${flags.includes(flag) ? 'selected' : ''}`}
                onClick={() => toggleFlag(flag)}
              >
                <span className="rpanel-flag-check">{flags.includes(flag) ? '✓' : '+'}</span>
                {flag}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Submit ── */}
      <div className="rpanel-submit">
        <button
          className={`btn btn-primary btn-lg ${!canSubmit ? 'btn-disabled' : ''}`}
          onClick={handleSubmit}
          disabled={!canSubmit}
        >
          Submit Assessment →
        </button>
        {!canSubmit && (
          <span className="rpanel-submit-hint">
            {!choice ? 'Select Real or AI-Generated to continue' : 'Select your confidence level'}
          </span>
        )}
      </div>
    </div>
  )
}

export default ResponsePanel
