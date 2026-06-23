# AristoPay Project Workflow & Specifications

This document outlines the official platform workflow, user roles, pricing structures, and implementation rules as provided by the client.

---

## 1. Universal Rules & Registration

### Universal Registration (Dual-Role Model)
* **Single Account Access:** Users register once with a single account.
* **Role Selection:** Upon registration, users select their primary role—**Service Provider (SP)** or **Client**.
* **Role Toggling:** Users can freely toggle between both roles from their dashboard at any time without needing separate accounts (similar to Fiverr's dual-role model).
* **Terms Agreement:** All users must agree to AristoPay Terms of Service and Trustap's Terms during registration.
* **Onboarding:** Trustap registration/onboarding is completed during the initial signup to enable transaction capability from day one.

---

## 2. Service Provider (SP) Flow

* **Step 1 — Registration & Login:** Provider registers, selects Service Provider as their primary role, and completes Trustap onboarding to unlock transaction capability.
* **Step 2 — Dashboard Access:** Provider accesses their dashboard to manage posts, proposals, active projects, and transaction history.
* **Step 3 — Service Posts:** Provider can create and publish their profile detailing their services. This is visible to all clients on the platform and is available on the **Free Tier**.
* **Step 4 — Communication:** Providers can message and communicate with any client regardless of their subscription plan. Communication is free for all users.
* **Step 5 — Proposals (Free vs Premium):**
  * *Free Tier:* Provider can send proposals to clients.
  * *Premium Tier:* Provider can both send proposals and receive proposals directly from verified clients. Both parties can initiate.
* **Step 6 — Identity Verification (Premium):** Premium subscribers ($29/month) complete identity verification via Veriff. Upon successful verification, they receive a visible **Verified Badge** on their profile to build trust.
* **Step 7 — Contracts (Premium):** Premium subscribers can attach a DocuSign contract to any proposal and request a signature from the client before the project begins. 
  * *Allowance:* 5 contracts included monthly. 
  * *Overage:* Additional contracts cost $2 each.
* **Concierge Service (Premium):** Premium subscribers have access to a dedicated Transaction Concierge.
  * *Contact Email:* `Concierge@AristoPay.co` (priority email support).
  * *SLA:* Guaranteed response within 24 hours.
  * *Note:* This is handled operationally—no backend build is required at this stage.
* **Step 8 — Receiving Payment:** Once a client releases escrow funds through Trustap, the provider receives payment directly. Providers pay a **5% service fee** per transaction (unless promo applies).

---

## 3. Client Flow

* **Step 1 — Registration & Login:** Client registers, selects Client as their primary role, and completes Trustap onboarding to unlock transaction capability.
* **Step 2 — Dashboard Access:** Client accesses their dashboard where they can browse services, manage proposals, active projects, and transaction history.
* **Step 3 — Browsing Services:** Clients can browse all published service provider posts and profiles based on preferences.
  * *Free Tier:* Can search and browse.
  * *Premium Tier:* Allows filtering searches based on the verified status of prospective users.
* **Step 4 — Communication:** Clients can message and communicate with any service provider regardless of subscription plan. Communication is free.
* **Step 5 — Proposals:**
  * *Free Tier:* Clients can **receive** proposals from service providers only.
  * *Premium Tier:* Clients can both receive **and send** proposals directly to service providers. This limits unsolicited or fraudulent outreach from unverified accounts.
* **Step 6 — Identity Verification (Premium):** Premium subscribers complete identity verification via Veriff to receive a verified badge, signaling accountability and reducing payment risks.
* **Step 7 — Contracts (Premium):** Premium subscribers can request, receive, and sign DocuSign contracts directly within the platform before payment is made. (Document limit applies only to sending, not signing. Standard 5 contracts and $2 overage rules apply).
* **Step 8 — Making Payment:** Clients pay through Trustap's secure checkout. Funds are held in escrow-style protection until the client confirms project delivery. 
  * *Payment Channels:* Accepted via credit card or ACH transfer.
  * *Recommendations:* Transactions over $2,000 should go through Bank/Wire transfer, while transactions below $2,000 go through standard card payments.
  * *Service Fee:* Clients pay a **5% + $0.40** standard protection fee.

---

## 4. Shared Transaction Flow (Escrow Mechanics)

* **Initialization:** Once both parties agree on terms and sign any attached contracts, the transaction is initiated through Trustap.
* **Merchant of Record:** Trustap acts as the merchant of record and manages the full transaction lifecycle including fund holding, payment acceptance, merchant payout (3% for AristoPay), fraud management, and issue resolution.
* **Escrow Hold:** Funds are held securely in escrow. Neither party can access the held funds until delivery is confirmed.
* **Release:** Upon the client's confirmation of project delivery, funds are released to the service provider.
* **Disputes:** All disputes and chargebacks are handled through Trustap's infrastructure.

---

## 5. Pricing & Fee Structure

### User Pricing Rules
* **Sellers (Service Providers) Pay:** **5%** (Standard Rate).
  * *Launch Promo:* First 90 days: **3%** seller fee ➡️ After 90 days: **5%** standard rate.
* **Buyers (Clients) Pay:** **5% + $0.40** per transaction (Trustap Standard Protection Fee).
* **Site Pricing Page Text:** *"Sellers pay 5%. Buyers pay Trustap's standard protection fee."*
* **Minimum Transactions:**
  * **Card Payments:** $150 minimum transaction size.
  * **Bank/Wire Transfers:** $300 minimum transaction size.
* **Accepted Currencies:** USD, EUR, GBP, CHF.

### Trustap Basic Integration Costs
Below is the default Trustap fee structure for the basic integration:

| Fee Component | Trustap Rate / Details |
| :--- | :--- |
| **Monthly Platform Fee** | Start for Free |
| **Integration Fee** | $249 |
| **Variable Fee** | 5.0% |
| **Fixed Fee** | $0.40 |
| **Bank Transfer** | 2% - Minimum $25 |
| **Instant Payout** | 2% |
| **Customer Support** | 10 Dispute & Support Tickets |
| **Additional Ticket Fee** | $10.00 |
| **Chargeback Management** | $0.00 |
| **Extra Chargeback Fee** | $50.00 |

---

## 6. Critical Technical Implementation Rules (Developer Flags)

> [!IMPORTANT]
> **Backend-Level Gatekeeping:**
> The proposal-sending permission for clients is tied directly to their premium subscription status. **This must be enforced at the API/backend level**, not just hidden in the frontend UI. This is a core fraud prevention mechanism, not just a feature gate.

> [!IMPORTANT]
> **Contract Signing Restrictions:**
> Contract signing and storing is **only available through Premium** for both Service Providers and Clients.

> [!NOTE]
> **Admin Dashboard Rule:**
> There is no need to implement user verification actions inside the admin panel, as that is automatically handled by Veriff. However, the admin panel **must** support the ability to remove/delete users.
> **Blog Management:** The blog management module is no longer required on the dashboard.

> [!WARNING]
> **Unverified State:**
> Any unverified or warning URL should clearly indicate a warning status.
