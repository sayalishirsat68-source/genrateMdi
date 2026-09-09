# Project Memory & Long-Term Context

> **File Purpose**: This document serves as the persistent memory store for **genraticMed - Rx Vault**. It captures the architectural state, completed features, domain models, business logic, API contracts, schema structures, known limitations, and future roadmap. Any AI assistant should consult this document to understand the codebase context instantly.

---

## 1. Project Overview

- **Application Name**: `genraticMed - Rx Vault`
- **Application Tagline**: Clinical operations precision portal for bio-generic prescription tracking, pharmacokinetic parity validation, and real-time refills.
- **Core Problem Solved**:
  Patients and caregivers often pay up to 10× more for branded pharmaceutical drugs ("innovator brands") due to lack of transparent clinical data regarding generic bio-equivalence. Furthermore, chronic patients regularly risk health crises due to delayed refill schedules.
- **Solution Delivered**:
  A mobile-first precision clinical web application that:
  1. Houses verified active, chronic, and completed e-prescriptions in a tamper-evident digital vault.
  2. Empirically validates generic medication efficacy through head-to-head pharmacokinetic assays (AUC, $C_{max}$, $T_{max}$, Half-life) and regulatory ratings (US FDA Orange Book AB rating, CDSCO Schedule M).
  3. Tracks real-time patient biomarker vitals (Cholesterol, eGFR, HbA1c, Blood Pressure) proving therapeutic generic efficacy.
  4. Provides a high-urgency one-tap refill workflow with simulated autonomous SkyRoute Drone courier dispatch (< 45 min delivery).
  5. Issues cryptographically verifiable ABHA (Ayushman Bharat Digital Mission) health tokens and tamper-evident SHA-256 Certificates of Analysis (CoA).

---

## 2. Tech Stack

| Layer | Technology | Version | Purpose |
| :--- | :--- | :--- | :--- |
| **Runtime / Tooling** | Node.js / Vite | Vite 6.2.3 | Development server and build bundler |
| **Language** | TypeScript | ~5.8.2 | Strict type safety and domain modeling |
| **Core Framework** | React | 19.0.1 | Modern concurrent UI component rendering |
| **DOM Renderer** | React DOM | 19.0.1 | Client-side DOM tree management |
| **Styling** | Tailwind CSS | 4.1.14 | Utility styling via `@tailwindcss/vite` & `@theme` tokens |
| **Animation Engine** | Motion | 12.23.24 | Smooth transitions, physics, and modals |
| **Iconography** | Material Symbols + Lucide | Variable / 0.546 | Medical ligatures & system UI glyphs |
| **AI Integration** | `@google/genai` | ^2.4.0 | Server-side Gemini API multimodal prescription OCR |
| **Server Framework** | Express | ^4.21.2 | Backend API bridge & AI Studio proxy |
| **Configuration** | Dotenv / TSX | ^17.2.3 / ^4.21.0 | Environment management and TypeScript execution |

---

## 3. Features Completed

### 3.1 Top Header & Global Shell (`Header.tsx`, `App.tsx`)
- [x] Dynamic screen title and clinical status indicators based on active tab.
- [x] Unread notifications bell with badge indicator and modal launcher.
- [x] Global toast notification system with animated slide-in and timeout dismiss.

### 3.2 Rx Vault Screen (`RxVaultScreen.tsx`)
- [x] **Patient Profile Tile**: Demographic summary (`Robert C.`, 62M, ABHA `#GM-PAT-88410`, Tier 1 Verified) with quick stats (Active Rx: 3, YTD Saved: $324, Doctors: 2, Refill Due: 4 Days).
- [x] **Sub-Segment Navigation**: Seamless switching across 4 clinical segments:
  1. `prescriptions`: Medication list with urgency filters (`all`, `needs-refill`, `chronic`, `archived`).
  2. `vitals`: Pharmacokinetic biomarkers with historical trend sparklines.
  3. `doctors`: Linked primary care physicians and specialist credentials.
  4. `documents`: Cryptographic records with SHA-256 checksums and PDF viewers.
- [x] **Prescription Cards**:
  - Pill thumbnail with manufacturer and dosage breakdown.
  - Urgency indicators (e.g., "Refill Critical • 4 Days Left" with red alert banner).
  - Pharmacokinetic parity badge (e.g., "99.4% AUC Match to Lipitor").
  - Cost comparison ($4.20 direct generic vs $48.00 innovator price).
  - One-tap refill button with animated state transitions (`idle` $\rightarrow$ `queuing` $\rightarrow$ `scheduled`).
  - Contextual modal triggers (CoA, Dosage Protocol, Bio-Parity Curves, Clinical PDF).

### 3.3 Explore Screen (`ExploreScreen.tsx`)
- [x] Searchable catalog of popular brand-name medications and their validated bio-equivalent generics.
- [x] Regulatory approval badges (US FDA, CDSCO, EMA, WHO-GMP, PMDA).
- [x] Immediate price delta and percentage savings display (89%–92% savings).
- [x] Direct shortcuts to "Compare Parity" and "Link to Clinical Review Queue".

### 3.4 Compare Screen (`CompareScreen.tsx`)
- [x] Head-to-head pharmacokinetic comparison matrix for 6 drug pairs:
  - *Statin*: Lipitor (Pfizer) vs. Atorvastatin Calcium (Cipla)
  - *Metformin*: Glucophage XR (Bristol Myers) vs. Metformin HCl ER (Zydus Cadila)
  - *Antibiotic*: Augmentin 625 (GSK) vs. Moxikind-CV 625 (Mankind)
  - *Antiplatelet*: Plavix (Bristol Myers) vs. Clopidogrel Bisulfate (Sun Pharma)
  - *Statin (High Potency)*: Crestor (AstraZeneca) vs. Rosuvastatin Calcium (Cipla)
  - *Antihypertensive*: Norvasc (Pfizer) vs. Amlodipine Besylate (Lupin)
- [x] Pharmacokinetic metrics: AUC Match, $C_{max}$ Match, $T_{max}$ absorption window, elimination half-life ($t_{1/2}$).
- [x] Regulatory bio-equivalence rating badges (FDA Orange Book AB rating, CDSCO Schedule M).
- [x] Annualized patient savings calculation ($462.00 to $1,010.40 saved annually).
- [x] Deep-linking integration from Explore catalog (`selectedDrugId`).

### 3.5 Cart & Dispatch Screen (`CartScreen.tsx`)
- [x] Itemized queue of scheduled generic refills with dosages and individual price tags.
- [x] Delivery method selector:
  - **Autonomous SkyRoute Drone Courier** ($2.50 fee, < 45 min ETA, authenticated cold-chain tracking).
  - **Standard Express Courier** ($0.00 fee, 1-2 business days).
- [x] Real-time savings tally showing patient savings over innovator pricing.
- [x] Order placement flow with confirmation screen, tracking ID (`SKY-DRONE-88192`), and landing pad destination.

### 3.6 Profile & ABHA Identity (`ProfileScreen.tsx`)
- [x] Patient credentials with verified badge and cryptographic ABHA ID.
- [x] Parity financial impact metrics (2026 YTD Saved: $324; Lifetime: $1,480 across 18 refills).
- [x] Quick actions: View Cryptographic Health Token, Clinical Care Team desk, Emergency Allergy profile.

### 3.7 Interactive Modals (`Modals.tsx`)
- [x] `QrPassModal`: Vector SVG QR code encoding ECDSA-P256 signed ABHA token for pharmacy point-of-sale scanning.
- [x] `CameraScanModal`: Interactive prescription scanning viewfinder with simulated OCR edge detection and auto-ingest.
- [x] `PdfPreviewModal`: Clinical PDF viewer mock with doctor signature, license number, and rx line items.
- [x] `CoAModal`: Certificate of Analysis viewer with HPLC purity assay (99.82%), dissolution rate, heavy metal checks, and QA sign-off.
- [x] `ClinicalDeskModal`: Direct encrypted messaging channel to consulting physicians.
- [x] `DosageGuideModal`: Meal timing, titration instructions, missed-dose protocol, and cautionary drug-food interactions.
- [x] `AUCDetailModal`: In-depth bioequivalence curve visualization (Innovator vs Generic plasma concentration vs time).
- [x] `NotificationsModal`: Notification center with category filters (Refills, Parity Updates, Security).

### 3.8 Gemini Multimodal AI Ingestion & Optical Scanner (`server.ts`, `aiService.ts`, `CameraScanModal`)
- [x] **Express AI Bridge (`server.ts`)**:
  - `POST /api/v1/ai/scan-prescription`: Ingests high-resolution base64 prescription images.
  - Integration with `@google/genai` (Gemini 2.0 Flash) with structured JSON clinical output.
  - Zero-downtime offline clinical formulary fallback engine.
  - `GET /api/health`: Live health and Gemini configuration status check.
- [x] **Client AI Service (`src/services/aiService.ts`)**:
  - Auto-negotiating client bridge connecting to `/api/v1/ai/scan-prescription` with seamless local formulary heuristic fallback.
  - Preloaded benchmark presets: Lipitor, Glucophage XR, Augmentin, Plavix.
- [x] **Interactive Optical Viewfinder (`CameraScanModal`)**:
  - Realistic camera scanning reticle with laser animation.
  - Direct file upload (`image/*`, `application/pdf`) and camera capture.
  - Multi-stage diagnostic progress animations.
  - CDSCO & US FDA Orange Book bio-equivalence validation summary.
- [x] **Reactive Vault Append Pipeline (`App.tsx`)**:
  - `handleScanComplete` converts AI-extracted entities into typed `Prescription` objects with calculated price variance and dosage instructions.
  - Direct navigation to `rx-vault` with animated toast confirmation.

---

## 4. Pending Features (Phase 4 & Beyond)

| Feature | Target Layer | Description | Priority |
| :--- | :--- | :--- | :--- |
| **Production Database Connection** | Backend / DB | Apply the Prisma PostgreSQL migration and set `DATABASE_URL` in deployment. | High (Deployment) |
| **ABHA OAuth 2.0** | Auth | Replace the local PIN/demo biometric gate with gateway-backed ABHA authentication. | Medium (Future) |
| **Drone Telemetry WebSockets**| Fullstack | Render live vector radar with GPS route of autonomous drone delivery to patient landing pad | Medium (Phase 4) |
| **Payment Gateway** | Client / Server | Integrate Stripe / Razorpay checkout for prescription copayments and drone fees | Medium (Phase 4) |
| **FHIR / ABDM Gateway** | Integration | Connect with official NDHM/ABDM sandbox endpoints for clinical document exchange | Low (Phase 5) |

---

## 5. API Endpoints Specification

### 5.1 Client & Mock Endpoints

Currently, data operations interact with `src/data/mockData.ts`. The planned Express API bridge implements the following REST endpoints:

```
# Prescriptions
GET    /api/v1/prescriptions               # Retrieve patient prescriptions (supports ?filter=critical)
GET    /api/v1/prescriptions/:id           # Retrieve single prescription details
POST   /api/v1/prescriptions               # Ingest a new prescription (from OCR)
POST   /api/v1/prescriptions/:id/refill    # Queue a one-tap refill

# Pharmacokinetic Bio-Parity
GET    /api/v1/parity                      # List catalog parity pairs
GET    /api/v1/parity/:pairId              # Get detailed assay comparison (AUC, Cmax, Tmax)

# Clinical Documents & Verification
GET    /api/v1/documents                   # List clinical documents and dossiers
GET    /api/v1/documents/:id/verify        # Verify SHA-256 checksum against blockchain/registry
GET    /api/v1/coa/:batchNumber            # Retrieve Certificate of Analysis for a drug batch

# Logistics & Orders
POST   /api/v1/orders                      # Create a refill dispatch order
GET    /api/v1/orders/:id/drone-telemetry  # Get live drone flight coordinates and temperature

# AI Ingestion
POST   /api/v1/ai/scan-prescription        # Send image buffer to Gemini 2.0 Flash for structured extraction
```

---

## 6. Database Schema Summary (Relational Design)

The project domain maps to the following Prisma/SQL schema:

```prisma
model Patient {
  id              String          @id @default(cuid())
  name            String
  tier            String          @default("Tier 1 Verified")
  age             Int
  gender          String
  abhaId          String          @unique
  avatarUrl       String?
  ytdSaved        Decimal         @default(0.00)
  createdAt       DateTime        @default(now())
  prescriptions   Prescription[]
  vitalMetrics    VitalMetric[]
  orders          Order[]
}

model Doctor {
  id              String          @id @default(cuid())
  name            String
  specialty       String
  hospital        String
  licenseNumber   String          @unique
  phone           String
  avatar          String?
  prescriptions   Prescription[]
}

model Prescription {
  id                  String          @id @default(cuid())
  patientId           String
  patient             Patient         @relation(fields: [patientId], references: [id])
  doctorId            String
  doctor              Doctor          @relation(fields: [doctorId], references: [id])
  name                String
  dosage              String
  manufacturer        String
  brandEquivalent     String
  status              String          // "critical" | "active" | "completed"
  remainingPills      Int
  daysLeft            Int
  directGenericPrice  Decimal
  innovatorPrice      Decimal
  instructions        String
  aucMatch            Decimal?        // e.g. 99.40
  batchNumber         String?
  pdfUrl              String?
  createdAt           DateTime        @default(now())
  orderItems          OrderItem[]
}

model VitalMetric {
  id            String          @id @default(cuid())
  patientId     String
  patient       Patient         @relation(fields: [patientId], references: [id])
  title         String          // e.g. "Total Cholesterol"
  currentValue  Decimal
  unit          String
  change        String
  changeType    String          // "positive" | "negative" | "neutral"
  baseline      String
  status        String
  historyJson   String          // JSON array of historical numbers
  updatedAt     DateTime        @updatedAt
}

model ClinicalDocument {
  id            String          @id @default(cuid())
  title         String
  type          String          // "prescription" | "coa" | "lab_report" | "parity_dossier"
  date          DateTime
  fileSize      String
  doctorOrLab   String
  verified      Boolean         @default(true)
  sha256Hash    String
  fileUrl       String
}

model Order {
  id            String          @id @default(cuid())
  patientId     String
  patient       Patient         @relation(fields: [patientId], references: [id])
  status        String          // "pending" | "dispatched" | "delivered"
  deliveryType  String          // "drone" | "express"
  deliveryFee   Decimal
  subtotal      Decimal
  totalSavings  Decimal
  trackingId    String          @unique
  createdAt     DateTime        @default(now())
  items         OrderItem[]
}

model OrderItem {
  id              String        @id @default(cuid())
  orderId         String
  order           Order         @relation(fields: [orderId], references: [id])
  prescriptionId  String
  prescription    Prescription  @relation(fields: [prescriptionId], references: [id])
  price           Decimal
  quantity        Int           @default(1)
}
```

---

## 7. Important Business Logic & Clinical Rules

### 7.1 Refill Urgency Classification
```typescript
if (daysLeft <= 7) {
  status = 'critical'; // Displays red urgency card and highlights drone instant dispatch
} else if (daysLeft > 7 && isChronic) {
  status = 'active';   // Displays blue active therapy status with auto-ship schedule
} else {
  status = 'completed'; // Course finished (e.g. 10-day acute antibiotic)
}
```

### 7.2 Pharmacokinetic Parity Bounds (FDA Standard)
- To be declared bio-equivalent, the **90% Confidence Interval** of the geometric mean test/reference ratio for both **AUC** and **$C_{max}$** must fall strictly within the **80.00% to 125.00%** acceptance interval.
- In genraticMed, all indexed generics meet or exceed 98.8% point-estimate parity.

### 7.3 Patient Savings Calculation
$$\text{Dollar Savings} = \text{Innovator Price} - \text{Direct Generic Price}$$
$$\text{Savings \%} = \left(\frac{\text{Innovator Price} - \text{Direct Generic Price}}{\text{Innovator Price}}\right) \times 100$$
*Example*: Atorvastatin ($4.20) vs. Lipitor ($48.00) $\implies \$43.80$ savings per fill ($91.25\%$).

---

## 8. Known Issues & Technical Debt

1. **Large Single File (`src/components/Modals.tsx`)**:
   - Contains 8 modal components spanning ~747 lines. While functionally sound, it should be refactored into a `src/components/modals/` directory with individual modal files.
2. **In-Memory State Volatility**:
   - Cart modifications and one-tap refill states are stored in component React state (`App.tsx`), meaning refreshing the browser resets the cart to initial mock state.
3. **Mock Data Drone Timer**:
   - The drone dispatch checkout in `CartScreen.tsx` uses a simple `setTimeout(..., 4000)` transition instead of a durable background job.
4. **Server Entry File Absence**:
   - `package.json` includes `express`, `dotenv`, and `@google/genai`, but `server.js` or `server.ts` has not yet been authored to expose live endpoints to the Vite dev server.

---

## 9. Future Roadmap

```
Q3 2026 (Immediate)
├── Author Express server bridge connecting @google/genai
├── Implement Gemini 2.0 Flash multimodal prompt for camera prescription scanning
└── Modularize src/components/Modals.tsx into src/components/modals/*

Q4 2026 (Persistence & Security)
├── Migrate to SQLite/PostgreSQL with Prisma ORM
├── Implement local Web Crypto API ECDSA signature generation for ABHA pass
└── Integrate PWA offline caching with Workbox

Q1 2027 (Clinical Ecosystem)
├── National Health Authority (ABDM) Milestone 1, 2, 3 sandbox certification
├── Real-time SkyRoute Drone telemetry via WebSocket / Leaflet Map integration
└── Physician e-signing portal with PKI smart-card support
```
