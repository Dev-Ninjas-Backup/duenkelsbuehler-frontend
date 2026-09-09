# Termly Privacy Policy & Third-Party Disclosure Guide
**Platform:** AristoPay (Duenkelsbuehler Marketplace & Escrow Platform)  
**Document Type:** Technical & Legal Disclosure Reference  
**Audited Components:** Frontend (`duenkelsbuehler-frontend`) & Backend (`duenkelsbuehler-backend`)  
**Date:** September 2026  

---

## 📌 Overview & Executive Summary

This document provides a comprehensive, field-by-field response for the **Termly "Disclosure to Third Parties"** section. Every recommendation is backed by a verified technical audit of the codebase, ensuring full compliance with GDPR, CCPA/CPRA, and relevant data privacy standards.

### Core Data Disclosure Principles for AristoPay:
1. **Zero Data Selling & Zero Targeted Ad Tracking:** AristoPay does **not** sell, rent, or share personal user data with data brokers, ad networks, or behavioral retargeting platforms.
2. **Disclose Strictly for Operational Delivery:** Data is disclosed solely to authorized third-party service providers essential for identity verification (KYC), escrow fund protection, legally binding digital contracts, and subscription billing.

---

## 📋 Field-by-Field Breakdown (Matching Termly Questionnaire Order)

---

### 1. Advertising, Direct Marketing, & Lead Generation
* **Examples in Termly:** *Bing Ads, Chitika, Google AdSense*
* **Selection:** **Leave Blank / None (Not Applicable)**
* **Technical Justification:**
  * No advertising networks, marketing SDKs, or lead generation scripts exist in the codebase.
  * User data is never monetized or exposed to ad exchanges.

---

### 2. Affiliate Marketing Programs
* **Examples in Termly:** *Amazon Affiliation, eBay Partner Network, iTunes Affiliation*
* **Selection:** **Leave Blank / None (Not Applicable)**
* **Technical Justification:**
  * There are no affiliate referral tracking links, cookies, or partner marketing networks integrated into the application.

---

### 3. AI Platforms
* **Examples in Termly:** *OpenAI, Google Cloud AI, Microsoft Azure AI*
* **Selection:** **Leave Blank / None (Not Applicable)**
* **Technical Justification:**
  * The platform currently operates strictly via deterministic business logic and custom APIs.
  * No OpenAI, Anthropic, Claude, Gemini, or external LLM/AI APIs are connected to process user prompts or files.

---

### 4. Allow Users to Connect to Their Third-Party Accounts
* **Examples in Termly:** *Facebook account, Google account, Instagram account*
* **Selection:** 
  * ✅ **Google account**
  * ✅ **Apple account** *(if available in dropdown, or via Firebase)*
* **Technical Justification:**
  * Users can connect and authenticate via their Google or Apple accounts using Firebase Authentication (`src/lib/firebase.ts` & `src/main/auth/auth.service.ts`).
  * Only basic identity claims (Name, Email, Google Profile Picture) are retrieved during authentication to create the user profile.

---

### 5. Cloud Computing Services
* **Examples in Termly:** *Microsoft Azure, Google Cloud Platform, Amazon Web Services (AWS)*
* **Selection:** 
  * ✅ **Google Cloud Platform (Firebase)**
  * *(Optional: Select **Amazon Web Services (AWS)** or your dedicated cloud provider if hosting production servers/databases there)*
* **Technical Justification:**
  * Firebase services are hosted under Google Cloud Platform infrastructure for authentication and token validation.
  * Production databases (PostgreSQL) and backend instances run in secure containerized cloud environments.

---

### 6. Communicate & Chat with Users
* **Examples in Termly:** *Customerly, Facebook Customer Chat, LiveChat*
* **Selection:** **Leave Blank in Dropdown** *(Covered under Custom "SMTP Email Service" and in-app Socket.io)*
* **Technical Justification:**
  * Direct real-time messaging between Clients and Service Providers is handled entirely by the proprietary in-app WebSocket engine (`Socket.io`). Chat logs are stored internally in the PostgreSQL database.
  * No third-party chat widgets (e.g., Zendesk, Intercom, LiveChat) have access to user conversations.

---

### 7. Content Optimization
* **Examples in Termly:** *Google Site Search, TripAdvisor widget, YouTube video embed*
* **Selection:** ✅ **Google Fonts** *(or leave blank if only external widgets are considered)*
* **Technical Justification:**
  * The web app loads typography assets (`Work_Sans`, `Rozha_One`) via Next.js Google Fonts optimization (`src/app/layout.tsx`).
  * No third-party search widgets or embedded external content frames are present.

---

### 8. Data Backup & Security
* **Examples in Termly:** *Dropbox Backup, Google Drive Backup, Vaultpress*
* **Selection:** **Leave Blank / None (Not Applicable)**
* **Technical Justification:**
  * Platform backups and PostgreSQL database snapshots are managed internally at the infrastructure/server level.
  * No consumer cloud storage tools (Dropbox, Google Drive) have access to user data.

---

### 9. Functionality & Infrastructure Optimization
* **Examples in Termly:** *Cloud Firestore, Firebase Legacy, Termly.io*
* **Selection:** 
  * ✅ **Firebase**
  * ✅ **Termly.io** *(for consent and policy delivery)*
* **Technical Justification:**
  * Firebase is utilized for client-side authentication token generation and secure session dispatching.
  * Termly is used to host, embed, and manage privacy terms and compliance banners.

---

### 10. Invoicing & Billing
* **Examples in Termly:** *Apple Pay, PayPal, Stripe*
* **Selection:** 
  * ✅ **Stripe** *(Select from dropdown)*
  * ➕ **Trustap** *(Must be added manually under "Other / Custom Services" below)*
* **Technical Justification:**
  * **Stripe:** Used for recurring subscription billing (`AristoAccess+` plans) via Stripe Checkout sessions and automated recurring webhooks (`src/main/subscriptions/`).
  * **Trustap:** Powers the core milestone escrow payment workflows for project milestones and fund holding (`src/main/trustap-transaction/`).

---

### 11. Retargeting Platforms
* **Examples in Termly:** *AdRoll, Facebook Custom Audience, Google Ads Remarketing*
* **Selection:** **Leave Blank / None (Not Applicable)**
* **Technical Justification:**
  * No retargeting pixels, Facebook Pixels, or Google Remarketing tags are installed.
  * User browsing activity is never tracked across external sites for marketing.

---

### 12. Social Media Sharing & Advertising
* **Examples in Termly:** *Facebook advertising, Google+ social plugins, Reddit plugins*
* **Selection:** **Leave Blank / None (Not Applicable)**
* **Technical Justification:**
  * No social sharing buttons, embedded social widgets, or social network telemetry scripts are embedded in the client or provider dashboard.

---

### 13. User Account Registration & Authentication
* **Examples in Termly:** *Facebook Login, GitHub OAuth, Google Sign-In*
* **Selection:** 
  * ✅ **Google Sign-In**
  * ✅ **Apple Sign-In** *(if listed)*
* **Technical Justification:**
  * Authentication supports Google OAuth and Apple OAuth via Firebase ID Token validation (`src/main/auth/auth.controller.ts`), alongside standard secure email/password OTP verification.

---

### 14. User Commenting & Forums
* **Examples in Termly:** *Disqus, Facebook Comments, Muut*
* **Selection:** **Leave Blank / None (Not Applicable)**
* **Technical Justification:**
  * Project reviews, ratings, and feedback are handled by the platform’s internal proprietary rating system.
  * No public third-party commenting frameworks are integrated.

---

### 15. Web & Mobile Analytics
* **Examples in Termly:** *Crazy Egg, Google Analytics, Heap Analytics*
* **Selection:** **Leave Blank / None (Not Applicable)**
* **Technical Justification:**
  * The codebase contains **zero** analytics trackers (no Google Analytics / gtag.js, Mixpanel, Hotjar, or Heap).
  * If analytics are added in the future, this section can be updated accordingly.

---

### 16. Website Hosting
* **Examples in Termly:** *Shopify, Tumblr, WordPress.com*
* **Selection:** **Leave Blank / Custom Provider** *(e.g. Node.js VPS / Vercel / AWS)*
* **Technical Justification:**
  * AristoPay is a custom full-stack application built with Next.js (frontend) and NestJS (backend), not hosted on templated CMS platforms like Shopify or WordPress.

---

### 17. Website Performance Monitoring
* **Examples in Termly:** *Crashlytics, Firebase Crash Reporting, Sentry*
* **Selection:** **Leave Blank / None (Not Applicable)** *(Select Sentry/Crashlytics only if actively configured in production)*
* **Technical Justification:**
  * Error monitoring is currently logged via internal server loggers (`@nestjs/common` Logger) and Winston/Docker logs without streaming user data to external crash reporting platforms.

---

### 18. Website Testing
* **Examples in Termly:** *Google Play Console, Optimizely, TestFlight*
* **Selection:** **Leave Blank / None (Not Applicable)**
* **Technical Justification:**
  * No A/B testing or live user experimentation tools (Optimizely, VWO) are injected into the client interface.

---

## 🚀 Crucial Custom Services to Add (Under "Other / + Add More")

Because AristoPay is a specialized **Escrow, Contract, and Freelance Marketplace**, several mission-critical third-party integrations do not appear in generic dropdowns. **These must be added using the `+ Add More` fields at the bottom of Termly:**

```
┌───────────────────────────────────────────────────────────────────────────────┐
│                           CUSTOM SERVICES TABLE                               │
└───────────────────────────────────────────────────────────────────────────────┘
```

| # | Purpose Field | Service Name | Exact Reason & Data Disclosed |
|---|---|---|---|
| **1** | **Identity Verification & KYC Compliance** | **Veriff** | • **Why:** To verify identity for Service Providers and Clients to prevent fraud and satisfy anti-money laundering (AML) / KYC standards.<br>• **Data Disclosed:** Government-issued ID documents, facial biometric selfies, legal name, and verification status. |
| **2** | **Escrow Payment Processing & Fund Holding** | **Trustap** | • **Why:** To hold client milestone payments securely in escrow until deliverables are approved.<br>• **Data Disclosed:** User email, guest user identifier, escrow transaction amounts, currency, and milestone release milestones. |
| **3** | **Legally Binding Contracts & Electronic Signatures** | **DocuSign** | • **Why:** To generate, deliver, and digitally execute legal contracts between Clients and Freelancers.<br>• **Data Disclosed:** Signer full names, email addresses, contract terms, digital signature timestamps, and executed contract PDF archives. |
| **4** | **Transactional Email Delivery** | **SMTP / Nodemailer** *(or SendGrid/Mailgun if configured)* | • **Why:** To dispatch essential system emails (OTP verification codes, password resets, deal notifications, and payment receipts).<br>• **Data Disclosed:** User email address, first name, and notification message body. |

---

## 📋 Quick-Action Summary Table for Termly Setup

| Termly Purpose Group | Status / Action | Value to Enter |
|---|---|---|
| Advertising, Direct Marketing | ⛔ Skip | None |
| Affiliate Marketing | ⛔ Skip | None |
| AI Platforms | ⛔ Skip | None |
| Third-Party Account Connections | ✅ Select | **Google account**, **Apple account** |
| Cloud Computing Services | ✅ Select | **Google Cloud Platform (Firebase)** |
| Communicate & Chat | ⛔ Skip (Dropdown) | Handled via internal Socket.io & SMTP |
| Content Optimization | ✅ Select | **Google Fonts** |
| Data Backup & Security | ⛔ Skip | None |
| Functionality & Infrastructure | ✅ Select | **Firebase**, **Termly.io** |
| Invoicing & Billing | ✅ Select & Add | **Stripe** *(Dropdown)* + **Trustap** *(Custom)* |
| Retargeting Platforms | ⛔ Skip | None |
| Social Media Sharing | ⛔ Skip | None |
| User Registration & Auth | ✅ Select | **Google Sign-In**, **Apple Sign-In** |
| User Commenting & Forums | ⛔ Skip | None |
| Web & Mobile Analytics | ⛔ Skip | None |
| Website Hosting | ⛔ Skip / Custom | Custom Next.js / NestJS Cloud VPS |
| Website Performance Monitoring | ⛔ Skip | None |
| Website Testing | ⛔ Skip | None |
| **Custom 1 (+ Add More)** | ➕ **Add Custom** | **Purpose:** Identity Verification & KYC <br>**Service:** `Veriff` |
| **Custom 2 (+ Add More)** | ➕ **Add Custom** | **Purpose:** Escrow Payment Processing <br>**Service:** `Trustap` |
| **Custom 3 (+ Add More)** | ➕ **Add Custom** | **Purpose:** Digital Contracts & Signatures <br>**Service:** `DocuSign` |
| **Custom 4 (+ Add More)** | ➕ **Add Custom** | **Purpose:** Transactional Email Communications <br>**Service:** `SMTP / Nodemailer` |

---

## 🔒 Compliance & Legal Statement

> **Summary Statement for Legal Translator / Legal Counsel:**  
> "AristoPay collects and discloses user information solely to the extent necessary to perform its core marketplace and escrow contract duties. Data is shared with specialized service processors for authentication (Google/Firebase), identity verification (Veriff), escrow payments (Trustap), contract execution (DocuSign), subscription billing (Stripe), and security notifications (SMTP). No personal information is sold, rented, or shared with third-party advertising or analytics networks."
