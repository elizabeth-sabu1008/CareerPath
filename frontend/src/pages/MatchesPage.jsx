import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import CareerCard from '../components/CareerCard';

export default function MatchesPage() {
  const [searchParams] = useSearchParams();
  const { userProfile } = useAuth();

  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Extract quiz scores from search params or fallback to userProfile or defaults
  const analytical =
    searchParams.get('analytical') || userProfile?.quizResults?.scores?.analytical || 10;
  const creative =
    searchParams.get('creative') || userProfile?.quizResults?.scores?.creative || 10;
  const social =
    searchParams.get('social') || userProfile?.quizResults?.scores?.social || 10;
  const technical =
    searchParams.get('technical') || userProfile?.quizResults?.scores?.technical || 10;

  const fetchMatches = useCallback(() => {
    setLoading(true);
    setError(null);

    api
      .getMatches({ analytical, creative, social, technical })
      .then((data) => {
        setMatches(data.matches || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('[Matches Fetch Error]', err);
        setError(
          err.message || 'Unable to load career matches right now. Please ensure the backend is running.'
        );
        setLoading(false);
      });
  }, [analytical, creative, social, technical]);

  useEffect(() => {
    fetchMatches();
  }, [fetchMatches]);

  return (
    <main className="main-content" id="main-content" style={{ padding: '1.25rem 1rem 2.5rem' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* Compact Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '0.85rem'
          }}
        >
          <div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: '0.8rem',
                color: 'var(--accent)',
                fontWeight: '600',
                marginBottom: '0.2rem'
              }}
            >
              🎯 Algorithmic Trait Alignment (Manhattan Distance)
            </div>
            <h1 style={{ fontSize: '1.6rem', fontWeight: '700', color: '#fff', margin: 0 }}>
              Top 3 Inclusive <span className="gradient-text">Career Tracks</span>
            </h1>
            <p style={{ color: 'var(--secondary-text)', fontSize: '0.85rem', margin: 0 }}>
              Scores — Analytical: {analytical}, Creative: {creative}, Social: {social}, Technical: {technical}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.6rem' }}>
            <Link to="/" className="btn-secondary" style={{ padding: '0.45rem 0.9rem', fontSize: '0.85rem' }}>
              ← Retake Quiz
            </Link>
            <button
              onClick={fetchMatches}
              className="btn-secondary"
              style={{ padding: '0.45rem 0.9rem', fontSize: '0.85rem' }}
            >
              🔄 Refresh
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div
            className="glass-panel"
            style={{
              padding: '3rem 1.5rem',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.85rem'
            }}
            aria-live="polite"
          >
            <div
              style={{
                width: '36px',
                height: '36px',
                border: '3px solid rgba(56, 189, 248, 0.2)',
                borderTopColor: 'var(--accent)',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }}
            />
            <p style={{ color: 'var(--secondary-text)', fontSize: '0.95rem' }}>
              Calculating trait distances & fetching live market insights...
            </p>
          </div>
        )}

        {/* Error State with Immediate Retry */}
        {!loading && error && (
          <div
            className="glass-panel"
            style={{
              padding: '2rem 1.5rem',
              textAlign: 'center',
              border: '1px solid var(--danger-border)',
              background: 'rgba(239, 68, 68, 0.1)'
            }}
            role="alert"
          >
            <div style={{ fontSize: '1.8rem', marginBottom: '0.4rem' }}>⚠️</div>
            <h2 style={{ color: '#fca5a5', fontSize: '1.2rem', marginBottom: '0.4rem' }}>Unable to Fetch Matches</h2>
            <p style={{ color: 'var(--secondary-text)', maxWidth: '500px', margin: '0 auto 1rem', fontSize: '0.9rem' }}>
              {error}
            </p>
            <button onClick={fetchMatches} className="btn-primary" style={{ padding: '0.5rem 1.25rem', fontSize: '0.9rem' }}>
              🔄 Try Reconnecting
            </button>
          </div>
        )}

        {/* Matches Grid */}
        {!loading && !error && (
          <div className="dashboard-grid" role="region" aria-label="Top career recommendations">
            {matches.map((career) => (
              <CareerCard key={career._id} career={career} />
            ))}
          </div>
        )}

        {/* Compact DEI & Inclusivity Notice */}
        <section
          className="glass-panel"
          style={{
            padding: '1.25rem 1.5rem',
            background: 'rgba(10, 18, 40, 0.5)',
            border: '1px solid rgba(56, 189, 248, 0.15)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <span style={{ fontSize: '1.1rem' }}>🌈</span>
            <strong style={{ color: 'var(--accent)', fontSize: '0.95rem' }}>
              Inclusivity & Non-Traditional Background Commitment
            </strong>
          </div>
          <p style={{ color: 'var(--secondary-text)', fontSize: '0.85rem', lineHeight: '1.5', margin: 0 }}>
            Every career on CareerPath is vetted for psychological safety, neurodivergent friendliness,
            and equal opportunity advancement. Whether you come from a non-traditional background,
            a bootcamp, self-taught study, or are pivoting from another field, you belong here.
          </p>
        </section>
      </div>
    </main>
  );
}
