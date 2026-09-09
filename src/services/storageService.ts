import type { Prescription } from '../types';

const STORAGE_KEYS = {
  prescriptions: 'genraticmed.phase3.prescriptions',
  cart: 'genraticmed.phase3.cart',
} as const;

function read<T>(key: string, fallback: T): T {
  try {
    const value = window.localStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage can be unavailable in private browsing; the in-memory UI remains usable.
  }
}

export const persistedVault = {
  readPrescriptions: (fallback: Prescription[]) => read(STORAGE_KEYS.prescriptions, fallback),
  writePrescriptions: (value: Prescription[]) => write(STORAGE_KEYS.prescriptions, value),
  readCart: (fallback: Prescription[]) => read(STORAGE_KEYS.cart, fallback),
  writeCart: (value: Prescription[]) => write(STORAGE_KEYS.cart, value),
};

export async function queueRefill(prescriptionId: string): Promise<void> {
  try {
    await fetch(`/api/v1/prescriptions/${encodeURIComponent(prescriptionId)}/refill`, { method: 'POST' });
  } catch {
    // The cart's local persistence is the offline-safe fallback.
  }
}
