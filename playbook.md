# Setup Playbook: Forms + Cloudflare Worker + Resend + Google Sheets + R2

Use this playbook to replicate the same architecture on a different website.

## 1) Goal

Implement a serverless submission pipeline where:
- frontend forms submit to a Cloudflare Worker endpoint
- Worker sends email notifications (Resend)
- Worker appends submissions to Google Sheets
- careers form uploads resumes to Cloudflare R2

## 2) Reference Files In This Repo

- Worker API: `cloudflare-worker/src/index.js`
- Worker config: `cloudflare-worker/wrangler.toml`
- Google Apps Script webhook: `cloudflare-worker/google-apps-script.gs`
- Contact form: `frontend/src/pages/Contact.jsx`
- Careers form: `frontend/src/components/ApplicationDrawer.jsx`
- Frontend env example: `frontend/.env.example`
- Cloudflare guide: `CLOUDFLARE_SETUP.md`
- CI deploy workflow: `.github/workflows/deploy-cloudflare.yml`

## 3) High-Level Architecture

1. User submits `Contact` form (JSON) or `Careers` form (multipart with resume).
2. Frontend calls `POST /api/contact` on Cloudflare Worker.
3. Worker validates payload.
4. Worker uploads resume file to R2 for career applications.
5. Worker sends notification email via Resend.
6. Worker posts payload to Apps Script webhook.
7. Apps Script appends row to Google Sheet.

## 4) Prerequisites

- Cloudflare account with Workers, Pages, and R2 enabled
- GitHub repository connected to Cloudflare
- Resend account with API key and verified sender domain/email
- Google account with Google Sheet + Apps Script access
- Custom domain (recommended)

## 5) Frontend Integration Pattern

### Contact Form
- Submit JSON to `VITE_CONTACT_API_URL` (fallback `/api/contact`)
- Required fields: `firstName`, `lastName`, `email`

### Careers Form
- Submit `multipart/form-data`
- Include required file field named `resume`
- Include fields:
  - `firstName`, `lastName`, `email`, `phone`
  - `currentLocation`, `willingToRelocate`, `sponsorshipRequired`
  - optional `visaStatus`, `message`
  - `source=career_application`

### Frontend Env Var

Set in Pages:
- `VITE_CONTACT_API_URL=https://api.<your-domain>/api/contact`

## 6) Worker Setup

### 6.1 Configure `wrangler.toml`

Update:
- `name` to your Worker project name
- `[[r2_buckets]]` with real bucket names
- `[vars]` values:
  - `ALLOWED_ORIGINS=https://www.<domain>,https://<domain>`
  - `NOTIFY_SUBJECT_PREFIX=<brand>`
  - `MAX_RESUME_SIZE_BYTES=10485760`
  - `R2_PUBLIC_BASE_URL=` (optional)

### 6.2 Worker Secrets

Add in Cloudflare Worker settings:
- `RESEND_API_KEY`
- `NOTIFY_TO_EMAIL`
- `NOTIFY_FROM_EMAIL`
- `GOOGLE_SHEETS_WEBHOOK_URL`
- `GOOGLE_SHEETS_WEBHOOK_TOKEN`

## 7) R2 Setup

1. Create production bucket and preview/dev bucket.
2. Put those names in `wrangler.toml` under `[[r2_buckets]]`.
3. Redeploy Worker.
4. Optional: make bucket public or attach custom domain, then set `R2_PUBLIC_BASE_URL`.

## 8) Google Sheets Setup

1. Create Google Sheet and target tab.
2. Open Apps Script and paste `cloudflare-worker/google-apps-script.gs`.
3. Set Script Properties:
   - `SHEET_ID`
   - `SHEET_NAME`
   - `WEBHOOK_TOKEN`
4. Deploy Apps Script as Web App:
   - Execute as: `Me`
   - Access: `Anyone`
5. Copy web app URL to Worker secret `GOOGLE_SHEETS_WEBHOOK_URL`.
6. Set matching token in Worker secret `GOOGLE_SHEETS_WEBHOOK_TOKEN`.

## 9) Resend Setup

1. Create API key.
2. Verify sending domain/email.
3. Set Worker secrets:
   - `RESEND_API_KEY`
   - `NOTIFY_FROM_EMAIL` (verified sender)
   - `NOTIFY_TO_EMAIL` (recipient mailbox)

## 10) Cloudflare Pages Frontend Setup

Use:
- Framework preset: `Vite`
- Root directory: `frontend`
- Build command: `npm run build`
- Build output directory: `dist`

Add env var:
- `VITE_CONTACT_API_URL=https://api.<your-domain>/api/contact`

Note:
- This repo includes `frontend/.npmrc` with `legacy-peer-deps=true` to avoid npm peer conflict in CI.

## 11) Domain Routing

- Frontend domain:
  - `www.<domain>` -> Cloudflare Pages project
- API domain:
  - `api.<domain>` -> Worker route `api.<domain>/*`

## 12) One-Click Deploy Options

### GitHub Actions
- Workflow: `.github/workflows/deploy-cloudflare.yml`
- Required repo secrets:
  - `CLOUDFLARE_API_TOKEN`
  - `CLOUDFLARE_ACCOUNT_ID`
  - `CLOUDFLARE_PAGES_PROJECT`

### Local Script
- Run: `.\deploy.ps1 -PagesProjectName "<pages-project-name>" -Branch "main"`

## 13) Verification Checklist

Run these checks after deploy:

1. `GET https://api.<domain>/api/health` returns `{ ok: true }`.
2. Contact form submit:
   - success response from Worker
   - email received
   - row in Google Sheet
3. Careers form submit with resume:
   - success response from Worker
   - email received with resume metadata
   - row in Google Sheet with resume fields
   - object present in R2 bucket
4. CORS:
   - browser requests succeed from production domain

## 14) Common Errors And Fixes

- `R2 code 10042`:
  - R2 not enabled or bucket names still placeholders in `wrangler.toml`.
- `npm ERESOLVE` on Pages:
  - ensure latest commit includes `frontend/.npmrc`.
- Worker returns CORS errors:
  - fix `ALLOWED_ORIGINS`.
- Resend fails:
  - verify sender and API key.
- Google Sheets webhook fails:
  - verify Apps Script deployment URL and matching token.

## 15) Reuse Procedure For A New Website

1. Copy `cloudflare-worker/` folder into new project.
2. Recreate forms using same payload contract.
3. Set frontend env `VITE_CONTACT_API_URL`.
4. Configure Worker vars/secrets.
5. Configure R2 bucket binding.
6. Deploy Apps Script webhook and set URL/token.
7. Deploy Worker.
8. Deploy Pages frontend.
9. Run verification checklist.

## 16) Security Notes

- Never expose Resend key or Google webhook token in frontend code.
- Keep secrets only in Worker secret storage.
- Prefer private R2 unless public resume URLs are explicitly required.
- Use strict `ALLOWED_ORIGINS` in production.
