import { createHash } from 'crypto';
import { getFirestoreDb } from '@/lib/firebase-admin';

function entries() {
  return getFirestoreDb().collection('entries');
}

export type Entry = {
  id: string;
  created_at: string;
  name: string;
  email: string;
  farm: string | null;
  postcode: string | null;
  score: number;
  time_seconds: number;
  answers: string;
  potato_area: string | null;
  current_harvester: string | null;
  replacement_plans: string | null;
  demo_interest: string | null;
  consent: number;
};

function entryId(email: string): string {
  return createHash('sha256').update(email.trim().toLowerCase()).digest('hex');
}

export class DuplicateEntryError extends Error {}

export async function insertEntry(e: Omit<Entry, 'id' | 'created_at'>): Promise<void> {
  const ref = entries().doc(entryId(e.email));

  try {
    // create() is atomic and fails if the canonical email document already exists.
    await ref.create({ ...e, created_at: new Date().toISOString() });
  } catch (error) {
    const code = (error as { code?: number | string }).code;
    if (code === 6 || code === 'already-exists') throw new DuplicateEntryError();
    throw error;
  }
}

// Leaderboard order: highest score first, fastest time breaks ties.
export async function getLeaderboard(): Promise<Entry[]> {
  const snapshot = await entries().get();
  return snapshot.docs
    .map((doc) => ({ id: doc.id, ...doc.data() }) as Entry)
    .sort(
      (a, b) =>
        b.score - a.score ||
        a.time_seconds - b.time_seconds ||
        a.created_at.localeCompare(b.created_at)
    );
}

export function getStats(rows: Entry[]) {
  const total = rows.length;
  const avg = total ? rows.reduce((sum, row) => sum + row.score, 0) / total : 0;
  const demos = rows.filter((row) => row.demo_interest?.startsWith('Yes')).length;
  const consented = rows.filter((row) => row.consent === 1).length;
  return { total, avg, demos, consented };
}
