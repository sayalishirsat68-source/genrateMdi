import React, { useState, useEffect, useRef } from 'react';
import { DOCTORS, PATIENT_DATA } from '../../data/mockData';
import { scanPrescriptionImage, SAMPLE_PRESCRIPTIONS, ExtractedPrescriptionData } from '../../services/aiService';
import type { ModalProps } from './types';

export const DosageGuideModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/70 backdrop-blur-md animate-fade-in">
      <div className="bg-surface-card rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-border-crisp">
        <div className="flex justify-between items-start pb-3 border-b border-border-crisp">
          <div>
            <h3 className="font-bold text-base text-on-surface">Metformin HCl 500mg ER</h3>
            <p className="text-xs text-secondary font-medium">Clinical Dosage & Titration Protocol</p>
          </div>
          <button onClick={onClose} className="text-on-surface-variant hover:text-on-surface">✕</button>
        </div>

        <div className="mt-4 space-y-3 text-xs">
          <div className="p-3 bg-surface-canvas rounded-xl border border-border-crisp space-y-2">
            <div className="flex items-center gap-2 text-on-surface font-semibold">
              <span className="material-symbols-outlined text-secondary text-[18px]">restaurant</span>
              <span>Take with Evening Meal</span>
            </div>
            <p className="text-on-surface-variant text-[11px] leading-relaxed">
              Extended Release (ER) formulation must be swallowed whole with water during or immediately after dinner. Do NOT crush, chew, or split the tablet.
            </p>
          </div>

          <div className="p-3 bg-status-verified-bg rounded-xl border border-status-verified-border space-y-1">
            <div className="flex items-center gap-1.5 text-status-verified font-bold">
              <span className="material-symbols-outlined text-[16px]">check_circle</span>
              <span>Renal Safety Validated</span>
            </div>
            <p className="text-[11px] text-on-surface leading-relaxed">
              Current eGFR is <strong>74 mL/min/1.73m²</strong> (well above safe cutoff threshold of 45). Annual renal panel auto-scheduled for Aug 2027.
            </p>
          </div>

          <div className="p-3 bg-surface-subtle rounded-xl text-on-surface-variant text-[11px]">
            <span className="font-semibold text-on-surface block mb-1">Prescribed by:</span>
            Dr. S. K. Mahapatra, MD • Metropolitan Clinical Research Center
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-4 py-2 rounded-xl bg-secondary text-white font-semibold text-xs hover:bg-secondary/90"
        >
          Acknowledge & Close
        </button>
      </div>
    </div>
  );
};
