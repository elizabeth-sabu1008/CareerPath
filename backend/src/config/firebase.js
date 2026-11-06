const admin = require('firebase-admin');

let isFirebaseConfigured = false;

try {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  let privateKey = process.env.FIREBASE_PRIVATE_KEY;

  if (projectId && clientEmail && privateKey && privateKey.includes('BEGIN PRIVATE KEY')) {
    // Replace literal \n with real newline characters
    privateKey = privateKey.replace(/\\n/g, '\n');

    admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        clientEmail,
        privateKey
      })
    });
    isFirebaseConfigured = true;
    console.log('[Firebase Admin] Successfully initialized with project:', projectId);
  } else {
    console.warn(
      '[Firebase Admin] Notice: FIREBASE_PRIVATE_KEY is not a valid PEM private key (must contain "-----BEGIN PRIVATE KEY-----"). Running in development token fallback mode.'
    );
  }
} catch (error) {
  console.warn('[Firebase Admin] Initialization failed:', error.message);
  console.warn('[Firebase Admin] Server will continue running with token fallback verification.');
}

module.exports = {
  admin,
  isFirebaseConfigured: () => isFirebaseConfigured
};

