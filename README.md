# CareerPath: Classroom to Career 🚀

**CareerPath: Classroom to Career** is an inclusive, full-stack career guidance platform designed for students and career-switchers. Built with accessibility and equity at its foundation, CareerPath surfaces accessibility accommodations, verified DEI workplace ratings, "Welcome to Non-Traditional Backgrounds" badges, and 1-on-1 mentorship with leaders from underrepresented communities.

---

## 🌟 Key Features

1. **Inclusive 12-Statement Aptitude Quiz**
   - 3 statements per trait: **Analytical**, **Creative**, **Social**, and **Technical**.
   - 5-point Likert scale (Strongly Disagree to Strongly Agree).
   - Real-time step progress indicator with accessible ARIA landmarks.
   - Retake capability and dynamic algorithmic scoring.

2. **Algorithmic Career Matching (Manhattan Distance)**
   - Scales trait scores to 1–5 and calculates Manhattan distance against ideal career profiles.
   - Surfaces the Top 3 matches with match percentage badges.
   - Enriches tracks with market demand and salary estimations via LinkedIn Analytics API (with resilient offline fallbacks).
   - "✨ Non-Traditional Welcome" flags and accessibility accommodations (screen reader support, neurodivergent pacing, asynchronous communication, etc.).

3. **Visual Roadmap & Timeline**
   - Vertical numbered timeline with gradient circular markers and connecting line.
   - Concrete milestones across foundational and production phases.
   - Required skills grouped by industry priority: **Critical MUST**, **High MUST/GOOD**, and **Medium GOOD/BONUS**.
   - Career selector dropdown with a universal **4-Year Academic Pathway** default.
   - Direct CTA to connect with specialized mentors.

4. **Diverse & Inclusive Mentorship Network**
   - Mentors filterable by focus: **Women in Tech**, **Career Transitioners**, **First-gen Tech**, **Bootcamp Grads**, and **LGBTQ+**.
   - Experience, skills, pronouns, and company affiliations displayed prominently.
   - Interactive 1-on-1 session booking system with instant confirmation.

5. **Universal Design & Accessibility First**
   - WCAG AA contrast ratio compliance throughout.
   - Semantic landmarks (`<header>`, `<nav>`, `<main>`, `<article>`, `<section>`, `<footer>`).
   - High-contrast `:focus-visible` keyboard rings.
   - Full keyboard accessibility and support for `prefers-reduced-motion`.
   - Dark glassmorphism theme with 30px subtle grid and custom CSS variables.

---

## 🛠️ Tech Stack

- **Frontend**:
  - React 19 + Vite
  - React Router DOM v7
  - Firebase Web SDK v11 (Google Sign-In)
  - Custom Pure CSS (No external UI libraries or CSS frameworks)
  - Google Font: *Outfit*

- **Backend**:
  - Node.js (CommonJS)
  - Express 5
  - Mongoose 8
  - CORS, Dotenv, Axios
  - Firebase Admin SDK
  - MongoDB Memory Server (automatic zero-config fallback and auto-seed)

- **Database**:
  - MongoDB via `MONGO_URI`
  - Automatic fallback to `mongodb-memory-server` if connection fails or `MONGO_URI` is omitted.

---

## 📁 Repository Layout

```
CareerPath/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.js             # MongoDB connection & memory-server fallback
│   │   │   └── firebase.js       # Firebase Admin initialization
│   │   ├── middleware/
│   │   │   └── auth.js           # Firebase ID token verification middleware
│   │   ├── models/
│   │   │   ├── CareerTrack.js    # Career schema with idealTraits & roadmap
│   │   │   ├── Mentor.js         # Mentor schema with focus & availability
│   │   │   └── User.js           # User schema with quiz & saved careers
│   │   ├── routes/
│   │   │   ├── careerRoutes.js   # /api/careers/matches & /api/careers/:id
│   │   │   ├── mentorRoutes.js   # /api/mentors
│   │   │   └── userRoutes.js     # /api/users (sync, quiz, saved, book)
│   │   ├── services/
│   │   │   ├── linkedin.js       # LinkedIn market data enrichment
│   │   │   └── seedData.js       # 5 inclusive careers & 3 mentors
│   │   ├── seed.js               # Standalone idempotent database seed script
│   │   └── server.js             # Express app entrypoint
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── CareerCard.jsx    # Career card with DEI & accessibility tags
│   │   │   ├── MentorCard.jsx    # Mentor profile card
│   │   │   ├── Navbar.jsx        # Navigation header with active state
│   │   │   └── QuizComponent.jsx # 12-statement Likert quiz
│   │   ├── context/
│   │   │   └── AuthContext.jsx   # Auth provider (Google sign-in + demo mode)
│   │   ├── pages/
│   │   │   ├── AuthGatePage.jsx  # Unauthenticated landing gate
│   │   │   ├── DashboardPage.jsx # Home dashboard & quiz
│   │   │   ├── MatchesPage.jsx   # Top 3 algorithmic matches
│   │   │   ├── MentorsPage.jsx   # Mentor directory & session booking
│   │   │   └── RoadmapPage.jsx   # Vertical timeline & grouped skills
│   │   ├── services/
│   │   │   └── api.js            # Unified API client using VITE_API_URL
│   │   ├── App.jsx               # Route definitions with catch-all redirect
│   │   ├── index.css             # Glassmorphism design system & variables
│   │   └── main.jsx
│   ├── .env.example
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── .gitignore
└── README.md
```

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- Node.js (v18.0.0 or higher)
- npm (v9.0.0 or higher)

---

### 2. Configure Environment Variables

#### Backend (`/backend/.env`)
Copy `backend/.env.example` to `backend/.env`:
```bash
cp backend/.env.example backend/.env
```
Key variables:
- `PORT=5000`
- `CORS_ORIGIN=http://localhost:5173`
- `MONGO_URI`: MongoDB connection string. **Leave empty to automatically launch in-memory MongoDB!**
- `LINKEDIN_ACCESS_TOKEN`: *(Optional)* Falls back cleanly to `₹8-40L` and `High demand`.
- `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY`: Service account credentials for server-side token verification.

#### Frontend (`/frontend/.env`)
Copy `frontend/.env.example` to `frontend/.env`:
```bash
cp frontend/.env.example frontend/.env
```
Key variables:
- `VITE_API_URL=http://localhost:5000`
- `VITE_FIREBASE_API_KEY`: Firebase web API key.
- `VITE_FIREBASE_AUTH_DOMAIN`: `your-app.firebaseapp.com`
- `VITE_FIREBASE_PROJECT_ID`: `your-app-id`

---

### 3. Database Seeding

The application automatically seeds the database on first start if empty. You can also run the idempotent seed script directly:

```bash
cd backend
npm run seed
```

This seeds:
- **5 Careers**: Data Scientist, UX Designer, Software Engineer, Product Manager, Technical Writer (with INR salary ranges, 2-phase roadmaps, accessibility accommodations, and skills grouped by importance).
- **3 Diverse Mentors**:
  - *Dr. Sarah Chen* (Staff Research Scientist @ DeepMind, she/her) — Women in Tech, First-gen Tech
  - *Marcus Johnson* (Senior Product Designer @ Spotify, he/him) — Bootcamp Grads, Career Transitioners
  - *Priya Patel* (Engineering Manager @ Stripe, they/them) — LGBTQ+, Neurodiversity Advocacy

---

### 4. Running the Servers

#### Terminal 1 — Backend API
```bash
cd backend
npm run dev
# or: npm start
```
The API starts at `http://localhost:5000`.
- Health check: `http://localhost:5000/api/health`
- Careers endpoint: `http://localhost:5000/api/careers`
- Mentors endpoint: `http://localhost:5000/api/mentors`

#### Terminal 2 — Frontend Client
```bash
cd frontend
npm run dev
```
The client starts at `http://localhost:5173`. Open your browser to explore the app!

---

## 🔒 Firebase Authentication Setup

1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Create a project and enable **Authentication** > **Sign-in method** > **Google**.
3. In Project Settings, add a Web App and copy the config values to `frontend/.env`.
4. In Project Settings > Service Accounts, generate a new private key and paste the project ID, client email, and private key string into `backend/.env`.
5. *Note*: The frontend also includes a 1-click **Demo Explorer Mode** that allows immediate local testing of the complete authenticated flow (profile sync, saving careers, booking sessions) even before configuring live Firebase keys.

---

## ♿ Accessibility & DEI Standards

- **Semantic landmarks**: Structured using `<header role="banner">`, `<nav aria-label="...">`, `<main id="main-content">`, `<fieldset>`, `<article>`, and `<footer role="contentinfo">`.
- **Keyboard navigation**: Full tab sequencing, arrow navigation on radio groups, and `:focus-visible` glow rings.
- **Screen Reader Support**: ARIA attributes on progress bars (`role="progressbar"`), Likert scale inputs, and dynamic live regions.
- **Prefers Reduced Motion**: Animations respect OS-level motion preferences.

