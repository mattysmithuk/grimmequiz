# GRIMME Harvest Quiz — Driffield Show

A stand-friendly quiz app for the Driffield Show. Visitors answer ten questions on GRIMME potato harvesting technology, leave their email plus a few marketing questions, and staff pick a prize winner from a password protected leaderboard.

## Setup

```bash
npm install
cp .env.example .env.local
npm run dev            # or: npm run build && npm start
```

Open http://localhost:3000 for the quiz and http://localhost:3000/admin for the leaderboard.

## Data storage

Quiz entries are stored in a local **SQLite** database (`better-sqlite3`) at `data/quiz.db`, created automatically on first run. Copy `.env.example` to `.env.local` and change `ADMIN_PASSWORD` before the show. The `data/` directory and `.env.local` are ignored by Git.

## How winning works


The leaderboard ranks by highest score first, then fastest completion time as the tiebreaker, then earliest entry. The top row is highlighted on the admin page. One entry per email address is enforced.

## Editing content

- Quiz questions and answers: `lib/questions.ts` (`QUESTIONS`). The correct answer index never reaches the browser; scoring happens server-side in `app/api/submit/route.ts`.
- Marketing questions: `lib/questions.ts` (`MARKETING_QUESTIONS`).
- Branding: colours are CSS variables at the top of `app/globals.css`; the GRIMME logo is stored locally at `public/grimme-logo.svg`.

## Admin

- `/admin` prompts for the password set in `ADMIN_PASSWORD`. A signed HttpOnly cookie keeps you logged in for 12 hours (one show day).
- Download CSV exports all entries including marketing answers and opt-in status, safe to open straight in Excel.
- The question difficulty table shows what percentage of visitors got each question right, handy for conversation starters on the stand.

## Deployment notes

- Runs on a laptop at the stand (`npm start`) or any Node host. No internet connection is required — everything is stored locally.
- The SQLite database file lives in `data/quiz.db`. Back it up (or copy it off the machine) after the show to keep the entries.
- For a kiosk tablet, run Chrome or Safari in kiosk/guided access mode pointed at the quiz URL. The "Next visitor" button resets the flow without reloading.

## GDPR

The consent checkbox controls marketing use only; competition entry details are collected under legitimate interest to run the prize draw. The CSV export includes the opt-in column so marketing can filter before importing to CRM. Delete rows from the `entries` table in `data/quiz.db` once the retention purpose has passed.

