# KnowBridge Marketing Platform

Production-ready marketing website, lead generation engine, customer subscription management, and DPDP Act 2023 compliant data governance platform for KnowBridge.

---

## Architecture Overview

The repository is structured into two independently deployable applications:

- **`backend/`**: Node.js & Express REST API, PostgreSQL database with automated SQL migrations, JWT admin authentication, DPDP Act 2023 consent records and automated data erasure cron, PDF invoice generator (`pdfkit`), transactional email notification engine (`nodemailer`), and comprehensive Jest test suite.
- **`frontend/`**: Next.js (App Router) client application featuring public marketing landing pages, interactive product showcase, lead booking and demo forms, dynamic pricing calculator, and a protected `/admin` portal designed with a strict black-and-white theme and Lucide SVG icons.

```
knowbridge-marketing/
├── backend/
│   ├── src/
│   │   ├── config/          # Database, Environment, SMTP configuration
│   │   ├── db/              # SQL migrations, seeds, migration runner
│   │   ├── middleware/      # Auth, rate limiting, error handling, validation
│   │   ├── modules/         # Auth, Clients, Subscriptions, Invoices, Consent, Leads, Usage
│   │   ├── utils/           # Email service, templates, PDF generator
│   │   └── index.ts         # Server entrypoint and healthcheck
│   ├── tests/               # Automated integration and unit test suite
│   ├── Procfile             # Railway deployment process configuration
│   ├── railway.json         # Railway Nixpacks build and deploy definition
│   └── package.json
├── frontend/
│   ├── app/                 # Next.js App Router (Public marketing pages and /admin portal)
│   ├── components/          # Reusable UI components, modals, skeletons, navigation
│   ├── lib/                 # API client utilities, admin API wrapper, constants
│   ├── vercel.json          # Vercel deployment configuration
│   └── package.json
└── README.md
```

---

## Local Development Setup

### Prerequisites
- Node.js >= 20.0.0
- npm >= 10.0.0
- PostgreSQL >= 14

### 1. Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create the environment configuration file:
   ```bash
   cp .env.example .env
   ```

4. Configure your `.env` variables:
   ```env
   PORT=4000
   NODE_ENV=development
   DATABASE_URL=postgresql://postgres:postgres@localhost:5432/knowbridge_marketing
   DATABASE_URL_TEST=postgresql://postgres:postgres@localhost:5432/knowbridge_marketing_test
   JWT_SECRET=your_32_character_secret_key_here
   JWT_EXPIRES_IN=8h
   SMTP_HOST=smtp.yourdomain.com
   SMTP_PORT=465
   SMTP_SECURE=true
   SMTP_USER=your_email@domain.com
   SMTP_PASS=your_smtp_password
   FROM_EMAIL=noreply@knowbridge.io
   NOTIFY_EMAIL=admin@knowbridge.io
   SEND_ACK_EMAIL=true
   FRONTEND_URL=http://localhost:3000
   ADMIN_EMAIL=admin@knowbridge.io
   ADMIN_PASSWORD=changeme123
   GST_PERCENTAGE=18
   INVOICE_PREFIX=KNB
   ```

5. Run database migrations:
   ```bash
   npm run migrate
   ```

6. Seed the database with initial plans and admin account:
   ```bash
   npm run seed
   ```

7. Start the backend development server:
   ```bash
   npm run dev
   ```
   The backend API will run on `http://localhost:4000`. Health check endpoint: `http://localhost:4000/api/health`.

### 2. Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create the environment configuration file:
   ```bash
   cp .env.local.example .env.local
   ```

4. Configure your `.env.local`:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:4000
   ```

5. Start the frontend development server:
   ```bash
   npm run dev
   ```
   The marketing site and admin panel will be accessible at `http://localhost:3000`.

---

## Automated Test Suite

The backend includes a comprehensive Jest test suite covering authentication, clients, consent, subscriptions, invoices, and usage tracking.

To run the full test suite:
```bash
cd backend
npm test
```

To run tests with coverage reporting:
```bash
npm run test:coverage
```

---

## Production Deployment

Both applications are configured for zero-configuration, independent continuous deployment.

### Backend Deployment (Railway)

The backend includes `railway.json` and `Procfile` configured for Railway's Nixpacks builder.

1. Create a new project in Railway and attach a **PostgreSQL** database plugin.
2. Link your Git repository and set the root directory to `backend`.
3. Set the following environment variables in the Railway Dashboard:
   - `DATABASE_URL`: Automatically populated from your Railway PostgreSQL plugin.
   - `NODE_ENV`: `production`
   - `PORT`: `4000` (or Railway default dynamic port)
   - `JWT_SECRET`: Generate a secure string (e.g. `openssl rand -hex 32`)
   - `JWT_EXPIRES_IN`: `8h`
   - `SMTP_HOST`: Your transactional SMTP host (e.g., SendGrid, AWS SES, Resend)
   - `SMTP_PORT`: `465` (or `587`)
   - `SMTP_SECURE`: `true` (for port 465) or `false` (for port 587)
   - `SMTP_USER`: SMTP username
   - `SMTP_PASS`: SMTP password
   - `FROM_EMAIL`: `noreply@knowbridge.io`
   - `NOTIFY_EMAIL`: Your internal sales/admin alert address
   - `SEND_ACK_EMAIL`: `true`
   - `FRONTEND_URL`: `https://your-frontend-domain.vercel.app` (Whitelisted for CORS)
   - `ADMIN_EMAIL`: Initial admin login email
   - `ADMIN_PASSWORD`: Strong initial admin password
   - `GST_PERCENTAGE`: `18`
   - `INVOICE_PREFIX`: `KNB`

4. Execute one-time database setup commands via Railway CLI or Railway Service Terminal:
   ```bash
   npm run migrate
   npm run seed
   ```

5. Health check verification:
   Railway automatically monitors the endpoint `/api/health`. When the deployment succeeds, it will report `{ "status": "ok", "service": "knowbridge-marketing-backend" }`.

### Frontend Deployment (Vercel)

The frontend includes `vercel.json` configured for Next.js App Router deployment.

1. Import the repository into Vercel.
2. Set the **Root Directory** to `frontend`.
3. Ensure the Framework Preset is set to **Next.js**.
4. Set the following Environment Variable in Vercel:
   - `NEXT_PUBLIC_API_URL`: Your deployed Railway backend URL (e.g., `https://knowbridge-backend.up.railway.app`)
5. Deploy. Vercel will run `npm run build` and publish the site with global edge caching and CDN distribution.

---

## Marketing Admin Portal

The marketing platform includes an integrated management portal at `/admin`.

- **Access URL**: `https://your-frontend-domain.vercel.app/admin/login`
- **Default Credentials**: Specified by `ADMIN_EMAIL` and `ADMIN_PASSWORD` in backend environment variables.
- **Theme & Design System**: Strict black-and-white monochromatic aesthetic matching the public brand, zero emojis, Lucide SVG iconography, accessible contrast ratios, and table skeleton loading states.
- **Key Modules**:
  - **Dashboard**: High-level metrics for Total Clients, Active Subscriptions, Monthly Revenue, and Subscriptions Expiring within 7 days.
  - **Leads & Clients**: Full lifecycle tracking from raw lead capture to active customer accounts, with company size, industry classification, and subscription history.
  - **Subscriptions & Usage**: Monitor conversation consumption against plan quotas, auto-expiry verification, and plan tier management.
  - **Invoices**: Tax invoice generation compliant with Indian GST (18%), sequential numbering format (`KNB-YYYY-XXX`), and instant on-the-fly PDF invoice generation.
  - **DPDP Consent Ledger**: Immutable audit log of all explicit consent events, IP addresses, timestamps, and active deletion request countdowns.

---

## DPDP Act 2023 Compliance Architecture

In compliance with India's **Digital Personal Data Protection Act (DPDP Act) 2023**, the platform enforces strict data governance:

1. **Explicit Consent Capture**:
   - Every contact and demo request captures affirmative, unambiguous consent via clear legal notices.
   - Consent records (`consent_records`) persist the client reference, email address, exact notice text, client IP address, and timestamp.
2. **Right to Withdraw**:
   - Data principals can withdraw consent at any time via authenticated or self-service channels (`withdrawConsent`).
3. **Automated Erasure & 30-Day Grace Period**:
   - When consent is withdrawn, a record is added to `consent_deletion_requests` with a scheduled deletion date (`scheduled_for = NOW() + INTERVAL '30 days'`).
   - A background cron scheduler executes every 24 hours to evaluate scheduled deletions.
   - Upon reaching the scheduled date, all personal identification records (leads, consent records, client profile data) are permanently purged while preserving necessary statutory financial records (tax invoices) in anonymized format.

---

## Production Launch Checklist

### Backend Verification
- [x] Node.js engine `>= 20.0.0` configured in `package.json`
- [x] Process execution defined in `Procfile` and `railway.json`
- [x] Database migrations up to date (`001_init.sql` through `007_leads.sql`)
- [x] Initial admin credentials seeded with strong password hash
- [x] Express global error handler active (hides error stack in `production`, generates error ID)
- [x] Zod schema validation active on all submission endpoints
- [x] Helmet security headers active
- [x] CORS restricted to verified `FRONTEND_URL`
- [x] Rate limiting active (5 reqs/15m for login, 5 reqs/15m for lead forms, 100 reqs/15m for API)
- [x] Morgan HTTP request logger configured (`combined` in production, `dev` in development)
- [x] Health check endpoint `/api/health` returns HTTP 200
- [x] Daily automated subscription expiry and DPDP deletion cron active

### Frontend Verification
- [x] Deployment configuration verified in `vercel.json`
- [x] Environment variable template documented in `.env.local.example`
- [x] App Router production build completes with zero errors (`npm run build`)
- [x] Custom security headers set in `next.config.ts` (`X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`)
- [x] Strict black-and-white theme applied across all admin and public pages
- [x] Complete absence of emoji characters; pure Lucide SVG icons used throughout
- [x] Global client layout handles admin route separation without hydration or prerender failure
- [x] Custom 404 page (`not-found.tsx`) and Admin Error Boundary (`AdminErrorBoundary.tsx`) active
- [x] Responsive layout verified across desktop, tablet, and mobile breakpoints
- [x] Cookie-based JWT authentication with automatic login redirection on expired session

### Security & Governance
- [x] Passwords hashed with bcrypt (salt rounds: 12)
- [x] JWT tokens signed with secure secret and 8-hour expiration
- [x] No sensitive environment variables committed to source control
- [x] DPDP consent audit log capturing IP, user agent, and timestamp
- [x] Automated data erasure scheduled on consent withdrawal
