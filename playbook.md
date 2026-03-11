# Setup Playbook: Cloudflare Pages Functions + Resend + Google Sheets + R2

Use this playbook to replicate the same serverless architecture on a different website using Cloudflare Pages.

## 1) Goal

Implement a serverless submission pipeline where:
- Frontend forms submit to a Cloudflare Pages Function endpoint
- Function sends email notifications (Resend)
- Function appends submissions to Google Sheets via Webhook
- Careers form uploads resumes to Cloudflare R2 bucket

## 2) Reference Files In This Repo

- Pages API routes: `frontend/functions/api/`
  - `contact.js`
  - `applications.js`
  - `health.js`
- Google Apps Script webhook: `backend-scripts/google-apps-script.gs`
- Contact form: `frontend/src/pages/Contact.jsx`
- Careers form: `frontend/src/components/ApplicationDrawer.jsx`
- Frontend env example: `frontend/.env.example`

## 3) High-Level Architecture

1. User submits `Contact` form (JSON) or `Careers` form (multipart with resume).
2. Frontend calls `/api/contact` or `/api/applications` natively on the same Cloudflare domain.
3. Pages Function validates payload.
4. Pages Function uploads resume file to R2 for career applications.
5. Pages Function sends notification email via Resend API.
6. Pages Function posts payload to Google Apps Script webhook.
7. Apps Script appends row to Google Sheet.

## 4) Prerequisites

- Cloudflare account with Pages and R2 enabled
- GitHub repository connected to Cloudflare Pages
- Resend account with API key and verified sender domain/email
- Google account with Google Sheet + Apps Script access
- Custom domain (recommended)

## 5) Cloudflare Pages Project Setup

Instead of deploying a separate worker, the API is built directly into the frontend deploy.

1. Create a **Cloudflare Pages** project linked to your repository.
2. Select the `Vite` framework preset.
   - Root directory: `frontend`
   - Build command: `npm run build`
   - Build output directory: `dist`

### 5.1 Environment Variables
Go to Cloudflare Dashboard -> Pages -> Your App -> Settings -> Variables and Secrets.
Add the following variables (for both Production and Preview if needed):

- `RESEND_API_KEY`: Your Resend API token.
- `NOTIFY_FROM_EMAIL`: Verified sender email (e.g. `noreply@yourdomain.com`).
- `NOTIFY_TO_EMAIL`: The recipient inbox.
- `NOTIFY_SUBJECT_PREFIX`: A short prefix for emails (e.g. `Aethercolt`).
- `GOOGLE_SHEETS_WEBHOOK_URL`: The deployed Google Apps Script URL.
- `GOOGLE_SHEETS_WEBHOOK_TOKEN`: A secret token you define to match the App Script.
- `MAX_RESUME_SIZE_BYTES`: `10485760` (10MB).
- `R2_PUBLIC_BASE_URL`: (Optional) public URL for resumes if bucket is public.

*Note: You do not need `VITE_CONTACT_API_URL` unless you are testing locally without wrangler.*

### 5.2 R2 Bucket Binding
1. Create a bucket in Cloudflare R2 (e.g. `company-resumes-prod`).
2. Go to Cloudflare Dashboard -> Pages -> Your App -> Settings -> Functions -> **R2 bucket bindings**.
3. Variable name: `RESUME_BUCKET`
4. R2 bucket: Select your created bucket.

## 6) Google Sheets Setup

1. Create a Google Sheet. At the bottom, create two tabs named exactly: **Contact** and **Careers**.
2. **Setup the Header Rows**:
   In the **Contact** tab, add these column names horizontally in Row 1:
   `Timestamp`, `name`, `email`, `phone`, `inquiryType`, `company`, `message`, `source`
   
   In the **Careers** tab, add these column names horizontally in Row 1:
   `Timestamp`, `name`, `email`, `phone`, `location`, `willingToRelocate`, `sponsorshipRequired`, `visaStatus`, `linkedin`, `resumeInfo`, `source`

3. Go to Extensions -> Apps Script.
4. Paste the contents of `backend-scripts/google-apps-script.gs`.
5. Define Script Properties (Project Settings -> Script Properties):
   - `SHEET_ID`: The ID from your Google Sheet URL (the long string between `/d/` and `/edit`).
   - `SHEET_NAME_CONTACT`: `Contact`
   - `SHEET_NAME_CAREERS`: `Careers`
   - `WEBHOOK_TOKEN`: A secure random string matching `GOOGLE_SHEETS_WEBHOOK_TOKEN` in Cloudflare.
6. Deploy -> New Deployment -> Web App.
   - Execute as: `Me`
   - Access: `Anyone`
6. Copy the resulting Web App URL into the `GOOGLE_SHEETS_WEBHOOK_URL` variable in Cloudflare.

## 7) Resend Setup

1. Create API key.
2. Verify sending domain/email within Resend.
3. Update `NOTIFY_FROM_EMAIL` to match this verified domain.

## 8) Verification Checklist

Run these checks after deploy:

1. `GET https://your-domain.com/api/health` returns `{ ok: true }`.
2. Contact form submit:
   - Success modal appears on site.
   - Email received in inbox.
   - Row appears in Google Sheet representing the payload.
3. Careers form submit with resume:
   - Success modal appears.
   - Email received with resume metadata/URL.
   - Row appears in Google Sheet.
   - Resume file appears in R2 Dashboard.

## 9) Common Errors And Fixes

- `Missing required fields` (400)
  - The frontend form didn't pass the required fields configured in the `api/*.js` file.
- `Resume too large` (413)
  - Ensure the file uploaded is underneath `MAX_RESUME_SIZE_BYTES`.
- `Server Error` (500)
  - Frequently caused by a missing environment variable or a misconfigured R2 bucket binding. Check the Pages deployment logs natively in the Cloudflare Dashboard.
- `R2 Bucket not bound`
  - You forgot to attach `RESUME_BUCKET` under Settings -> Functions.
