# EventPilot – AWS-Powered Event Management Platform

A full-stack, production-ready scaffold for organizers and attendees.  
Stack: **Next.js 14 (App Router) + Tailwind + NextAuth (Cognito Provider)** on the frontend; **AWS Lambda + API Gateway + DynamoDB + S3 + Cognito** via **AWS SAM** on the backend.

## Quick Start

### 1) Deploy Backend (AWS SAM)

```bash
cd backend
sam build
sam deploy --guided
```
Pick a stack name (e.g., `eventpilot-stack`). On first deploy SAM will create:
- Cognito User Pool + App Client (Hosted UI optional)
- DynamoDB tables (`Events`, `Registrations`, `Tickets`)
- S3 buckets for `banners` and `tickets` with CORS
- API Gateway with routes
- Lambda functions (CRUD, analytics, presign, ticket pdf generation)

> After deploy, note the **Outputs** printed by SAM:
- `ApiBaseUrl`
- `UserPoolId`, `UserPoolClientId`, `UserPoolDomain`
- `BannersBucket`, `TicketsBucket`
- `CognitoIssuerUrl`

### 2) Configure Frontend

Create `frontend/.env.local` from `.env.example` and fill values from SAM outputs.

```bash
cd frontend
npm install
npm run dev  # or: npm run build && npm run start
```

Recommended hosting: **AWS Amplify**. In Amplify console, connect this repo, set environment variables from `.env.example`, and deploy.

### 3) Roles & Users

In the AWS Console → Cognito → User Pool:
- Create two groups: `organizer`, `attendee`
- Assign users to the appropriate group(s).

### 4) Organizer Dashboard

Log in as an organizer to access the dashboard with analytics:
- Registrants per event (bar)
- Ticket scans over time (line)
- Registrations by category (pie)
- Conversion metrics (visits vs registrations) – mock included
- Real-time active attendees – stub endpoint included

### 5) Ticketing

When an attendee registers:
- A Lambda generates a **PDF** with an embedded **QR** code
- PDF is stored in S3 (`tickets` bucket), and pre-signed download link is provided

---

## Deployment Notes & Manual Steps

1. **Cognito Hosted UI (optional)**: In the User Pool App Client, set a domain (e.g. `eventpilot-<random>`) and callback URLs matching your frontend (e.g., `https://yourdomain/callback`). If using NextAuth, you can also use custom flows without Hosted UI.
2. **CORS**: Buckets are created with permissive CORS for dev. Tighten for prod.
3. **Stripe (optional)**: Frontend includes a mock payment toggle. To switch to real Stripe in test mode, add keys to `.env.local` and extend the `createRegistration` Lambda to call Stripe. (Skeleton included.)

---

## Commands

**Backend**
```bash
cd backend
sam build && sam deploy --guided
# Later updates:
sam deploy
```

**Frontend (local)**
```bash
cd frontend
npm install
npm run dev
```

**Frontend (Amplify)**
- Connect repo → Set env vars → Build & Deploy

---

## Environment Variables (Frontend)
Create `frontend/.env.local`:

```
NEXT_PUBLIC_API_BASE_URL=https://<apigw-id>.execute-api.<region>.amazonaws.com/Prod
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=replace-with-strong-random
COGNITO_CLIENT_ID=<UserPoolClientId>
COGNITO_CLIENT_SECRET=<OptionalIfConfidential>
COGNITO_ISSUER=https://cognito-idp.<region>.amazonaws.com/<UserPoolId>
NEXT_PUBLIC_BANNERS_BUCKET=<bucket-name>
NEXT_PUBLIC_TICKETS_BUCKET=<bucket-name>
NEXT_PUBLIC_REGION=<region>

# Optional Stripe test keys
STRIPE_PUBLIC_KEY=pk_test_xxx
STRIPE_SECRET_KEY=sk_test_xxx
```

**Backend (SAM Parameters / Env)**
- `BannersBucketName`, `TicketsBucketName`
- `AllowedOrigin` (CORS for API)
- `EnableHostedUI` (true/false)

---

## Architecture Diagram (ASCII)

```
[Next.js + NextAuth] --(HTTPS)--> [API Gateway] --> [Lambda Functions] --> [DynamoDB]
         |                                     \-> [S3 Pre-Signed URLs]
         |                                              |
         |--(S3 Upload banners)------------------------>+--> [S3 Banners Bucket]
         |--(Download ticket via signed URL)----------->+--> [S3 Tickets Bucket]

[Cognito User Pool + Groups]
  - organizer
  - attendee

[Analytics Lambdas] --> scan/aggregate DynamoDB --> return series (bar/line/pie)
[Registration Lambda] --> generate PDF + QR (stored in S3)
```

---

## Cost & Scalability (Rough)

- **DynamoDB**: On-demand mode scales automatically; cost per request + storage
- **API Gateway/Lambda**: pay-per-invocation, scales to zero
- **S3**: pennies for storage + bandwidth
- **Cognito**: MAU-based pricing; suitable for bursty auth
- **CloudFront/Amplify**: global caching, low-latency

This scaffold is designed for **serverless scale-to-zero** with clean separation of concerns.
