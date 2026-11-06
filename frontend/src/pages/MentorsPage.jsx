import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

const FOCUS_TAGS = [
  'All',
  'Women in Tech',
  'Career Transitioners',
  'First-gen Tech',
  'Bootcamp Grads',
  'LGBTQ+'
];

export default function MentorsPage() {
  const { token, refreshProfile } = useAuth();

  const [mentors, setMentors] = useState([]);
  const [activeFocus, setActiveFocus] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Booking modal state
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [isBooking, setIsBooking] = useState(false);
  const [bookingToast, setBookingToast] = useState(null);
  const [bookingError, setBookingError] = useState(null);

  // Fetch mentors when activeFocus changes
  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    api
      .getMentors(activeFocus)
      .then((data) => {
        if (isMounted) {
          setMentors(data || []);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          console.error('Error fetching mentors:', err);
          setError('Failed to load mentors list. Please ensure the backend server is running.');
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [activeFocus]);

  const getInitials = (name) => {
    if (!name) return 'M';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const handleOpenBooking = (mentor) => {
    setSelectedMentor(mentor);
    setBookingError(null);
    // Default select first available slot
    if (mentor.availableSlots && mentor.availableSlots.length > 0) {
      setSelectedDate(mentor.availableSlots[0]);
    } else {
      // Fallback date 2 days from now at 4:00 PM
      const fallbackDate = new Date(Date.now() + 48 * 3600 * 1000);
      fallbackDate.setMinutes(0, 0, 0);
      setSelectedDate(fallbackDate.toISOString());
    }
  };

  const handleCloseBooking = () => {
    setSelectedMentor(null);
    setSelectedDate(null);
    setBookingError(null);
  };

  const handleConfirmBooking = async () => {
    if (!selectedMentor || !selectedDate) return;
    setIsBooking(true);
    setBookingError(null);

    try {
      const res = await api.bookMentorSession(token, {
        mentorId: selectedMentor._id,
        date: selectedDate
      });

      setBookingToast(
        res.message || `Session successfully confirmed with ${selectedMentor.name}!`
      );
      handleCloseBooking();
      refreshProfile();

      // Auto-hide toast after 6 seconds
      setTimeout(() => {
        setBookingToast(null);
      }, 6000);
    } catch (err) {
      console.error('Booking error:', err);
      setBookingError(err.message || 'Failed to book mentor session.');
    } finally {
      setIsBooking(false);
    }
  };

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
    <main className="main-content" id="main-content">
      <div className="mentors-container">
        {/* Header */}
        <div>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontSize: '0.85rem',
              color: 'var(--accent)',
              fontWeight: '600',
              marginBottom: '0.4rem'
            }}
          >
            🤝 Empathetic Guidance from Lived Experience
          </div>
          <h1 className="section-title">
            Connect with <span className="gradient-text">Inclusive Mentors</span>
          </h1>
          <p className="section-subtitle" style={{ marginBottom: '1.25rem' }}>
            Book 1-on-1 career strategy, portfolio reviews, and mock interviews with seasoned
            engineers and leaders championing diversity in tech.
          </p>

          {/* Mentorship Focus Filter Buttons */}
          <div className="focus-filter-bar" role="group" aria-label="Filter mentors by background focus">
            {FOCUS_TAGS.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => setActiveFocus(tag)}
                className={`focus-pill-btn ${activeFocus === tag ? 'active' : ''}`}
                aria-pressed={activeFocus === tag}
              >
                {tag === 'All' ? '🌐 All Backgrounds' : tag}
              </button>
            ))}
          </div>
        </div>

        {/* Success Confirmation Toast */}
        {bookingToast && (
          <div className="toast-success" role="status" aria-live="polite">
            <span style={{ fontSize: '1.3rem' }}>🎉</span>
            <div>
              <strong>Booking Confirmed!</strong> {bookingToast}
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div
            className="glass-panel"
            style={{ padding: '3.5rem', textAlign: 'center' }}
            aria-live="polite"
          >
            <p style={{ color: 'var(--secondary-text)' }}>Loading verified mentors...</p>
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div
            className="glass-panel"
            style={{
              padding: '2.5rem',
              textAlign: 'center',
              border: '1px solid var(--danger-border)',
              background: 'rgba(239, 68, 68, 0.1)'
            }}
            role="alert"
          >
            <p style={{ color: '#fca5a5' }}>{error}</p>
          </div>
        )}

        {/* Mentors Grid */}
        {!loading && !error && (
          <div className="dashboard-grid" role="region" aria-label="Mentor profiles">
            {mentors.length === 0 ? (
              <div
                className="glass-panel"
                style={{ gridColumn: '1 / -1', padding: '3rem', textAlign: 'center' }}
              >
                <p style={{ color: 'var(--secondary-text)' }}>
                  No mentors found matching the "{activeFocus}" focus. Try selecting "All Backgrounds".
                </p>
              </div>
            ) : (
              mentors.map((mentor) => (
                <article
                  key={mentor._id}
                  className="glass-panel mentor-card"
                  aria-labelledby={`mentor-name-${mentor._id}`}
                >
                  {/* Avatar & Header */}
                  <div className="mentor-header">
                    {mentor.imageUrl ? (
                      <img
                        src={mentor.imageUrl}
                        alt={`${mentor.name}'s profile avatar`}
                        className="mentor-avatar"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="mentor-avatar-initials" aria-hidden="true">
                        {getInitials(mentor.name)}
                      </div>
                    )}

                    <div className="mentor-info-block">
                      <h2 id={`mentor-name-${mentor._id}`} className="mentor-name">
                        {mentor.name}
                      </h2>
                      <div className="mentor-role-company">
                        {mentor.role} · <span style={{ color: 'var(--accent)' }}>{mentor.company}</span>
                      </div>
                      <span className="mentor-pronouns-badge">
                        Pronouns: {mentor.pronouns || 'they/them'}
                      </span>
                    </div>
                  </div>

                  {/* Experience & Skills */}
                  <div className="mentor-meta-row">
                    <span>⏳ {mentor.experienceYears} Years Industry Exp</span>
                  </div>

                  {/* Focus Tags */}
                  {mentor.mentorshipFocus && mentor.mentorshipFocus.length > 0 && (
                    <div>
                      <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: '600', marginBottom: '0.35rem' }}>
                        Mentorship Focus
                      </div>
                      <div className="mentor-focus-tags">
                        {mentor.mentorshipFocus.map((focus, fIdx) => (
                          <span key={fIdx} className="tag-focus">
                            ✦ {focus}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Skills Chips */}
                  {mentor.skills && mentor.skills.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                      {mentor.skills.map((skill, sIdx) => (
                        <span
                          key={sIdx}
                          style={{
                            fontSize: '0.75rem',
                            background: 'rgba(56, 189, 248, 0.08)',
                            color: 'var(--secondary-text)',
                            padding: '0.2rem 0.6rem',
                            borderRadius: '6px'
                          }}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Connect Action Button */}
                  <div style={{ marginTop: 'auto', paddingTop: '0.5rem' }}>
                    <button
                      type="button"
                      onClick={() => handleOpenBooking(mentor)}
                      className="btn-primary"
                      style={{ width: '100%' }}
                      aria-label={`Connect and book a mentoring session with ${mentor.name}`}
                    >
                      Connect & Book Slot 📅
                    </button>
                  </div>
                </article>
              ))
            )}
          </div>
        )}
      </div>

      {/* Accessible Booking Modal Dialog */}
      {selectedMentor && (
        <div
          className="booking-dialog-overlay"
          onClick={handleCloseBooking}
          role="dialog"
          aria-modal="true"
          aria-labelledby="booking-modal-title"
        >
          <div
            className="glass-panel booking-modal"
            onClick={(e) => e.stopPropagation()}
            style={{ background: '#091326', border: '1px solid var(--border-hover)' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h2 id="booking-modal-title" style={{ fontSize: '1.4rem', color: '#ffffff', marginBottom: '0.25rem' }}>
                  Connect with {selectedMentor.name}
                </h2>
                <p style={{ color: 'var(--secondary-text)', fontSize: '0.85rem' }}>
                  {selectedMentor.role} @ {selectedMentor.company}
                </p>
              </div>
              <button
                type="button"
                onClick={handleCloseBooking}
                className="btn-secondary"
                style={{ padding: '0.3rem 0.7rem', borderRadius: '50%' }}
                aria-label="Close booking modal"
              >
                ✕
              </button>
            </div>

            {bookingError && (
              <div
                style={{
                  background: 'var(--danger-bg)',
                  border: '1px solid var(--danger-border)',
                  color: '#fecaca',
                  padding: '0.75rem',
                  borderRadius: '8px',
                  fontSize: '0.85rem',
                  marginTop: '1rem'
                }}
              >
                {bookingError}
              </div>
            )}

            <div style={{ marginTop: '1.25rem' }}>
              <label
                style={{
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  color: 'var(--text)',
                  display: 'block',
                  marginBottom: '0.5rem'
                }}
              >
                Select an Available Session Slot:
              </label>

              <div className="slots-grid" role="radiogroup" aria-label="Available meeting time slots">
                {(selectedMentor.availableSlots && selectedMentor.availableSlots.length > 0
                  ? selectedMentor.availableSlots
                  : [new Date(Date.now() + 48 * 3600 * 1000).toISOString()]
                ).map((slotDate, index) => {
                  const isSelected = selectedDate === slotDate;
                  return (
                    <button
                      key={index}
                      type="button"
                      className={`slot-option-btn ${isSelected ? 'selected' : ''}`}
                      onClick={() => setSelectedDate(slotDate)}
                      role="radio"
                      aria-checked={isSelected}
                    >
                      <span>🗓️ {formatSlot(slotDate)}</span>
                      <span>{isSelected ? '✓ Selected' : 'Select'}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
              <button
                type="button"
                onClick={handleCloseBooking}
                className="btn-secondary"
                disabled={isBooking}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmBooking}
                disabled={isBooking || !selectedDate}
                className="btn-primary"
              >
                {isBooking ? 'Confirming...' : 'Confirm Session Booking 🚀'}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
