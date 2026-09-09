import React, { useState, useEffect, useRef } from 'react';
import { DOCTORS, PATIENT_DATA } from '../../data/mockData';
import { scanPrescriptionImage, SAMPLE_PRESCRIPTIONS, ExtractedPrescriptionData } from '../../services/aiService';
import type { ModalProps } from './types';

export const ClinicalDeskModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  const [callState, setCallState] = useState<'connecting' | 'connected'>('connecting');
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setCallState('connecting');
      setDuration(0);
      const timer = setTimeout(() => {
        setCallState('connected');
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  useEffect(() => {
    if (callState === 'connected') {
      const interval = setInterval(() => {
        setDuration((prev) => prev + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [callState]);

  if (!isOpen) return null;

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/75 backdrop-blur-md animate-fade-in">
      <div className="bg-surface-card rounded-2xl max-w-sm w-full p-6 text-center shadow-2xl border border-border-crisp relative">
        <div className="relative w-20 h-20 mx-auto rounded-full overflow-hidden mb-3 border-2 border-secondary shadow-lg">
          <img
            src="https://images.unsplash.com/photo-1594824813512-32b4b41b4439?w=200&auto=format&fit=crop&q=80"
            alt="Dr. Priya Sharma, PharmD"
            className="w-full h-full object-cover"
          />
          {callState === 'connected' && (
            <span className="absolute bottom-1 right-1 w-3.5 h-3.5 rounded-full bg-status-verified border-2 border-white"></span>
          )}
        </div>

        <h3 className="font-bold text-base text-on-surface">Dr. Priya Sharma, PharmD</h3>
        <p className="text-xs text-secondary font-medium">Senior Duty Clinical Pharmacist</p>
        <p className="text-[11px] text-on-surface-variant mt-0.5">genraticMed Clinical Operations Desk • 24/7 Priority</p>

        <div className="my-5 p-3 rounded-xl bg-surface-canvas border border-border-crisp">
          {callState === 'connecting' ? (
            <div className="flex items-center justify-center gap-2 text-xs font-semibold text-status-pending">
              <span className="material-symbols-outlined text-[18px] animate-spin">sync</span>
              Establishing secure encrypted voice channel...
            </div>
          ) : (
            <div>
              <div className="text-xs text-status-verified font-bold flex items-center justify-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-status-verified animate-pulse"></span>
                LIVE VOICE LINK SECURED • {formatTime(duration)}
              </div>
              <p className="text-[11px] text-on-surface-variant italic mt-2">
                "Hello Mr. Robert, I have your Atorvastatin and Metformin profiles open. How can I assist you today?"
              </p>
            </div>
          )}
        </div>

        <div className="flex justify-center gap-3">
          <button
            onClick={() => alert('Microphone muted.')}
            className="w-12 h-12 rounded-full bg-surface-subtle hover:bg-border-crisp text-on-surface flex items-center justify-center"
          >
            <span className="material-symbols-outlined text-[20px]">mic</span>
          </button>
          <button
            onClick={onClose}
            className="w-12 h-12 rounded-full bg-status-critical text-white flex items-center justify-center hover:bg-status-critical/90 shadow-lg shadow-status-critical/30"
          >
            <span className="material-symbols-outlined text-[22px]">call_end</span>
          </button>
          <button
            onClick={() => alert('Switching to clinical chat.')}
            className="w-12 h-12 rounded-full bg-surface-subtle hover:bg-border-crisp text-on-surface flex items-center justify-center"
          >
            <span className="material-symbols-outlined text-[20px]">chat</span>
          </button>
        </div>
      </div>
    </div>
  );
};
