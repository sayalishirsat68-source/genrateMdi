import React, { useState, useEffect, useRef } from 'react';
import { DOCTORS, PATIENT_DATA } from '../../data/mockData';
import { scanPrescriptionImage, SAMPLE_PRESCRIPTIONS, ExtractedPrescriptionData } from '../../services/aiService';
import type { ModalProps } from './types';
import { signHealthToken } from '../../services/cryptoService';

export const QrPassModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  const [walletSaved, setWalletSaved] = useState(false);
  const [tokenCopied, setTokenCopied] = useState(false);
  const [signature, setSignature] = useState('Generating ECDSA-P256 signature…');

  useEffect(() => {
    if (isOpen) void signHealthToken({ abhaId: PATIENT_DATA.abhaId, subject: PATIENT_DATA.name, issuedAt: new Date().toISOString() }).then(setSignature);
  }, [isOpen]);

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-surface-card rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-border-crisp relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-surface-subtle flex items-center justify-center text-on-surface-variant hover:text-on-surface"
        >
          <span className="material-symbols-outlined text-[18px]">close</span>
        </button>

        <div className="text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-status-verified-bg text-status-verified text-xs font-semibold mb-3">
            <span className="w-2 h-2 rounded-full bg-status-verified"></span>
            ABHA DIGITAL HEALTH TOKEN
          </div>
          <h3 className="font-bold text-lg text-on-surface">{PATIENT_DATA.name}</h3>
          <p className="text-xs text-on-surface-variant font-mono mt-0.5">{PATIENT_DATA.abhaId}</p>

          <div className="my-5 p-4 bg-surface-canvas rounded-xl border border-border-crisp flex flex-col items-center">
            {/* QR Code SVG */}
            <div className="w-48 h-48 bg-white p-2 rounded-lg shadow-inner flex items-center justify-center">
              <svg viewBox="0 0 100 100" className="w-full h-full text-on-surface">
                {/* Simulated high-density QR pattern */}
                <rect x="0" y="0" width="30" height="30" fill="currentColor" />
                <rect x="5" y="5" width="20" height="20" fill="white" />
                <rect x="10" y="10" width="10" height="10" fill="currentColor" />

                <rect x="70" y="0" width="30" height="30" fill="currentColor" />
                <rect x="75" y="5" width="20" height="20" fill="white" />
                <rect x="80" y="10" width="10" height="10" fill="currentColor" />

                <rect x="0" y="70" width="30" height="30" fill="currentColor" />
                <rect x="5" y="75" width="20" height="20" fill="white" />
                <rect x="10" y="80" width="10" height="10" fill="currentColor" />

                {/* Data blocks */}
                <rect x="35" y="10" width="25" height="10" fill="currentColor" />
                <rect x="10" y="35" width="10" height="25" fill="currentColor" />
                <rect x="35" y="35" width="30" height="30" fill="currentColor" />
                <rect x="40" y="40" width="20" height="20" fill="white" />
                <rect x="45" y="45" width="10" height="10" fill="currentColor" />
                <rect x="70" y="40" width="25" height="10" fill="currentColor" />
                <rect x="70" y="60" width="10" height="30" fill="currentColor" />
                <rect x="40" y="75" width="20" height="15" fill="currentColor" />
                <rect x="85" y="75" width="15" height="15" fill="currentColor" />
              </svg>
            </div>
            <span className="text-[10px] font-mono text-secondary mt-2">
              {signature}
            </span>
          </div>

          <p className="text-xs text-on-surface-variant leading-relaxed">
            Scan at any verified pharmacy or hospital terminal for instant bio-parity verification and clinical record exchange.
          </p>

          <div className="mt-4 pt-4 border-t border-border-crisp flex gap-2">
            <button
              onClick={() => {
                setWalletSaved(true);
                setTimeout(() => {
                  setWalletSaved(false);
                  onClose();
                }, 1400);
              }}
              className="flex-1 py-2 rounded-lg bg-secondary text-on-secondary text-xs font-semibold hover:bg-secondary/90 transition-colors flex items-center justify-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">
                {walletSaved ? 'check' : 'account_balance_wallet'}
              </span>
              {walletSaved ? 'Pass Saved!' : 'Add to Wallet'}
            </button>
            <button
              onClick={() => {
                navigator.clipboard?.writeText(PATIENT_DATA.abhaId);
                setTokenCopied(true);
                setTimeout(() => setTokenCopied(false), 2000);
              }}
              className="px-3 py-2 rounded-lg bg-surface-subtle text-on-surface text-xs font-medium hover:bg-border-crisp transition-colors flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[16px]">
                {tokenCopied ? 'check' : 'content_copy'}
              </span>
              {tokenCopied ? 'Copied' : 'Copy Token'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
