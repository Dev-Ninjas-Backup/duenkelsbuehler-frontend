# AristoPay System Architecture & Workflow Diagrams

This document visualizes the system architecture, component relationships, and user transaction lifecycles for the AristoPay platform.

---

## 1. High-Level System Architecture

The following block diagram illustrates the component architecture of AristoPay, including the frontend, API gateway, backend server, database, and external third-party integrations (Trustap, Veriff, DocuSign, Firebase).

```mermaid
graph TD
    %% Frontend and Client interactions
    subgraph ClientSpace ["User Space"]
        C[Client / Buyer]
        SP[Service Provider / Seller]
    end

    subgraph FrontendSpace ["Frontend App (Next.js)"]
        FE[Next.js App Server / Client UI]
    end

    subgraph GatewaySpace ["Gateway"]
        Caddy[Caddy Reverse Proxy]
    end

    subgraph BackendSpace ["Backend Services (NestJS)"]
        API[NestJS Core API]
        Seeder[Seeder Service]
        DB[(PostgreSQL Database)]
    end

    subgraph ThirdPartySpace ["Third-Party Integrations"]
        Firebase["Firebase Auth (Identity Provider)"]
        Trustap["Trustap API (Escrow Merchant of Record)"]
        Veriff["Veriff API (KYC / Identity Verification)"]
        DocuSign["DocuSign API (e-Signatures)"]
    end

    %% Routing Flows
    C -->|Interacts| FE
    SP -->|Interacts| FE
    FE -->|HTTP / WebSockets| Caddy
    Caddy -->|Reverse Proxy| API
    
    %% Backend Flows
    API -->|Prisma ORM| DB
    Seeder -->|Seed Defaults| DB
    
    %% External API connections
    API -->|Authenticate| Firebase
    API -->|Escrow & Fees| Trustap
    API -->|Verify KYC| Veriff
    API -->|Sign Contracts| DocuSign
```

---

## 2. User Onboarding & Role Management Flow

Users sign up once and can freely toggle between Client and Service Provider roles. Verification is offloaded to Veriff for premium users.

```mermaid
graph TD
    Start([User Registration]) --> SelectRole[Select Primary Role: Client or Service Provider]
    SelectRole --> Terms[Agree to AristoPay & Trustap Terms]
    Terms --> CreateUser[Create User & Onboard to Trustap]
    CreateUser --> Dashboard[Access Dashboard]
    
    Dashboard --> RoleToggle{Toggle Role?}
    RoleToggle -->|Yes| SwitchRole[Switch Interface State]
    SwitchRole --> Dashboard
    
    Dashboard --> SubCheck{Subscribe to Premium?}
    SubCheck -->|Yes - $29/mo| VeriffVerify[Initiate KYC via Veriff]
    VeriffVerify --> VerifyStatus{Verification Success?}
    VerifyStatus -->|Yes| Badge["Grant Verified Badge (Show Crown)"]
    VerifyStatus -->|No| Warn["Show Warning / Unverified State"]
    
    SubCheck -->|No - Free Tier| FreeLimits["Apply Free Tier Limitations"]
```

---

## 3. End-to-End Escrow Transaction & Contract Lifecycle

This sequence diagram details the transactional steps from contract initialization (DocuSign) to payment holding (Trustap Escrow), delivery, fund release, and feedback submission.

```mermaid
sequenceDiagram
    autonumber
    actor SP as Service Provider (Seller)
    actor CL as Client (Buyer)
    participant API as AristoPay Backend (NestJS)
    participant DS as DocuSign Service
    participant TR as Trustap Escrow Service

    %% Contract Stage
    Note over SP, CL: 1. Negotiation & Contract Stage
    SP->>API: Create Proposal (Check Premium)
    API-->>SP: Verify Premium & Allow Proposal
    SP->>API: Attach Contract Document (DocuSign Envelope)
    API->>DS: Create Signature Envelope
    DS-->>API: Return Signing URLs
    API-->>SP: Present Contract Sign Screen
    API-->>CL: Present Contract Sign Screen
    SP->>DS: Sign Contract
    CL->>DS: Sign Contract
    DS-->>API: Webhook: Contract Signed & Completed

    %% Escrow Stage
    Note over CL, TR: 2. Escrow Payment Stage
    CL->>API: Initiate Checkout
    API->>TR: Retrieve Trustap Fee (Get /p2p/charge)
    TR-->>API: Return Fee Structure (5% + $0.40)
    API-->>CL: Display Total Checkout Price (Min $150 Card / $300 Bank)
    CL->>TR: Submit Escrow Payment (Credit Card / ACH)
    TR-->>API: Webhook: Payment Received (Funds Held in Escrow)
    API-->>SP: Notify: Funds Secured (Safe to Begin Work)

    %% Fulfillment & Release
    Note over SP, CL: 3. Fulfillment & Release Stage
    SP->>CL: Deliver Completed Service/Project
    CL->>API: Confirm Project Delivery & Release Funds
    API->>TR: Request Release of Held Escrow Funds
    TR->>SP: Payout Released Funds (Deducting 5% SP Fee)
    TR-->>API: Webhook: Payout Completed
    API-->>SP: Prompt: Leave Review / Rating for Client
    SP->>API: Submit Client Rating/Review
    API-->>CL: Update Client Rating Record
```

---

## 4. Feature Gating Rules Summary

The backend enforces strict access policies based on the user's subscription state:

```mermaid
graph LR
    subgraph AccessControls ["Backend Authorization Guard"]
        Free["Free Tier Users"]
        Prem["Premium Tier Users ($29/mo)"]
    end

    subgraph ServiceProviderRights ["Service Provider Features"]
        SP_Send[Send Proposals]
        SP_Recv[Receive Proposals]
        SP_Verify[Verified Badge & Veriff]
        SP_Docu[DocuSign Contracts & Storing]
    end

    subgraph ClientRights ["Client Features"]
        CL_Recv[Receive Proposals]
        CL_Send[Send Proposals]
        CL_Filter[Search Filter by Verification]
    end

    %% Connections for SP
    Free -->|Allowed| SP_Send
    Free -->|Blocked| SP_Recv
    Prem -->|Allowed| SP_Recv
    Prem -->|Allowed| SP_Verify
    Prem -->|Allowed| SP_Docu
    
    %% Connections for CL
    Free -->|Allowed| CL_Recv
    Free -->|Blocked| CL_Send
    Prem -->|Allowed| CL_Send
    Prem -->|Allowed| CL_Filter
```
