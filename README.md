# GRIMME Harvest Quiz — Driffield Show

A stand-friendly quiz app for the Driffield Show. Visitors answer ten questions on GRIMME potato harvesting technology, leave their email plus a few marketing questions, and staff pick a prize winner from a password protected leaderboard.

## Setup

```bash
npm install
cp .env.example .env.local
npm run dev            # or: npm run build && npm start
```

Open http://localhost:3000 for the quiz and http://localhost:3000/admin for the leaderboard.

## Firebase setup

Quiz entries are stored in **Cloud Firestore** in the `grimmequiz` Firebase project. The Firebase web configuration (including the API key) identifies a browser app but does not grant this server permission to write to Firestore. The backend therefore uses the Firebase Admin SDK and requires a service account locally.

1. In the [Firebase console](https://console.firebase.google.com/project/grimmequiz), open **Build > Firestore Database** and create a Firestore database if one does not exist.
2. Open **Project settings > Service accounts**, generate a new private key, and download the JSON file.
3. Copy `.env.example` to `.env.local`, change `ADMIN_PASSWORD`, and copy the JSON's `project_id`, `client_email`, and `private_key` into the corresponding Firebase variables.
4. Never commit the downloaded key or `.env.local`. Both common service-account filenames and local environment files are ignored by Git.

On Firebase App Hosting, Cloud Run, or another Google Cloud runtime with a service identity, the project is auto-detected and Application Default Credentials are used automatically, so no service-account key is needed. The runtime service account needs a Firestore role such as **Cloud Datastore User**.

## Deploying to Firebase App Hosting

Runtime environment variables are declared in `apphosting.yaml`, so the values the server needs are available when the app runs (not just locally):

1. Store the admin password as a secret and grant the backend access:
   ```bash
   firebase apphosting:secrets:set ADMIN_PASSWORD
   firebase apphosting:secrets:grantaccess ADMIN_PASSWORD --backend <backend-id>
   ```
2. The `NEXT_PUBLIC_FIREBASE_*` values in `apphosting.yaml` are marked `BUILD` so they are inlined into the browser bundle for Analytics. They are not secrets.
3. `FIREBASE_PROJECT_ID` is set for both build and runtime; Firestore auth uses the backend's own service account via Application Default Credentials. If you would rather use a dedicated key, store the full service-account JSON as the `FIREBASE_SERVICE_ACCOUNT_KEY` secret (see the commented block in `apphosting.yaml`).
4. Deploy by pushing to the branch connected to your App Hosting backend, or run `firebase deploy`.


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

- Runs on a laptop at the stand (`npm start`) or a Node/serverless host, provided it has internet access and Firebase credentials.
- Firestore provides persistent shared storage, so entries remain available across deployments and multiple app instances.
- For a kiosk tablet, run Chrome or Safari in kiosk/guided access mode pointed at the quiz URL. The "Next visitor" button resets the flow without reloading.

## GDPR

The consent checkbox controls marketing use only; competition entry details are collected under legitimate interest to run the prize draw. The CSV export includes the opt-in column so marketing can filter before importing to CRM. Delete the documents in Firestore's `entries` collection once the retention purpose has passed.
