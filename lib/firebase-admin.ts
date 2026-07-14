import { applicationDefault, cert, getApps, initializeApp } from 'firebase-admin/app';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';

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

// Firestore is initialised lazily on first use rather than at module load. This
// keeps `next build` (and any import of this module) from parsing credentials,
// which matters when the service-account key is only provided at runtime.
let db: Firestore | null = null;

export function getFirestoreDb(): Firestore {
  if (db) return db;

  const app =
    getApps()[0] ??
    initializeApp({
      credential: credentials(),
      projectId: process.env.FIREBASE_PROJECT_ID,
    });

  db = getFirestore(app);
  return db;
}
