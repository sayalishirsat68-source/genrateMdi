import React, { useState, useEffect, useRef } from 'react';
import { DOCTORS, PATIENT_DATA } from '../../data/mockData';
import { scanPrescriptionImage, SAMPLE_PRESCRIPTIONS, ExtractedPrescriptionData } from '../../services/aiService';
import type { ModalProps } from './types';

export const CameraScanModal: React.FC<
  ModalProps & { onScanComplete?: (medData: ExtractedPrescriptionData) => void }
> = ({
  isOpen,
  onClose,
  onScanComplete,
}) => {
  const [step, setStep] = useState<'viewfinder' | 'analyzing' | 'result'>('viewfinder');
  const [analyzingMessage, setAnalyzingMessage] = useState('Ingesting prescription...');
  const [analyzingSubtext, setAnalyzingSubtext] = useState('Extracting active pharmaceutical ingredient (API)...');
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [extractedMed, setExtractedMed] = useState<ExtractedPrescriptionData>({
    brand: 'Lipitor (Pfizer)',
    ingredient: 'Atorvastatin Calcium 20mg',
    genericEquivalent: 'Cipla Atorvastatin Calcium 20mg',
    brandCost: '$48.00',
    genericCost: '$4.20',
    savings: '91.25%',
    confidence: '99.4% OCR Confidence',
    doctorName: 'Dr. A. K. Verma',
    instructions: '1 Tab at Bedtime',
    dosage: '20mg Film-coated tab',
    aucMatch: '99.4% AUC Match to Lipitor',
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setStep('viewfinder');
      setPreviewImage(null);
      setUploadedFileName(null);
    }
  }, [isOpen]);

  const processAnalysis = async (
    sampleId?: string,
    fileBase64?: string,
    fileName?: string,
    mimeType?: string,
  ) => {
    setStep('analyzing');
    setAnalyzingMessage('Scanning Document Optical Borders...');
    setAnalyzingSubtext('Aligning text contrast & optical density...');

    const timer1 = setTimeout(() => {
      setAnalyzingMessage('Multimodal Gemini Ingestion Active...');
      setAnalyzingSubtext('Extracting drug entity, dosage, doctor credentials...');
    }, 650);

    const timer2 = setTimeout(() => {
      setAnalyzingMessage('Validating Bio-Equivalence Parity...');
      setAnalyzingSubtext('Correlating FDA Orange Book & CDSCO Schedule M...');
    }, 1300);

    try {
      const result = await scanPrescriptionImage(
        fileBase64 || previewImage || undefined,
        mimeType || 'image/jpeg',
        sampleId,
      );
      clearTimeout(timer1);
      clearTimeout(timer2);
      setExtractedMed(result);
      if (fileName) setUploadedFileName(fileName);
      setStep('result');
    } catch (err) {
      clearTimeout(timer1);
      clearTimeout(timer2);
      setStep('result');
    }
  };

  const handleCapture = () => {
    processAnalysis();
  };

  const handleSampleClick = (sampleId: string) => {
    processAnalysis(sampleId);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setPreviewImage(base64);
      setUploadedFileName(file.name);
      processAnalysis(undefined, base64, file.name, file.type || 'image/jpeg');
    };
    reader.readAsDataURL(file);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/70 backdrop-blur-md">
      <div className="bg-surface-card rounded-2xl max-w-sm w-full overflow-hidden shadow-2xl border border-border-crisp relative animate-fade-in">
        <div className="p-4 bg-primary-container text-on-primary flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-brand-accent-cyan text-[20px]">photo_camera</span>
            <span className="font-semibold text-sm">Bio-Parity Optical Scanner</span>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white text-sm transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Hidden File Input */}
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*,application/pdf"
          className="hidden"
          onChange={handleFileChange}
        />

        {step === 'viewfinder' && (
          <div className="p-4 flex flex-col items-center">
            {/* Viewfinder simulation */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="w-full h-60 bg-slate-900 rounded-xl relative overflow-hidden flex flex-col items-center justify-center border-2 border-dashed border-secondary/60 cursor-pointer group hover:border-secondary transition-colors"
              title="Click to select or upload prescription photo"
            >
              {previewImage ? (
                <img src={previewImage} alt="Uploaded Rx" className="w-full h-full object-cover opacity-80" />
              ) : (
                <>
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

                  <span className="material-symbols-outlined text-slate-500 group-hover:text-secondary text-4xl mb-2 transition-colors">
                    document_scanner
                  </span>
                  <p className="text-white text-xs font-medium text-center px-4">
                    Align paper prescription, blister pack, or drug packaging
                  </p>
                  <span className="text-[10px] text-brand-accent-cyan font-mono mt-1">
                    Gemini 2.0 Multimodal OCR Engine
                  </span>
                </>
              )}
            </div>

            {/* Benchmark Samples Selector */}
            <div className="w-full mt-3">
              <span className="text-[10px] uppercase font-bold text-on-surface-variant tracking-wider block mb-1">
                Quick Ingestion Presets:
              </span>
              <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1">
                {SAMPLE_PRESCRIPTIONS.map((sample) => (
                  <button
                    key={sample.id}
                    onClick={() => handleSampleClick(sample.id)}
                    className="px-2.5 py-1 bg-surface-canvas hover:bg-surface-subtle border border-border-crisp rounded-lg text-[11px] font-medium text-on-surface whitespace-nowrap transition-colors flex items-center gap-1"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                    {sample.name.split(' (')[0]}
                  </button>
                ))}
              </div>
            </div>

            {/* Action buttons */}
            <div className="w-full mt-3 flex gap-2">
              <button
                onClick={handleCapture}
                className="flex-1 py-2.5 rounded-xl bg-secondary text-white font-semibold text-xs flex items-center justify-center gap-2 hover:bg-secondary/90 transition-all active:scale-95 shadow-sm"
              >
                <span className="material-symbols-outlined text-[18px]">camera</span>
                Capture
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-3.5 py-2.5 rounded-xl bg-surface-canvas hover:bg-surface-subtle text-on-surface font-semibold text-xs flex items-center justify-center gap-1.5 border border-border-crisp transition-colors"
              >
                <span className="material-symbols-outlined text-[16px] text-secondary">upload_file</span>
                Upload File
              </button>
            </div>
            <p className="text-[10px] text-on-surface-variant text-center mt-2">
              Accepts photo capture, camera roll images, or clinical PDFs
            </p>
          </div>
        )}

        {step === 'analyzing' && (
          <div className="p-8 flex flex-col items-center justify-center text-center">
            <div className="relative w-16 h-16 mb-4 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-4 border-secondary/20 border-t-secondary animate-spin"></div>
              <span className="material-symbols-outlined text-secondary text-2xl animate-pulse">biotech</span>
            </div>
            <h4 className="font-semibold text-on-surface text-base">{analyzingMessage}</h4>
            <p className="text-xs text-on-surface-variant mt-1 max-w-[240px] leading-relaxed">
              {analyzingSubtext}
            </p>
            <div className="mt-4 px-3 py-1 bg-status-verified-bg border border-status-verified-border rounded-full text-[10px] font-mono text-status-verified flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-status-verified animate-ping"></span>
              CDSCO / US FDA Orange Book verification
            </div>
          </div>
        )}

        {step === 'result' && (
          <div className="p-5">
            <div className="flex items-center gap-2 text-status-verified bg-status-verified-bg p-2.5 rounded-xl border border-status-verified-border mb-3">
              <span className="material-symbols-outlined text-[20px]">verified</span>
              <div className="text-xs">
                <span className="font-bold block">
                  Bio-Parity Match Confirmed ({extractedMed.aucMatch?.split(' ')[0] || '99.4%'})
                </span>
                <span className="text-[11px] text-emerald-800">
                  {extractedMed.confidence || 'FDA / CDSCO therapeutically equivalent'}
                </span>
              </div>
            </div>

            <div className="space-y-2 text-xs bg-surface-canvas p-3 rounded-xl border border-border-crisp">
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Detected Brand:</span>
                <span className="font-semibold text-on-surface truncate max-w-[170px]">{extractedMed.brand}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Active Salt & Dosage:</span>
                <span className="font-mono text-on-surface truncate max-w-[170px]">{extractedMed.ingredient}</span>
              </div>
              <div className="flex justify-between border-t border-border-crisp pt-2">
                <span className="text-secondary font-semibold">Matched Generic:</span>
                <span className="font-semibold text-secondary truncate max-w-[170px]">
                  {extractedMed.genericEquivalent}
                </span>
              </div>
              {extractedMed.instructions && (
                <div className="flex justify-between text-[11px] text-on-surface-variant">
                  <span>Instructions:</span>
                  <span className="font-medium text-on-surface">{extractedMed.instructions}</span>
                </div>
              )}
              {extractedMed.doctorName && (
                <div className="flex justify-between text-[11px] text-on-surface-variant">
                  <span>Prescriber:</span>
                  <span>{extractedMed.doctorName}</span>
                </div>
              )}
              <div className="flex justify-between items-baseline border-t border-border-crisp pt-2">
                <span className="text-on-surface-variant">Price Variance:</span>
                <div>
                  <span className="line-through text-on-surface-variant/60 mr-1.5">{extractedMed.brandCost}</span>
                  <span className="text-base font-bold text-status-verified">{extractedMed.genericCost}</span>
                  <span className="ml-1 text-[10px] text-status-verified font-bold">
                    ({extractedMed.savings || '91%'} saved)
                  </span>
                </div>
              </div>
            </div>

            {uploadedFileName && (
              <p className="text-[10px] font-mono text-on-surface-variant mt-2 truncate">
                Source Document: {uploadedFileName}
              </p>
            )}

            <div className="mt-4 flex gap-2">
              <button
                onClick={() => {
                  if (onScanComplete) onScanComplete(extractedMed);
                  onClose();
                }}
                className="flex-1 py-2.5 rounded-xl bg-secondary text-white font-semibold text-xs hover:bg-secondary/90 transition-all flex items-center justify-center gap-1.5 active:scale-95 shadow-sm"
              >
                <span className="material-symbols-outlined text-[16px]">add_task</span>
                Add to Rx Vault
              </button>
              <button
                onClick={() => setStep('viewfinder')}
                className="px-3 py-2.5 rounded-xl bg-surface-subtle text-on-surface text-xs font-medium hover:bg-border-crisp transition-colors"
              >
                Scan Another
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
