import React from 'react';
import { PATIENT_DATA, DOCTORS } from '../data/mockData';

interface ProfileScreenProps {
  onOpenQr: () => void;
  onOpenClinicalDesk: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  onOpenQr,
  onOpenClinicalDesk,
}) => {
  return (
    <div className="flex flex-col w-full max-w-md mx-auto px-space-md pt-space-md pb-24 space-y-space-md">
      {/* Profile Header */}
      <div className="bg-surface-card p-space-md rounded-2xl border border-border-crisp shadow-sm text-center">
        <div className="relative w-20 h-20 mx-auto rounded-full overflow-hidden mb-3 border-2 border-secondary shadow-md">
          <img
            src={PATIENT_DATA.avatarUrl}
            alt={PATIENT_DATA.name}
            className="w-full h-full object-cover"
          />
          <span className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-status-verified border-2 border-white"></span>
        </div>

        <h2 className="text-headline-md font-bold text-on-surface">{PATIENT_DATA.name}</h2>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-status-verified-bg text-status-verified text-xs font-semibold mt-1 border border-status-verified-border">
          <span className="w-2 h-2 rounded-full bg-status-verified"></span>
          {PATIENT_DATA.tier}
        </div>

        <p className="text-xs text-on-surface-variant mt-2 font-mono">
          ABHA ID: <span className="text-secondary font-bold">{PATIENT_DATA.abhaId}</span>
        </p>

        <button
          onClick={onOpenQr}
          className="mt-4 px-4 py-2 bg-surface-canvas hover:bg-surface-subtle border border-border-crisp rounded-xl text-xs font-semibold text-on-surface flex items-center justify-center gap-2 mx-auto transition-colors"
        >
          <span className="material-symbols-outlined text-[18px] text-secondary">qr_code_2</span>
          View Cryptographic Health Token
        </button>
      </div>

      {/* Bio-Parity Savings Summary */}
      <div className="bg-surface-card p-space-md rounded-xl border border-border-crisp shadow-sm space-y-3">
        <h3 className="font-bold text-xs uppercase tracking-wider text-on-surface">
          Generic Parity Financial Impact
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-status-verified-bg rounded-xl border border-status-verified-border">
            <span className="text-[10px] text-status-verified font-medium block">2026 YTD Saved</span>
            <span className="text-xl font-bold text-status-verified">${PATIENT_DATA.stats.ytdSaved}</span>
            <span className="text-[10px] text-status-verified/80 block mt-0.5">92% avg vs brand Rx</span>
          </div>
          <div className="p-3 bg-surface-canvas rounded-xl border border-border-crisp">
            <span className="text-[10px] text-on-surface-variant font-medium block">Lifetime Savings</span>
            <span className="text-xl font-bold text-on-surface">$1,480</span>
            <span className="text-[10px] text-on-surface-variant/80 block mt-0.5">Across 18 refills</span>
          </div>
        </div>
      </div>

      {/* Associated Care Network */}
      <div className="bg-surface-card p-space-md rounded-xl border border-border-crisp shadow-sm space-y-3">
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-xs uppercase tracking-wider text-on-surface">
            Clinical Care Network
          </h3>
          <span className="text-xs text-secondary font-semibold">2 Physicians</span>
        </div>

        <div className="space-y-2 text-xs">
          {DOCTORS.map((doc) => (
            <div
              key={doc.id}
              className="p-2.5 bg-surface-canvas rounded-xl border border-border-crisp flex justify-between items-center"
            >
              <div>
                <span className="font-semibold text-on-surface block">{doc.name}</span>
                <span className="text-[11px] text-on-surface-variant">{doc.specialty}</span>
              </div>
              <span className="text-[10px] font-mono text-status-verified bg-status-verified-bg px-2 py-0.5 rounded border border-status-verified-border">
                Connected
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Security & Regulatory Compliance */}
      <div className="bg-surface-card p-space-md rounded-xl border border-border-crisp shadow-sm space-y-3 text-xs">
        <h3 className="font-bold text-xs uppercase tracking-wider text-on-surface">
          Vault Security & Privacy
        </h3>

        <div className="space-y-2">
          <div className="flex items-center justify-between p-2 rounded bg-surface-canvas border border-border-crisp">
            <span className="text-on-surface-variant">HIPAA & GDPR Encryption</span>
            <span className="text-status-verified font-mono font-bold">AES-256 ACTIVE</span>
          </div>
          <div className="flex items-center justify-between p-2 rounded bg-surface-canvas border border-border-crisp">
            <span className="text-on-surface-variant">CDSCO Protocol Compliance</span>
            <span className="font-mono text-on-surface">#SMC-GEN-1940</span>
          </div>
          <div className="flex items-center justify-between p-2 rounded bg-surface-canvas border border-border-crisp">
            <span className="text-on-surface-variant">Pharmacist Clinical Desk</span>
            <button
              onClick={onOpenClinicalDesk}
              className="text-secondary font-semibold hover:underline"
            >
              Connect 24/7
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
