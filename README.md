# EventPilot – AWS-Powered Event Management Platform

[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3-38B2AC?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![AWS SAM](https://img.shields.io/badge/AWS%20SAM-Serverless-orange?logo=amazonaws)](https://aws.amazon.com/serverless/sam/)
[![Amazon DynamoDB](https://img.shields.io/badge/DynamoDB-NoSQL-blue?logo=amazon-dynamodb)](https://aws.amazon.com/dynamodb/)
[![GitHub repo size](https://img.shields.io/github/repo-size/nishith-geedh/EventPilot?color=6aa64d)](https://github.com/nishith-geedh/EventPilot)
[![GitHub contributors](https://img.shields.io/github/contributors/nishith-geedh/EventPilot?color=BC69FA)](https://github.com/nishith-geedh/EventPilot/graphs/contributors)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Last Commit](https://img.shields.io/github/last-commit/nishith-geedh/EventPilot?logo=github)](https://github.com/nishith-geedh/EventPilot/commits/main)
[![Open Issues](https://img.shields.io/github/issues-raw/nishith-geedh/EventPilot?color=DF2A2A)](https://github.com/nishith-geedh/EventPilot/issues)
[![Pull Requests](https://img.shields.io/github/issues-pr-raw/nishith-geedh/EventPilot?color=654DD9)](https://github.com/nishith-geedh/EventPilot/pulls)
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

<pre lang="markdown"> <code>```bash cd frontend npm install npm run dev # for development ``` or ```bash npm run build && npm start # for production ```</code> </pre>

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

<pre lang="markdown"> <code>```bash # Backend (AWS SAM) cd backend sam build && sam deploy --guided ``` ```bash # For subsequent deployments sam deploy ``` ```bash # Frontend (Local) cd frontend npm install npm run dev ```</code> </pre>

**Frontend (Amplify):**
- Connect repo → Set env vars → Build & Deploy

---

## Environment Variables

### Frontend (`frontend/.env.local`)

<pre lang="markdown"> <code>```env NEXT_PUBLIC_API_BASE_URL=https://<api-id>.execute-api.<region>.amazonaws.com/Prod NEXTAUTH_URL=http://localhost:3000 NEXTAUTH_SECRET=replace-with-strong-random COGNITO_CLIENT_ID= COGNITO_CLIENT_SECRET= COGNITO_ISSUER=https://cognito-idp.<region>.amazonaws.com/ NEXT_PUBLIC_BANNERS_BUCKET= NEXT_PUBLIC_TICKETS_BUCKET= NEXT_PUBLIC_REGION= # Optional Stripe test keys STRIPE_PUBLIC_KEY=pk_test_xxx STRIPE_SECRET_KEY=sk_test_xxx ```</code> </pre>
### Backend (SAM Parameters / Env):

- `BannersBucketName`
- `TicketsBucketName`
- `AllowedOrigin` (CORS for API)
- `EnableHostedUI` (true/false)

---

## Architecture Diagram (ASCII)

<pre lang="markdown"> <code>```text [Next.js + NextAuth] | (HTTPS) | [API Gateway] | +-------+--------+ | | [Lambda Functions] [Cognito User Pool + Groups] | v [DynamoDB] | +------------------+-------------------------+ | | | (S3 Upload banners) (Analytics Lambdas) (Download ticket via | | signed URL from Lambda) v v v [S3 Banners Bucket] scan/aggregate [S3 Tickets Bucket] DynamoDB and | return series [S3 Pre-Signed URLs] (bar / line / pie) | +--------------+--------------+ | | [Registration Lambda] [Other Lambdas...] generate PDF + QR code, store in S3 User Roles: ----------- - Organizer - Attendee ```</code> </pre>

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
