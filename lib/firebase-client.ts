// Browser-side Firebase. This is only used for Analytics; all database writes
// happen server-side through the Admin SDK (see lib/firebase-admin.ts), which is
// the secure pattern. The values below identify the browser app and are safe to
// ship to the client (the API key is not a secret). They can be overridden with
// NEXT_PUBLIC_FIREBASE_* environment variables.
import { getApps, initializeApp, type FirebaseApp } from 'firebase/app';
import { getAnalytics, isSupported, type Analytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? 'AIzaSyDs9tgml5nkPXXAkVhD6RTwCMROngj5FxA',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? 'grimmequiz.firebaseapp.com',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? 'grimmequiz',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ?? 'grimmequiz.firebasestorage.app',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? '36920949274',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ?? '1:36920949274:web:df486fe99c0fca3f74afa3',
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID ?? 'G-RFVNF3L69Y',
};

export function firebaseApp(): FirebaseApp {
  return getApps()[0] ?? initializeApp(firebaseConfig);
}

// Analytics only runs in the browser and only where it is supported (e.g. not in
// SSR or unsupported environments). Returns null when unavailable.
export async function initAnalytics(): Promise<Analytics | null> {
  if (typeof window === 'undefined') return null;
  if (!(await isSupported())) return null;
  return getAnalytics(firebaseApp());
}
