# AristoPay — Project Documentation

## What is AristoPay?

AristoPay is a transparent marketplace platform for securing professional deals. It connects Service Providers (experts/professionals) with Clients, with built-in contract signing, escrow-style payment protection via Trustap, identity verification, and ratings.

---

## Core Concepts

### Universal Registration (Dual-Role Model)
- A user registers **once** with a single account
- Upon registration they select a **primary role** — Service Provider or Client
- They can **toggle between both roles freely** from their dashboard (like Fiverr)
- All users agree to AristoPay Terms of Service and Trustap's Terms upon registration
- Trustap registration is completed during onboarding to enable transaction capability from day one

### Subscription Tiers
| Feature | Free Tier | Premium Tier ($29/month) |
|---------|-----------|--------------------------|
| Messaging | ✅ Free for all | ✅ |
| Browse services | ✅ | ✅ + filter by verified status |
| Create service posts (SP) | ✅ | ✅ |
| Send proposals (SP) | ✅ | ✅ |
| Receive proposals (Client) | ✅ | ✅ |
| Send proposals (Client) | ❌ | ✅ |
| Receive proposals from verified clients (SP) | ❌ | ✅ |
| Identity Verification (Veriff badge) | ❌ | ✅ |
| DocuSign contracts | ❌ | ✅ (5/month, $2 each additional) |
| Transaction Concierge | ❌ | ✅ (concierge@aristopay.com, 24hr response) |

### Transaction Rules
- Minimum transaction size: **$150 USD**
- Accepted currencies: Defined by Trustap
- Payment methods: Credit card, ACH transfer
- Recommendation: Over $2,000 → Bank/Wire transfer | Under $2,000 → Card payment
- SP pays **5% service fee** per transaction
- Client pays **3% service fee** per transaction
- Trustap acts as merchant of record — handles fund holding, payment acceptance, fraud management, issue resolution

---

## Service Provider (SP) Flow

### Step 1 — Registration & Login
- Registers and selects **Service Provider** as primary role
- Completes Trustap registration to unlock transaction capability
- Can also login via Google or Apple OAuth

### Step 2 — Dashboard Access
- Accesses SP dashboard
- Can manage: posts, proposals, active projects, transaction history

### Step 3 — Service Posts (Free)
- Creates and publishes service profile/posts with info about their services
- Visible to all clients on the platform
- **Available on free tier**

### Step 4 — Communication (Free)
- Can message and communicate with **any client** regardless of subscription plan
- Communication is **free for all users**

### Step 5 — Proposals
- **Free tier:** SP can send proposals to clients
- **Premium tier:** SP can also **receive** proposals from verified clients (both parties can initiate)

### Step 6 — Identity Verification (Premium)
- Premium subscribers ($29/month) complete identity verification via **Veriff**
- Upon successful verification → receive a visible **verified badge** on their profile
- Signals trust to prospective clients

### Step 7 — Contracts (Premium)
- Premium subscribers can attach a **DocuSign contract** to any proposal
- Can request a signature from the client before the project begins
- **5 contracts included monthly**
- Additional contracts at **$2 each**

### Step 8 — Receiving Payment
- Once client releases funds through Trustap → provider receives payment directly
- SP pays **5% service fee** per transaction
- Concierge service available for premium subscribers (concierge@aristopay.com)

---

## Client Flow

### Step 1 — Registration & Login
- Registers and selects **Client** as primary role
- Completes Trustap registration to unlock transaction capability
- Can also login via Google or Apple OAuth

### Step 2 — Dashboard Access
- Accesses Client dashboard
- Can browse services, manage proposals, active projects, transaction history

### Step 3 — Browsing Services (Free)
- Can browse all published SP posts and profiles based on preferences
- **Free tier:** Basic browsing
- **Premium tier:** Can filter search based on **verified status** of prospective SP

### Step 4 — Communication (Free)
- Can message and communicate with **any service provider** regardless of subscription plan
- Communication is **free for all users**

### Step 5 — Proposals
- **Free tier:** Client can only **receive** proposals from service providers
- **Premium tier:** Client can both **receive AND send** proposals directly to SPs
- ⚠️ Sending proposals requires active premium subscription — enforced at **backend level** (not just UI) as a core fraud prevention mechanism

### Step 6 — Identity Verification (Premium)
- Premium subscribers complete identity verification via **Veriff**
- Receive a verified badge — signals to SPs that the client is serious and accountable
- Reduces late payment risk on both sides

### Step 7 — Contracts (Premium)
- Premium subscribers can request, receive, and sign DocuSign contracts within the platform
- Document limit (5/month, $2 additional) applies only to those **sending** contracts, not signing
- Same 5 DocuSign envelopes and $2 per additional applies for sending

### Step 8 — Making Payment
- Client pays through **Trustap's secure checkout**
- Funds held in escrow until client **confirms project delivery**
- Client pays **3% service fee** per transaction
- Minimum transaction: **$150**

---

## Shared Transaction Flow (Both Parties)

1. Both parties agree on terms
2. Any contracts are signed (if applicable)
3. Transaction initiated through **Trustap**
4. Trustap holds funds securely in escrow
5. Client confirms delivery → funds released to SP
6. Neither party can access held funds until confirmation
7. All disputes and chargebacks handled through Trustap's infrastructure

---

## Admin Flow

### Admin Capabilities
- User Management — view all users, verify SP accounts
- Banner Management — create/update/delete banners
- Blog Management — create/update/delete blog posts
- Badge Management — create/update badges with images
- Subscription Management — create/update/toggle subscription plans
- Finance Dashboard — total revenue, active subscriptions, monthly revenue chart
- Recent Users — last 5 registered users

---

## Tech Stack

### Frontend
- **Framework:** Next.js 15 (App Router)
- **Styling:** Tailwind CSS
- **State:** Zustand
- **Data Fetching:** TanStack Query (React Query)
- **Animations:** Framer Motion
- **Auth:** Firebase (Google + Apple OAuth) + JWT
- **Real-time:** Socket.io (messages)
- **Deployment:** Vercel

### Backend
- **Framework:** NestJS
- **Database:** PostgreSQL + Prisma ORM
- **Auth:** JWT + Firebase Admin
- **Payment:** Trustap (escrow)
- **Identity Verification:** Veriff
- **File Upload:** Local disk (⚠️ needs S3 migration)
- **Real-time:** Socket.io (messages + trustap events)
- **Deployment:** AWS

---

## Key Business Rules

1. **Proposal sending by clients is premium-only** — enforced at backend level, not just UI
2. **Messaging is free** for all users regardless of subscription
3. **Identity verification** requires active premium subscription — handled by Veriff
4. **Minimum transaction is $150** regardless of subscription
5. **DocuSign limit** (5/month, $2 additional) applies only to the **sender**, not the signer
6. **Concierge service** — Concierge@AristoPay.co, priority email support within 24 hours (operational only)
7. **Trustap registration** must be completed during onboarding for transaction capability
8. **5% fee = Trustap fee** paid by SP per transaction
9. **3% fee = AristoPay fee** paid by Client per transaction
10. **Admin cannot manually verify accounts** — Veriff handles all identity verification
11. **Admin can remove users** from the platform
12. **Blog management** removed from admin panel — no longer needed
13. **Any URL in messages** triggers a warning modal (both SP and Client side)

---

## Current Implementation Status

| Feature | Backend | Frontend |
|---------|---------|----------|
| Auth (Email/OTP) | ✅ | ✅ |
| Auth (Google/Apple OAuth) | ✅ | ✅ |
| Admin Panel | ✅ | ✅ |
| SP Profile Creation | ✅ | ✅ |
| Service Posts | ✅ | ✅ |
| Messaging (REST + Socket) | ✅ | ✅ |
| Trustap Transactions | ✅ | ✅ |
| Identity Verification (Veriff) | ✅ | ✅ |
| Subscriptions (Stripe) | ✅ | ✅ |
| Reviews/Ratings | ✅ | Partial |
| Favorites | ✅ | ✅ |
| File Upload (S3) | ❌ Local only | ✅ |
| Proposal System | ⚠️ Partial | ⚠️ Partial |
| DocuSign Integration | ❌ | ❌ |
| Concierge Email | N/A (operational) | N/A |
