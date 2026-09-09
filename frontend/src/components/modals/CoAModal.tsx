import React, { useState, useEffect, useRef } from 'react';
import { DOCTORS, PATIENT_DATA } from '../../data/mockData';
import { scanPrescriptionImage, SAMPLE_PRESCRIPTIONS, ExtractedPrescriptionData } from '../../services/aiService';
import type { ModalProps } from './types';

export const CoAModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/70 backdrop-blur-md animate-fade-in">
      <div className="bg-surface-card rounded-2xl max-w-md w-full overflow-hidden shadow-2xl border border-border-crisp">
        <div className="p-4 bg-secondary text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px]">workspace_premium</span>
            <span className="font-semibold text-sm">Certificate of Analysis (CoA)</span>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white text-sm">✕</button>
        </div>

        <div className="p-5 text-xs space-y-3">
          <div className="bg-surface-canvas p-3 rounded-lg border border-border-crisp">
            <div className="flex justify-between font-semibold text-on-surface">
              <span>Batch #: AUG-27K</span>
              <span className="text-status-verified font-bold">RELEASED: PASSED</span>
            </div>
            <p className="text-[11px] text-on-surface-variant mt-0.5">Drug: Moxikind-CV 625mg (Amoxicillin & Potassium Clavulanate)</p>
            <p className="text-[10px] text-on-surface-variant font-mono mt-0.5">Mfg Date: 08/2026 • Exp Date: 07/2028</p>
          </div>

          <div className="space-y-1.5">
            <h5 className="font-bold text-on-surface text-[11px] uppercase tracking-wide">Physicochemical Quality Metrics</h5>
            <table className="w-full text-[11px] border border-border-crisp rounded overflow-hidden">
              <thead className="bg-surface-subtle text-on-surface-variant">
                <tr>
                  <th className="p-1.5 text-left">Test Parameter</th>
                  <th className="p-1.5 text-left">Specification</th>
                  <th className="p-1.5 text-left">Batch Result</th>
                  <th className="p-1.5 text-left">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-crisp">
                <tr>
                  <td className="p-1.5 font-medium">Amoxicillin Assay (HPLC)</td>
                  <td className="p-1.5">90.0% - 110.0%</td>
                  <td className="p-1.5 font-semibold text-secondary">99.8%</td>
                  <td className="p-1.5 text-status-verified font-bold">PASS</td>
                </tr>
                <tr>
                  <td className="p-1.5 font-medium">Clavulanate Assay (HPLC)</td>
                  <td className="p-1.5">90.0% - 115.0%</td>
                  <td className="p-1.5 font-semibold text-secondary">101.2%</td>
                  <td className="p-1.5 text-status-verified font-bold">PASS</td>
                </tr>
                <tr>
                  <td className="p-1.5 font-medium">Dissolution (Q at 30 min)</td>
                  <td className="p-1.5">&gt; 80%</td>
                  <td className="p-1.5">94.6%</td>
                  <td className="p-1.5 text-status-verified font-bold">PASS</td>
                </tr>
                <tr>
                  <td className="p-1.5 font-medium">Heavy Metals & Impurities</td>
                  <td className="p-1.5">&lt; 10 ppm</td>
                  <td className="p-1.5">&lt; 1.2 ppm</td>
                  <td className="p-1.5 text-status-verified font-bold">PASS</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="p-2.5 bg-status-verified-bg rounded-lg border border-status-verified-border flex items-center gap-2">
            <span className="material-symbols-outlined text-status-verified text-[18px]">verified</span>
            <p className="text-[11px] text-status-verified font-medium">
              WHO-GMP & US-FDA 21 CFR Part 211 validated by Principal Analytical Chemist.
            </p>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              onClick={() => {
                alert('Official CoA Certificate PDF downloaded.');
                onClose();
              }}
              className="px-4 py-2 rounded-lg bg-secondary text-white font-semibold text-xs hover:bg-secondary/90"
            >
              Export Sealed CoA
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
