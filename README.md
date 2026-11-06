# CareerPath: Classroom to Career

An inclusive career guidance web app that helps students discover careers that fit their strengths. Users sign in with Google, take a short aptitude quiz, and get ranked career matches with salary estimates, market demand, accessibility features and a "welcomes non-traditional backgrounds" flag. They can then explore a roadmap and browse a mentor network.

## Why CareerPath

Most career tools only ask "what are you good at?" CareerPath also asks "where will you be supported?" Every career track carries inclusivity data (accessibility features, DEI rating, openness to self-taught and bootcamp graduates), and mentors are listed with their pronouns and the communities they mentor, such as Women in Tech, LGBTQ+, First-gen Tech and Career Transitioners.

## Features

- **Google sign-in** with Firebase Authentication; user profiles are synced to MongoDB on first login.
- **Career Aptitude Quiz**: 12 statements covering four traits (analytical, creative, social, technical), with a step progress indicator and a retake option.
- **Career Matches**: the top 3 careers ranked by closeness to the user's trait profile, enriched with a market tag and salary estimate.
- **Inclusivity badges**: non-traditional-path welcome and accessibility features shown on every match.
- **Academic Roadmap**: a year-by-year timeline from foundations to capstone.
- **Mentor Network**: mentor cards with role, company, pronouns and mentorship focus.
- **Resilient backend**: falls back to an in-memory MongoDB (auto-seeded) if no cloud database is configured, and falls back to default market data if the LinkedIn API is unavailable.

## Tech Stack

| Layer | Technology |
| --- | --- |
| Frontend | React 19, Vite, React Router 7, plain CSS (glassmorphism theme, Outfit font) |
| Authentication | Firebase Authentication (Google provider), Firebase Admin SDK for token verification |
| Backend | Node.js, Express 5 |
| Database | MongoDB with Mongoose (MongoDB Atlas, or `mongodb-memory-server` as a local fallback) |
| External data | LinkedIn job analytics API (optional, with fallback) |

## How Matching Works

1. Each quiz trait has 3 questions scored 1 to 5, so each trait total is between 3 and 15.
2. The backend divides each total by 3 to get a 1 to 5 scale.
3. For every career it computes the sum of absolute differences between the user's scores and the career's `idealTraits`.
4. Careers are sorted by lowest distance (closest match first) and the top 3 are returned.
5. Each result is enriched with a market tag and salary estimate from LinkedIn; if that call fails, defaults are used so matching never breaks.

## Project Structure

```
CareerPath/
├── backend/
│   ├── config/firebase.js        # Firebase Admin initialisation
│   ├── middleware/auth.js        # Verifies Firebase ID tokens
│   ├── models/                   # Career, Mentor, User (Mongoose schemas)
│   ├── routes/                   # careerRoutes, mentorRoutes, userRoutes
│   ├── utils/seed.js             # Sample careers and mentors
│   ├── runSeed.js                # Seed a configured MongoDB database
│   └── server.js                 # Express app entry point
└── frontend/
    └── src/
        ├── components/           # Login, Navbar, Quiz, Matches, Roadmap, Mentors
        ├── firebase.js           # Firebase client setup
        ├── App.jsx               # Auth gate and routing
        └── index.css             # Theme and shared styles
```

## Getting Started

### Prerequisites

- Node.js 18 or later
- A Firebase project with Google sign-in enabled
- (Optional) A MongoDB Atlas connection string. Without one, the app uses an in-memory database.

### 1. Clone and install

```bash
git clone <your-repo-url>
cd CareerPath

cd backend && npm install
cd ../frontend && npm install
```

### 2. Configure environment variables

Create `backend/.env`:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string   # optional; leave empty to use the in-memory fallback
LINKEDIN_ACCESS_TOKEN=your_linkedin_token  # optional; defaults are used if missing

# Firebase Admin (from your service account JSON)
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=your_service_account_email
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

Create `frontend/.env`:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

> **Never commit `.env` files.** Make sure both are listed in `.gitignore`.

### 3. (Optional) Seed a cloud database

If you set `MONGO_URI`, load the sample data once:

```bash
cd backend
node runSeed.js
```

With the in-memory fallback, seeding happens automatically on startup.

### 4. Run the app

In one terminal:

```bash
cd backend
node server.js
```

In another:

```bash
cd frontend
npm run dev
```

Open the URL Vite prints (usually http://localhost:5173) and sign in with Google.

## API Reference

| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| GET | `/api/careers/matches` | No | Returns the top 3 careers. Query params: `analytical`, `creative`, `social`, `technical` (each 3 to 15). |
| GET | `/api/mentors` | No | Returns all mentors. |
| POST | `/api/users/sync` | Bearer Firebase ID token | Creates the user in MongoDB on first login, or returns the existing user. |

## Data Models

- **CareerTrack**: title, description, salary range, demand level, remote-friendly flag, accessibility features, non-traditional welcome flag, DEI rating, ideal trait profile, roadmap phases and required skills.
- **Mentor**: name, pronouns, role, company, years of experience, skills, mentorship focus and available slots.
- **User**: name, email, Firebase UID, pronouns, accessibility needs, preferred language, quiz results, saved careers and booked sessions.

## Roadmap / Future Work

- Per-career roadmaps (the roadmap data is already in the database; the page currently shows a general 4-year timeline)
- Save careers and book mentor sessions (schema support exists; UI and endpoints are next)
- Store quiz results on the user profile
- Move API URLs into an environment variable instead of `localhost:5000`
- A `start` script and deployment configuration for the backend

## License

ISC
