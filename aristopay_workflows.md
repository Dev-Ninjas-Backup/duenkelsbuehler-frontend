# AristoPay Complete Workflows & Specifications

This document outlines the detailed transaction, proposal, and escrow workflows on the AristoPay platform for both Clients and Service Providers (SP).

---

## 1. Client to SP Proposal Workflow (Proposal Flow)

This is the standard proposal flow initiated by a Client looking to hire a Service Provider.

### 🔗 Process Chain
```
Client Mode (Proposal Sending)
  └─► Transact (New Transaction)
  └─► Search SP
  └─► Select SP
  └─► Select Services
  └─► Proposal Details (Title, Description, Budget & Payment Method)
  └─► Final Remarks (Start/End Date & Terms)
  └─► Ready (Review & Escrow Fee Breakdown)
  └─► Submit (Send Proposal to SP)

SP Mode (Proposal Acceptance & Contract)
  └─► SP Receives Proposal
  └─► Accept Proposal
  └─► Upload DocuSign Contract (Premium Only)

Signing & Escrow Payment Phase
  └─► Client & SP Sign Contract (Premium Only)
  └─► Client Pays via Trustap Checkout
  └─► Funds Held in Escrow

Execution & Delivery
  └─► SP Completes Work
  └─► Client Confirms Delivery
  └─► Escrow Funds Released
  └─► Trustap Pays SP (Minus Fees)
```

> [!NOTE]
> **Budget Minimums for Proposals:**
> * **Bank/Wire Transfer:** $300 minimum budget requirement.
> * **Credit Card:** $150 minimum budget requirement.

---

## 2. SP to Client Direct Transaction Workflow (Direct Deal / Invoice Flow)

This flow is initiated directly by a Service Provider to send a direct deal or invoice to a Client.

### 🔗 Process Chain
```
SP Mode (Direct Deal / Invoice Creation)
  └─► Transact (New Transaction)
  └─► Select Client (from Contacts)
  └─► Amount (Enter Deal Amount)
  └─► Select Payment Method
  └─► Contract Upload & DocuSign Option (Premium Only)
  └─► Invoice Details (Title, Dates, Tax)
  └─► Final Details (Notes & Terms)
  └─► Ready (Review & Confirm)
  └─► Submit (Create Transaction)

Client Dashboard Side (Invoice Payment)
  └─► Client Receives Deal/Invoice
  └─► Client & SP Sign Contract (If DocuSign was selected - Premium Only)
  └─► Client Pays Invoice via Trustap
  └─► Funds Held in Escrow

Execution & Payout
  └─► SP Completes Work
  └─► Client Releases Funds
  └─► Trustap Pays SP (Minus Fees)
```

---

## ⚖️ Key Differences Between Flows

| Feature | 1. Client to SP (Proposal Flow) | 2. SP to Client (Direct Deal Flow) |
| :--- | :--- | :--- |
| **Initiator** | Client | Service Provider (SP) |
| **Primary Focus** | Hiring and proposing project scope | Invoicing and direct billing |
| **Contract Upload** | SP uploads *after* accepting proposal | SP uploads *during* invoice creation |
| **Workflow Step** | Multi-phase acceptance and negotiation | Fast, direct checkouts and payments |

> [!IMPORTANT]
> **Premium Features & Restrictions:**
> 1. **DocuSign Contract Upload & Signing:** Uploading, signing, and storing contracts via DocuSign is strictly restricted to **Premium (Subscriber) accounts** for both Service Providers and Clients.
> 2. **External Link Interceptor:** Sending links in direct messaging displays an informational alert (⚠️) warning users about off-platform transaction risks.
