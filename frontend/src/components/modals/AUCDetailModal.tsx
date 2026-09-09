import React, { useState, useEffect, useRef } from 'react';
import { DOCTORS, PATIENT_DATA } from '../../data/mockData';
import { scanPrescriptionImage, SAMPLE_PRESCRIPTIONS, ExtractedPrescriptionData } from '../../services/aiService';
import type { ModalProps } from './types';

export const AUCDetailModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/70 backdrop-blur-md animate-fade-in">
      <div className="bg-surface-card rounded-2xl max-w-md w-full p-5 shadow-2xl border border-border-crisp">
        <div className="flex justify-between items-start pb-3 border-b border-border-crisp">
          <div>
            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-status-verified-bg text-status-verified text-[11px] font-semibold mb-1">
              <span className="material-symbols-outlined text-[14px]">biotech</span>
              99.4% AUC BIO-EQUIVALENCE
            </div>
            <h3 className="font-bold text-base text-on-surface">Cipla Atorvastatin vs Pfizer Lipitor</h3>
          </div>
          <button onClick={onClose} className="text-on-surface-variant hover:text-on-surface">✕</button>
        </div>

        <div className="mt-4 space-y-3 text-xs">
          <p className="text-on-surface-variant text-[11px]">
            In vivo pharmacokinetic bioavailability curves demonstrate perfect statistical superposition within the FDA 80–125% confidence interval window.
          </p>

          {/* PK Graph */}
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-white">
            <div className="flex justify-between text-[10px] text-slate-400 mb-2">
              <span>Plasma Concentration (ng/mL)</span>
              <div className="flex gap-3">
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-0.5 bg-brand-accent-cyan"></span> Cipla Generic
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-0.5 bg-emerald-400 stroke-dashed"></span> Lipitor Brand
                </span>
              </div>
            </div>

            <div className="h-32 w-full">
              <svg viewBox="0 0 300 120" className="w-full h-full">
                {/* Grid lines */}
                <line x1="20" y1="10" x2="290" y2="10" stroke="#1e293b" strokeWidth="1" />
                <line x1="20" y1="40" x2="290" y2="40" stroke="#1e293b" strokeWidth="1" />
                <line x1="20" y1="70" x2="290" y2="70" stroke="#1e293b" strokeWidth="1" />
                <line x1="20" y1="100" x2="290" y2="100" stroke="#334155" strokeWidth="1" />

                {/* Lipitor Curve */}
                <path
                  d="M20,100 C40,15 70,25 120,55 C170,80 240,95 290,98"
                  fill="none"
                  stroke="#34d399"
                  strokeWidth="2"
                  strokeDasharray="4 2"
                />

                {/* Cipla Curve (almost identical overlay) */}
                <path
                  d="M20,100 C39,17 71,26 122,56 C171,81 239,94 290,98"
                  fill="none"
                  stroke="#06b6d4"
                  strokeWidth="2.5"
                />

                <circle cx="55" cy="22" r="3" fill="#06b6d4" />
                <text x="60" y="20" fill="#06b6d4" fontSize="8" fontFamily="sans-serif">Cmax: 12.8 ng/mL</text>

                <text x="20" y="115" fill="#64748b" fontSize="8" fontFamily="sans-serif">0h</text>
                <text x="80" y="115" fill="#64748b" fontSize="8" fontFamily="sans-serif">4h</text>
                <text x="150" y="115" fill="#64748b" fontSize="8" fontFamily="sans-serif">12h</text>
                <text x="220" y="115" fill="#64748b" fontSize="8" fontFamily="sans-serif">24h</text>
                <text x="280" y="115" fill="#64748b" fontSize="8" fontFamily="sans-serif">48h</text>
              </svg>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-[11px]">
            <div className="p-2 bg-surface-canvas rounded border border-border-crisp">
              <span className="text-on-surface-variant block text-[10px]">AUC0-inf</span>
              <span className="font-bold text-on-surface">99.4%</span>
            </div>
            <div className="p-2 bg-surface-canvas rounded border border-border-crisp">
              <span className="text-on-surface-variant block text-[10px]">Cmax Parity</span>
              <span className="font-bold text-on-surface">99.1%</span>
            </div>
            <div className="p-2 bg-surface-canvas rounded border border-border-crisp">
              <span className="text-on-surface-variant block text-[10px]">Tmax Delta</span>
              <span className="font-bold text-status-verified">&lt; 0.1 hr</span>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-4 py-2 rounded-xl bg-secondary text-white font-semibold text-xs hover:bg-secondary/90"
        >
          Close Analysis
        </button>
      </div>
    </div>
  );
};
