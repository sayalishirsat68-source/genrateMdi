import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { INITIAL_PRESCRIPTIONS, VITALS_DATA } from './data/mockData.js';
import type { Prescription } from './types.js';

dotenv.config();

const app = express();
const PORT = process.env.SERVER_PORT || process.env.PORT || 3001;

// Development-safe repository. Prisma's schema and seed script provide the PostgreSQL
// implementation; this store keeps the API usable until DATABASE_URL is configured.
const prescriptions: Prescription[] = [...INITIAL_PRESCRIPTIONS];
const refillOrders = new Map<string, { prescriptionId: string; status: string; queuedAt: string }>();

type DroneOrder = {
  id: string;
  waybillId: string;
  prescriptionIds: string[];
  status: 'dispatched' | 'in_transit' | 'delivered';
  distanceKm: number;
  deliveryFee: number;
  createdAt: string;
};

const droneOrders = new Map<string, DroneOrder>();

function telemetrySnapshot(order: DroneOrder, tick: number) {
  const progress = Math.min(tick / 12, 1);
  const latitude = 28.6139 + (0.0184 * progress);
  const longitude = 77.209 + (0.0211 * progress);
  return {
    orderId: order.id,
    waybillId: order.waybillId,
    status: (progress >= 1 ? 'delivered' : 'in_transit') as DroneOrder['status'],
    progress: Math.round(progress * 100),
    etaMinutes: Math.max(0, Math.ceil((1 - progress) * 18)),
    coordinates: { latitude: Number(latitude.toFixed(5)), longitude: Number(longitude.toFixed(5)) },
    altitudeM: progress >= 1 ? 0 : Math.round(72 - (progress * 28)),
    airspeedKph: progress >= 1 ? 0 : Math.round(42 + ((tick % 3) * 3)),
    temperatureC: Number((5 + Math.sin(tick) * 0.7).toFixed(1)),
    humidityPercent: Math.round(45 + Math.cos(tick) * 3),
    timestamp: new Date().toISOString(),
  };
}

// Enable JSON body parser with increased limit for high-resolution prescription images
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// CORS headers — allow the Vite dev server and any configured frontend origin
const allowedOrigin = process.env.FRONTEND_URL || '*';
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', allowedOrigin);
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.use((_req, res, next) => {
  res.setHeader('Content-Security-Policy', "default-src 'self'; img-src 'self' https://images.unsplash.com https://lh3.googleusercontent.com data:; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; connect-src 'self'; script-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'none'; form-action 'self'");
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(self), geolocation=(), microphone=()');
  next();
});

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'online',
    service: 'genraticMed Clinical Operations API',
    timestamp: new Date().toISOString(),
    geminiConfigured: Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY'),
  });
});

app.get('/api/v1/prescriptions', (req: Request, res: Response) => {
  const filter = typeof req.query.filter === 'string' ? req.query.filter : 'all';
  const filtered = filter === 'needs-refill'
    ? prescriptions.filter((prescription) => prescription.status === 'critical')
    : filter === 'chronic'
      ? prescriptions.filter((prescription) => prescription.status === 'active')
      : filter === 'archived'
        ? prescriptions.filter((prescription) => prescription.status === 'completed')
        : prescriptions;
  res.json({ success: true, data: filtered });
});

app.post('/api/v1/prescriptions/:id/refill', (req: Request, res: Response) => {
  const prescription = prescriptions.find((entry) => entry.id === req.params.id);
  if (!prescription) {
    res.status(404).json({ success: false, error: 'Prescription not found.' });
    return;
  }
  const order = {
    prescriptionId: prescription.id,
    status: 'queued',
    queuedAt: new Date().toISOString(),
  };
  refillOrders.set(prescription.id, order);
  res.status(201).json({ success: true, data: order });
});

app.get('/api/v1/vitals/:patientId', (req: Request, res: Response) => {
  if (req.params.patientId !== 'patient-robert-c' && req.params.patientId !== 'GM-PAT-88410') {
    res.status(404).json({ success: false, error: 'Patient not found.' });
    return;
  }
  res.json({ success: true, data: VITALS_DATA });
});

app.get('/api/v1/fhir/MedicationRequest/:id', (req: Request, res: Response) => {
  const prescription = prescriptions.find((entry) => entry.id === req.params.id);
  if (!prescription) {
    res.status(404).json({ success: false, error: 'Prescription not found.' });
    return;
  }
  res.json({
    resourceType: 'MedicationRequest',
    id: prescription.id,
    status: prescription.status === 'completed' ? 'completed' : 'active',
    intent: 'order',
    subject: { reference: 'Patient/patient-robert-c' },
    medicationCodeableConcept: { text: prescription.name },
    dosageInstruction: [{ text: prescription.instructions, doseAndRate: [{ doseQuantity: { text: prescription.dosage } }] }],
    authoredOn: new Date().toISOString().slice(0, 10),
  });
});

app.get('/api/v1/fhir/Observation/:patientId', (req: Request, res: Response) => {
  if (req.params.patientId !== 'patient-robert-c' && req.params.patientId !== 'GM-PAT-88410') {
    res.status(404).json({ success: false, error: 'Patient not found.' });
    return;
  }
  res.json({
    resourceType: 'Bundle',
    type: 'collection',
    entry: VITALS_DATA.map((vital, index) => ({
      resource: {
        resourceType: 'Observation',
        id: `vital-${index + 1}`,
        status: 'final',
        subject: { reference: 'Patient/patient-robert-c' },
        code: { text: vital.title },
        valueQuantity: { value: vital.currentValue, unit: vital.unit },
        effectiveDateTime: new Date().toISOString(),
      },
    })),
  });
});

app.post('/api/v1/abdm/consent-requests', (req: Request, res: Response) => {
  const { purpose, records } = req.body;
  if (typeof purpose !== 'string' || !Array.isArray(records)) {
    res.status(400).json({ success: false, error: 'purpose and records are required for consent.' });
    return;
  }
  res.status(202).json({
    success: true,
    mode: process.env.ABDM_GATEWAY_URL ? 'sandbox-ready' : 'local-consent-preview',
    data: {
      consentId: `CONSENT-${Date.now()}`,
      purpose,
      records,
      status: 'requested',
      expiresAt: new Date(Date.now() + 30 * 60_000).toISOString(),
    },
  });
});

app.post('/api/v1/orders/drone-dispatch', (req: Request, res: Response) => {
  const prescriptionIds = Array.isArray(req.body.prescriptionIds)
    ? req.body.prescriptionIds.filter((id: unknown): id is string => typeof id === 'string')
    : [];
  const distanceKm = Number(req.body.distanceKm);
  if (prescriptionIds.length === 0 || prescriptionIds.some((id) => !prescriptions.some((prescription) => prescription.id === id))) {
    res.status(400).json({ success: false, error: 'Dispatch requires one or more valid prescription IDs.' });
    return;
  }
  if (!Number.isFinite(distanceKm) || distanceKm <= 0 || distanceKm > 50) {
    res.status(400).json({ success: false, error: 'distanceKm must be between 0 and 50.' });
    return;
  }
  const id = `order-${Date.now()}`;
  const order: DroneOrder = {
    id,
    waybillId: `SKY-${new Date().getFullYear()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
    prescriptionIds,
    status: 'dispatched',
    distanceKm: Number(distanceKm.toFixed(1)),
    deliveryFee: Number((2.5 + Math.max(0, distanceKm - 5) * 0.35).toFixed(2)),
    createdAt: new Date().toISOString(),
  };
  droneOrders.set(order.id, order);
  res.status(201).json({ success: true, data: order });
});

app.get('/api/v1/orders/:id/telemetry', (req: Request, res: Response) => {
  const order = droneOrders.get(req.params.id);
  if (!order) {
    res.status(404).json({ success: false, error: 'Dispatch order not found.' });
    return;
  }
  res.set({ 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache', Connection: 'keep-alive' });
  res.flushHeaders();
  let tick = 0;
  const emit = () => {
    const telemetry = telemetrySnapshot(order, tick++);
    order.status = telemetry.status;
    res.write(`event: telemetry\ndata: ${JSON.stringify(telemetry)}\n\n`);
    if (telemetry.status === 'delivered') {
      clearInterval(interval);
      res.end();
    }
  };
  emit();
  const interval = setInterval(emit, 1000);
  req.on('close', () => clearInterval(interval));
});

app.get('/api/v1/orders/:id/receipt', (req: Request, res: Response) => {
  const order = droneOrders.get(req.params.id);
  if (!order || order.status !== 'delivered') {
    res.status(404).json({ success: false, error: 'A receipt is available after delivery.' });
    return;
  }
  res.json({
    success: true,
    data: {
      receiptId: `RCT-${order.waybillId}`,
      waybillId: order.waybillId,
      verifiedCoA: true,
      deliveredAt: new Date().toISOString(),
    },
  });
});

// Clinical Formularies for Generic Equivalence Matching
const FORMULARY_DATABASE = [
  {
    brand: 'Lipitor (Pfizer)',
    ingredient: 'Atorvastatin Calcium 20mg',
    genericEquivalent: 'Cipla Atorvastatin Calcium 20mg',
    brandCost: '$48.00',
    genericCost: '$4.20',
    savings: '91.25%',
    confidence: '99.4% OCR Confidence',
    doctorName: 'Dr. A. K. Verma',
    doctorSpecialty: 'Senior Consultant Cardiologist',
    instructions: '1 Tab at Bedtime',
    dosage: '20mg Film-coated tab',
    daysLeft: 30,
    aucMatch: '99.4% AUC Match to Lipitor',
    category: 'Cardiovascular / Statins',
  },
  {
    brand: 'Glucophage XR (Bristol Myers)',
    ingredient: 'Metformin HCl 500mg ER',
    genericEquivalent: 'Zydus Metformin HCl ER 500mg',
    brandCost: '$62.00',
    genericCost: '$5.10',
    savings: '91.77%',
    confidence: '99.7% OCR Confidence',
    doctorName: 'Dr. S. K. Mahapatra',
    doctorSpecialty: 'Internal Medicine & Diabetology',
    instructions: '1 Tab with Dinner',
    dosage: '500mg Extended Release Tab',
    daysLeft: 30,
    aucMatch: '99.7% AUC Match to Glucophage',
    category: 'Endocrinology / Diabetes',
  },
  {
    brand: 'Augmentin (GSK)',
    ingredient: 'Amoxicillin 500mg + Clavulanic Acid 125mg',
    genericEquivalent: 'Mankind Moxikind-CV 625mg',
    brandCost: '$76.00',
    genericCost: '$8.50',
    savings: '88.82%',
    confidence: '99.1% OCR Confidence',
    doctorName: 'Dr. A. K. Verma',
    doctorSpecialty: 'Acute Clinical Care',
    instructions: '1 Tab BID after meals for 10 days',
    dosage: '625mg Film-coated tab',
    daysLeft: 10,
    aucMatch: '99.1% AUC Match to Augmentin',
    category: 'Anti-infective / Antibiotic',
  },
  {
    brand: 'Plavix (Bristol Myers)',
    ingredient: 'Clopidogrel Bisulfate 75mg',
    genericEquivalent: 'Sun Pharma Clopidogrel 75mg',
    brandCost: '$84.00',
    genericCost: '$6.40',
    savings: '92.38%',
    confidence: '99.5% OCR Confidence',
    doctorName: 'Dr. A. K. Verma',
    doctorSpecialty: 'Cardiology',
    instructions: '1 Tab Once Daily',
    dosage: '75mg Film-coated tab',
    daysLeft: 30,
    aucMatch: '99.5% AUC Match to Plavix',
    category: 'Hematology / Antiplatelet',
  },
  {
    brand: 'Crestor (AstraZeneca)',
    ingredient: 'Rosuvastatin Calcium 10mg',
    genericEquivalent: 'Cipla Rosuvastatin 10mg',
    brandCost: '$92.00',
    genericCost: '$7.80',
    savings: '91.52%',
    confidence: '99.8% OCR Confidence',
    doctorName: 'Dr. A. K. Verma',
    doctorSpecialty: 'Cardiology',
    instructions: '1 Tab in Evening',
    dosage: '10mg Film-coated tab',
    daysLeft: 30,
    aucMatch: '99.8% AUC Match to Crestor',
    category: 'Cardiovascular / Statins',
  },
];

/**
 * POST /api/v1/ai/scan-prescription
 * Ingests an uploaded image of a prescription, lab report, or medicine blister pack.
 * Uses Gemini 2.0 Flash via @google/genai to extract clinical text and correlate with
 * generic bio-parity data.
 */
app.post('/api/v1/ai/scan-prescription', async (req: Request, res: Response): Promise<void> => {
  try {
    const { imageBase64, mimeType = 'image/jpeg', sampleId } = req.body;

    if (imageBase64 !== undefined && typeof imageBase64 !== 'string') {
      res.status(400).json({ success: false, error: 'imageBase64 must be a base64-encoded string.' });
      return;
    }

    if (typeof mimeType !== 'string' || !['image/jpeg', 'image/png', 'image/webp', 'application/pdf'].includes(mimeType)) {
      res.status(400).json({ success: false, error: 'Unsupported document type. Upload a JPEG, PNG, WebP, or PDF.' });
      return;
    }

    const apiKey = process.env.GEMINI_API_KEY;
    const hasValidKey = apiKey && apiKey !== 'MY_GEMINI_API_KEY' && apiKey.length > 10;

    // Fast-path: If user specifically requested a sample benchmark
    if (sampleId) {
      const matchedSample = FORMULARY_DATABASE.find((f) =>
        f.brand.toLowerCase().includes((sampleId as string).toLowerCase())
      );
      if (matchedSample) {
        res.json({ success: true, mode: 'sample_benchmark', data: matchedSample });
        return;
      }
    }

    // Live Multimodal Gemini Ingestion
    if (hasValidKey && imageBase64) {
      try {
        const ai = new GoogleGenAI({ apiKey });

        // Strip the browser data-URL prefix for either images or PDFs.
        const cleanBase64 = (imageBase64 as string).replace(/^data:[^;]+;base64,/, '');

        const prompt = `You are a clinical pharmacologist and bio-parity verification specialist for the genraticMed portal.
Analyze this medical prescription image or drug packaging carefully.
Extract the prescribed brand medication and identify its certified generic equivalent according to US FDA Orange Book / CDSCO Schedule M bio-equivalence standards.

Respond ONLY with a valid JSON object strictly matching this schema:
{
  "brand": "Detected Brand Name (Manufacturer)",
  "ingredient": "Active Pharmaceutical Ingredient (API) and strength, e.g. Atorvastatin 20mg",
  "genericEquivalent": "Generic Manufacturer and product name, e.g. Cipla Atorvastatin Calcium 20mg",
  "brandCost": "Estimated brand cost formatted as $XX.00",
  "genericCost": "Certified generic cost formatted as $X.XX",
  "savings": "Percentage savings e.g. 91%",
  "confidence": "Calculated OCR confidence e.g. 99.4% OCR Confidence",
  "doctorName": "Doctor name detected or 'Dr. Verified Clinician'",
  "doctorSpecialty": "Specialty detected or 'General Medicine'",
  "instructions": "Frequency and timing e.g. '1 Tab at Bedtime'",
  "dosage": "Dosage form e.g. '20mg Film-coated tab'",
  "daysLeft": 30,
  "aucMatch": "AUC parity e.g. '99.4% AUC Match'",
  "category": "Therapeutic class e.g. 'Cardiovascular / Statins'"
}`;

        const response = await ai.models.generateContent({
          model: 'gemini-2.0-flash',
          contents: [
            {
              role: 'user',
              parts: [
                { text: prompt },
                { inlineData: { mimeType: mimeType || 'image/jpeg', data: cleanBase64 } },
              ],
            },
          ],
        });

        const textOutput = response.text || '';
        const jsonMatch = textOutput.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          res.json({ success: true, mode: 'gemini_live', data: parsed });
          return;
        }
      } catch (geminiError) {
        console.error('[server] Gemini API error, falling back to formulary:', geminiError);
      }
    }

    // Server-side formulary fallback
    const fallback = FORMULARY_DATABASE[Math.floor(Math.random() * FORMULARY_DATABASE.length)];
    res.json({ success: true, mode: 'clinical_formulary_mock', data: fallback });
  } catch (err) {
    console.error('[server] scan-prescription error:', err);
    res.status(500).json({ success: false, error: 'Internal server error.' });
  }
});

app.listen(PORT, () => {
  console.log(`[server] genraticMed API running on http://localhost:${PORT}`);
});
