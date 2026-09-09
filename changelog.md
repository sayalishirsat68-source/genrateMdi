# Changelog

All notable changes to the **genraticMed - Rx Vault** project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [v0.7.0] - 2026-09-08

### Added
- FHIR R4 `MedicationRequest` and `Observation` endpoints, plus ABDM consent-request boundary.
- PWA manifest, offline service worker, and app icon.
- ECDSA-P256 Web Crypto signing for ABHA health tokens and hardened Express security headers.

---

## [v0.6.0] - 2026-09-08

### Added
- SkyRoute drone-dispatch API with dynamic distance pricing and verified waybills.
- Server-Sent Event flight telemetry, cold-chain monitoring, delivery completion, and verified CoA receipt retrieval.
- Live dispatch tracker and temperature graph in the refill cart.

---

## [v0.5.0] - 2026-09-08

### Added
- Database migration scripts for Prisma ORM with PostgreSQL persistence (Phase 3).
- Component modularization of `src/components/Modals.tsx` into individual files inside `src/components/modals/` (Phase 3).
- ABHA PIN session unlock with device-biometric capability detection (Phase 3).

### Changed
- Client-side cart state persistence using `localStorage` to retain refill items across page reloads (Phase 3).

---

## [v0.4.0] - 2026-09-08

### Added
- **Gemini 2.0 Flash Multimodal OCR API Server** (`server.ts`):
  - Express backend server hosting `POST /api/v1/ai/scan-prescription` and `GET /api/health`.
  - Multimodal prompt engineering utilizing `@google/genai` to extract active pharmaceutical ingredients (API), brand names, dosage form, prescriber details, and CDSCO/FDA bio-parity equivalents.
  - Resilient high-fidelity clinical formulary database fallback ensuring zero downtime even without an active `GEMINI_API_KEY`.
- **Client-Side AI Prescription Ingestion Service** (`src/services/aiService.ts`):
  - Connects client components to the server OCR endpoint with auto-fallback to local formulary heuristics.
  - Pre-packaged benchmark clinical sample presets (Lipitor, Glucophage XR, Augmentin, Plavix).
- **Interactive Bio-Parity Optical Viewfinder** (`CameraScanModal` in `src/components/Modals.tsx`):
  - Viewfinder with live scanning animation, photo upload (`input[type=file]`), and quick sample buttons.
  - Multi-stage progress indicators ("Scanning Document Optical Borders...", "Multimodal Gemini Ingestion Active...", "Validating Bio-Equivalence Parity...").
  - Rich analytical result display with CDSCO / US FDA Orange Book verification badges, active salt match, and direct savings calculations.
- **Top-Level Reactive Vault Ingestion** in `App.tsx`:
  - `handleScanComplete` dynamically creates certified `Prescription` records and prepends them to the Rx Vault.
  - Auto-switches view to `rx-vault` tab upon ingestion with real-time toast confirmation.
- **Vite API Reverse Proxy** in `vite.config.ts`:
  - Forwards all `/api/*` network requests directly to the Express backend on port 3001 while preserving AI Studio HMR settings.
- **Strict TypeScript Typing**:
  - Defined `ExtractedPrescriptionData` domain interface in `src/types.ts`.
  - Eliminated all `: any` occurrences across the entire codebase.

---

## [v0.3.1] - 2026-09-08

### Added
- **Dynamic Prescription Pipeline** in `App.tsx` and `RxVaultScreen.tsx`:
  - Elevated `prescriptions` array state to top-level `App.tsx` with dynamic appending from camera scan and formulary explore.
  - Interactive sorting engine in `RxVaultScreen.tsx` supporting Refill Urgency, Price: Low to High, and Default sort orders.
  - Dynamic count badges on all filter pills (`All`, `Needs Refill`, `Chronic Care`, `Archived`) updating instantaneously on prescription additions or status transitions.
- **Full Pharmacokinetic Bio-Parity Expansion** in `CompareScreen.tsx`:
  - Added full analytical assays for all 6 catalog medications (Lipitor, Glucophage, Augmentin, Plavix, Crestor, Norvasc).
  - Deep-link support enabling Explore catalog's "Compare" button to automatically activate the matching drug pair.
- **Native Non-Blocking Mobile UX**:
  - Replaced browser `alert()` dialogs in `QrPassModal` and `ExploreScreen.tsx` with inline state feedback and native-feel copy confirmations.

### Fixed
- Fixed courier option label typo in `CartScreen.tsx` ("Courier Courier" $\rightarrow$ "Express Courier").
- Fixed hardcoded prescription card limiter in `RxVaultScreen.tsx`, enabling seamless rendering of all newly scanned and formulary-added prescriptions.

---

## [v0.3.0] - 2026-09-08

### Added
- **AI Persistent Context Suite**:
  - `decisions.md`: Architecture & Product Decision Records (ADR-001 through ADR-008).
  - `rules.md`: Non-negotiable AI coding assistant standards, UI/UX consistency, git commit rules, and regression prevention rules.
  - `memory.md`: Long-term project memory including domain models, schemas, API specifications, and roadmap.
  - `changelog.md`: Chronological history of project changes following Keep a Changelog.
- **Eight Interactive Clinical Modals** (`Modals.tsx`):
  - `QrPassModal`: Vector SVG rendering of ECDSA-P256 signed ABHA Digital Health Pass.
  - `CameraScanModal`: Interactive scanner viewfinder with simulated edge detection and OCR extraction.
  - `PdfPreviewModal`: Official physician prescription viewer with digital signature verification.
  - `CoAModal`: Certificate of Analysis viewer with HPLC purity assay (99.82%) and dissolution metrics.
  - `ClinicalDeskModal`: Direct secure communication channel with primary care doctors.
  - `DosageGuideModal`: Meal timing, titration guides, and missed-dose clinical guidelines.
  - `AUCDetailModal`: Bioequivalence curves comparing Innovator vs Generic plasma concentration over time.
  - `NotificationsModal`: Notification center with category-based filtering.
- **Autonomous Drone Dispatch Flow** in `CartScreen.tsx`:
  - Instant dispatch option with live status progression (`idle` $\rightarrow$ `queuing` $\rightarrow$ `scheduled`).
  - Cold-chain authenticated tracking ID generation (`SKY-DRONE-88192`) with 45-minute delivery window.

### Changed
- Enhanced `RxVaultScreen.tsx` with one-tap refill workflow updating the global cart badge.
- Updated `ExploreScreen.tsx` to link generic alternatives directly into the bio-parity comparison engine.
- Re-aligned bottom navigation bar to provide seamless tactile tab switching with cart badge counter.

### Fixed
- Fixed mobile safe-area spacing clipping on devices with bottom gesture indicators by enforcing `pb-24` and `pb-safe`.
- Corrected status badge contrast in `ProfileScreen.tsx` to conform with WCAG 2.1 AAA standards.

---

## [v0.2.0] - 2026-09-05

### Added
- **Pharmacokinetic Bio-Parity Engine** (`CompareScreen.tsx`):
  - Head-to-head comparison for Statin (Lipitor vs Atorvastatin), Metformin, and Antibiotics.
  - AUC, $C_{max}$, $T_{max}$, and half-life kinetic metrics.
  - FDA Orange Book AB rating and CDSCO Schedule M compliance indicators.
- **Biomarker Vitals Tracking**:
  - Total Cholesterol, eGFR (renal clearance), HbA1c, and Blood Pressure with 6-point trend sparklines.
- **Prescription Urgency Filters**:
  - Filter chips for `All`, `Needs Refill` (critical stock depletion), `Chronic`, and `Archived`.
- **Linked Care Team Directory**:
  - Profile cards for Dr. A. K. Verma (Cardiologist) and Dr. S. K. Mahapatra (Internal Medicine).
- **Cryptographic Document Dossiers**:
  - SHA-256 integrity verification hashes for clinical PDFs and lab releases.

### Changed
- Refactored `src/types.ts` to include strict domain models for `Prescription`, `Doctor`, `ClinicalDocument`, `VitalMetric`, and `CartItem`.
- Reorganized `mockData.ts` to reflect realistic clinical test patients (`Robert C.`, ABHA `#GM-PAT-88410`).

### Fixed
- Fixed layout horizontal overflow on narrow mobile screens by wrapping metric cards in fluid flex containers.

---

## [v0.1.0] - 2026-09-01

### Added
- Initial project scaffolding using **Vite 6** and **React 19** with strict TypeScript configuration.
- Custom clinical design system in `src/index.css` via **Tailwind CSS v4** `@theme` token definitions:
  - Clinical surface tokens (`--color-surface`, `--color-surface-card`, `--color-surface-canvas`).
  - Status indicators (`--color-status-verified`, `--color-status-critical`, `--color-status-pending`).
  - Spacing scales (`--spacing-space-xs` through `--spacing-space-3xl`).
- Typography system integrating Google Fonts `Inter` (UI copy) and `JetBrains Mono` (technical codes).
- Google Material Symbols Outlined font integration in `index.html`.
- Core application frame with sticky `Header.tsx` and mobile-first `BottomNav.tsx`.

### Removed
- Removed boilerplate template files from initial React/Vite seed.
