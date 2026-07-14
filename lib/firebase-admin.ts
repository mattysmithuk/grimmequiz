import { applicationDefault, cert, getApps, initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

function privateKey(): string | undefined {
  return process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
}

function credentials() {
  const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  if (serviceAccount) {
    try {
      return cert(JSON.parse(serviceAccount));
    } catch {
      throw new Error('FIREBASE_SERVICE_ACCOUNT_KEY must contain valid service-account JSON.');
    }
  }

  if (process.env.FIREBASE_CLIENT_EMAIL && privateKey()) {
    return cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: privateKey(),
    });
  }

  // Uses Application Default Credentials on Firebase App Hosting, Cloud Run,
  // and other Google Cloud environments.
  return applicationDefault();
}

const app =
  getApps()[0] ??
  initializeApp({
    credential: credentials(),
    projectId: process.env.FIREBASE_PROJECT_ID,
  });

export const firestore = getFirestore(app);