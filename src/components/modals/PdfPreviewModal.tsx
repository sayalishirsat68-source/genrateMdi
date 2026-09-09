import React, { useState, useEffect, useRef } from 'react';
import { DOCTORS, PATIENT_DATA } from '../../data/mockData';
import { scanPrescriptionImage, SAMPLE_PRESCRIPTIONS, ExtractedPrescriptionData } from '../../services/aiService';
import type { ModalProps } from './types';

export const PdfPreviewModal: React.FC<ModalProps & { fileName?: string }> = ({
  isOpen,
  onClose,
  fileName = 'Dr_Verma_Cardio_Sept2026.pdf',
}) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/70 backdrop-blur-md animate-fade-in">
      <div className="bg-surface-card rounded-2xl max-w-md w-full overflow-hidden shadow-2xl border border-border-crisp flex flex-col max-h-[90vh]">
        <div className="p-4 bg-surface-subtle border-b border-border-crisp flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary text-[20px]">description</span>
            <div>
              <h4 className="font-semibold text-xs text-on-surface truncate max-w-[240px]">{fileName}</h4>
              <span className="text-[10px] font-mono text-status-verified">Cryptographically Verified • OCR 99.1%</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-white flex items-center justify-center text-on-surface-variant hover:text-on-surface shadow-sm"
          >
            ✕
          </button>
        </div>

        {/* Prescription Document Sheet */}
        <div className="p-6 overflow-y-auto space-y-4 bg-white text-slate-800 text-xs font-sans">
          {/* Clinic Header */}
          <div className="border-b-2 border-slate-900 pb-3 flex justify-between items-start">
            <div>
              <h2 className="font-bold text-sm text-slate-900">APOLLO HEART & VASCULAR INSTITUTE</h2>
              <p className="text-[11px] text-slate-600">Department of Clinical Cardiology</p>
              <p className="text-[10px] text-slate-500">Reg No: MCI-REG-39104 • Tele-Health Node #772</p>
            </div>
            <div className="text-right">
              <span className="inline-block px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded text-[10px]">
                AUTHENTICATED RX
              </span>
              <p className="text-[10px] text-slate-500 mt-1">Date: 02-SEP-2026</p>
            </div>
          </div>

          {/* Patient Details */}
          <div className="grid grid-cols-2 gap-2 bg-slate-50 p-2.5 rounded border border-slate-200 text-[11px]">
            <div>
              <span className="text-slate-500">Patient Name:</span> <strong className="text-slate-900">Robert C.</strong>
            </div>
            <div>
              <span className="text-slate-500">ABHA:</span> <span className="font-mono">{PATIENT_DATA.abhaId}</span>
            </div>
            <div>
              <span className="text-slate-500">Age / Gender:</span> 62 Y / Male
            </div>
            <div>
              <span className="text-slate-500">Diagnosis:</span> Hypercholesterolemia (ICD-10 E78.0)
            </div>
          </div>

          {/* Rx Body */}
          <div className="pt-2">
            <div className="text-lg font-serif italic text-slate-900 font-bold mb-2">Rx</div>
            <div className="border border-slate-200 rounded p-3 bg-slate-50/50">
              <div className="flex justify-between font-bold text-slate-900">
                <span>1. Tab. Atorvastatin Calcium 20 mg (Bio-Equivalent)</span>
                <span>Qty: 30</span>
              </div>
              <p className="text-slate-600 mt-1 text-[11px]">Sig: Take 1 tablet by mouth daily at bedtime. Continue for 90 days.</p>
              <p className="text-[10px] text-emerald-700 font-medium mt-1">
                ✓ Generic substitution authorized: Approved for CDSCO/FDA bio-equivalent (Cipla / Zydus equivalent).
              </p>
            </div>
          </div>

          {/* Signature and Seal */}
          <div className="pt-4 border-t border-slate-200 flex justify-between items-end">
            <div className="text-[10px] text-slate-500 font-mono">
              Digital Signature Hash:<br />
              <span className="text-slate-700">7f83b1657ff1fc53b92dc...</span>
            </div>
            <div className="text-center">
              <div className="font-serif italic text-sm text-blue-900 font-semibold mb-0.5">Dr. A. K. Verma</div>
              <div className="border-t border-slate-400 pt-0.5 text-[9px] text-slate-600 font-medium">
                Senior Consultant Cardiologist
              </div>
            </div>
          </div>
        </div>

        <div className="p-3 bg-surface-subtle border-t border-border-crisp flex justify-between items-center">
          <button
            onClick={() => alert('Prescription PDF downloaded successfully.')}
            className="px-3 py-1.5 rounded-lg bg-white border border-border-crisp text-xs font-semibold text-on-surface hover:bg-slate-50 flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[16px]">download</span>
            Download PDF
          </button>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-secondary text-white text-xs font-semibold hover:bg-secondary/90"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
