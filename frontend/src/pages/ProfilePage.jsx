import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

const ACCESSIBILITY_OPTIONS = [
  'Screen Reader Friendly',
  'Neurodivergent Accommodating',
  'Asynchronous Workflows',
  'Flexible Pacing',
  'High-Contrast Interface',
  'Quiet Workstations'
];

export default function ProfilePage() {
  const navigate = useNavigate();
  const { currentUser, userProfile, token, refreshProfile, toggleSaveCareer } = useAuth();

  const [pronouns, setPronouns] = useState(userProfile?.pronouns || 'they/them');
  const [accessibilityNeeds, setAccessibilityNeeds] = useState(
    userProfile?.accessibilityNeeds || []
  );
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (userProfile) {
      if (userProfile.pronouns) setPronouns(userProfile.pronouns);
      if (userProfile.accessibilityNeeds) setAccessibilityNeeds(userProfile.accessibilityNeeds);
    }
  }, [userProfile]);

  const handleToggleAccessNeed = (need) => {
    setAccessibilityNeeds((prev) =>
      prev.includes(need) ? prev.filter((n) => n !== need) : [...prev, need]
    );
  };

  const handleSavePreferences = async (e) => {
    e.preventDefault();
    if (!token) return;
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      await api.syncUser(token, {
        pronouns,
        accessibilityNeeds,
        preferredLanguage: userProfile?.preferredLanguage || 'English'
      });
      await refreshProfile();
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to save profile preferences:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const displayName = currentUser?.displayName || userProfile?.name || 'Career Explorer';
  const email = currentUser?.email || userProfile?.email || 'explorer@careerpath.internal';
  const scores = userProfile?.quizResults?.scores;
  const savedList = userProfile?.savedCareers || [];
  const bookedList = userProfile?.bookedSessions || [];

  const formatSlot = (dateString) => {
    const d = new Date(dateString);
    return d.toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <main className="main-content" id="main-content" style={{ padding: '1.25rem 1rem 2.5rem' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* Profile Header */}
        <section
          className="glass-panel"
          style={{
            padding: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem'
          }}
          aria-labelledby="profile-heading"
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'var(--gradient-primary)',
                color: '#fff',
                fontSize: '1.5rem',
                fontWeight: '700',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 20px rgba(56, 189, 248, 0.4)'
              }}
              aria-hidden="true"
            >
              {displayName.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <h1 id="profile-heading" style={{ fontSize: '1.5rem', color: '#ffffff', marginBottom: '0.2rem' }}>
                {displayName}
              </h1>
              <p style={{ color: 'var(--secondary-text)', fontSize: '0.85rem' }}>
                {email} · <span style={{ color: 'var(--accent)' }}>Pronouns: {pronouns}</span>
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.6rem' }}>
            <button
              onClick={() => navigate('/')}
              className="btn-secondary"
              style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
            >
              ← Quiz Dashboard
            </button>
            <button
              onClick={() => navigate('/matches')}
              className="btn-primary"
              style={{ padding: '0.5rem 1.1rem', fontSize: '0.85rem' }}
            >
              View Matches 🎯
            </button>
          </div>
        </section>

        {/* 2-Column Responsive Layout */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
          {/* Column 1: Account Preferences & Accessibility Settings */}
          <section className="glass-panel" style={{ padding: '1.5rem' }} aria-labelledby="preferences-heading">
            <h2 id="preferences-heading" style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '0.75rem' }}>
              👤 Inclusivity Preferences
            </h2>

            {saveSuccess && (
              <div
                style={{
                  background: 'rgba(16, 185, 129, 0.2)',
                  border: '1px solid rgba(16, 185, 129, 0.5)',
                  color: '#a7f3d0',
                  padding: '0.5rem 0.85rem',
                  borderRadius: '8px',
                  marginBottom: '1rem',
                  fontSize: '0.85rem'
                }}
              >
                ✓ Profile preferences saved successfully!
              </div>
            )}

            <form onSubmit={handleSavePreferences}>
              <div style={{ marginBottom: '1rem' }}>
                <label
                  htmlFor="pronouns-select"
                  style={{ display: 'block', fontSize: '0.85rem', color: 'var(--secondary-text)', marginBottom: '0.4rem' }}
                >
                  Your Preferred Pronouns:
                </label>
                <select
                  id="pronouns-select"
                  value={pronouns}
                  onChange={(e) => setPronouns(e.target.value)}
                  className="career-dropdown-select"
                  style={{ width: '100%', padding: '0.55rem 0.85rem', fontSize: '0.9rem' }}
                >
                  <option value="they/them">they / them</option>
                  <option value="she/her">she / her</option>
                  <option value="he/him">he / him</option>
                  <option value="she/they">she / they</option>
                  <option value="he/they">he / they</option>
                  <option value="any pronouns">any pronouns</option>
                </select>
              </div>

              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--secondary-text)', marginBottom: '0.5rem' }}>
                  Accessibility & Learning Needs:
                </label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                  {ACCESSIBILITY_OPTIONS.map((opt) => {
                    const isSelected = accessibilityNeeds.includes(opt);
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => handleToggleAccessNeed(opt)}
                        style={{
                          background: isSelected ? 'rgba(14, 165, 233, 0.25)' : 'rgba(10, 20, 44, 0.6)',
                          border: `1px solid ${isSelected ? 'var(--accent)' : 'var(--border)'}`,
                          color: isSelected ? '#ffffff' : 'var(--secondary-text)',
                          padding: '0.35rem 0.75rem',
                          borderRadius: '9999px',
                          fontSize: '0.8rem',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        {isSelected ? '✓ ' : '+ '}
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                type="submit"
                disabled={isSaving}
                className="btn-primary"
                style={{ width: '100%', padding: '0.65rem 1rem', fontSize: '0.9rem' }}
              >
                {isSaving ? 'Saving Changes...' : 'Save Preferences 💾'}
              </button>
            </form>
          </section>

          {/* Column 2: Aptitude Quiz Profile */}
          <section className="glass-panel" style={{ padding: '1.5rem' }} aria-labelledby="aptitude-heading">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <h2 id="aptitude-heading" style={{ fontSize: '1.2rem', color: '#fff' }}>
                📊 Aptitude Trait Scores
              </h2>
              <Link
                to="/"
                style={{ fontSize: '0.8rem', color: 'var(--accent)', textDecoration: 'none' }}
              >
                Retake Quiz ↺
              </Link>
            </div>

            {scores && (scores.analytical > 0 || scores.creative > 0 || scores.social > 0 || scores.technical > 0) ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {[
                  { name: 'Analytical Thinking', score: scores.analytical, color: '#38bdf8' },
                  { name: 'Creative Exploration', score: scores.creative, color: '#c084fc' },
                  { name: 'Social & Empathy', score: scores.social, color: '#34d399' },
                  { name: 'Technical Architecture', score: scores.technical, color: '#fbbf24' }
                ].map((item) => {
                  const percent = Math.min(100, Math.round((item.score / 15) * 100));
                  return (
                    <div key={item.name}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.25rem' }}>
                        <span style={{ color: 'var(--text)' }}>{item.name}</span>
                        <span style={{ color: item.color, fontWeight: '600' }}>
                          {item.score} / 15 ({percent}%)
                        </span>
                      </div>
                      <div style={{ height: '8px', background: 'rgba(10, 20, 44, 0.7)', borderRadius: '9999px', overflow: 'hidden' }}>
                        <div
                          style={{
                            width: `${percent}%`,
                            height: '100%',
                            background: item.color,
                            borderRadius: '9999px',
                            transition: 'width 0.4s ease'
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div style={{ padding: '1.5rem 0', textAlign: 'center' }}>
                <p style={{ color: 'var(--secondary-text)', fontSize: '0.9rem', marginBottom: '0.85rem' }}>
                  You haven't taken the career aptitude assessment yet.
                </p>
                <Link to="/" className="btn-primary" style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}>
                  Take 12-Statement Quiz 🚀
                </Link>
              </div>
            )}
          </section>
        </div>

        {/* Saved Careers Section */}
        <section className="glass-panel" style={{ padding: '1.5rem' }} aria-labelledby="saved-careers-heading">
          <h2 id="saved-careers-heading" style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '0.75rem' }}>
            ★ Saved Career Pathways ({savedList.length})
          </h2>

          {savedList.length === 0 ? (
            <p style={{ color: 'var(--secondary-text)', fontSize: '0.9rem' }}>
              No saved careers yet. Discover paths on the{' '}
              <Link to="/matches" style={{ color: 'var(--accent)' }}>
                Matches page
              </Link>{' '}
              and click "Save Career" to bookmark them here.
            </p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '0.85rem' }}>
              {savedList.map((career) => {
                const cId = career._id || career;
                const title = career.title || 'Saved Career Track';
                return (
                  <div
                    key={cId}
                    style={{
                      padding: '1rem',
                      background: 'rgba(10, 20, 44, 0.6)',
                      border: '1px solid var(--border)',
                      borderRadius: '12px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      gap: '0.6rem'
                    }}
                  >
                    <div>
                      <strong style={{ color: '#fff', fontSize: '0.95rem' }}>{title}</strong>
                      {career.demandLevel && (
                        <div style={{ fontSize: '0.75rem', color: 'var(--accent)', marginTop: '0.2rem' }}>
                          📈 {career.demandLevel} Demand
                        </div>
                      )}
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
                      <Link
                        to={`/roadmap?careerId=${cId}`}
                        className="btn-primary"
                        style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem', flex: 1, textAlign: 'center' }}
                      >
                        Roadmap →
                      </Link>
                      <button
                        onClick={() => toggleSaveCareer(cId)}
                        style={{
                          background: 'transparent',
                          border: '1px solid rgba(239, 68, 68, 0.3)',
                          color: '#fca5a5',
                          borderRadius: '8px',
                          padding: '0.35rem 0.65rem',
                          fontSize: '0.8rem',
                          cursor: 'pointer'
                        }}
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Booked Mentor Sessions Section */}
        <section className="glass-panel" style={{ padding: '1.5rem' }} aria-labelledby="booked-sessions-heading">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <h2 id="booked-sessions-heading" style={{ fontSize: '1.2rem', color: '#fff' }}>
              📅 Booked Mentorship Sessions ({bookedList.length})
            </h2>
            <Link to="/mentors" className="btn-secondary" style={{ padding: '0.35rem 0.85rem', fontSize: '0.8rem' }}>
              + Find More Mentors
            </Link>
          </div>

          {bookedList.length === 0 ? (
            <p style={{ color: 'var(--secondary-text)', fontSize: '0.9rem' }}>
              No mentor sessions booked yet. Explore our diverse mentors on the{' '}
              <Link to="/mentors" style={{ color: 'var(--accent)' }}>
                Mentors page
              </Link>{' '}
              to book a 1-on-1 strategy session!
            </p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.85rem' }}>
              {bookedList.map((session, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '1rem',
                    background: 'rgba(10, 20, 44, 0.6)',
                    border: '1px solid var(--border)',
                    borderRadius: '12px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.4rem'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <strong style={{ color: '#fff', fontSize: '0.95rem' }}>
                      {session.mentorName || 'Industry Mentor'}
                    </strong>
                    <span
                      style={{
                        background: 'rgba(16, 185, 129, 0.15)',
                        color: '#6ee7b7',
                        border: '1px solid rgba(16, 185, 129, 0.3)',
                        padding: '0.15rem 0.5rem',
                        borderRadius: '9999px',
                        fontSize: '0.75rem'
                      }}
                    >
                      ✓ Confirmed
                    </span>
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--secondary-text)' }}>
                    {session.mentorRole} {session.company ? `@ ${session.company}` : ''}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--accent)', marginTop: '0.2rem' }}>
                    🗓️ {formatSlot(session.date)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

