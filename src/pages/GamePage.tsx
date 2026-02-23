import React, { useState } from 'react'
import { challenges } from '../data/challenges'
import { Answer, Confidence, GameScreen } from '../types'
import ChallengeCard  from '../components/ChallengeCard'
import ResponsePanel  from '../components/ResponsePanel'
import FeedbackPanel  from '../components/FeedbackPanel'
import GameSummary    from '../components/GameSummary'

interface Props {
  onHome: () => void
}

const difficultyColor: Record<string, string> = {
  Beginner:     'diff-beginner',
  Intermediate: 'diff-intermediate',
  Advanced:     'diff-advanced',
  Expert:       'diff-expert',
}

const GamePage: React.FC<Props> = ({ onHome }) => {
  const [screen,      setScreen]      = useState<GameScreen>('intro')
  const [currentIdx,  setCurrentIdx]  = useState(0)
  const [answers,     setAnswers]     = useState<Answer[]>([])
  const [lastAnswer,  setLastAnswer]  = useState<Answer | null>(null)

  const challenge = challenges[currentIdx]
  const total     = challenges.length
  const progress  = Math.round(((currentIdx) / total) * 100)

  // ── Handlers ──────────────────────────────────────────────────────────────

  const startChallenge = () => setScreen('challenge')

  const handleSubmit = (
    choice: 'real' | 'ai',
    confidence: Confidence,
    flags: string[]
  ) => {
    const correct = (choice === 'ai') === challenge.isAI
    const answer: Answer = {
      challengeId: challenge.id,
      userChoice:  choice,
      correct,
      confidence,
      redFlagsSelected: flags,
    }
    setLastAnswer(answer)
    setAnswers((prev) => [...prev, answer])
    setScreen('feedback')
  }

  const handleNext = () => {
    if (currentIdx + 1 >= total) {
      setScreen('summary')
    } else {
      setCurrentIdx((i) => i + 1)
      setScreen('intro')
    }
  }

  // ── Intro screen ──────────────────────────────────────────────────────────
  if (screen === 'intro') {
    return (
      <div className="game-wrap">
        <GameNav currentIdx={currentIdx} total={total} progress={progress} onHome={onHome} />
        <div className="game-intro">
          <div className="game-intro-counter">
            Challenge {currentIdx + 1} of {total}
          </div>
          <div className={`game-intro-diff ${difficultyColor[challenge.difficulty]}`}>
            {challenge.difficulty} · {Math.round(challenge.expectedDetectionRate)}% expected detection rate
          </div>
          <h1 className="game-intro-title">{challenge.title}</h1>
          <div className="game-intro-category">
            {challenge.category === 'document' && '📄 Document Authentication'}
            {challenge.category === 'video'    && '🎥 Video Authentication'}
            {challenge.category === 'audio'    && '🎙️ Audio Authentication'}
            {challenge.category === 'image'    && '🖼️ Image Authentication'}
          </div>
          <div className="game-intro-scenario">
            <span className="game-intro-scenario-label">Scenario</span>
            <p>{challenge.scenario}</p>
          </div>
          <div className="game-intro-instructions">
            <div className="game-intro-inst-item">
              <span>🔍</span> Examine the evidence carefully
            </div>
            <div className="game-intro-inst-item">
              <span>⏱</span> No time limit — accuracy matters more than speed
            </div>
            <div className="game-intro-inst-item">
              <span>🎯</span> Decide: Real or AI-Generated?
            </div>
          </div>
          <button className="btn btn-primary btn-lg" onClick={startChallenge}>
            Review Evidence →
          </button>
        </div>
      </div>
    )
  }

  // ── Summary ───────────────────────────────────────────────────────────────
  if (screen === 'summary') {
    return (
      <div className="game-wrap">
        <div className="game-summary-wrap">
          <GameSummary
            answers={answers}
            challenges={challenges}
            onRestart={() => {
              setAnswers([])
              setCurrentIdx(0)
              setScreen('intro')
            }}
            onHome={onHome}
          />
        </div>
      </div>
    )
  }

  // ── Challenge + Feedback ──────────────────────────────────────────────────
  return (
    <div className="game-wrap">
      <GameNav currentIdx={currentIdx} total={total} progress={progress} onHome={onHome} />

      <div className="game-main">
        {/* Left: evidence card */}
        <div className="game-evidence">
          <div className="game-evidence-header">
            <span className="game-evidence-label">Evidence</span>
            <span className={`game-diff-badge ${difficultyColor[challenge.difficulty]}`}>
              {challenge.difficulty}
            </span>
          </div>
          <ChallengeCard challenge={challenge} />
        </div>

        {/* Right: response or feedback */}
        <div className="game-panel">
          {screen === 'challenge' && (
            <>
              <div className="game-panel-header">
                <span className="game-panel-title">Your Assessment</span>
                <span className="game-panel-sub">Is this Real or AI-Generated?</span>
              </div>
              <ResponsePanel onSubmit={handleSubmit} />
            </>
          )}

          {screen === 'feedback' && lastAnswer && (
            <FeedbackPanel
              challenge={challenge}
              answer={lastAnswer}
              onNext={handleNext}
              isLast={currentIdx + 1 >= total}
            />
          )}
        </div>
      </div>
    </div>
  )
}

// ── Sub-component: top nav bar ────────────────────────────────────────────────
interface NavProps {
  currentIdx: number
  total: number
  progress: number
  onHome: () => void
}

const GameNav: React.FC<NavProps> = ({ currentIdx, total, progress, onHome }) => (
  <div className="game-nav">
    <button className="game-nav-home" onClick={onHome}>← Home</button>
    <div className="game-nav-center">
      <div className="game-nav-label">Challenge {currentIdx + 1} / {total}</div>
      <div className="game-progress-bar">
        <div className="game-progress-fill" style={{ width: `${progress}%` }} />
      </div>
    </div>
    <div className="game-nav-right">
      <span className="game-nav-pct">{progress}%</span>
    </div>
  </div>
)

export default GamePage
