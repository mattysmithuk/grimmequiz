import { createHmac, timingSafeEqual } from 'crypto';
import { cookies } from 'next/headers';

const COOKIE = 'grimme_admin';

function password(): string {
  const p = process.env.ADMIN_PASSWORD;
  if (!p) throw new Error('ADMIN_PASSWORD is not set. Copy .env.example to .env and set it.');
  return p;
}

export function adminToken(): string {
  return createHmac('sha256', password()).update('grimme-quiz-admin-v1').digest('hex');
}

export function checkPassword(candidate: string): boolean {
  const a = Buffer.from(candidate);
  const b = Buffer.from(password());
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function isAdmin(): Promise<boolean> {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  return token === adminToken();
}

export async function setAdminCookie() {
  const jar = await cookies();
  jar.set(COOKIE, adminToken(), {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 12, // 12 hours, one show day
  });
}

export async function clearAdminCookie() {
  const jar = await cookies();
  jar.delete(COOKIE);
}
