import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

const QUIZ_QUESTIONS = [
  // Analytical (3 questions)
  {
    id: 1,
    trait: 'analytical',
    category: 'Analytical Thinking',
    tagClass: 'tag-analytical',
    statement: 'I enjoy digging into complex data, logical puzzles, and quantitative patterns to find root causes.'
  },
  {
    id: 2,
    trait: 'analytical',
    category: 'Analytical Thinking',
    tagClass: 'tag-analytical',
    statement: 'I prefer making decisions backed by empirical evidence, verifiable metrics, and systematic testing.'
  },
  {
    id: 3,
    trait: 'analytical',
    category: 'Analytical Thinking',
    tagClass: 'tag-analytical',
    statement: 'I feel energized when dissecting complicated workflows into clear, methodical steps.'
  },

  // Creative (3 questions)
  {
    id: 4,
    trait: 'creative',
    category: 'Creative Exploration',
    tagClass: 'tag-creative',
    statement: 'I thrive when imagining novel concepts, visual designs, or unconventional solutions.'
  },
  {
    id: 5,
    trait: 'creative',
    category: 'Creative Exploration',
    tagClass: 'tag-creative',
    statement: 'I care deeply about aesthetics, intuitive user flows, and crafting memorable human experiences.'
  },
  {
    id: 6,
    trait: 'creative',
    category: 'Creative Exploration',
    tagClass: 'tag-creative',
    statement: 'I love brainstorming divergent ideas and rapid prototyping without fear of early mistakes.'
  },

  // Social (3 questions)
  {
    id: 7,
    trait: 'social',
    category: 'Social & Empathy',
    tagClass: 'tag-social',
    statement: 'I find deep fulfillment in understanding diverse human perspectives and listening with empathy.'
  },
  {
    id: 8,
    trait: 'social',
    category: 'Social & Empathy',
    tagClass: 'tag-social',
    statement: 'I excel at bringing people together, facilitating inclusive team discussions, and championing peers.'
  },
  {
    id: 9,
    trait: 'social',
    category: 'Social & Empathy',
    tagClass: 'tag-social',
    statement: 'I naturally gravitate towards bridging communication gaps and mentoring people from diverse backgrounds.'
  },

  // Technical (3 questions)
  {
    id: 10,
    trait: 'technical',
    category: 'Technical Architecture',
    tagClass: 'tag-technical',
    statement: 'I enjoy learning programming languages, debugging code, and understanding computational models.'
  },
  {
    id: 11,
    trait: 'technical',
    category: 'Technical Architecture',
    tagClass: 'tag-technical',
    statement: 'I get excited by building software architectures, automation pipelines, and developer tools.'
  },
  {
    id: 12,
    trait: 'technical',
    category: 'Technical Architecture',
    tagClass: 'tag-technical',
    statement: 'I am fascinated by how digital systems function under the hood, from web protocols to cloud APIs.'
  }
];

const LIKERT_OPTIONS = [
  { value: 1, label: 'Strongly Disagree', short: 'Str. Disagree' },
  { value: 2, label: 'Disagree', short: 'Disagree' },
  { value: 3, label: 'Neutral', short: 'Neutral' },
  { value: 4, label: 'Agree', short: 'Agree' },
  { value: 5, label: 'Strongly Agree', short: 'Str. Agree' }
];

export default function QuizComponent() {
  const navigate = useNavigate();
  const { token, refreshProfile } = useAuth();

  const [answers, setAnswers] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentQ = QUIZ_QUESTIONS[currentIndex];
  const totalQuestions = QUIZ_QUESTIONS.length;
  const answeredCount = Object.keys(answers).length;
  const progressPercent = Math.round((answeredCount / totalQuestions) * 100);
  const isComplete = answeredCount === totalQuestions;

  const handleSelectScore = (val) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQ.id]: val
    }));

    // Auto-advance if not on last question
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleRetake = () => {
    setAnswers({});
    setCurrentIndex(0);
  };

  const calculateScores = () => {
    const scores = {
      analytical: 0,
      creative: 0,
      social: 0,
      technical: 0
    };

    QUIZ_QUESTIONS.forEach((q) => {
      const val = answers[q.id] || 3;
      scores[q.trait] += val;
    });

    return scores;
  };

  const handleSeeMatches = async () => {
    const scores = calculateScores();
    setIsSubmitting(true);

    if (token) {
      try {
        await api.saveQuiz(token, {
          scores,
          topMatch: 'Evaluating...'
        });
        refreshProfile();
      } catch (e) {
        console.warn('[Quiz Save Notice]', e.message);
      }
    }

    const params = new URLSearchParams({
      analytical: scores.analytical,
      creative: scores.creative,
      social: scores.social,
      technical: scores.technical
    });

    navigate(`/matches?${params.toString()}`);
  };

  return (
    <section className="quiz-container" style={{ maxWidth: '820px', margin: '0 auto' }} aria-label="Career Aptitude Assessment">
      {/* Question Stepper Indicator (1-12 Pills - Eliminates Scrolling) */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.4rem',
          flexWrap: 'wrap',
          marginBottom: '0.85rem'
        }}
        role="tablist"
        aria-label="Quiz question navigation"
      >
        {QUIZ_QUESTIONS.map((q, idx) => {
          const isAnswered = answers[q.id] !== undefined;
          const isCurrent = idx === currentIndex;
          return (
            <button
              key={q.id}
              type="button"
              onClick={() => setCurrentIndex(idx)}
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.8rem',
                fontWeight: isCurrent ? '700' : '500',
                cursor: 'pointer',
                background: isCurrent
                  ? 'var(--primary)'
                  : isAnswered
                  ? 'rgba(16, 185, 129, 0.25)'
                  : 'rgba(10, 20, 44, 0.6)',
                border: isCurrent
                  ? '2px solid var(--accent)'
                  : isAnswered
                  ? '1px solid rgba(16, 185, 129, 0.5)'
                  : '1px solid var(--border)',
                color: isCurrent ? '#ffffff' : isAnswered ? '#a7f3d0' : 'var(--secondary-text)',
                transition: 'all 0.15s ease'
              }}
              title={`Question ${q.id}: ${q.category} (${isAnswered ? 'Answered' : 'Unanswered'})`}
              aria-label={`Jump to question ${q.id}`}
            >
              {isAnswered && !isCurrent ? '✓' : q.id}
            </button>
          );
        })}
      </div>

      {/* Sleek Progress Bar */}
      <div style={{ marginBottom: '1rem' }}>
        <div
          className="quiz-progress-bar-wrapper"
          style={{ margin: '0 0 0.35rem 0', height: '8px' }}
          role="progressbar"
          aria-valuenow={progressPercent}
          aria-valuemin="0"
          aria-valuemax="100"
          aria-label="Quiz progress"
        >
          <div className="quiz-progress-bar-fill" style={{ width: `${progressPercent}%` }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--secondary-text)' }}>
          <span>
            Question <strong>{currentIndex + 1}</strong> of {totalQuestions}
          </span>
          <span>{answeredCount} of {totalQuestions} answered ({progressPercent}%)</span>
        </div>
      </div>

      {/* Compact Question Card */}
      <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
          <span className={`quiz-category-tag ${currentQ.tagClass}`} style={{ margin: 0 }}>
            {currentQ.category}
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Trait: {currentQ.trait.toUpperCase()}
          </span>
        </div>

        <p
          className="quiz-statement-text"
          id={`question-statement-${currentQ.id}`}
          style={{ fontSize: '1.15rem', marginBottom: '1.25rem', lineHeight: '1.5' }}
        >
          "{currentQ.statement}"
        </p>

        {/* 5-Point Likert Scale (Compact Row) */}
        <fieldset className="likert-fieldset">
          <legend className="sr-only">
            How strongly do you agree with: {currentQ.statement}
          </legend>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(5, 1fr)',
              gap: '0.5rem'
            }}
            role="radiogroup"
            aria-labelledby={`question-statement-${currentQ.id}`}
          >
            {LIKERT_OPTIONS.map((opt) => {
              const isSelected = answers[currentQ.id] === opt.value;
              return (
                <label
                  key={opt.value}
                  className={`likert-option ${isSelected ? 'selected' : ''}`}
                  style={{ cursor: 'pointer' }}
                >
                  <input
                    type="radio"
                    name={`q-${currentQ.id}`}
                    value={opt.value}
                    checked={isSelected}
                    onChange={() => handleSelectScore(opt.value)}
                    className="likert-input"
                    aria-label={`${opt.label} (${opt.value} of 5)`}
                  />
                  <div
                    className="likert-button-box"
                    style={{
                      padding: '0.65rem 0.35rem',
                      background: isSelected ? 'rgba(14, 165, 233, 0.25)' : 'rgba(10, 20, 44, 0.6)',
                      borderColor: isSelected ? 'var(--accent)' : 'var(--border)'
                    }}
                  >
                    <span className="likert-score-num" style={{ fontSize: '1.1rem' }}>
                      {opt.value}
                    </span>
                    <span className="likert-label-text" style={{ fontSize: '0.7rem' }}>
                      {opt.short}
                    </span>
                  </div>
                </label>
              );
            })}
          </div>
        </fieldset>

        {/* Quiz Controls (Compact Bar) */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: '1.25rem',
            gap: '0.5rem',
            paddingTop: '0.85rem',
            borderTop: '1px solid rgba(56, 189, 248, 0.1)'
          }}
        >
          <button
            type="button"
            onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
            disabled={currentIndex === 0}
            className="btn-secondary"
            style={{ padding: '0.45rem 0.9rem', fontSize: '0.85rem' }}
            aria-label="Previous question"
          >
            ← Prev
          </button>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              type="button"
              onClick={handleRetake}
              className="btn-secondary"
              style={{ padding: '0.45rem 0.9rem', fontSize: '0.85rem' }}
              aria-label="Reset quiz"
            >
              🔄 Reset
            </button>

            {currentIndex < totalQuestions - 1 ? (
              <button
                type="button"
                onClick={() => setCurrentIndex((prev) => Math.min(totalQuestions - 1, prev + 1))}
                className="btn-primary"
                style={{ padding: '0.45rem 1rem', fontSize: '0.85rem' }}
                aria-label="Next question"
              >
                Next →
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSeeMatches}
                disabled={!isComplete || isSubmitting}
                className="btn-primary"
                style={{ padding: '0.45rem 1.1rem', fontSize: '0.85rem' }}
                aria-label="See career matches"
              >
                {isSubmitting ? 'Analyzing...' : 'See Matches 🚀'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* If complete and user is reviewing earlier questions, show a quick completion button */}
      {isComplete && currentIndex < totalQuestions - 1 && (
        <div
          className="glass-panel"
          style={{
            padding: '0.75rem 1.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'rgba(16, 185, 129, 0.12)',
            border: '1px solid rgba(16, 185, 129, 0.3)'
          }}
        >
          <span style={{ fontSize: '0.85rem', color: '#a7f3d0' }}>
            ✓ All 12 answered! Ready to calculate matches.
          </span>
          <button
            onClick={handleSeeMatches}
            disabled={isSubmitting}
            className="btn-primary"
            style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }}
          >
            {isSubmitting ? 'Analyzing...' : 'See Matches 🚀'}
          </button>
        </div>
      )}
    </section>
  );
}
