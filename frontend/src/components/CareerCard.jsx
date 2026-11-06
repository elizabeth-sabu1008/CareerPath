import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function CareerCard({ career }) {
  const navigate = useNavigate();
  const { savedCareers, toggleSaveCareer } = useAuth();

  const isSaved = savedCareers.includes(career._id);

  const formatSalary = () => {
    if (career.salaryEstimation) {
      return career.salaryEstimation;
    }
    if (career.baseSalaryRange) {
      const minLakhs = Math.round(career.baseSalaryRange.min / 100000);
      const maxLakhs = Math.round(career.baseSalaryRange.max / 100000);
      return `₹${minLakhs}-${maxLakhs}L`;
    }
    return '₹8-40L';
  };

  return (
    <article className="glass-panel career-card" aria-labelledby={`career-title-${career._id}`}>
      {/* Top Header: Title & Match Score */}
      <div className="career-card-top">
        <div>
          <h3 id={`career-title-${career._id}`} className="career-title">
            {career.title}
          </h3>
          <div className="career-badges-row" style={{ marginTop: '0.4rem' }}>
            <span className="badge-market" aria-label={`Market Demand: ${career.marketTag || 'High demand'}`}>
              📈 {career.marketTag || 'High demand'}
            </span>
            <span className="badge-salary" aria-label={`Estimated Salary: ${formatSalary()}`}>
              💼 {formatSalary()}
            </span>
            <span className="badge-dei" aria-label={`DEI Rating: ${career.deiRating || 4.5} out of 5`}>
              ★ {career.deiRating || 4.5} DEI Rating
            </span>
          </div>
        </div>

        {career.matchScore !== undefined && (
          <div
            className="match-percentage-badge"
            aria-label={`${career.matchScore}% trait alignment`}
          >
            🎯 {career.matchScore}% Match
          </div>
        )}
      </div>

      {/* Description */}
      <p className="career-description">{career.description}</p>

      {/* Non-traditional background badge */}
      {career.welcomesNonTraditional && (
        <div>
          <span className="badge-non-traditional">
            ✨ Non-Traditional Welcome
          </span>
        </div>
      )}

      {/* Accessibility Features */}
      {career.accessibilityFeatures && career.accessibilityFeatures.length > 0 && (
        <div className="accessibility-features-block">
          <div className="accessibility-block-title">
            ♿ Inclusive & Accessibility Accommodations
          </div>
          <div className="accessibility-badges-wrap">
            {career.accessibilityFeatures.map((feat, idx) => (
              <span key={idx} className="badge-access">
                ✓ {feat}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons: Save & View Path */}
      <div className="career-card-actions">
        <button
          onClick={() => toggleSaveCareer(career._id)}
          className={`btn-save-career ${isSaved ? 'saved' : ''}`}
          aria-label={isSaved ? `Unsave ${career.title}` : `Save ${career.title} to my profile`}
          type="button"
        >
          {isSaved ? '★ Saved to Path' : '☆ Save Career'}
        </button>

        <button
          onClick={() => navigate(`/roadmap?careerId=${career._id}`)}
          className="btn-primary"
          style={{ flex: 1 }}
          type="button"
          aria-label={`View learning roadmap for ${career.title}`}
        >
          View Path →
        </button>
      </div>
    </article>
  );
}
