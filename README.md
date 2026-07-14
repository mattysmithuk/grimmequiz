# GRIMME Harvest Quiz

A stand-friendly quiz app for farming shows. Visitors answer ten questions on GRIMME potato harvesting technology, leave their email plus a few marketing questions, and staff pick a prize winner from a password protected leaderboard.

## Setup

```bash
npm install
cp .env.example .env   # then change ADMIN_PASSWORD
npm run dev            # or: npm run build && npm start
```

Open http://localhost:3000 for the quiz and http://localhost:3000/admin for the leaderboard.

Data is stored in a local SQLite file at `data/quiz.db`, created automatically. That makes the app fully self-contained on a stand laptop with no internet dependency. Back the file up after the show if you want to keep the leads.

## How winning works

The leaderboard ranks by highest score first, then fastest completion time as the tiebreaker, then earliest entry. The top row is highlighted on the admin page. One entry per email address is enforced.

## Editing content

- Quiz questions and answers: `lib/questions.ts` (`QUESTIONS`). The correct answer index never reaches the browser; scoring happens server-side in `app/api/submit/route.ts`.
- Marketing questions: `lib/questions.ts` (`MARKETING_QUESTIONS`).
- Branding: colours are CSS variables at the top of `app/globals.css` (`--red` is the GRIMME signal red). Drop the official logo into `public/grimme-logo.svg` and swap the wordmark in `app/layout.tsx` as commented.

## Admin

- `/admin` prompts for the password set in `ADMIN_PASSWORD`. A signed HttpOnly cookie keeps you logged in for 12 hours (one show day).
- Download CSV exports all entries including marketing answers and opt-in status, safe to open straight in Excel.
- The question difficulty table shows what percentage of visitors got each question right, handy for conversation starters on the stand.

## Deployment notes

- Runs happily on a laptop at the stand (`npm start`), a small VM, or anything that supports Node with a persistent filesystem.
- SQLite means it will not persist on serverless hosts like Vercel. If you need to host it there, swap `lib/db.ts` for Postgres (Neon or Azure Database for PostgreSQL); the rest of the app is storage-agnostic through the three functions in that file.
- For a kiosk tablet, run Chrome or Safari in kiosk/guided access mode pointed at the quiz URL. The "Next visitor" button resets the flow without reloading.

## GDPR

The consent checkbox controls marketing use only; competition entry details are collected under legitimate interest to run the prize draw. The CSV export includes the opt-in column so marketing can filter before importing to CRM. Delete `data/quiz.db` (or the relevant rows) once the retention purpose has passed.
