# EventPilot – AWS-Powered Event Management Platform

[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![AWS SAM](https://img.shields.io/badge/AWS-SAM-orange?logo=amazonaws)](https://aws.amazon.com/serverless/sam/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Build](https://img.shields.io/github/actions/workflow/status/nishith-geedh/EventPilot/deploy.yml?label=Build&logo=github)](https://github.com/nishith-geedh/EventPilot/actions)

---

A full-stack, production-ready scaffold for organizers and attendees.

**Frontend:** Next.js 14 (App Router), TailwindCSS, NextAuth (Cognito Provider)  
**Backend:** AWS Lambda, API Gateway, DynamoDB, S3, Cognito — orchestrated via AWS SAM

---

## Table of Contents

- [Quick Start](#quick-start)
- [Backend Deployment (AWS SAM)](#deploy-backend-aws-sam)
- [Frontend Setup & Hosting](#configure-frontend)
- [User Roles & Cognito Groups](#roles--users)
- [Organizer Dashboard Features](#organizer-dashboard)
- [Ticketing Flow](#ticketing)
- [Deployment Notes & Manual Steps](#deployment-notes--manual-steps)
- [Commands Reference](#commands)
- [Environment Variables](#environment-variables)
- [Architecture](#architecture-diagram-ascii)
- [Cost & Scalability](#cost--scalability)
- [Contributing](#contributing)
- [License](#license)

---

## Quick Start

### Deploy Backend (AWS SAM)

cd backend
sam build
sam deploy --guided


Pick a stack name (e.g., `eventpilot-stack`).  
On first deploy, SAM will create:

- Cognito User Pool + App Client (Hosted UI optional)
- DynamoDB tables: `Events`, `Registrations`, `Tickets`
- S3 buckets for `banners` & `tickets` (CORS enabled)
- API Gateway with all routes
- Lambda functions for CRUD, analytics, presigned URLs, PDF generation

> **After deployment, note the outputs:**
> - `ApiBaseUrl`
> - `UserPoolId`, `UserPoolClientId`, `UserPoolDomain`
> - `BannersBucket`, `TicketsBucket`
> - `CognitoIssuerUrl`

---

### Configure Frontend

Create `frontend/.env.local` based on `.env.example`, copying SAM output values.

cd frontend
npm install
npm run dev # for development

or
npm run build && npm start # for production


**Recommended Hosting:**  
AWS Amplify — connect this repo, set environment variables, build & deploy.

---

## Roles & Users

In AWS Console → Cognito → User Pool:

- Create groups: `organizer`, `attendee`
- Assign users appropriately

---

## Organizer Dashboard

Log in as an organizer to access analytics:

- Registrants per event (bar chart)
- Ticket scans over time (line chart)
- Registrations by category (pie chart)
- Conversion metrics (visits vs registrations)
- Real-time active attendees (stub endpoint)

---

## Ticketing

When an attendee registers:

- Lambda generates a downloadable PDF ticket with embedded QR code
- PDF stored in S3 (`tickets` bucket); attendee receives a pre-signed URL

---

## Deployment Notes & Manual Steps

1. **Cognito Hosted UI (optional):**  
   Set a custom domain (e.g., `eventpilot-xyz`) and callback URLs matching your frontend (`https://yourdomain/callback`). Or, use custom flows via NextAuth.
2. **CORS:**  
   Buckets start with permissive dev CORS; restrict for production.
3. **Stripe (optional):**  
   Add Stripe test/live keys in `.env.local`.  
   Extend the `createRegistration` Lambda for payment handling.

---

## Commands

**Backend (AWS SAM):**


cd backend
sam build && sam deploy --guided

For subsequent deployments:
sam deploy


**Frontend (Local):**

cd frontend
npm install
npm run dev

**Frontend (Amplify):**
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
STRIPE_PUBLIC_KEY=pk_test_xxx
STRIPE_SECRET_KEY=sk_test_xxx


### Backend (SAM Parameters / Env):

- `BannersBucketName`
- `TicketsBucketName`
- `AllowedOrigin` (CORS for API)
- `EnableHostedUI` (true/false)

---

## Architecture Diagram (ASCII)

[Next.js + NextAuth] --(HTTPS)--> [API Gateway] --> [Lambda Functions] --> [DynamoDB]
| |
|--(S3 Upload banners)+-------->+--> [S3 Banners Bucket]
|--(Download ticket via signed URL)+-> [S3 Tickets Bucket]
| |
+-> [S3 Pre-Signed URLs] |
[Cognito User Pool + Groups]

organizer

attendee

[Analytics Lambdas] --> scan/aggregate DynamoDB --> return series (bar/line/pie)
[Registration Lambda] --> generate PDF + QR (stored in S3)


---

## Cost & Scalability

| Service     | Purpose                   | Pricing                | Scalability         |
|-------------|---------------------------|------------------------|---------------------|
| DynamoDB    | Event/registration store  | On-demand, per-request | Auto-scaled         |
| Lambda      | API/business logic        | Per-invocation         | Scales-to-zero      |
| API Gateway | RESTful API endpoints     | Per-call               | Auto-scaled         |
| S3          | File storage (banners/tickets)| Per-GB + bandwidth  | Durable, low-cost   |
| Cognito     | Auth/groups               | Per MAU                | Handles bursts      |
| Amplify     | Frontend static hosting   | Static + build usage   | Global CDN          |
| Stripe      | Payments (optional)       | Pay-as-you-go          | Secure, scalable    |

_Designed for serverless, scale-to-zero efficiency and clean modular separation._

---

## Contributing

Contributions and suggestions are always welcome.  
Open issues or pull requests for features, fixes, or documentation.

---

## License

MIT License. See [LICENSE](LICENSE).

---

**EventPilot** delivers a modern, scalable foundation for AWS-native, production-grade event platforms —  
with robust patterns for cost, security, performance, and developer experience.
