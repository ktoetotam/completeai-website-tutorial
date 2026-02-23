import React from 'react'
import { Challenge, Answer } from '../types'

interface Props {
  challenge: Challenge
  answer: Answer
  onNext: () => void
  isLast: boolean
}

const FeedbackPanel: React.FC<Props> = ({ challenge, answer, onNext, isLast }) => {
  const correct = answer.correct

  return (
    <div className={`feedback ${correct ? 'feedback-correct' : 'feedback-wrong'}`}>
      {/* ── Result banner ── */}
      <div className="feedback-banner">
        <span className="feedback-banner-icon">{correct ? '✓' : '✗'}</span>
        <div>
          <div className="feedback-banner-title">
            {correct
              ? challenge.isAI
                ? "You're Right — This is AI-Generated"
                : "You're Right — This is Authentic"
              : challenge.isAI
                ? 'This Was AI-Generated'
                : 'This Was Actually Real'}
          </div>
          <div className="feedback-banner-sub">
            {correct ? 'Good detection work.' : 'Here\'s what to look for next time.'}
          </div>
        </div>
      </div>

      {/* ── Main explanation ── */}
      <div className="feedback-body">
        <p className="feedback-explanation">
          {correct ? challenge.feedbackCorrect : challenge.feedbackIncorrect}
        </p>
      </div>

      {/* ── Red flags / real markers ── */}
      <div className="feedback-cols">
        <div className="feedback-col">
          <div className="feedback-col-header feedback-col-header-bad">
            ⚠ AI Red Flags
          </div>
          <ul className="feedback-list">
            {challenge.redFlags.map((f) => (
              <li key={f}>
                <span className="feedback-list-dot red" />
                {f}
              </li>
            ))}
          </ul>
        </div>
        <div className="feedback-col">
          <div className="feedback-col-header feedback-col-header-good">
            ✓ Real Markers
          </div>
          <ul className="feedback-list">
            {challenge.realMarkers.map((m) => (
              <li key={m}>
                <span className="feedback-list-dot green" />
                {m}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ── Professional tip ── */}
      <div className="feedback-tip">
        <span className="feedback-tip-label">💡 Professional Tip</span>
        <p>{challenge.professionalTip}</p>
      </div>

      {/* ── Next ── */}
      <div className="feedback-next">
        <button className="btn btn-primary btn-lg" onClick={onNext}>
          {isLast ? 'See Your Results →' : `Next Challenge →`}
        </button>
      </div>
    </div>
  )
}

export default FeedbackPanel
