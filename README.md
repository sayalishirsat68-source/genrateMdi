# genraticMed — Rx Vault

Clinical operations precision portal for bio-generic prescription tracking, pharmacokinetic parity validation, and real-time drone-dispatched refills.

---

## Project Structure

```
genraticmed/
├── frontend/          # Vite + React 19 SPA
│   ├── src/
│   │   ├── components/
│   │   ├── services/       # API clients (fetch-based)
│   │   ├── data/           # Client-side mock/catalog data
│   │   └── types.ts        # Frontend domain types
│   ├── public/             # Static assets & PWA manifest
│   ├── index.html
│   ├── vite.config.ts
│   ├── tsconfig.json
│   ├── package.json
│   └── .env                # VITE_API_URL
│
├── backend/           # Express + Gemini AI API server
│   ├── src/
│   │   ├── server.ts       # All API routes
│   │   ├── types.ts        # Server-side domain types
│   │   └── data/
│   │       └── mockData.ts # In-memory seed data
│   ├── prisma/
│   │   ├── schema.prisma   # PostgreSQL schema
│   │   └── seed.ts         # Database seeder
│   ├── tsconfig.json
│   ├── package.json
│   └── .env                # SERVER_PORT, GEMINI_API_KEY, DATABASE_URL
│
├── package.json       # Root — convenience scripts only
├── .gitignore
└── README.md
```

---

## Prerequisites

- **Node.js** v20 or later
- **npm** v10 or later
- **PostgreSQL** (optional — the server runs fully on in-memory data without it)

---

## Setup

### 1. Install dependencies

Install both frontend and backend dependencies in one command from the project root:

```bash
npm run install:all
```

Or install them individually:

```bash
# Frontend
cd frontend && npm install

# Backend
cd backend && npm install
```

### 2. Configure environment variables

Copy the example files and fill in your values:

```bash
cp frontend/.env.example frontend/.env
cp backend/.env.example  backend/.env
```

**`frontend/.env`**
```
VITE_API_URL=http://localhost:3001
```

**`backend/.env`**
```
SERVER_PORT=3001
GEMINI_API_KEY=your_gemini_api_key_here
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/genraticmed?schema=public"
ABDM_GATEWAY_URL=
FRONTEND_URL=http://localhost:3000
```

> `GEMINI_API_KEY` is only required for live AI prescription scanning. The server falls back to a local clinical formulary if the key is absent.

---

## Running the Application

### Start the backend

```bash
cd backend
npm run dev
```

The API server starts at **http://localhost:3001**.

### Start the frontend

```bash
cd frontend
npm run dev
```

The Vite dev server starts at **http://localhost:3000**. All `/api/*` requests are proxied to the backend automatically.

### Run both together (from project root)

```bash
npm run dev
```

This uses `npm-run-all` to start the frontend and backend in parallel. Install root dependencies first:

```bash
npm install   # installs npm-run-all
npm run dev
```

---

## API Endpoints

All endpoints are served by the backend on port `3001`.

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/health` | Health check |
| `GET` | `/api/v1/prescriptions` | List prescriptions (`?filter=all\|needs-refill\|chronic\|archived`) |
| `POST` | `/api/v1/prescriptions/:id/refill` | Queue a refill order |
| `GET` | `/api/v1/vitals/:patientId` | Patient vital metrics |
| `GET` | `/api/v1/fhir/MedicationRequest/:id` | FHIR R4 MedicationRequest |
| `GET` | `/api/v1/fhir/Observation/:patientId` | FHIR R4 Observation bundle |
| `POST` | `/api/v1/abdm/consent-requests` | ABDM consent boundary |
| `POST` | `/api/v1/orders/drone-dispatch` | Create a SkyRoute drone dispatch order |
| `GET` | `/api/v1/orders/:id/telemetry` | SSE live drone telemetry stream |
| `GET` | `/api/v1/orders/:id/receipt` | Delivery receipt (after delivery) |
| `POST` | `/api/v1/ai/scan-prescription` | Gemini multimodal OCR prescription scan |

---

## Database (optional)

The backend runs fully without a database using in-memory data. To enable PostgreSQL persistence:

```bash
cd backend

# Apply migrations
npm run db:migrate

# Seed initial data
npm run db:seed
```

---

## Building for Production

```bash
# Build the frontend
npm run build          # from project root
# or
cd frontend && npm run build

# Start the backend in production mode
cd backend && npm start
```

The frontend build output lands in `frontend/dist/`. Configure your web server or CDN to serve it and point `VITE_API_URL` to your deployed backend URL before building.

---

## Demo Credentials

- **PIN**: `8841`
- **Patient**: Robert C. · ABHA `#GM-PAT-88410`
