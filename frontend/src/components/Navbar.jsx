import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { currentUser, userProfile, signOutUser } = useAuth();

  const getInitials = (name) => {
    if (!name) return 'CP';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const displayName = currentUser?.displayName || userProfile?.name || 'Career Explorer';
  const pronouns = userProfile?.pronouns || currentUser?.pronouns || 'they/them';

  return (
    <header className="site-header" role="banner">
      <nav className="nav-container" aria-label="Primary Navigation">
        {/* Brand */}
        <Link to="/" className="brand-link" aria-label="CareerPath Homepage">
          <div className="brand-icon" aria-hidden="true">
            CP
          </div>
          <div className="brand-text">
            <span className="brand-title">CareerPath</span>
            <span className="brand-tagline">Classroom to Career</span>
          </div>
        </Link>

        {/* Navigation links */}
        <ul className="nav-links" role="list">
          <li>
            <NavLink
              to="/"
              end
              className={({ isActive }) => `nav-item-link ${isActive ? 'active' : ''}`}
            >
              <span>Dashboard</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/matches"
              className={({ isActive }) => `nav-item-link ${isActive ? 'active' : ''}`}
            >
              <span>Matches</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/roadmap"
              className={({ isActive }) => `nav-item-link ${isActive ? 'active' : ''}`}
            >
              <span>Roadmap</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/mentors"
              className={({ isActive }) => `nav-item-link ${isActive ? 'active' : ''}`}
            >
              <span>Mentors</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/profile"
              className={({ isActive }) => `nav-item-link ${isActive ? 'active' : ''}`}
            >
              <span>Account</span>
            </NavLink>
          </li>
        </ul>

        {/* User profile & Sign out */}
        <div className="nav-user-section">
          <Link
            to="/profile"
            className="user-badge clickable-user-badge"
            title={`View Account: ${displayName} (${pronouns})`}
            aria-label="View My Account and Inclusivity Settings"
          >
            {currentUser?.photoURL ? (
              <img
                src={currentUser.photoURL}
                alt=""
                className="user-avatar-mini"
                aria-hidden="true"
              />
            ) : (
              <div className="user-avatar-mini" aria-hidden="true">
                {getInitials(displayName)}
              </div>
            )}
            <div className="user-details">
              <span className="user-name-text">{displayName}</span>
              <span className="user-pronouns-tag">{pronouns}</span>
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--accent)', marginLeft: '0.2rem' }}>⚙️</span>
          </Link>

          <button
            onClick={signOutUser}
            className="btn-signout"
            aria-label="Sign out of CareerPath"
          >
            Sign Out
          </button>
        </div>
      </nav>
    </header>
  );
}
