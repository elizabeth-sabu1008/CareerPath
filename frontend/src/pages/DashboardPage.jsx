import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import QuizComponent from '../components/QuizComponent';

export default function DashboardPage() {
  const { userProfile } = useAuth();

  const prevScores = userProfile?.quizResults?.scores;
  const hasPreviousQuiz =
    prevScores &&
    (prevScores.analytical > 0 ||
      prevScores.creative > 0 ||
      prevScores.social > 0 ||
      prevScores.technical > 0);

  return (
    <main className="main-content" id="main-content" style={{ padding: '1.25rem 1rem 2rem' }}>
      {/* Compact Header Bar */}
      <section
        className="glass-panel"
        style={{
          padding: '1.25rem 1.75rem',
          marginBottom: '1.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          background: 'linear-gradient(135deg, rgba(14,25,52,0.85) 0%, rgba(10,18,40,0.95) 100%)'
        }}
        aria-labelledby="dashboard-hero-title"
      >
        <div style={{ maxWidth: '720px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: '600',
                color: '#38bdf8',
                background: 'rgba(56, 189, 248, 0.12)',
                padding: '0.2rem 0.6rem',
                borderRadius: '9999px',
                border: '1px solid rgba(56, 189, 248, 0.25)'
              }}
            >
              ✨ Classroom to Career
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--secondary-text)' }}>
              Inclusive, accessible guidance for students & career switchers
            </span>
          </div>
          <h1 id="dashboard-hero-title" style={{ fontSize: '1.6rem', fontWeight: '700', color: '#fff', margin: 0 }}>
            Find Your Path with the <span className="gradient-text">Aptitude Quiz</span>
          </h1>
        </div>

        {hasPreviousQuiz && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--secondary-text)' }}>
              Scores: A:{prevScores.analytical} C:{prevScores.creative} S:{prevScores.social} T:{prevScores.technical}
            </span>
            <Link
              to={`/matches?analytical=${prevScores.analytical}&creative=${prevScores.creative}&social=${prevScores.social}&technical=${prevScores.technical}`}
              className="btn-primary"
              style={{ fontSize: '0.8rem', padding: '0.45rem 0.9rem' }}
            >
              Saved Matches 🎯
            </Link>
          </div>
        )}
      </section>

      {/* Main 12-Statement Career Aptitude Quiz (Compact & Streamlined) */}
      <QuizComponent />
    </main>
  );
}
