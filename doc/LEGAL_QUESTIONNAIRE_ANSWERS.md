# AristoPay — Legal Questionnaire & Policy Technical Audit

This document provides a verified, code-level analysis of all questions asked for the **Privacy Policy** and **Terms & Conditions** generation for **AristoPay**, based on a complete scan of the frontend (`duenkelsbuehler-frontend`) and backend (`duenkelsbuehler-backend`) codebases.

---

## 📊 Summary & Comparison Matrix

| # | Question | Current Draft Status | Verified Codebase Fact | Recommended Exact Answer / Option |
|---|---|---|---|---|
| **1** | **Google API Services** | ✅ Correct | Used for Firebase Auth (Google Sign-In) & Google Fonts | **Yes** (Google Sign-In / Firebase Auth & Google Fonts only; No Maps/Drive/Gmail APIs) |
| **2** | **Personal Data Disclose / Sell / Share** | ✅ Correct | Data is disclosed strictly to 3rd-party service providers (Veriff, Trustap, DocuSign, Stripe, Firebase, SMTP); **Zero** selling or ad tracking | **Disclose only** |
| **3** | **AI-Based Services** | ✅ Correct | No AI/LLM models or APIs integrated | **No** |
| **4** | **Data Retention Period** | ✅ Correct | Retained while account active; soft-delete on deactivation; legal/contract/escrow records retained | **As long as the user has an account with us** (or specify retention based on legal/escrow compliance) |
| **5** | **Cookies / Web Beacons / Google Maps** | ✅ Partially Correct | Functional/essential cookies & local storage used; Google Maps is NOT used; Web beacons NOT used | **Cookies and/or web beacons** |
| **6** | **Google Analytics** | ✅ Correct | No Google Analytics or GTM scripts installed | **No** |
| **7** | **User Consent Preferences Update** | ✅ Correct | No in-app consent/cookie preference manager implemented | **No** |
| **8** | **AristoAccess+ Auto-Renewal** | ✅ Correct | Stripe subscription mode with recurring monthly/yearly billing | **Yes, it automatically renews** |
| **9** | **Subscription Cancellation Method** | ✅ Correct | Self-service cancellation button in Account Settings -> Subscription Tab | **Logging into their account** |

---

## 🔍 Detailed Technical Verification (Code Evidence)

### 1. Google API Services
* **Code Evidence:**
  * **Firebase Auth**: `src/lib/firebase.ts` (Frontend) and `src/common/config/firebase/firebase.service.ts` & `src/main/auth/auth.service.ts` (Backend) verify Google ID tokens from `https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com`.
  * **Google Fonts**: `src/app/layout.tsx` imports `Work_Sans` and `Rozha_One` from `next/font/google`.
  * **Google Maps / Drive / Gmail API**: Not implemented anywhere in the project.
* **Verdict:** **Yes**, used for authentication (Google Sign-In) and typography.

---

### 2. Disclose or sell/share users' personal information to third parties?
* **Code Evidence:**
  * **Veriff (`src/main/verif/`)**: Identity verification documents, selfie verification sessions, and user IDs.
  * **Trustap (`src/main/trustap-transaction/`, `src/common/trustap.config.ts`)**: Escrow payment processing, user emails, guest user creation, escrow transaction amounts.
  * **DocuSign (`src/main/docusign_2.0/`)**: Digital contract generation, signer names, signer emails, and signed contract PDFs.
  * **Stripe (`src/main/subscriptions/`)**: Subscription billing for AristoAccess+, customer emails, Stripe customer/subscription IDs.
  * **Firebase / Google (`src/main/auth/`)**: User authentication and profile details (name, email, avatar).
  * **SMTP / Nodemailer (`src/common/config/mail/`)**: Transactional email delivery for OTP verification, password resets, and invoice receipts.
  * **Data Selling / Advertising:** **Zero** ad networks, behavioral trackers (Meta Pixel, Google Ads), or data brokers are connected.
* **Verdict:** Select **Disclose only**. Data is disclosed strictly to authorized third-party service providers/processors to deliver core marketplace, escrow, identity verification, and billing services.

---

### 3. Does your website or app offer AI-based services?
* **Code Evidence:**
  * Search for OpenAI, Gemini, Claude, Anthropic, LangChain, or other AI SDKs returned **0 results**.
* **Verdict:** **No**.

---

### 4. How long will you keep the information collected from users?
* **Code Evidence:**
  * User accounts and transactions are stored indefinitely in PostgreSQL via Prisma.
  * Soft-deletion is used (`isActive: false`, `deletedAt: new Date()` in `src/main/users/users.service.ts`) to maintain legal contract and transaction audit trails.
  * There are no automated purge cron jobs for inactive/idle accounts.
* **Verdict:** **As long as the user has an account with us** (with financial/contractual records retained as required by law for escrow and tax compliance).

---

### 5. Which of the following does your website or app use or plan to use?
* **Options:** *Cookies and/or web beacons*, *Google Maps APIs*, *Both*, *Neither*
* **Code Evidence:**
  * **Cookies:** Used for UI layout state (e.g. `sidebar:state` cookie in `src/components/ui/sidebar.tsx`).
  * **Local Storage:** Used for authentication session state (`auth-storage` in `src/stores/auth/use-auth-store.ts`).
  * **Google Maps API:** Not present.
  * **Web Beacons / Pixels:** Not present.
* **Verdict:** Select **Cookies and/or web beacons** (essential functional cookies and local storage only).

---

### 6. Do you use Google Analytics?
* **Code Evidence:**
  * Complete scan for `gtag`, `GoogleAnalytics`, `@next/third-parties/google`, and `GTM` confirmed no analytics tracker is implemented.
* **Verdict:** **No**.

---

### 7. Can users update their consent preferences through their accounts?
* **Code Evidence:**
  * Account settings (`/sp/settings`, `/client/settings`) contain Profile, Payment Info, Transaction History, Disputes, and Saved Contracts. No cookie/privacy consent management toggles exist.
* **Verdict:** **No**.

---

### 8. Does the subscription to AristoAccess+ automatically renew?
* **Code Evidence:**
  * `src/main/subscriptions/subscriptions.service.ts`:
    * Stripe Checkout session is created in `mode: 'subscription'` with recurring billing.
    * Stripe automatically charges on renewal and triggers the `invoice.payment_succeeded` webhook, extending `currentPeriodEnd`.
    * Cancellation sets `cancel_at_period_end: true`, stopping auto-renewal at the end of the paid cycle.
* **Verdict:** **Yes, it automatically renews** at the end of each billing cycle (monthly/yearly) unless cancelled.

---

### 9. How can users cancel their subscription?
* **Options:** *Logging into their account*, *Contacting customer service*, *Other*
* **Code Evidence:**
  * Frontend (`src/components/shared/subscription-management-tab.tsx`): Users can click "Cancel Subscription" with confirmation modal.
  * Backend (`PATCH /subscriptions/me/:subscriptionId/cancel`): Updates Stripe subscription to `cancel_at_period_end: true`.
* **Verdict:** Select **Logging into their account**.

---

## ✉️ Client Message



Hi Alexis,

Thanks for reaching out! We have conducted a complete technical audit of both our frontend and backend systems to give you exact and verified answers for the Privacy Policy and Terms & Conditions.

Here are the confirmed answers matching our current implementation:

---

### **Privacy Policy**

1. **Do you use Google API Services?**
   * **Answer:** **Yes.**
   * *Details:* We use Google Services exclusively for **Firebase Authentication (Google Sign-In / OAuth)** and Google Web Fonts. We do not use Google Maps, Google Drive, or Gmail API.

2. **Do you disclose or sell/share users' personal information to third parties?**
   * **Selected Option:** **Disclose only**
   * *Details:* We **do not sell** any personal information to third parties or data brokers, nor do we share data for cross-context behavioral advertising. We only **disclose** necessary user data to trusted third-party service providers/processors strictly to operate our platform features:
     * **Veriff:** Identity verification & KYC compliance
     * **Trustap:** Milestone-based escrow payments & transaction handling
     * **DocuSign:** Legally binding contract generation & digital signatures
     * **Stripe:** Subscription billing for AristoAccess+
     * **Firebase (Google):** Secure user authentication & social login
     * **SMTP Email Service:** Transactional notifications (OTP codes, invoice receipts, deal updates)

3. **Does your website or app offer AI-based services?**
   * **Answer:** **No.** The platform does not currently incorporate any AI or machine learning services.

4. **How long will you keep the information that you've collected from your users?**
   * **Selected Option:** **As long as the user has an account with us**
   * *Details:* User data is retained for the lifetime of the user's active account. Completed transaction logs, escrow records, and executed DocuSign contracts are retained as required for legal, accounting, and dispute resolution purposes.

5. **Which of the following does your website or app use or plan to use?**
   * **Selected Option:** **Cookies and/or web beacons**
   * *Details:* We use strictly functional/essential cookies and local storage for maintaining user login sessions and UI preferences. We **do not** use Google Maps API or marketing web beacons.

6. **Do you use Google Analytics?**
   * **Answer:** **No.** Google Analytics is not integrated into the platform.

7. **Can users update their consent preferences through their accounts?**
   * **Answer:** **No.** There is currently no in-app consent/cookie preference management center within user accounts.

---

### **Terms & Conditions**

8. **Does the subscription to AristoAccess+ automatically renew?**
   * **Answer:** **Yes.** Paid subscriptions to AristoAccess+ automatically renew at the end of each billing cycle (monthly or yearly) via recurring Stripe billing until cancelled by the user.

9. **How can users cancel their subscription?**
   * **Selected Option:** **Logging into their account**
   * *Details:* Users can cancel their subscription at any time directly through their Account Settings under the Subscription tab. Once cancelled, they retain access until the end of their current paid billing period without further renewal.

---

Please let us know if you need any additional technical details or clarification!

Best regards,  
**Development Team**

