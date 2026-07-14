import { redirect } from 'next/navigation';
import { isAdmin, checkPassword, setAdminCookie, clearAdminCookie } from '@/lib/auth';
import { getLeaderboard, getStats, type Entry } from '@/lib/db';
import { QUESTIONS } from '@/lib/questions';

export const dynamic = 'force-dynamic';

async function login(formData: FormData) {
  'use server';
  const pw = String(formData.get('password') ?? '');
  if (checkPassword(pw)) {
    await setAdminCookie();
  }
  redirect('/admin');
}

async function logout() {
  'use server';
  await clearAdminCookie();
  redirect('/admin');
}

function fmtTime(s: number) {
  const m = Math.floor(s / 60);
  return `${m}m ${String(s % 60).padStart(2, '0')}s`;
}

export default async function Admin() {
  if (!(await isAdmin())) {
    return (
      <main className="card" style={{ maxWidth: 420, margin: '40px auto' }}>
        <h2>Driffield Show admin</h2>
        <p className="lede">Enter the admin password to view entries.</p>
        <form action={login}>
          <label className="field">
            <span className="lab">Password</span>
            <input type="text" name="password" autoFocus autoComplete="off" />
          </label>
          <button className="btn" type="submit">Sign in</button>
        </form>
      </main>
    );
  }

  let rows: Entry[] = [];
  let dbError = false;
  try {
    rows = await getLeaderboard();
  } catch (error) {
    console.error('Failed to load leaderboard from Firestore:', error);
    dbError = true;
  }
  const stats = getStats(rows);

  // Per-question correct percentage, useful for talking points on the stand.
  const perQ = QUESTIONS.map((q) => {
    let correct = 0;
    for (const r of rows) {
      try {
        const a = JSON.parse(r.answers);
        if (Number(a[q.id]) === q.correct) correct++;
      } catch {}
    }
    return { id: q.id, text: q.text, pct: rows.length ? Math.round((correct / rows.length) * 100) : 0 };
  });

  return (
    <main>
      <div className="row" style={{ marginTop: 0, marginBottom: 8 }}>
        <h1 style={{ margin: 0 }}>Leaderboard</h1>
        <span style={{ display: 'flex', gap: 10 }}>
          <a className="btn ghost" href="/api/admin/export" style={{ textDecoration: 'none' }}>
            Download CSV
          </a>
          <form action={logout}>
            <button className="btn ghost" type="submit">Sign out</button>
          </form>
        </span>
      </div>

      {dbError && (
        <p className="error" style={{ marginTop: 0 }}>
          Could not connect to Cloud Firestore. Check the Firebase service-account
          credentials in your <code>.env.local</code> (FIREBASE_PROJECT_ID,
          FIREBASE_CLIENT_EMAIL and FIREBASE_PRIVATE_KEY).
        </p>
      )}

      <div className="stats">
        <div className="stat"><div className="n">{stats.total}</div><div className="l">Entries</div></div>
        <div className="stat"><div className="n">{stats.avg.toFixed(1)}</div><div className="l">Average score</div></div>
        <div className="stat"><div className="n">{stats.demos}</div><div className="l">Demo requests</div></div>
        <div className="stat"><div className="n">{stats.consented}</div><div className="l">Marketing opt-ins</div></div>
      </div>

      <div className="tablewrap">
        <table className="board">
          <thead>
            <tr>
              <th>#</th><th>Name</th><th>Farm</th><th>Email</th><th>Score</th><th>Time</th>
              <th>Potatoes</th><th>Harvester</th><th>Replacing</th><th>Demo</th><th>Opt-in</th><th>Entered</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr><td colSpan={12}>No entries yet. Send the first visitor to the quiz.</td></tr>
            )}
            {rows.map((r, i) => (
              <tr key={r.id} className={i === 0 ? 'winner' : ''}>
                <td>{i + 1}</td>
                <td>{r.name}</td>
                <td>{r.farm ?? ''}</td>
                <td>{r.email}</td>
                <td>{r.score}/{QUESTIONS.length}</td>
                <td>{fmtTime(r.time_seconds)}</td>
                <td>{r.potato_area ?? ''}</td>
                <td>{r.current_harvester ?? ''}</td>
                <td>{r.replacement_plans ?? ''}</td>
                <td>{r.demo_interest ?? ''}</td>
                <td>{r.consent ? 'Yes' : 'No'}</td>
                <td>{r.created_at}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 style={{ marginTop: 36 }}>Question difficulty</h2>
      <div className="tablewrap">
        <table className="board">
          <thead>
            <tr><th>Q</th><th>Question</th><th>Answered correctly</th></tr>
          </thead>
          <tbody>
            {perQ.map((q) => (
              <tr key={q.id}>
                <td>{q.id}</td>
                <td>{q.text}</td>
                <td>{q.pct}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
