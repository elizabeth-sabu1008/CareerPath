const { admin, isFirebaseConfigured } = require('../config/firebase');

const verifyAuthToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      error: 'Unauthorized: No token provided in Authorization header (Bearer <token> expected)'
    });
  }

  const token = authHeader.split('Bearer ')[1].trim();

  if (!token) {
    return res.status(401).json({
      error: 'Unauthorized: Empty token provided'
    });
  }

  // 1. If Firebase Admin is configured, verify using Firebase Admin SDK
  if (isFirebaseConfigured()) {
    try {
      const decodedToken = await admin.auth().verifyIdToken(token);
      req.user = {
        uid: decodedToken.uid,
        email: decodedToken.email,
        name: decodedToken.name || decodedToken.displayName || 'CareerPath Member',
        picture: decodedToken.picture || ''
      };
      return next();
    } catch (firebaseErr) {
      console.warn('[Auth Middleware] Firebase verifyIdToken error:', firebaseErr.message);
      // If verification explicitly failed against configured Firebase, return 401
      return res.status(401).json({
        error: 'Unauthorized: Invalid or expired Firebase ID token'
      });
    }
  }

  // 2. Fallback mode (Firebase Admin credentials not set up or running locally)
  // Safely parse JWT payload or dev mock token
  try {
    if (token.startsWith('mock-token-') || token.startsWith('demo-token-')) {
      const parts = token.split('-');
      // Format is demo-token-<timestamp>-<encodedEmail>-<uid>
      const emailPart = parts.find((p) => p.includes('@') || p.includes('%40'));
      const mockEmail = emailPart ? decodeURIComponent(emailPart) : 'demo.user@careerpath.internal';
      req.user = {
        uid: 'demo_user_uid_' + (parts[parts.length - 1] || '123'),
        email: mockEmail,
        name: 'Demo Explorer'
      };
      return next();
    }

    // Attempt to decode standard JWT payload (header.payload.signature)
    const tokenParts = token.split('.');
    if (tokenParts.length === 3) {
      const payloadBase64 = tokenParts[1].replace(/-/g, '+').replace(/_/g, '/');
      const payloadJson = Buffer.from(payloadBase64, 'base64').toString('utf8');
      const payload = JSON.parse(payloadJson);

      if (payload && (payload.email || payload.sub || payload.user_id)) {
        req.user = {
          uid: payload.sub || payload.user_id || payload.uid || 'anon_uid',
          email: payload.email || `${payload.sub}@placeholder.user`,
          name: payload.name || payload.displayName || 'Career Explorer',
          picture: payload.picture || ''
        };
        return next();
      }
    }

    return res.status(401).json({
      error: 'Unauthorized: Token could not be verified'
    });
  } catch (err) {
    return res.status(401).json({
      error: 'Unauthorized: Malformed token payload'
    });
  }
};

module.exports = verifyAuthToken;

