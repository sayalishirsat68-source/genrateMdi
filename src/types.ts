export type TabType = 'explore' | 'compare' | 'rx-vault' | 'cart' | 'profile';

export type VaultSegment = 'prescriptions' | 'vitals' | 'doctors' | 'documents';

export type RxFilter = 'all' | 'needs-refill' | 'chronic' | 'archived';

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
  imageUrl: string;
  imageAlt: string;
  aucMatch?: string;
  pdfFile: string;
  ocrMatch?: string;
  doctor: string;
  doctorSpecialty: string;
  instructions: string;
  directGenericPrice: number;
  innovatorPrice: number;
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

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  hospital: string;
  licenseNumber: string;
  avatar: string;
  lastConsultation: string;
  activeRxCount: number;
  phone: string;
}

export interface ClinicalDocument {
  id: string;
  title: string;
  type: 'prescription' | 'coa' | 'lab_report' | 'parity_dossier';
  date: string;
  size: string;
  doctorOrLab: string;
  verified: boolean;
  hash: string;
}

export interface CartItem {
  rxId: string;
  name: string;
  dosage: string;
  price: number;
  quantity: number;
  supplyDays: number;
  refillScheduledDate: string;
}

export interface ExtractedPrescriptionData {
  brand: string;
  ingredient: string;
  genericEquivalent: string;
  brandCost: string;
  genericCost: string;
  savings: string;
  confidence: string;
  doctorName?: string;
  doctorSpecialty?: string;
  instructions?: string;
  dosage?: string;
  daysLeft?: number;
  aucMatch?: string;
  category?: string;
  mode?: string;
  extractedAt?: string;
  verifiedUnder?: string;
}
