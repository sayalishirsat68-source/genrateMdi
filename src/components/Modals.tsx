import React, { useState, useEffect } from 'react';
import { DOCTORS, PATIENT_DATA } from '../data/mockData';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QrPassModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
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
              ECDSA-P256 Signed: 0x8F92...B41C
            </span>
          </div>

          <p className="text-xs text-on-surface-variant leading-relaxed">
            Scan at any verified pharmacy or hospital terminal for instant bio-parity verification and clinical record exchange.
          </p>

          <div className="mt-4 pt-4 border-t border-border-crisp flex gap-2">
            <button
              onClick={() => {
                alert('Digital Health Pass saved to Apple Wallet / Google Pay format.');
                onClose();
              }}
              className="flex-1 py-2 rounded-lg bg-secondary text-on-secondary text-xs font-semibold hover:bg-secondary/90 transition-colors"
            >
              Add to Wallet
            </button>
            <button
              onClick={() => {
                navigator.clipboard?.writeText(PATIENT_DATA.abhaId);
                alert('ABHA Token copied to clipboard.');
              }}
              className="px-3 py-2 rounded-lg bg-surface-subtle text-on-surface text-xs font-medium hover:bg-border-crisp transition-colors"
            >
              Copy Token
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const CameraScanModal: React.FC<ModalProps & { onScanComplete?: (medName: string) => void }> = ({
  isOpen,
  onClose,
  onScanComplete,
}) => {
  const [step, setStep] = useState<'viewfinder' | 'analyzing' | 'result'>('viewfinder');
  const [extractedMed, setExtractedMed] = useState({
    brand: 'Lipitor (Pfizer)',
    ingredient: 'Atorvastatin 20mg',
    genericEquivalent: 'Cipla Atorvastatin Calcium 20mg',
    brandCost: '$48.00',
    genericCost: '$4.20',
    savings: '91.25%',
    confidence: '99.4% OCR Confidence',
  });

  useEffect(() => {
    if (isOpen) {
      setStep('viewfinder');
    }
  }, [isOpen]);

  const handleCapture = () => {
    setStep('analyzing');
    setTimeout(() => {
      setStep('result');
    }, 1800);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/70 backdrop-blur-md">
      <div className="bg-surface-card rounded-2xl max-w-sm w-full overflow-hidden shadow-2xl border border-border-crisp relative">
        <div className="p-4 bg-primary-container text-on-primary flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-brand-accent-cyan text-[20px]">photo_camera</span>
            <span className="font-semibold text-sm">Bio-Parity Optical Scanner</span>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white text-sm"
          >
            ✕
          </button>
        </div>

        {step === 'viewfinder' && (
          <div className="p-4 flex flex-col items-center">
            {/* Viewfinder simulation */}
            <div className="w-full h-64 bg-slate-900 rounded-xl relative overflow-hidden flex flex-col items-center justify-center border-2 border-dashed border-secondary/60">
              <div className="absolute inset-4 border border-secondary/30 rounded pointer-events-none flex flex-col justify-between p-2">
                <div className="flex justify-between">
                  <div className="w-4 h-4 border-t-2 border-l-2 border-secondary"></div>
                  <div className="w-4 h-4 border-t-2 border-r-2 border-secondary"></div>
                </div>
                <div className="flex justify-between">
                  <div className="w-4 h-4 border-b-2 border-l-2 border-secondary"></div>
                  <div className="w-4 h-4 border-b-2 border-r-2 border-secondary"></div>
                </div>
              </div>

              {/* Laser scanning beam */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-brand-accent-cyan to-transparent animate-[pulse_2s_infinite]"></div>

              <span className="material-symbols-outlined text-slate-500 text-4xl mb-2">document_scanner</span>
              <p className="text-white text-xs font-medium text-center px-4">
                Align paper prescription, blister pack, or drug packaging within frame
              </p>
              <span className="text-[10px] text-brand-accent-cyan font-mono mt-1">
                FDA Orange Book AI Matching active
              </span>
            </div>

            <div className="w-full mt-4 flex gap-2">
              <button
                onClick={handleCapture}
                className="flex-1 py-3 rounded-xl bg-secondary text-white font-semibold text-sm flex items-center justify-center gap-2 hover:bg-secondary/90 transition-all active:scale-95"
              >
                <span className="material-symbols-outlined text-[18px]">camera</span>
                Capture Prescription
              </button>
            </div>
            <p className="text-[11px] text-on-surface-variant text-center mt-2">
              Or drag & drop prescription image or PDF here
            </p>
          </div>
        )}

        {step === 'analyzing' && (
          <div className="p-8 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-full border-4 border-secondary/20 border-t-secondary animate-spin mb-4"></div>
            <h4 className="font-semibold text-on-surface text-base">Ingesting Prescription...</h4>
            <p className="text-xs text-on-surface-variant mt-1">
              Extracting active pharmaceutical ingredient (API), dosage, & verifying pharmacokinetics...
            </p>
            <div className="mt-4 px-3 py-1 bg-surface-subtle rounded-full text-[11px] font-mono text-secondary">
              CDSCO / FDA orange book match...
            </div>
          </div>
        )}

        {step === 'result' && (
          <div className="p-5">
            <div className="flex items-center gap-2 text-status-verified bg-status-verified-bg p-2.5 rounded-lg border border-status-verified-border mb-3">
              <span className="material-symbols-outlined text-[20px]">check_circle</span>
              <div className="text-xs">
                <span className="font-bold block">Bio-Parity Match Confirmed (99.4%)</span>
                <span>FDA / CDSCO therapeutically equivalent</span>
              </div>
            </div>

            <div className="space-y-2.5 text-xs bg-surface-canvas p-3 rounded-xl border border-border-crisp">
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Detected Brand:</span>
                <span className="font-semibold text-on-surface">{extractedMed.brand}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Active Salt:</span>
                <span className="font-mono text-on-surface">{extractedMed.ingredient}</span>
              </div>
              <div className="flex justify-between border-t border-border-crisp pt-2">
                <span className="text-secondary font-semibold">Matched Generic:</span>
                <span className="font-semibold text-secondary">{extractedMed.genericEquivalent}</span>
              </div>
              <div className="flex justify-between items-baseline pt-1">
                <span className="text-on-surface-variant">Price Comparison:</span>
                <div>
                  <span className="line-through text-on-surface-variant/60 mr-1.5">{extractedMed.brandCost}</span>
                  <span className="text-base font-bold text-status-verified">{extractedMed.genericCost}</span>
                  <span className="ml-1 text-[10px] text-status-verified font-bold">({extractedMed.savings} off)</span>
                </div>
              </div>
            </div>

            <div className="mt-4 flex gap-2">
              <button
                onClick={() => {
                  if (onScanComplete) onScanComplete(extractedMed.genericEquivalent);
                  onClose();
                }}
                className="flex-1 py-2.5 rounded-xl bg-secondary text-white font-semibold text-xs hover:bg-secondary/90 transition-colors flex items-center justify-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[16px]">add_task</span>
                Add to Rx Vault
              </button>
              <button
                onClick={() => setStep('viewfinder')}
                className="px-3 py-2.5 rounded-xl bg-surface-subtle text-on-surface text-xs font-medium hover:bg-border-crisp transition-colors"
              >
                Retake
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

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
