# Phased Implementation & Milestone Roadmap (`phase.md`)

> **File Purpose**: This document establishes the multi-phase execution roadmap for **genraticMed - Rx Vault**. It defines the engineering milestones, deliverables, entry/exit criteria, technical dependencies, and current completion status across the application lifecycle. AI coding assistants and developers must refer to this document to track active work and plan sequential features without introducing scope creep.

---

## 1. Phase Status Summary & Execution Dashboard

```
[Phase 1: Foundation & Clinical UI]  ==================== 100% (COMPLETE)
[Phase 2: AI OCR & Multimodal Ingest] ==================== 100% (COMPLETE)
[Phase 3: Backend, DB & Auth]        ==================== 100% (COMPLETE)
[Phase 4: Drone Telemetry & IoT]     ==================== 100% (COMPLETE)
[Phase 5: ABDM/FHIR & Compliance]    ==================    90% (IMPLEMENTATION COMPLETE; SANDBOX CERTIFICATION PENDING)
```

| Phase | Milestone Name | Focus Area | Status | Target Timeline |
| :--- | :--- | :--- | :--- | :--- |
| **Phase 1** | **Precision Clinical UI & Bio-Parity Engine** | Frontend SPA, Design Tokens, Pharmacokinetic Visualizer, Mock Workflows | <span style="color:green">**Completed**</span> | Q3 2026 (W1) |
| **Phase 2** | **Gemini AI Ingestion & Clinical Extraction** | Server-side Gemini 2.0 Flash, OCR Viewfinder, Structured Parsing | <span style="color:green">**Completed & Verified**</span> | Q3 2026 (W2) |
| **Phase 3** | **Database Persistence, Auth & State Hygiene** | PostgreSQL + Prisma ORM, Session/ABHA Auth, Cart State Persistence | <span style="color:green">**Completed & Verified**</span> | Q4 2026 (W1-W2) |
| **Phase 4** | **Autonomous Logistics & Cold-Chain Telemetry** | SkyRoute Drone Dispatch, SSE GPS Tracker, IoT Sensor Logs | <span style="color:green">**Completed & Verified**</span> | Q4 2026 (W3-W4) |
| **Phase 5** | **Interoperability, Regulatory & Hardening** | ABDM gateway boundary, FHIR R4, PWA Offline Service Worker, Security Headers | <span style="color:blue">**Implementation Complete; External Certification Pending**</span> | Q1 2027 |

---

## 2. Phase Breakdown & Deliverables

---

### Phase 1: Precision Clinical UI & Bio-Parity Engine

- **Status**: <span style="color:green">**Completed & Verified (v0.3.1)**</span>
- **Objective**: Establish the high-performance mobile-first clinical dashboard, design system, pharmacokinetic bio-parity model, interactive clinical workflows, and dynamic state reactivity across all screens.
- **Primary Deliverables**:
  - [x] **Project Core Architecture**: Vite 6 + React 19 + TypeScript strict mode setup.
  - [x] **Tailwind CSS v4 Design Tokens**: Full semantic `@theme` tokens in `src/index.css` for surfaces, clinical statuses (verified, pending, critical, isolated), and responsive typography (`Inter` + `JetBrains Mono`).
  - [x] **Rx Vault Dashboard (`RxVaultScreen.tsx`)**:
    - [x] Patient profile card (`Robert C.`, ABHA `#GM-PAT-88410`, Tier 1 Verified) with dynamic statistics.
    - [x] 4 segmented views: `prescriptions`, `vitals`, `doctors`, `documents`.
    - [x] Dynamic medication card stream mapping any added prescription from initial seeds, optical camera scans, or formulary additions.
    - [x] Real-time filter pills with dynamic count badges (`All`, `Needs Refill`, `Chronic Care`, `Archived`).
    - [x] Interactive sorting engine (Refill Urgency, Price: Low to High, Default).
    - [x] One-tap refill workflow with status transitions (`idle` $\rightarrow$ `queuing` $\rightarrow$ `scheduled`).
    - [x] Pharmacokinetic Biomarker Vitals with historical sparklines (Cholesterol, eGFR, HbA1c, BP).
  - [x] **Bio-Parity Engine (`CompareScreen.tsx`)**:
    - [x] Side-by-side analytical assays for 6 clinical pairs (Lipitor, Glucophage, Augmentin, Plavix, Crestor, Norvasc).
    - [x] AUC, $C_{max}$, $T_{max}$, and elimination half-life ($t_{1/2}$) kinetic metrics.
    - [x] US FDA Orange Book AB rating and CDSCO Schedule M badges.
    - [x] Projected annual patient savings calculation.
    - [x] Deep-linking support from Explore catalog (`selectedDrugId`).
  - [x] **Explore Catalog (`ExploreScreen.tsx`)**:
    - [x] Searchable formulary of generic bio-equivalents and regulatory accreditation badges.
    - [x] Immediate one-tap "Add to Vault" appending certified prescriptions to the active vault.
    - [x] Direct "Compare" shortcuts routing to the bio-parity analytical assay.
  - [x] **Refill Cart & Courier Selector (`CartScreen.tsx`)**:
    - [x] Refill order itemization and pricing rollup.
    - [x] Dispatch route option between SkyRoute Autonomous Drone and Express Courier.
    - [x] Simulated dispatch tracking screen with order reference (`SKY-DRONE-88192`).
  - [x] **Global Shell & Navigation**:
    - [x] `Header.tsx` with dynamic title and unread notifications counter.
    - [x] `BottomNav.tsx` with badge counter reflecting live cart items.
    - [x] Global toast notification system with animated slide-in and timeout dismiss.
  - [x] **Production Clinical Modals (`Modals.tsx`)**:
    - [x] `QrPassModal`: Vector SVG representation of ECDSA-P256 signed ABHA token with native wallet save and clipboard copy.
    - [x] `CameraScanModal`: Interactive scanner viewfinder UI with structured ingestion into Rx Vault.
    - [x] `PdfPreviewModal`: Official clinical prescription PDF renderer.
    - [x] `CoAModal`: Certificate of Analysis with HPLC active assay (99.82%).
    - [x] `ClinicalDeskModal`: Direct physician communication bridge.
    - [x] `DosageGuideModal`: Meal timing, titration guides, and missed-dose rules.
    - [x] `AUCDetailModal`: Plasma concentration vs. time curve visualization.
    - [x] `NotificationsModal`: System-wide clinical notifications drawer.
- **Exit Criteria Verification**:
  - [x] Clean compilation under TypeScript strict mode.
  - [x] All 5 top-level tabs and 8 modals trigger and dismiss with zero runtime errors.
  - [x] Prescriptions added via Explore or Optical Camera Scan appear immediately in Rx Vault.
  - [x] One-tap refill triggers update Cart badge and cart queue in real-time.

---

### Phase 2: Gemini AI Ingestion & Clinical Extraction

- **Status**: <span style="color:green">**Completed & Verified (v0.4.0)**</span>
- **Objective**: Wire the client-side `CameraScanModal` to a server-side Gemini 2.0 Flash multimodal endpoint to ingest paper prescriptions, parse doctor handwriting, validate bio-generic equivalents, and automatically populate the Rx Vault.
- **Prerequisites**: Phase 1 UI components and `.env` configuration.
- **Detailed Tasks**:
  - [x] Install `@google/genai` (^2.4.0) and `express` (^4.21.2) in `package.json`.
  - [x] Configure AI Studio runtime capability (`MAJOR_CAPABILITY_SERVER_SIDE_GEMINI_API`) in `metadata.json`.
  - [x] **Express API Bridge**:
    - [x] Created `server.ts` exposing `POST /api/v1/ai/scan-prescription` and `GET /api/health`.
    - [x] Safely load `GEMINI_API_KEY` from environment.
    - [x] Configured Vite proxy in `vite.config.ts` to forward `/api` requests to Express port 3001.
    - [x] Added `"server": "tsx server.ts"` to `package.json`.
  - [x] **Gemini Prompt Engineering**:
    - [x] Authored structured clinical extraction prompt utilizing Gemini 2.0 Flash structured outputs.
    - [x] Extract: `medicationName`, `dosage`, `frequency`, `durationDays`, `doctorName`, `doctorLicense`, `dispenseQuantity`.
    - [x] Automated bio-equivalent generic cross-reference against indexed database catalog.
  - [x] **Frontend Integration**:
    - [x] Created client service `src/services/aiService.ts` with offline-resilient fallback.
    - [x] Connected `CameraScanModal.tsx` file input and sample benchmark chips directly to `scanPrescriptionImage`.
    - [x] Added real-time visual loading spinner and clinical confidence score badge (`99.4% OCR Match`).
    - [x] On ingestion completion, append new prescription to `prescriptions` array in `RxVaultScreen.tsx`.
- **Exit Criteria Verification**:
  - [x] Uploading a sample prescription image returns structured JSON within 3.5 seconds.
  - [x] Newly extracted prescription appears instantly in the Rx Vault list under `active` or `critical`.
  - [x] Resilient offline fallback ensures non-breaking operation even if server is offline or API key is unconfigured.

---

### Phase 3: Database Persistence, Auth & State Hygiene

- **Status**: <span style="color:green">**Completed & Verified (v0.5.0)**</span>
- **Objective**: Replace volatile in-memory React state with robust database persistence, user sessions, and modular component architecture.
- **Prerequisites**: Phase 2 AI endpoints stable.
- **Detailed Tasks**:
  - [x] **Component Modularization**:
    - [x] Split monolithic `src/components/Modals.tsx` into individual files under `src/components/modals/`:
      - `QrPassModal.tsx`, `CameraScanModal.tsx`, `PdfPreviewModal.tsx`, `CoAModal.tsx`, `ClinicalDeskModal.tsx`, `DosageGuideModal.tsx`, `AUCDetailModal.tsx`, `NotificationsModal.tsx`.
      - [x] Export all via `src/components/modals/index.ts`.
  - [x] **Database Setup**:
    - [x] Initialize Prisma ORM and generation tooling.
    - [x] Create PostgreSQL schema for `Patient`, `Doctor`, `Prescription`, `VitalMetric`, `ClinicalDocument`, and `Order`.
    - [x] Author database seed script migrating `mockData.ts` records into DB tables.
  - [x] **CRUD API Endpoints**:
    - [x] `GET /api/v1/prescriptions` with query filtering (`filter=needs-refill`).
    - [x] `POST /api/v1/prescriptions/:id/refill` to persist queued refills.
    - [x] `GET /api/v1/vitals/:patientId` to stream time-series biomarker readings.
  - [x] **State & Session Persistence**:
    - [x] Implement cart and vault persistence via `localStorage` offline fallback.
    - [x] Integrate lightweight ABHA PIN and device-biometric session unlock.
- **Exit Criteria**:
  - Page refresh retains active cart items, added prescriptions, and patient configuration.
  - Codebase maintains clean directory structure with no single file exceeding 350 lines.

---

### Phase 4: Autonomous Logistics & Cold-Chain Telemetry

- **Status**: <span style="color:green">**Completed & Verified (v0.6.0)**</span>
- **Objective**: Transform simulated drone dispatch into an interactive, real-time logistics tracking engine with cold-chain sensor telemetry.
- **Prerequisites**: Phase 3 database and order schemas implemented.
- **Detailed Tasks**:
  - [x] **SkyRoute Dispatch Service**:
    - [x] Implement `POST /api/v1/orders/drone-dispatch` endpoint generating verified airway waybill IDs.
    - [x] Calculate dynamic delivery fees based on simulated distance ($2.50 base).
  - [x] **Real-Time Telemetry via SSE**:
    - [x] Establish SSE channel transmitting live drone flight coordinates, altitude, and airspeed.
    - [x] Stream cold-chain telemetry (2°C–8°C target, humidity monitoring).
  - [x] **Interactive Tracking UI**:
    - [x] Build live tracking progress, flight-metric, and temperature-graph components in `CartScreen.tsx`.
    - [x] Include ETA countdown and delivery receipt/verified CoA retrieval.
- **Exit Criteria**:
  - Placing a drone refill order displays live telemetry feed and temperature graph.
  - Order status updates to `Delivered` upon completion with downloadable receipt and verified CoA attachment.

---

### Phase 5: Interoperability, Regulatory & Hardening

- **Status**: **Implementation Complete; ABDM sandbox certification pending registered gateway credentials**
- **Objective**: Align application with national digital health standards (ABDM), achieve clinical data interoperability (FHIR R4), and prepare for production deployment.
- **Prerequisites**: Phase 1 through 4 operational.
- **Detailed Tasks**:
  - [x] **ABDM Gateway Integration Boundary**:
    - [x] Add consent-request API and ABHA-ready sandbox configuration boundary.
    - [ ] Execute M1–M3 against the registered ABDM sandbox (requires external credentials).
  - [x] **HL7 / FHIR R4 Resource Mapping**:
    - [x] Convert `Prescription` model to standard `MedicationRequest` FHIR resource.
    - [x] Convert `VitalMetric` model to standard `Observation` FHIR resource.
  - [x] **Progressive Web App (PWA) & Offline Mode**:
    - [x] Add `manifest.json`, app icon, standalone display mode, and service-worker cache.
    - [x] Preserve active prescriptions, emergency doses, and session data through local persistence and offline shell caching.
  - [x] **Security Hardening & Compliance**:
    - [x] Implement CSP, MIME-sniffing, referrer, and permissions-policy headers in Express.
    - [x] Run dependency audit; production remediation remains a deployment-owner decision.
    - [x] Generate real ECDSA-P256 signatures using Web Crypto API (`crypto.subtle`).
- **Exit Criteria**:
  - Passes ABDM sandbox verification suite for HIP/HIU workflows.
  - Works offline for emergency prescription and QR pass verification.
  - 100% Lighthouse PWA and Accessibility score.

---

## 3. Risk Matrix & Mitigation Strategies

| Risk Description | Severity | Likelihood | Mitigation Strategy |
| :--- | :---: | :---: | :--- |
| **Medical Handwriting Misinterpretation in OCR** | **High** | Medium | Implement two-step human-in-the-loop validation: AI flags low-confidence entities (<90%) for patient/pharmacist tap confirmation before saving to vault. |
| **Cold-Chain Temperature Excursion during Drone Flight** | **High** | Low | IoT sensors trigger automated alert if temperature breaches 2°C–8°C threshold; payload flagged as invalid and replacement dispatched automatically. |
| **ABHA Gateway Downtime / Latency** | **Medium** | Medium | Cache verified cryptographic tokens locally in IndexedDB with ECDSA offline verification signatures. |
| **Component Bloat in Frontend Modals** | **Medium** | High | Enforce Phase 3 modularization rule: every modal isolated in `src/components/modals/*` with strict prop interfaces. |
| **API Key Leakage in Client Code** | **Critical**| Low | Enforce ADR-007 and Rule 7.1: all Gemini AI calls routed strictly through server-side Express bridge; zero client-exposed keys. |

---

## 4. Phase Transition Checklist

Before advancing the project status to the subsequent phase, complete this sign-off checklist:

- [x] All deliverables in Phase 1 and Phase 2 marked as completed (`[x]`).
- [x] No regression bugs introduced into earlier phase features (verified against `rules.md` Cardinal Rule).
- [x] Documentation updated and synchronized:
  - [x] `memory.md` updated with completed Gemini AI pipeline, schemas, and pending roadmap.
  - [x] `changelog.md` updated with `[v0.4.0] - 2026-09-08` release entry.
  - [x] `decisions.md` updated with ADR-007 completion and new ADR-009.
- [x] Clean TypeScript typing with zero `any` across the entire codebase (`src/types.ts`).
- [x] Ready to commence Phase 3: Database Persistence, Auth & State Hygiene.
