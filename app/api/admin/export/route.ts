import { NextResponse } from 'next/server';
import { isAdmin } from '@/lib/auth';
import { getLeaderboard } from '@/lib/db';

function csvCell(v: unknown): string {
  const s = v == null ? '' : String(v);
  // Prefix cells starting with =, +, -, @ to prevent spreadsheet formula injection.
  const safe = /^[=+\-@]/.test(s) ? `'${s}` : s;
  return `"${safe.replace(/"/g, '""')}"`;
}

export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'Not authorised.' }, { status: 401 });
  }

  const rows = await getLeaderboard();
  const header = [
    'rank', 'name', 'email', 'farm', 'postcode', 'score', 'time_seconds',
    'potato_area', 'current_harvester', 'replacement_plans', 'demo_interest',
    'marketing_opt_in', 'entered_at',
  ];
  const lines = [header.join(',')];
  rows.forEach((r, i) => {
    lines.push([
      i + 1, r.name, r.email, r.farm, r.postcode, r.score, r.time_seconds,
      r.potato_area, r.current_harvester, r.replacement_plans, r.demo_interest,
      r.consent ? 'yes' : 'no', r.created_at,
    ].map(csvCell).join(','));
  });

  return new NextResponse(lines.join('\r\n'), {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="grimme-quiz-entries.csv"`,
    },
  });
}
