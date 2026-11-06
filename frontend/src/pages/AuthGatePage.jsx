import React from 'react';
import { useAuth } from '../context/AuthContext';

export default function AuthGatePage() {
  const { signInWithGoogle, signInDemo, authError } = useAuth();

  return (
    <div className="auth-gate-container">
      <main className="glass-panel auth-card" role="main" aria-labelledby="auth-main-title">
        {/* App Icon */}
        <div className="auth-card-icon" aria-hidden="true">
          CP
        </div>

        <h1 id="auth-main-title" className="auth-title">
          CareerPath: <span className="gradient-text">Classroom to Career</span>
        </h1>

        <p className="auth-subtitle">
          An inclusive career guidance platform for students and career-switchers.
          Discover neurodivergent-friendly roles, verified DEI workplaces, and accessible pathways.
        </p>

        {/* Inline Firebase / Auth Error Banner */}
        {authError && (
          <div className="auth-error-banner" role="alert" aria-live="assertive">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
              <span style={{ fontSize: '1.2rem' }}>⚠️</span>
              <strong style={{ color: '#ffffff' }}>Firebase Notice:</strong>
            </div>
            <p style={{ color: '#fecaca', marginBottom: '0.75rem' }}>{authError}</p>
            <button
              onClick={() => signInDemo('Aarav Sharma (Student)')}
              className="btn-demo-prominent"
              style={{ width: '100%', fontSize: '0.9rem', padding: '0.65rem 1rem' }}
              type="button"
            >
              🎓 Enter Now with Demo Explorer Account →
            </button>
          </div>
        )}

        {/* Action Group */}
        <div className="auth-action-group">
          {/* Primary: Sign in with Google */}
          <button
            onClick={signInWithGoogle}
            className="btn-google"
            type="button"
            aria-label="Sign in with your Google account"
          >
            {/* Google G Logo SVG */}
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              aria-hidden="true"
              focusable="false"
            >
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Sign in with Google</span>
          </button>

          <div className="auth-divider">
            <span>or instant 1-click preview</span>
          </div>

          {/* Quick Demo Access */}
          <button
            onClick={() => signInDemo('Aarav Sharma (Student)')}
            className="btn-demo-prominent"
            type="button"
            aria-label="Continue with Demo Student Account"
          >
            🎓 Continue with Demo Explorer Account
          </button>
        </div>

        {/* Feature Highlights */}
        <div className="auth-features-list" aria-label="Key features">
          <div className="auth-feature-item">
            <span className="auth-feature-check">✓</span>
            <span>Accessibility First</span>
          </div>
          <div className="auth-feature-item">
            <span className="auth-feature-check">✓</span>
            <span>Non-Traditional Welcomed</span>
          </div>
          <div className="auth-feature-item">
            <span className="auth-feature-check">✓</span>
            <span>5-Point Aptitude Quiz</span>
          </div>
          <div className="auth-feature-item">
            <span className="auth-feature-check">✓</span>
            <span>Underrepresented Mentors</span>
          </div>
        </div>
      </main>
    </div>
  );
}
