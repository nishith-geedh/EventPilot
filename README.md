# EventPilot – AWS-Powered Event Management Platform

A full-stack, production-ready scaffold for organizers and attendees.  
Stack: **Next.js 14 (App Router) + Tailwind + NextAuth (Cognito Provider)** on the frontend; **AWS Lambda + API Gateway + DynamoDB + S3 + Cognito** via **AWS SAM** on the backend.

---

## Table of Contents

- [Quick Start](#quick-start)
- [Backend Deployment (AWS SAM)](#1-deploy-backend-aws-sam)
- [Frontend Setup & Hosting](#2-configure-frontend)
- [User Roles & Cognito Groups](#3-roles--users)
- [Organizer Dashboard Features](#organizer-dashboard)
- [Ticketing Flow](#5-ticketing)
- [Deployment Notes & Manual Steps](#deployment-notes--manual-steps)
- [Commands Reference](#commands)
- [Environment Variables](#environment-variables)
- [Architecture Overview](#architecture-diagram-ascii)
- [Cost & Scalability](#cost--scalability-rough)
- [Contributing](#contributing)
- [License](#license)

---

## Quick Start

### 1. Deploy Backend (AWS SAM)

cd backend
sam build
sam deploy --guided

Pick a stack name (e.g., `eventpilot-stack`).  
On first deploy, SAM will create:

- Cognito User Pool + App Client (Hosted UI optional)
- DynamoDB tables: `Events`, `Registrations`, `Tickets`
- S3 buckets for banners & tickets (with CORS)
- API Gateway with routes
- Lambda functions (CRUD, analytics, presign, ticket pdf generation)

> After deploy, note these outputs:
> - `ApiBaseUrl`
> - `UserPoolId`, `UserPoolClientId`, `UserPoolDomain`
> - `BannersBucket`, `TicketsBucket`
> - `CognitoIssuerUrl`

---

### 2. Configure Frontend

Create `frontend/.env.local` based on `.env.example`, filling with output values from your SAM deploy.

cd frontend
npm install
npm run dev # or: npm run build && npm run start


**Recommended hosting:**  
AWS Amplify – Connect this repo, set environment variables from `.env.example`, and deploy.

---

### 3. Roles & Users

In the AWS Console → Cognito → User Pool:

- Create groups: `organizer`, `attendee`
- Assign users to appropriate groups

---

## Organizer Dashboard

Log in as an organizer to access advanced analytics:

- Registrants per event (bar chart)
- Ticket scans over time (line chart)
- Registrations by category (pie chart)
- Conversion metrics (visits vs registrations)
- Real-time active attendees (stub endpoint)

---

### 5. Ticketing

When an attendee registers:

- A Lambda generates a PDF with an embedded QR code
- PDF is stored in S3 (`tickets` bucket), and a pre-signed download link is emailed to the attendee

---

## Deployment Notes & Manual Steps

1. **Cognito Hosted UI (optional):**  
   In User Pool App Client, set a domain (e.g., `eventpilot-<random>`) and callback URLs (e.g., `https://yourdomain/callback`).  
   If using NextAuth, you can use custom flows without Hosted UI.

2. **CORS:**  
   Buckets are created with permissive CORS for dev. Tighten for production.

3. **Stripe (optional):**  
   Frontend includes a mock payment toggle. To switch to real Stripe in test mode, add Stripe keys to `.env.local` and extend `createRegistration` Lambda to call Stripe (skeleton included).

---

## Commands

**Backend**


cd backend
sam build && sam deploy --guided

Later updates:
sam deploy


**Frontend (local)**

cd frontend
npm install
npm run dev


**Frontend (Amplify)**

- Connect repo → Set env vars → Build & Deploy

---

## Environment Variables

### Frontend (`frontend/.env.local`)



NEXT_PUBLIC_API_BASE_URL=https://<apigw-id>.execute-api.<region>.amazonaws.com/Prod
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=replace-with-strong-random
COGNITO_CLIENT_ID=<UserPoolClientId>
COGNITO_CLIENT_SECRET=<OptionalIfConfidential>
COGNITO_ISSUER=https://cognito-idp.<region>.amazonaws.com/<UserPoolId>
NEXT_PUBLIC_BANNERS_BUCKET=<bucket-name>
NEXT_PUBLIC_TICKETS_BUCKET=<bucket-name>
NEXT_PUBLIC_REGION=<region>

Optional Stripe test keys
#STRIPE_PUBLIC_KEY=pk_test_xxx
#STRIPE_SECRET_KEY=sk_test_xxx


**Backend (SAM Parameters / Env):**

- `BannersBucketName`
- `TicketsBucketName`
- `AllowedOrigin` (CORS for API)
- `EnableHostedUI` (true/false)

---

## Architecture Diagram (ASCII)

[Next.js + NextAuth] --(HTTPS)--> [API Gateway] --> [Lambda Functions] --> [DynamoDB]
| -> [S3 Pre-Signed URLs]
|--(S3 Upload banners)----------------------> [S3 Banners Bucket]
|--(Download ticket via signed URL)---------> [S3 Tickets Bucket]

[Cognito User Pool + Groups]

organizer

attendee

[Analytics Lambdas] --> scan/aggregate DynamoDB --> return series (bar/line/pie)
[Registration Lambda] --> generate PDF + QR (stored in S3)


---

## Cost & Scalability (Rough Overview)

| Service     | Purpose                  | Cost Model                | Scalability           |
|-------------|--------------------------|---------------------------|-----------------------|
| DynamoDB    | Event/registration DB    | On-demand, per-request    | Scales automatically  |
| Lambda      | Business logic           | Pay-per-invocation        | Scales to zero        |
| API Gateway | REST API                 | Pay-per-call              | Scales automatically  |
| S3          | Storage (banners/tickets)| Pay-per-GB + bandwidth    | Durable, low-cost     |
| Cognito     | Auth/groups              | Per MAU                   | Handles bursts        |
| Amplify     | Frontend hosting & CDN   | Static + build usage      | Global CDN            |
| Stripe      | Payment processing       | Pay-as-you-go             | Optional integration  |

---

## Contributing

Pull requests, issues, and suggestions are welcome.  
Open an Issue or PR for custom features, bug reports, or improvements.

---

## License

Distributed under the MIT License. See [LICENSE](LICENSE) for details.

---

**EventPilot** delivers a modern, scalable foundation for AWS-native, production-grade event platforms –  
with battle-tested patterns for cost, performance, and a delightful user experience.
