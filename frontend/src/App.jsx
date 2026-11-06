import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import AuthGatePage from './pages/AuthGatePage';
import DashboardPage from './pages/DashboardPage';
import MatchesPage from './pages/MatchesPage';
import RoadmapPage from './pages/RoadmapPage';
import MentorsPage from './pages/MentorsPage';
import ProfilePage from './pages/ProfilePage';

export default function App() {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#040914',
          color: '#bae6fd'
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              border: '3px solid rgba(56, 189, 248, 0.2)',
              borderTopColor: '#38bdf8',
              borderRadius: '50%',
              margin: '0 auto 1rem',
              animation: 'spin 1s linear infinite'
            }}
          />
          <p>Initializing CareerPath...</p>
        </div>
      </div>
    );
  }

  // Auth Gate: Unauthenticated users see the landing gate with "Sign in with Google"
  if (!currentUser) {
    return <AuthGatePage />;
  }

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/matches" element={<MatchesPage />} />
        <Route path="/roadmap" element={<RoadmapPage />} />
        <Route path="/mentors" element={<MentorsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        {/* Catch-all redirect to "/" */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <footer className="site-footer" role="contentinfo">
        <p>
          CareerPath: Classroom to Career · Built with empathy, accessible by design, welcoming to
          all backgrounds.
        </p>
      </footer>
    </>
  );
}
