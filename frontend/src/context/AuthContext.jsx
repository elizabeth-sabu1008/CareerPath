import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { api } from '../services/api';

const AuthContext = createContext(null);

// Initialize Firebase Web SDK safely
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'demo-api-key',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'careerpath.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'careerpath-demo',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'careerpath.appspot.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '123456789012',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:123456789012:web:abcdef'
};

let auth = null;
let googleProvider = null;

try {
  const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  auth = getAuth(app);
  googleProvider = new GoogleAuthProvider();
  googleProvider.setCustomParameters({ prompt: 'select_account' });
} catch (e) {
  console.warn('[Firebase Client] Initialization note:', e.message);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [savedCareers, setSavedCareers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Background sync helper - non-blocking as required
  const syncWithBackend = useCallback((authToken, user) => {
    if (!authToken) return;
    api
      .syncUser(authToken, {
        pronouns: 'they/them',
        preferredLanguage: 'English'
      })
      .then((profile) => {
        setUserProfile(profile);
        if (profile && profile.savedCareers) {
          setSavedCareers(profile.savedCareers.map((c) => (typeof c === 'object' ? c._id : c)));
        }
      })
      .catch((err) => {
        console.warn('[Background Sync] Non-blocking sync notice:', err.message);
      });
  }, []);

  // Listen for Firebase auth state changes
  useEffect(() => {
    // Check if demo user is saved in localStorage
    const storedDemo = localStorage.getItem('careerpath_demo_user');
    if (storedDemo) {
      try {
        const parsed = JSON.parse(storedDemo);
        setCurrentUser(parsed.user);
        setToken(parsed.token);
        syncWithBackend(parsed.token, parsed.user);
        setLoading(false);
        return;
      } catch (e) {
        localStorage.removeItem('careerpath_demo_user');
      }
    }

    if (!auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const idToken = await firebaseUser.getIdToken();
          const userData = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName || 'Career Explorer',
            photoURL: firebaseUser.photoURL || '',
            pronouns: 'they/them'
          };
          setCurrentUser(userData);
          setToken(idToken);
          setAuthError(null);

          // Non-blocking background sync as strictly required
          syncWithBackend(idToken, userData);
        } catch (tokenErr) {
          console.error('[Auth Token Error]', tokenErr);
        }
      } else {
        // Only clear if not in demo mode
        if (!localStorage.getItem('careerpath_demo_user')) {
          setCurrentUser(null);
          setToken(null);
          setUserProfile(null);
          setSavedCareers([]);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [syncWithBackend]);

  // Google Sign-In
  const signInWithGoogle = async () => {
    setAuthError(null);

    const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;
    if (!apiKey || apiKey === 'demo-api-key' || apiKey.trim() === '') {
      setAuthError(
        'Firebase API key is not configured in frontend/.env. You can provide your real Firebase project credentials in frontend/.env, or click "Continue with Demo Explorer Account" below to test the entire application right away!'
      );
      return;
    }

    if (!auth || !googleProvider) {
      setAuthError('Firebase Authentication is not configured. Please supply valid Firebase credentials in frontend/.env.');
      return;
    }

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const firebaseUser = result.user;
      const idToken = await firebaseUser.getIdToken();
      const userData = {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName || 'Career Explorer',
        photoURL: firebaseUser.photoURL || '',
        pronouns: 'they/them'
      };

      // Set user immediately
      setCurrentUser(userData);
      setToken(idToken);

      // Trigger background sync without blocking UI
      syncWithBackend(idToken, userData);
    } catch (error) {
      console.error('[Google Sign-In Error]', error);
      let userFriendlyMsg = error.message;

      if (error.code === 'auth/popup-closed-by-user') {
        userFriendlyMsg = 'Sign-in cancelled: The Google popup window was closed before completing.';
      } else if (error.code === 'auth/cancelled-popup-request') {
        userFriendlyMsg = 'Another authentication popup is already open.';
      } else if (error.code === 'auth/configuration-not-found') {
        userFriendlyMsg =
          'Google Sign-in is not enabled in your Firebase Console yet. Go to Firebase Console > Authentication > Sign-in method, click Google, and toggle "Enable" (with project support email).';
      } else if (
        error.code === 'auth/unauthorized-domain' ||
        error.code === 'auth/api-key-not-valid' ||
        error.code === 'auth/invalid-api-key' ||
        (error.message && error.message.includes('api-key-not-valid'))
      ) {
        userFriendlyMsg =
          'Firebase API key in frontend/.env is not valid. Please update frontend/.env with your Firebase Project keys, or click "Continue with Demo Explorer Account" below to test without Firebase.';
      }
      setAuthError(userFriendlyMsg);
    }
  };

  // Demo Sign-In (Allows testing all full-stack flows instantly even without GCP setup)
  const signInDemo = (customName = 'Aarav Sharma (Student)') => {
    setAuthError(null);
    const demoToken = `demo-token-${Date.now()}-${encodeURIComponent('aarav.sharma@example.edu')}-001`;
    const demoUser = {
      uid: 'demo_user_uid_101',
      email: 'aarav.sharma@example.edu',
      displayName: customName,
      photoURL: '',
      pronouns: 'they/them'
    };

    localStorage.setItem(
      'careerpath_demo_user',
      JSON.stringify({ user: demoUser, token: demoToken })
    );

    setCurrentUser(demoUser);
    setToken(demoToken);

    // Sync in background
    syncWithBackend(demoToken, demoUser);
  };

  // Sign Out
  const signOutUser = async () => {
    localStorage.removeItem('careerpath_demo_user');
    setCurrentUser(null);
    setToken(null);
    setUserProfile(null);
    setSavedCareers([]);
    setAuthError(null);

    if (auth) {
      try {
        await signOut(auth);
      } catch (err) {
        console.warn('Sign out warning:', err.message);
      }
    }
  };

  // Refresh Profile
  const refreshProfile = async () => {
    if (!token) return;
    try {
      const profile = await api.getUserProfile(token);
      setUserProfile(profile);
      if (profile && profile.savedCareers) {
        setSavedCareers(profile.savedCareers.map((c) => (typeof c === 'object' ? c._id : c)));
      }
    } catch (e) {
      console.warn('Profile refresh notice:', e.message);
    }
  };

  // Toggle Save Career
  const toggleSaveCareer = async (careerId) => {
    if (!token) return;
    const isSaved = savedCareers.includes(careerId);

    // Optimistic UI update
    if (isSaved) {
      setSavedCareers((prev) => prev.filter((id) => id !== careerId));
      try {
        await api.unsaveCareer(token, careerId);
      } catch (err) {
        // Revert on failure
        setSavedCareers((prev) => [...prev, careerId]);
      }
    } else {
      setSavedCareers((prev) => [...prev, careerId]);
      try {
        await api.saveCareer(token, careerId);
      } catch (err) {
        // Revert on failure
        setSavedCareers((prev) => prev.filter((id) => id !== careerId));
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        userProfile,
        token,
        loading,
        authError,
        savedCareers,
        signInWithGoogle,
        signInDemo,
        signOutUser,
        refreshProfile,
        toggleSaveCareer
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
