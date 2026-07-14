import { NextResponse } from 'next/server';
import { QUESTIONS, MARKETING_QUESTIONS } from '@/lib/questions';
import { insertEntry, emailExists } from '@/lib/db';

export const runtime = 'nodejs';

export async function POST(req: Request) {

  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  const name = String(body.name ?? '').trim().slice(0, 100);
  const email = String(body.email ?? '').trim().slice(0, 200);
  const farm = String(body.farm ?? '').trim().slice(0, 150);
  const postcode = String(body.postcode ?? '').trim().slice(0, 12);
  const consent = body.consent ? 1 : 0;
  const timeSeconds = Math.max(0, Math.min(24 * 3600, Number(body.timeSeconds) || 0));

  if (!name) return NextResponse.json({ error: 'Name is required.' }, { status: 400 });
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return NextResponse.json({ error: 'A valid email is required.' }, { status: 400 });
  }
  if (emailExists(email)) {
    return NextResponse.json(
      { error: 'This email has already entered the competition. One entry per person.' },
      { status: 409 }
    );
  }

  // Score on the server against the answer key.

  const answers: Record<string, number> = body.answers ?? {};
  let score = 0;
  for (const q of QUESTIONS) {
    if (Number(answers[q.id]) === q.correct) score++;
  }

  // Marketing answers must be one of the offered options; anything else is dropped.
  const mkt: Record<string, string | null> = {};
  for (const m of MARKETING_QUESTIONS) {
    const v = String(body.marketing?.[m.key] ?? '');
    mkt[m.key] = (m.options as readonly string[]).includes(v) ? v : null;
  }

  insertEntry({
    name,
    email,
    farm: farm || null,
    postcode: postcode || null,
    score,
    time_seconds: timeSeconds,
    answers: JSON.stringify(answers),
    potato_area: mkt.potato_area,
    current_harvester: mkt.current_harvester,
    replacement_plans: mkt.replacement_plans,
    demo_interest: mkt.demo_interest,
    consent,
  });

  return NextResponse.json({ score, total: QUESTIONS.length });

}
