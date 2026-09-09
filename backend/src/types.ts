export interface Prescription {
  id: string;
  name: string;
  dosage: string;
  manufacturer: string;
  brandEquivalent: string;
  status: 'critical' | 'active' | 'completed';
  statusLabel: string;
  remainingInfo: string;
  daysLeft?: number;
  instructions: string;
  directGenericPrice: number;
  innovatorPrice: number;
  // Optional frontend-display fields (present in seed data, ignored by server logic)
  imageUrl?: string;
  imageAlt?: string;
  aucMatch?: string;
  pdfFile?: string;
  ocrMatch?: string;
  doctor?: string;
  doctorSpecialty?: string;
  clinicalNote?: string;
  autoShipDate?: string;
  deliveryMethod?: string;
  batchNumber?: string;
  coaAvailable?: boolean;
}

export interface VitalMetric {
  title: string;
  currentValue: number;
  unit: string;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  baseline: string;
  status: string;
  history: number[];
}
