'use client';

import { useEffect } from 'react';
import { initAnalytics } from '@/lib/firebase-client';

// Initialises Firebase Analytics once in the browser. Renders nothing.
export default function FirebaseAnalytics() {
  useEffect(() => {
    initAnalytics().catch((err) => {
      console.warn('Firebase Analytics unavailable:', err);
    });
  }, []);

  return null;
}
