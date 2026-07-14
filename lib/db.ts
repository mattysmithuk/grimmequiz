import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const DATA_DIR = path.join(process.cwd(), 'data');
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

const db = new Database(path.join(DATA_DIR, 'quiz.db'));
db.pragma('journal_mode = WAL');

db.exec(`
  CREATE TABLE IF NOT EXISTS entries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE COLLATE NOCASE,
    farm TEXT,
    postcode TEXT,
    score INTEGER NOT NULL,
    time_seconds INTEGER NOT NULL,
    answers TEXT NOT NULL,
    potato_area TEXT,
    current_harvester TEXT,
    replacement_plans TEXT,
    demo_interest TEXT,
    consent INTEGER NOT NULL DEFAULT 0
  )
`);

export type Entry = {
  id: number;
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

export function insertEntry(e: Omit<Entry, 'id' | 'created_at'>) {
  const stmt = db.prepare(`
    INSERT INTO entries
      (name, email, farm, postcode, score, time_seconds, answers,
       potato_area, current_harvester, replacement_plans, demo_interest, consent)
    VALUES
      (@name, @email, @farm, @postcode, @score, @time_seconds, @answers,
       @potato_area, @current_harvester, @replacement_plans, @demo_interest, @consent)
  `);
  return stmt.run(e);
}

export function emailExists(email: string): boolean {
  const row = db
    .prepare('SELECT 1 FROM entries WHERE email = ? COLLATE NOCASE')
    .get(email.trim());
  return !!row;
}

// Leaderboard order: highest score first, fastest time breaks ties.
export function getLeaderboard(): Entry[] {
  return db
    .prepare('SELECT * FROM entries ORDER BY score DESC, time_seconds ASC, created_at ASC')
    .all() as Entry[];
}

export function getStats() {
  const total = (db.prepare('SELECT COUNT(*) AS n FROM entries').get() as { n: number }).n;
  const avg = (db.prepare('SELECT AVG(score) AS a FROM entries').get() as { a: number | null }).a;
  const demos = (
    db
      .prepare("SELECT COUNT(*) AS n FROM entries WHERE demo_interest LIKE 'Yes%'")
      .get() as { n: number }
  ).n;
  const consented = (
    db.prepare('SELECT COUNT(*) AS n FROM entries WHERE consent = 1').get() as { n: number }
  ).n;
  return { total, avg: avg ?? 0, demos, consented };
}
