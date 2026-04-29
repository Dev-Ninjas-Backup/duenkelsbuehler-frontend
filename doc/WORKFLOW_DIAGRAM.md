# AristoPay — Workflow Flow Diagram

## 1. Registration & Onboarding Flow

```
User visits AristoPay
        │
        ▼
   Register / Login
   (Email+OTP or Google/Apple OAuth)
        │
        ▼
  Select Primary Role
  ┌─────┴─────┐
  ▼           ▼
CLIENT    SERVICE PROVIDER
  │           │
  └─────┬─────┘
        ▼
  Complete Trustap Registration
  (enables transaction capability)
        │
        ▼
   Access Dashboard
   (can toggle role anytime)
```

---

## 2. Service Provider Flow

```
SP Dashboard
     │
     ├──────────────────────────────────────────┐
     ▼                                          ▼
[FREE TIER]                              [PREMIUM - $29/mo]
     │                                          │
     ├─ Create Service Posts ──────────────────►│
     │  (visible to all clients)                │
     │                                          ├─ Identity Verification (Veriff)
     ├─ Message any Client (free) ─────────────►│  → Verified Badge on profile
     │                                          │
     ├─ Send Proposals to Clients ─────────────►├─ Receive Proposals from
     │                                          │  verified clients
     │                                          │
     │                                          ├─ DocuSign Contracts
     │                                          │  (5/month, $2 each extra)
     │                                          │
     │                                          └─ Transaction Concierge
     │                                             (concierge@aristopay.com)
     │
     ▼
  Deal Agreed
     │
     ▼
  Transaction via Trustap
     │
     ▼
  Funds held in Escrow
     │
     ▼
  Client confirms delivery
     │
     ▼
  SP receives payment
  (minus 5% service fee)
```

---

## 3. Client Flow

```
Client Dashboard
     │
     ├──────────────────────────────────────────┐
     ▼                                          ▼
[FREE TIER]                              [PREMIUM - $29/mo]
     │                                          │
     ├─ Browse SP Services ────────────────────►├─ Browse + Filter by
     │  (basic)                                 │  Verified Status
     │                                          │
     ├─ Message any SP (free) ─────────────────►│
     │                                          ├─ Identity Verification (Veriff)
     ├─ Receive Proposals from SP ─────────────►│  → Verified Badge
     │                                          │
     │                              ────────────►├─ Send Proposals to SP
     │                              (PREMIUM     │  (fraud prevention gate)
     │                               ONLY)       │
     │                                          ├─ DocuSign Contracts
     │                                          │  (sign only, free)
     │                                          │  (send: 5/mo, $2 extra)
     │                                          │
     │                                          └─ Transaction Concierge
     │
     ▼
  Deal Agreed
     │
     ▼
  Sign Contract (if applicable)
     │
     ▼
  Pay via Trustap
  (funds held in escrow)
  (minus 3% service fee)
  (min $150)
     │
     ▼
  Confirm Delivery
     │
     ▼
  Funds released to SP
     │
     ▼
  Leave Review/Rating
```

---

## 4. Full Transaction Flow (Both Parties)

```
SP sends Proposal          Client sends Proposal
(Free + Premium)           (Premium ONLY ⚠️)
        │                          │
        └──────────┬───────────────┘
                   ▼
          Both Parties Agree on Terms
                   │
                   ▼
          Contract Signing (Optional)
          DocuSign — Premium only
          SP sends → Client signs
                   │
                   ▼
          Transaction Initiated via Trustap
                   │
                   ▼
          ┌────────────────────────┐
          │   TRUSTAP ESCROW       │
          │   Funds held securely  │
          │   Neither party can    │
          │   access until         │
          │   confirmation         │
          └────────────────────────┘
                   │
                   ▼
          Client Confirms Delivery
                   │
                   ▼
          Funds Released to SP
          ┌─────────────────────┐
          │ SP receives payment │
          │ - 5% AristoPay fee  │
          │ - 3% from Client    │
          └─────────────────────┘
                   │
                   ▼
          Reviews & Ratings
          (both parties)
                   │
                   ▼
          Badges Earned
          (based on activity)
```

---

## 5. Admin Flow

```
Admin Dashboard
     │
     ├─ User Management
     │   └─ View all users
     │   └─ Verify SP accounts (identity check)
     │
     ├─ Content Management
     │   ├─ Banner Management (CRUD)
     │   ├─ Blog Management (CRUD)
     │   └─ Badge Management (CRUD + image upload)
     │
     ├─ Subscription Management
     │   └─ Create/Edit/Toggle plans
     │
     └─ Finance Dashboard
         ├─ Total Revenue
         ├─ Active Subscriptions
         ├─ Monthly Revenue Chart
         └─ Recent Users (last 5)
```

---

## 6. Subscription & Verification Flow

```
User wants Premium Features
          │
          ▼
   Subscribe ($29/month)
   via Stripe
          │
          ▼
   Premium Unlocked
          │
          ▼
   Start Identity Verification
   via Veriff
          │
     ┌────┴────┐
     ▼         ▼
  Success    Failed
     │         │
     ▼         ▼
Verified    Try Again /
Badge       Contact Support
Added to
Profile
```

---

## 7. Messaging Flow

```
User A (SP or Client)
          │
          ▼
   Open Messages
   (Free for ALL users)
          │
          ▼
   Connect via Socket.io
   (/messages namespace)
   Auth: JWT token
          │
          ▼
   Send Message
   (text / image / PDF)
          │
          ▼
   Trustap URL detected?
   ┌──────┴──────┐
   ▼             ▼
  No            Yes
   │             │
   │             ▼
   │      Show Warning Modal
   │      "Leaving AristoPay"
   │             │
   ▼             ▼
Message      User confirms
delivered    → opens external URL
via Socket
(receive_message event)
          │
          ▼
   Mark as Read
   (PATCH /messages/:id/read)
```

---

## 8. Badge Earning System

| Badge | Trigger |
|-------|---------|
| Left a Rating | User leaves a review |
| Completed a Transaction | Transaction finalized |
| Attached a Contract | DocuSign contract attached |
| Subscribed to AristoAccess+ | Premium subscription active |
| Verified Account | Identity verified via Veriff |
| Sent a Proposal | Proposal sent to other party |

---

## 9. Fee Structure Summary

```
Transaction Amount: $X (minimum $150)
        │
        ├─ Client pays: X + 3% (AristoPay fee)
        │
        └─ SP receives: X - 5% (Trustap fee)

Trustap acts as merchant of record
→ handles all fund holding, fraud, disputes
```

---

## 10. What's Built vs What's Pending

```
✅ DONE                          ⚠️ PARTIAL / PENDING
─────────────────────────────    ──────────────────────────────
Auth (Email + OAuth)             Proposal System (partial)
Admin Panel (full)               File Upload → needs S3
SP Profile + Services            DocuSign Integration
Messaging (REST + Socket)        Subscription gate enforcement
Trustap Transactions               at backend level
Identity Verification            Connect page (mock data)
Subscriptions (Stripe)           Saved Clients (now real ✅)
Favorites                        Discover → SP link (broken)
Reviews (backend)
Badges (admin CRUD)
```
