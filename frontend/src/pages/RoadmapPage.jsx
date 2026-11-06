import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';

const DEFAULT_ACADEMIC_ROADMAP = {
  title: '4-Year Academic to Career Pathway',
  description:
    'A universal roadmap designed for university students and degree pursuers transitioning smoothly into high-impact tech and design professions.',
  roadmap: [
    {
      phase: 'Year 1: Foundations & Exploratory Groundwork',
      milestones: [
        'Establish core computer science, discrete math, and algorithmic fundamentals',
        'Learn Git version control, collaborative development, and command-line tooling',
        'Explore introductory UX, systems thinking, and data analysis electives',
        'Participate in inclusive hackathons and campus engineering student groups'
      ]
    },
    {
      phase: 'Year 2: Specialization & Intermediate Systems',
      milestones: [
        'Deepen focus into a chosen track: Software Engineering, Data Science, Product, or UX',
        'Build and deploy three intermediate full-stack or analytical web applications',
        'Master accessible design principles (WCAG) and data privacy standards',
        'Draft technical blogs and open-source documentation contributions'
      ]
    },
    {
      phase: 'Year 3: Industry Immersion & Practical Internships',
      milestones: [
        'Secure and complete a summer or winter industry internship or research fellowship',
        'Collaborate cross-functionally across engineering, product management, and QA',
        'Conduct mock technical and behavioral interviews with experienced industry mentors',
        'Establish automated testing (CI/CD) and cloud architecture proficiencies'
      ]
    },
    {
      phase: 'Year 4: Capstone Execution & Career Transition',
      milestones: [
        'Deliver an end-to-end production capstone project addressing real-world user friction',
        'Polishing developer/designer portfolio and GitHub profile with accessible case studies',
        'Negotiate competitive full-time offers and evaluate company DEI workplace cultures',
        'Give back to first- and second-year peers through peer mentorship programs'
      ]
    }
  ],
  skills: [
    {
      name: 'Algorithmic Problem Solving & Data Structures',
      importance: 'Critical MUST',
      category: 'Computer Science'
    },
    {
      name: 'Modern Web & API Development (Node/React/Python)',
      importance: 'Critical MUST',
      category: 'Software Engineering'
    },
    {
      name: 'Git Version Control & CI/CD Pipelines',
      importance: 'Critical MUST',
      category: 'DevOps'
    },
    {
      name: 'Inclusive Design & Assistive Tech Accessibility (WCAG)',
      importance: 'High MUST/GOOD',
      category: 'Accessibility'
    },
    {
      name: 'Technical Writing & Architecture Documentation',
      importance: 'High MUST/GOOD',
      category: 'Communication'
    },
    {
      name: 'Cloud Computing Fundamentals (AWS/Docker)',
      importance: 'Medium GOOD/BONUS',
      category: 'Cloud'
    },
    {
      name: 'Agile Project Ceremonies & Sprint Planning',
      importance: 'Medium GOOD/BONUS',
      category: 'Management'
    }
  ]
};

export default function RoadmapPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const careerId = searchParams.get('careerId');

  const [careerList, setCareerList] = useState([]);
  const [currentCareer, setCurrentCareer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch list of all careers for dropdown
  useEffect(() => {
    api
      .getAllCareers()
      .then((data) => setCareerList(data || []))
      .catch((err) => console.warn('Could not load careers for dropdown:', err));
  }, []);

  // Fetch selected career or default to 4-year academic
  useEffect(() => {
    if (!careerId || careerId === 'academic') {
      setCurrentCareer(DEFAULT_ACADEMIC_ROADMAP);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    api
      .getCareerById(careerId)
      .then((data) => {
        setCurrentCareer(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching career roadmap:', err);
        setError('Career roadmap not found. Showing 4-year academic pathway.');
        setCurrentCareer(DEFAULT_ACADEMIC_ROADMAP);
        setLoading(false);
      });
  }, [careerId]);

  const handleSelectCareer = (e) => {
    const val = e.target.value;
    if (val === 'academic') {
      setSearchParams({});
    } else {
      setSearchParams({ careerId: val });
    }
  };

  const activeData = currentCareer || DEFAULT_ACADEMIC_ROADMAP;

  // Group skills by importance
  const criticalSkills = (activeData.skills || []).filter(
    (s) => s.importance === 'Critical MUST'
  );
  const highSkills = (activeData.skills || []).filter(
    (s) => s.importance === 'High MUST/GOOD'
  );
  const mediumSkills = (activeData.skills || []).filter(
    (s) => s.importance === 'Medium GOOD/BONUS'
  );

  return (
    <main className="main-content" id="main-content">
      <div className="roadmap-page-container">
        {/* Selector & Title Bar */}
        <section
          className="glass-panel roadmap-selector-bar"
          aria-label="Roadmap selection and controls"
        >
          <div>
            <h1 className="section-title" style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>
              Structured <span className="gradient-text">Learning Roadmap</span>
            </h1>
            <p style={{ color: 'var(--secondary-text)', fontSize: '0.9rem' }}>
              Phase-by-phase progression, concrete milestones, and industry skills.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <label
              htmlFor="career-select"
              style={{ fontSize: '0.9rem', color: 'var(--secondary-text)', fontWeight: '500' }}
            >
              Select Pathway:
            </label>
            <select
              id="career-select"
              value={careerId || 'academic'}
              onChange={handleSelectCareer}
              className="career-dropdown-select"
              aria-label="Select career roadmap or 4-year academic timeline"
            >
              <option value="academic">🎓 4-Year Academic Pathway (Default)</option>
              {careerList.map((c) => (
                <option key={c._id} value={c._id}>
                  💼 {c.title}
                </option>
              ))}
            </select>
          </div>
        </section>

        {/* Selected Roadmap Overview */}
        <section
          className="glass-panel"
          style={{ padding: '2rem 2.25rem' }}
          aria-labelledby="active-roadmap-heading"
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h2 id="active-roadmap-heading" style={{ fontSize: '1.6rem', color: '#ffffff', marginBottom: '0.4rem' }}>
                {activeData.title}
              </h2>
              <p style={{ color: 'var(--secondary-text)', maxWidth: '800px', fontSize: '1rem', lineHeight: '1.6' }}>
                {activeData.description}
              </p>
            </div>

            {activeData.deiRating && (
              <div className="badge-dei" style={{ padding: '0.45rem 0.9rem', fontSize: '0.85rem' }}>
                ★ {activeData.deiRating} / 5.0 DEI Rating
              </div>
            )}
          </div>
        </section>

        {/* Vertical Numbered Timeline */}
        <section aria-label="Roadmap phases and milestones">
          <h2 className="section-title" style={{ fontSize: '1.4rem', marginBottom: '1.5rem' }}>
            Curated Progression Phases
          </h2>

          <div className="timeline-wrapper">
            <div className="timeline-connecting-line" aria-hidden="true" />

            {(activeData.roadmap || []).map((phaseItem, index) => (
              <div key={index} className="timeline-phase-block">
                {/* Gradient Circle Marker */}
                <div className="timeline-circle-marker" aria-hidden="true">
                  {index + 1}
                </div>

                {/* Milestone Content Card */}
                <article className="glass-panel timeline-content-card">
                  <h3 className="phase-title">
                    <span className="gradient-text">{phaseItem.phase}</span>
                  </h3>
                  <ul className="milestones-list" role="list">
                    {(phaseItem.milestones || []).map((ms, mIdx) => (
                      <li key={mIdx} className="milestone-item">
                        <span className="milestone-bullet" aria-hidden="true">
                          ✦
                        </span>
                        <span>{ms}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              </div>
            ))}
          </div>
        </section>

        {/* Required & Recommended Skills Grouped by Importance */}
        {activeData.skills && activeData.skills.length > 0 && (
          <section className="skills-section" aria-labelledby="skills-heading">
            <h2 id="skills-heading" className="section-title" style={{ fontSize: '1.4rem' }}>
              Target Skills Breakdown
            </h2>
            <p style={{ color: 'var(--secondary-text)', fontSize: '0.95rem' }}>
              Grouped by industry necessity so you know exactly where to prioritize your energy.
            </p>

            <div className="skills-groups-grid">
              {/* Critical MUST */}
              {criticalSkills.length > 0 && (
                <div className="skill-group-box">
                  <div className="skill-group-header critical">
                    <span>🔥</span>
                    <span>Critical MUST (Core Requirement)</span>
                  </div>
                  <div className="skills-chips-wrap">
                    {criticalSkills.map((sk, idx) => (
                      <span key={idx} className="skill-pill" title={`Category: ${sk.category}`}>
                        {sk.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* High MUST/GOOD */}
              {highSkills.length > 0 && (
                <div className="skill-group-box">
                  <div className="skill-group-header high">
                    <span>⚡</span>
                    <span>High MUST/GOOD (Competitive Advantage)</span>
                  </div>
                  <div className="skills-chips-wrap">
                    {highSkills.map((sk, idx) => (
                      <span key={idx} className="skill-pill" title={`Category: ${sk.category}`}>
                        {sk.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Medium GOOD/BONUS */}
              {mediumSkills.length > 0 && (
                <div className="skill-group-box">
                  <div className="skill-group-header medium">
                    <span>✨</span>
                    <span>Medium GOOD/BONUS (Differentiator)</span>
                  </div>
                  <div className="skills-chips-wrap">
                    {mediumSkills.map((sk, idx) => (
                      <span key={idx} className="skill-pill" title={`Category: ${sk.category}`}>
                        {sk.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* "Find Mentors" CTA */}
        <section className="glass-panel roadmap-cta-block" aria-labelledby="cta-heading">
          <h2 id="cta-heading" style={{ fontSize: '1.8rem', color: '#ffffff', marginBottom: '0.6rem' }}>
            Ready to Accelerate Your Learning with a Guide?
          </h2>
          <p
            style={{
              color: 'var(--secondary-text)',
              maxWidth: '600px',
              margin: '0 auto 1.75rem',
              fontSize: '1.05rem',
              lineHeight: '1.5'
            }}
          >
            Connect with seasoned industry practitioners from underrepresented backgrounds who
            have walked this exact path before you.
          </p>
          <button
            onClick={() => navigate('/mentors')}
            className="btn-primary"
            style={{ padding: '0.9rem 2.2rem', fontSize: '1.05rem' }}
            aria-label="Find mentors specializing in this career"
          >
            Find Mentors 🤝
          </button>
        </section>
      </div>
    </main>
  );
}
