import React, { useState, useEffect, useRef } from 'react';
import { DOCTORS, PATIENT_DATA } from '../../data/mockData';
import { scanPrescriptionImage, SAMPLE_PRESCRIPTIONS, ExtractedPrescriptionData } from '../../services/aiService';
import type { ModalProps } from './types';

export const NotificationsModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/70 backdrop-blur-md animate-fade-in">
      <div className="bg-surface-card rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-border-crisp">
        <div className="flex justify-between items-center pb-3 border-b border-border-crisp">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary text-[20px]">notifications_active</span>
            <h3 className="font-bold text-base text-on-surface">Clinical Alerts & Updates</h3>
          </div>
          <button onClick={onClose} className="text-on-surface-variant hover:text-on-surface">✕</button>
        </div>

        <div className="mt-3 space-y-2.5 text-xs">
          <div className="p-3 bg-status-critical-bg rounded-xl border border-status-critical-border">
            <div className="flex justify-between font-semibold text-status-critical">
              <span>Refill Alert: 4 Days Left</span>
              <span className="text-[10px]">10m ago</span>
            </div>
            <p className="text-on-surface mt-1 text-[11px]">
              Atorvastatin Calcium 20mg has 6 tablets remaining. One-tap refill ready for delivery.
            </p>
          </div>

          <div className="p-3 bg-status-verified-bg rounded-xl border border-status-verified-border">
            <div className="flex justify-between font-semibold text-status-verified">
              <span>Bio-Parity Verified</span>
              <span className="text-[10px]">2h ago</span>
            </div>
            <p className="text-on-surface mt-1 text-[11px]">
              Dr. S. K. Mahapatra validated 9-month lipid normalization data with zero myopathy reports.
            </p>
          </div>

          <div className="p-3 bg-surface-canvas rounded-xl border border-border-crisp">
            <div className="flex justify-between font-semibold text-on-surface">
              <span>SkyRoute Drone #ORD-99411</span>
              <span className="text-[10px]">Yesterday</span>
            </div>
            <p className="text-on-surface-variant mt-1 text-[11px]">
              Batch #AUG-27K Moxikind-CV safely delivered and cold-chain verified.
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-4 py-2 rounded-xl bg-surface-subtle text-on-surface font-medium text-xs hover:bg-border-crisp"
        >
          Mark All as Read
        </button>
      </div>
    </div>
  );
};
