# AristoPay Deal Management System: Architectural & Product Design

This document explains the unified architecture of the AristoPay Deal Management System, comparing industry best practices to the implementation details of the AristoPay codebase.

---

## 1. Industry Best Practices (Fiverr, Upwork, AristoPay style)

In peer-to-peer (P2P) freelance and escrow platforms, **a single unified database table is always used to manage active deals**, rather than splitting them into separate tables based on who initiated them. 

### Why a Unified Table?
* **Separate Entries, Converged Destination:** While a transaction can start from two completely different UI entry points (a Client sending a proposal or a Service Provider sending a custom invoice), once the terms are agreed upon and payment/contract signing is requested, their tracking, milestone management, escrow status, and release phases are exactly identical.
* **Reduces Code & Logic Duplication:** A single table prevents developer overhead, ensures consistency in tracking transaction states, and simplifies calculating user analytics (e.g., transaction volumes, ratings, active deals).

### Typical Unified Schema
```
                                 ┌────────────────────────┐
                                 │      Transactions      │
                                 ├────────────────────────┤
                                 │ id (Primary Key)       │
                                 │ amount                 │
                                 │ currency               │
                                 │ status                 │
                                 │ buyerId (Client)       │
                                 │ sellerId (SP)          │
                                 │ trustapTransactionId   │
                                 │ contractId (DocuSign)  │
                                 └────────────────────────┘
```

---

## 2. Under the Hood: How AristoPay is Structured

The AristoPay backend and frontend integrate these flows seamlessly through a two-phase architecture:

### Phase A: Pre-Deal Negotiation (Entry Points)
Depending on who initiates the deal, the initial flow is different:

* **Client-initiated (Proposal Flow):**
  * Client selects SP services and sets a budget.
  * Saved under the `proposals` database table.
  * Undergoes negotiation (accept/decline).
* **SP-initiated (Direct Custom Invoice Flow):**
  * SP inputs the direct amount, terms, and contract file to send to a client.
  * Bypasses the proposal state completely.

### Phase B: Active Deal Escrow (The Convergence)
Once either the proposal is accepted or the direct invoice is sent:
1. **DocuSign Contract Signings:** The deal prompts for signatures (if required).
2. **Escrow Checkout:** Client deposits funds via Trustap checkout.
3. **Escrow Hold:** Funds are marked as `HELD_IN_ESCROW`.
4. **Escrow Release:** Once the SP completes the work and the Client approves, funds are transferred to the SP.

---

## 3. Deal Tracking Management UI (Role-Based Display)

Because the deal converges into a unified transaction in the database, the dashboard tracking screen (both Client and SP) reads from the same transactions list. The UI dynamically adjusts the available action buttons depending on the active user's role:

| User Role | Escrow Status: Signed / Checkout | Escrow Status: Paid / Active |
| :--- | :--- | :--- |
| **Buyer (Client)** | Shows **`Pay Invoice`** | Shows **`Release Escrow`** |
| **Seller (SP)** | Shows `Waiting for Client Payment` | Shows **`Request Release`** / `Mark Complete` |

---

## 💡 Summary of System Design

> [!TIP]
> **No duplicate tables are needed.** 
> While the UI form inputs and proposal steps are different, they both ultimately resolve to a single Trustap transaction entity (`POST /trustap/create-transaction`). The AristoPay frontend is already fully optimized to handle this role-based unified system.
