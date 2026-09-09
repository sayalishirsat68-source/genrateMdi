import React, { useState } from 'react';
import {
  PATIENT_DATA,
  INITIAL_PRESCRIPTIONS,
  VITALS_DATA,
  DOCTORS,
  DOCUMENTS,
} from '../data/mockData';
import { VaultSegment, RxFilter, Prescription } from '../types';

interface RxVaultScreenProps {
  prescriptions?: Prescription[];
  onOpenQr: () => void;
  onOpenScan: () => void;
  onOpenPdf: (filename?: string) => void;
  onOpenCoA: () => void;
  onOpenClinicalDesk: () => void;
  onOpenDosageGuide: () => void;
  onOpenAUC: () => void;
  onAddToCart: (rx: Prescription) => void;
}

export const RxVaultScreen: React.FC<RxVaultScreenProps> = ({
  prescriptions: propPrescriptions,
  onOpenQr,
  onOpenScan,
  onOpenPdf,
  onOpenCoA,
  onOpenClinicalDesk,
  onOpenDosageGuide,
  onOpenAUC,
  onAddToCart,
}) => {
  const [activeSegment, setActiveSegment] = useState<VaultSegment>('prescriptions');
  const [activeFilter, setActiveFilter] = useState<RxFilter>('all');
  const [localPrescriptions] = useState<Prescription[]>(INITIAL_PRESCRIPTIONS);
  const [refillState, setRefillState] = useState<{ [key: string]: 'idle' | 'queuing' | 'scheduled' }>({});
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [sortBy, setSortBy] = useState<'default' | 'urgency' | 'price'>('default');

  const basePrescriptions = propPrescriptions || localPrescriptions;

  // One-tap refill handler matching the user's interactive script
  const handleRefill = (rxId: string) => {
    setRefillState((prev) => ({ ...prev, [rxId]: 'queuing' }));
    setTimeout(() => {
      setRefillState((prev) => ({ ...prev, [rxId]: 'scheduled' }));
      const rx = basePrescriptions.find((p) => p.id === rxId);
      if (rx) {
        onAddToCart(rx);
      }
      setTimeout(() => {
        setRefillState((prev) => ({ ...prev, [rxId]: 'idle' }));
      }, 3500);
    }, 900);
  };

  // Sort and filter prescriptions based on chips and sort order
  const sortedPrescriptions = [...basePrescriptions].sort((a, b) => {
    if (sortBy === 'urgency') return (a.daysLeft || 99) - (b.daysLeft || 99);
    if (sortBy === 'price') return a.directGenericPrice - b.directGenericPrice;
    return 0;
  });

  const filteredPrescriptions = sortedPrescriptions.filter((rx) => {
    if (activeFilter === 'needs-refill') return rx.status === 'critical';
    if (activeFilter === 'chronic') return rx.status === 'active';
    if (activeFilter === 'archived') return rx.status === 'completed';
    return true;
  });

  const criticalCount = basePrescriptions.filter((p) => p.status === 'critical').length;
  const chronicCount = basePrescriptions.filter((p) => p.status === 'active').length;
  const archivedCount = basePrescriptions.filter((p) => p.status === 'completed').length;
  const activeCount = basePrescriptions.filter((p) => p.status !== 'completed').length;
  const minDaysLeft = basePrescriptions
    .filter((p) => p.status === 'critical' && p.daysLeft !== undefined)
    .map((p) => p.daysLeft as number)
    .reduce((min, cur) => (cur < min ? cur : min), 4);

  const exportHistoryPDF = () => {
    onOpenPdf('Clinical_Rx_History_RobertC_Sept2026.pdf');
  };

  return (
    <div className="flex flex-col w-full max-w-md mx-auto pb-24">
      {/* Patient Profile Header Tile */}
      <section className="px-space-md pt-space-md pb-space-sm bg-surface-container-lowest shadow-sm border-b border-border-crisp/60">
        <div className="flex items-start justify-between gap-space-sm">
          <div className="flex items-center gap-space-sm">
            <div className="relative w-14 h-14 rounded-full overflow-hidden shadow-sm flex-shrink-0">
              <img
                className="w-full h-full object-cover"
                alt="Robert C. portrait"
                src={PATIENT_DATA.avatarUrl}
              />
              <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-status-verified border-2 border-white"></span>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-space-xs flex-wrap">
                <h1 className="font-semibold text-headline-md text-on-surface truncate">
                  {PATIENT_DATA.name}
                </h1>
                <span className="font-semibold text-label-sm px-space-xs py-space-2xs rounded-full bg-status-verified-bg text-status-verified uppercase border border-status-verified-border">
                  {PATIENT_DATA.tier}
                </span>
              </div>
              <p className="text-body-sm text-on-surface-variant flex items-center gap-space-xs mt-0.5">
                <span>{PATIENT_DATA.age} yo {PATIENT_DATA.gender}</span>
                <span className="text-on-surface-variant/40">•</span>
                <span className="font-mono text-code-xs text-secondary font-medium tracking-tight">
                  ABHA: {PATIENT_DATA.abhaId}
                </span>
              </p>
            </div>
          </div>
          <button
            onClick={onOpenQr}
            className="w-9 h-9 rounded-full bg-surface-subtle flex items-center justify-center text-on-surface-variant hover:text-on-surface transition-colors hover:bg-border-crisp"
            title="Manage Digital Health Pass"
          >
            <span className="material-symbols-outlined text-[20px]">qr_code_2</span>
          </button>
        </div>

        {/* Quick Stats Bento Strip */}
        <div className="grid grid-cols-4 gap-space-xs mt-space-md">
          <button
            onClick={() => {
              setActiveSegment('prescriptions');
              setActiveFilter('all');
            }}
            className="bg-surface-canvas hover:bg-surface-subtle p-space-xs rounded-xl flex flex-col items-center text-center transition-colors border border-border-crisp/60"
          >
            <span className="font-semibold text-headline-sm text-on-surface leading-tight">
              {activeCount}
            </span>
            <span className="text-label-sm text-on-surface-variant mt-0.5">Active Rx</span>
          </button>
          <button
            onClick={onOpenAUC}
            className="bg-status-verified-bg hover:bg-emerald-100 p-space-xs rounded-xl flex flex-col items-center text-center transition-colors border border-status-verified-border"
          >
            <span className="font-semibold text-headline-sm text-status-verified leading-tight">
              ${PATIENT_DATA.stats.ytdSaved}
            </span>
            <span className="text-label-sm text-status-verified font-medium mt-0.5">
              YTD Saved
            </span>
          </button>
          <button
            onClick={() => setActiveSegment('doctors')}
            className="bg-surface-canvas hover:bg-surface-subtle p-space-xs rounded-xl flex flex-col items-center text-center transition-colors border border-border-crisp/60"
          >
            <span className="font-semibold text-headline-sm text-on-surface leading-tight">
              {PATIENT_DATA.stats.doctorsCount}
            </span>
            <span className="text-label-sm text-on-surface-variant mt-0.5">Doctors</span>
          </button>
          <button
            onClick={() => {
              setActiveSegment('prescriptions');
              setActiveFilter('needs-refill');
            }}
            className="bg-status-pending-bg hover:bg-amber-100 p-space-xs rounded-xl flex flex-col items-center text-center transition-colors border border-status-pending-border"
          >
            <span className="font-semibold text-headline-sm text-status-pending leading-tight">
              {minDaysLeft}d
            </span>
            <span className="text-label-sm text-status-pending font-medium mt-0.5">
              Refill Due
            </span>
          </button>
        </div>

        {/* Bio-Parity Value Proposition Indicator */}
        <div
          onClick={onOpenAUC}
          className="mt-space-sm bg-surface-subtle hover:bg-slate-200 p-space-xs rounded-lg flex items-center justify-between gap-space-xs cursor-pointer transition-colors"
        >
          <div className="flex items-center gap-space-xs min-w-0">
            <span className="material-symbols-outlined text-[16px] text-secondary">
              verified_user
            </span>
            <span className="text-label-sm text-on-surface truncate font-medium">
              92% Average savings via Bio-Generics
            </span>
          </div>
          <span className="font-mono text-code-xs text-status-verified font-medium whitespace-nowrap">
            FDA / CDSCO Equal
          </span>
        </div>

        {/* Segment Controls */}
        <div className="flex items-center gap-space-xs overflow-x-auto no-scrollbar mt-space-md py-space-2xs">
          <button
            onClick={() => setActiveSegment('prescriptions')}
            className={`px-space-sm py-1.5 rounded-full font-semibold text-label-md whitespace-nowrap shadow-sm transition-all ${
              activeSegment === 'prescriptions'
                ? 'bg-secondary text-on-secondary'
                : 'bg-surface-subtle text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Prescriptions & Refills ({basePrescriptions.length})
          </button>
          <button
            onClick={() => setActiveSegment('vitals')}
            className={`px-space-sm py-1.5 rounded-full font-semibold text-label-md whitespace-nowrap transition-all ${
              activeSegment === 'vitals'
                ? 'bg-secondary text-on-secondary'
                : 'bg-surface-subtle text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Clinical Vitals
          </button>
          <button
            onClick={() => setActiveSegment('doctors')}
            className={`px-space-sm py-1.5 rounded-full font-semibold text-label-md whitespace-nowrap transition-all ${
              activeSegment === 'doctors'
                ? 'bg-secondary text-on-secondary'
                : 'bg-surface-subtle text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Doctor Network ({DOCTORS.length})
          </button>
          <button
            onClick={() => setActiveSegment('documents')}
            className={`px-space-sm py-1.5 rounded-full font-semibold text-label-md whitespace-nowrap transition-all ${
              activeSegment === 'documents'
                ? 'bg-secondary text-on-secondary'
                : 'bg-surface-subtle text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Documents & CoAs ({DOCUMENTS.length})
          </button>
        </div>
      </section>

      {/* SEGMENT 1: PRESCRIPTIONS & REFILLS */}
      {activeSegment === 'prescriptions' && (
        <>
          {/* Rx Vault Filter Chips */}
          <div className="px-space-md pt-space-md pb-space-xs flex items-center justify-between">
            <div className="flex items-center gap-space-xs overflow-x-auto no-scrollbar">
              <button
                onClick={() => setActiveFilter('all')}
                className={`filter-pill px-space-sm py-1 rounded-full font-semibold text-label-sm whitespace-nowrap transition-all ${
                  activeFilter === 'all'
                    ? 'bg-primary text-on-primary'
                    : 'bg-surface-card text-on-surface-variant hover:text-on-surface shadow-sm'
                }`}
              >
                All ({basePrescriptions.length})
              </button>
              <button
                onClick={() => setActiveFilter('needs-refill')}
                className={`filter-pill px-space-sm py-1 rounded-full font-semibold text-label-sm whitespace-nowrap transition-all ${
                  activeFilter === 'needs-refill'
                    ? 'bg-status-critical-bg text-status-critical border border-status-critical-border ring-1 ring-status-critical'
                    : 'bg-status-critical-bg text-status-critical border border-status-critical-border'
                }`}
              >
                Needs Refill ({criticalCount})
              </button>
              <button
                onClick={() => setActiveFilter('chronic')}
                className={`filter-pill px-space-sm py-1 rounded-full font-semibold text-label-sm whitespace-nowrap transition-all ${
                  activeFilter === 'chronic'
                    ? 'bg-primary text-on-primary'
                    : 'bg-surface-card text-on-surface-variant hover:text-on-surface shadow-sm'
                }`}
              >
                Chronic Care ({chronicCount})
              </button>
              <button
                onClick={() => setActiveFilter('archived')}
                className={`filter-pill px-space-sm py-1 rounded-full font-semibold text-label-sm whitespace-nowrap transition-all ${
                  activeFilter === 'archived'
                    ? 'bg-primary text-on-primary'
                    : 'bg-surface-card text-on-surface-variant hover:text-on-surface shadow-sm'
                }`}
              >
                Archived ({archivedCount})
              </button>
            </div>
            <button
              onClick={() => setShowSortMenu(!showSortMenu)}
              className="text-on-surface-variant hover:text-on-surface p-1 rounded-md hover:bg-surface-subtle"
              title="Sort and filter options"
            >
              <span className="material-symbols-outlined text-[18px]">tune</span>
            </button>
          </div>

          {/* Sort Menu popover if toggled */}
          {showSortMenu && (
            <div className="mx-space-md mb-2 p-3 bg-surface-card border border-border-crisp rounded-xl shadow-md flex items-center justify-between text-xs">
              <span className="text-on-surface-variant font-medium">Sort Prescriptions:</span>
              <div className="flex gap-1.5">
                <button
                  onClick={() => {
                    setSortBy('urgency');
                    setShowSortMenu(false);
                  }}
                  className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                    sortBy === 'urgency' ? 'bg-secondary text-white' : 'bg-surface-subtle hover:bg-border-crisp text-on-surface'
                  }`}
                >
                  Refill Urgency
                </button>
                <button
                  onClick={() => {
                    setSortBy('price');
                    setShowSortMenu(false);
                  }}
                  className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                    sortBy === 'price' ? 'bg-secondary text-white' : 'bg-surface-subtle hover:bg-border-crisp text-on-surface'
                  }`}
                >
                  Price: Low to High
                </button>
                <button
                  onClick={() => {
                    setSortBy('default');
                    setShowSortMenu(false);
                  }}
                  className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                    sortBy === 'default' ? 'bg-secondary text-white' : 'bg-surface-subtle hover:bg-border-crisp text-on-surface'
                  }`}
                >
                  Default
                </button>
              </div>
            </div>
          )}

          {/* Main Prescription Cards Stream */}
          <div className="px-space-md flex flex-col gap-space-md mt-space-xs">
            {filteredPrescriptions.length === 0 ? (
              <div className="bg-surface-card p-8 rounded-xl border border-border-crisp text-center space-y-2">
                <span className="material-symbols-outlined text-4xl text-on-surface-variant/40">
                  medication
                </span>
                <h4 className="font-semibold text-sm text-on-surface">No Prescriptions in this Category</h4>
                <p className="text-xs text-on-surface-variant">
                  {activeFilter === 'needs-refill'
                    ? 'All your current prescriptions are well-stocked.'
                    : 'Switch back to "All" or upload a new prescription.'}
                </p>
                <button
                  onClick={() => setActiveFilter('all')}
                  className="mt-2 px-3 py-1.5 bg-secondary text-white rounded-lg text-xs font-semibold"
                >
                  View All Prescriptions
                </button>
              </div>
            ) : (
              filteredPrescriptions.map((rx) => (
                <article
                  key={rx.id}
                  className={`bg-surface-card rounded-xl p-space-md shadow-sm relative overflow-hidden border ${
                    rx.status === 'critical'
                      ? 'border-status-critical-border'
                      : 'border-border-crisp'
                  }`}
                >
                  {/* Status header banner */}
                  <div className="flex items-start justify-between gap-space-xs">
                    <div className="flex items-center gap-space-xs">
                      <span
                        className={`w-2.5 h-2.5 rounded-full ${
                          rx.status === 'critical'
                            ? 'bg-status-critical animate-pulse'
                            : rx.status === 'active'
                            ? 'bg-status-verified'
                            : 'bg-on-surface-variant/40'
                        }`}
                      ></span>
                      <span
                        className={`font-semibold text-label-sm uppercase tracking-wide ${
                          rx.status === 'critical'
                            ? 'text-status-critical'
                            : rx.status === 'active'
                            ? 'text-status-verified'
                            : 'text-on-surface-variant'
                        }`}
                      >
                        {rx.statusLabel}
                      </span>
                    </div>
                    <span className="font-mono text-code-xs bg-surface-subtle text-on-surface-variant px-space-xs py-space-2xs rounded">
                      {rx.remainingInfo}
                    </span>
                  </div>

                  {/* Main Pill info & image */}
                  <div className="flex gap-space-sm mt-space-sm">
                    <div className="w-14 h-14 rounded-lg bg-surface-subtle overflow-hidden flex-shrink-0 border border-border-crisp/60">
                      <img
                        className="w-full h-full object-cover"
                        alt={rx.imageAlt || rx.name}
                        src={rx.imageUrl}
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h2 className="font-semibold text-headline-sm text-on-surface leading-tight">
                        {rx.name}
                      </h2>
                      <p className="text-body-sm text-on-surface-variant mt-0.5">
                        {rx.dosage}
                      </p>
                      {rx.aucMatch && (
                        <div className="flex items-center gap-space-xs mt-1.5 flex-wrap">
                          <button
                            onClick={onOpenAUC}
                            className="inline-flex items-center gap-1 px-space-xs py-0.5 rounded bg-status-verified-bg text-status-verified font-semibold text-label-sm hover:bg-emerald-100 transition-colors"
                          >
                            <span className="material-symbols-outlined text-[14px]">biotech</span>
                            {rx.aucMatch}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* PDF & OCR verification strip if present */}
                  {rx.pdfFile && (
                    <div
                      onClick={() => onOpenPdf(rx.pdfFile)}
                      className="mt-space-sm p-space-xs bg-surface-canvas rounded-lg flex items-center justify-between gap-space-xs cursor-pointer hover:bg-surface-subtle transition-colors border border-border-crisp/40"
                    >
                      <div className="flex items-center gap-space-xs min-w-0">
                        <span className="material-symbols-outlined text-[16px] text-secondary">
                          description
                        </span>
                        <span className="font-mono text-code-xs text-on-surface truncate">
                          {rx.pdfFile}
                        </span>
                      </div>
                      <div className="flex items-center gap-space-2xs flex-shrink-0">
                        <span className="text-label-sm text-status-verified font-medium">
                          {rx.ocrMatch || '99.1% OCR Match'}
                        </span>
                        <span className="material-symbols-outlined text-[14px] text-status-verified">
                          verified
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Doctor & Schedule */}
                  <div className="mt-space-xs flex items-center justify-between text-body-sm text-on-surface-variant flex-wrap gap-1">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">person</span>
                      {rx.doctor} {rx.doctorSpecialty ? `(${rx.doctorSpecialty})` : ''}
                    </span>
                    <span className="flex items-center gap-1 text-on-surface font-medium">
                      <span className="material-symbols-outlined text-[14px] text-secondary">
                        schedule
                      </span>
                      {rx.instructions}
                    </span>
                  </div>

                  {/* Clinical note if present */}
                  {rx.clinicalNote && (
                    <div className="mt-space-sm p-space-xs bg-status-verified-bg/50 rounded-lg flex items-start gap-space-xs border border-status-verified-border/60">
                      <span className="material-symbols-outlined text-[16px] text-status-verified mt-0.5">
                        health_and_safety
                      </span>
                      <p className="text-body-sm text-on-surface leading-tight">
                        {rx.clinicalNote}
                      </p>
                    </div>
                  )}

                  {/* Delivery method note if present */}
                  {rx.deliveryMethod && (
                    <p className="text-body-sm text-on-surface-variant/80 mt-2 flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px] text-secondary">
                        local_shipping
                      </span>
                      {rx.deliveryMethod}
                    </p>
                  )}

                  {/* Certificate of analysis strip if available */}
                  {rx.coaAvailable && (
                    <div className="mt-space-sm flex items-center justify-between pt-space-xs bg-surface-subtle p-space-xs rounded-lg">
                      <div className="flex items-center gap-space-xs min-w-0">
                        <span className="material-symbols-outlined text-[16px] text-secondary">
                          workspace_premium
                        </span>
                        <span className="font-mono text-code-xs text-on-surface font-medium truncate max-w-[200px]">
                          {rx.batchNumber || 'Batch Certificate of Analysis (CoA)'}
                        </span>
                      </div>
                      <button
                        onClick={onOpenCoA}
                        className="text-secondary font-semibold text-label-sm hover:underline flex items-center gap-0.5 flex-shrink-0"
                      >
                        View CoA
                      </button>
                    </div>
                  )}

                  {/* Auto-ship & Dosage guide row if active */}
                  {rx.status === 'active' && (
                    <div className="mt-space-sm flex items-center justify-between pt-space-xs">
                      <div className="flex items-center gap-space-xs text-body-sm text-on-surface-variant">
                        <span className="material-symbols-outlined text-[16px] text-on-surface-variant">
                          autorenew
                        </span>
                        <span>{rx.autoShipDate || 'Auto-refill enrolled'}</span>
                      </div>
                      <button
                        onClick={onOpenDosageGuide}
                        className="font-semibold text-label-md text-secondary hover:underline flex items-center gap-0.5"
                      >
                        Dosage Guide
                        <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                      </button>
                    </div>
                  )}

                  {/* Refill CTA Block */}
                  {rx.status !== 'completed' && (
                    <div className="mt-space-md pt-space-sm bg-surface-subtle -mx-space-md -mb-space-md px-space-md pb-space-sm flex items-center justify-between gap-space-sm border-t border-border-crisp">
                      <div>
                        <span className="text-label-sm text-on-surface-variant block font-medium">
                          Direct Generic Price
                        </span>
                        <span className="text-headline-sm text-on-surface leading-none font-bold">
                          ${rx.directGenericPrice.toFixed(2)}{' '}
                          <span className="text-body-sm line-through text-on-surface-variant/60 font-normal">
                            ${rx.innovatorPrice.toFixed(2)}
                          </span>
                        </span>
                      </div>
                      <div className="flex items-center gap-space-xs">
                        <button
                          onClick={onOpenScan}
                          className="px-space-sm py-2 rounded-lg bg-surface-card hover:bg-surface-canvas text-on-surface font-semibold text-label-md flex items-center gap-1 shadow-sm transition-colors border border-border-crisp"
                        >
                          <span className="material-symbols-outlined text-[16px]">visibility</span>
                          Scan
                        </button>
                        <button
                          onClick={() => handleRefill(rx.id)}
                          disabled={refillState[rx.id] === 'queuing'}
                          className={`px-space-md py-2 rounded-lg font-semibold text-label-md flex items-center gap-1 shadow-sm transition-transform active:scale-95 ${
                            refillState[rx.id] === 'scheduled'
                              ? 'bg-status-verified text-on-secondary'
                              : 'bg-secondary hover:bg-secondary/90 text-on-secondary'
                          }`}
                        >
                          {refillState[rx.id] === 'queuing' ? (
                            <>
                              <span className="material-symbols-outlined text-[16px] animate-spin">
                                progress_activity
                              </span>
                              Queuing...
                            </>
                          ) : refillState[rx.id] === 'scheduled' ? (
                            <>
                              <span className="material-symbols-outlined text-[16px]">
                                check_circle
                              </span>
                              Scheduled!
                            </>
                          ) : (
                            <>
                              <span className="material-symbols-outlined text-[16px]">
                                shopping_cart_checkout
                              </span>
                              Refill Now
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </article>
              ))
            )}
          </div>

          {/* Prescription Upload & Verification Action Hub */}
          <section className="px-space-md mt-space-lg">
            <div className="bg-gradient-to-br from-primary-container to-inverse-surface rounded-2xl p-space-md text-on-primary shadow-sm relative overflow-hidden">
              <div className="relative z-10">
                <div className="flex items-center gap-space-xs">
                  <span className="px-space-xs py-space-2xs rounded bg-brand-accent-cyan/20 text-brand-accent-cyan font-mono text-code-xs uppercase font-semibold">
                    Instant Ingestion
                  </span>
                  <span className="font-semibold text-label-sm text-primary-fixed-dim">
                    Pharmacist Sign-off &lt;5m
                  </span>
                </div>
                <h3 className="font-semibold text-headline-md text-on-primary mt-space-xs leading-tight">
                  Upload New Prescription
                </h3>
                <p className="text-body-sm text-primary-fixed-dim mt-1 max-w-[280px]">
                  Scan paper Rx or import PDF. Real-time bio-parity mapping matches FDA/WHO approved generic equivalents automatically.
                </p>
                <div className="grid grid-cols-2 gap-space-sm mt-space-md">
                  <button
                    onClick={onOpenScan}
                    className="bg-surface-card text-on-surface font-semibold text-label-md py-space-sm px-space-xs rounded-xl flex items-center justify-center gap-space-xs shadow-sm hover:bg-surface-subtle transition-all active:scale-95"
                  >
                    <span className="material-symbols-outlined text-secondary text-[20px]">
                      photo_camera
                    </span>
                    Camera Scan
                  </button>
                  <button
                    onClick={() => onOpenPdf('New_Prescription_Draft.pdf')}
                    className="bg-surface-card/10 text-on-primary font-semibold text-label-md py-space-sm px-space-xs rounded-xl flex items-center justify-center gap-space-xs hover:bg-surface-card/20 transition-all active:scale-95 border border-white/10"
                  >
                    <span className="material-symbols-outlined text-brand-accent-cyan text-[20px]">
                      upload_file
                    </span>
                    Upload PDF
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Real-World Clinical Bio-Parity Efficacy Card */}
          <section className="px-space-md mt-space-lg">
            <div className="bg-surface-card rounded-xl p-space-md shadow-sm border border-border-crisp">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-space-xs">
                  <span className="material-symbols-outlined text-secondary text-[20px]">
                    query_stats
                  </span>
                  <h3 className="font-semibold text-headline-sm text-on-surface">
                    Lipid Response & Parity
                  </h3>
                </div>
                <span className="font-mono text-code-xs text-status-verified font-medium px-space-xs py-0.5 rounded bg-status-verified-bg border border-status-verified-border">
                  Generic Response: Optimal
                </span>
              </div>

              {/* Cholesterol Drop Metric */}
              <div className="mt-space-md bg-surface-canvas p-space-sm rounded-lg flex items-center justify-between border border-border-crisp/60">
                <div>
                  <span className="text-label-sm text-on-surface-variant block font-medium">
                    Total Cholesterol
                  </span>
                  <div className="flex items-baseline gap-space-xs mt-0.5">
                    <span className="text-headline-lg text-on-surface font-bold">158</span>
                    <span className="text-body-sm text-on-surface-variant">mg/dL</span>
                    <span className="text-label-sm text-status-verified font-semibold ml-space-xs">
                      ↓ 84 mg/dL (-34%)
                    </span>
                  </div>
                  <span className="font-mono text-code-xs text-on-surface-variant/80 mt-0.5 block">
                    Baseline on Innovator: 242 mg/dL
                  </span>
                </div>

                {/* Inline SVG Sparkline for Lipid drop */}
                <div className="w-24 h-12">
                  <svg className="w-full h-full text-secondary" viewBox="0 0 100 40">
                    <defs>
                      <linearGradient id="sparklineGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="currentColor" stopOpacity="0.3"></stop>
                        <stop offset="100%" stopColor="currentColor" stopOpacity="0.0"></stop>
                      </linearGradient>
                    </defs>
                    <path d="M0,8 Q25,12 50,22 T100,34 L100,40 L0,40 Z" fill="url(#sparklineGrad)"></path>
                    <path
                      d="M0,8 Q25,12 50,22 T100,34"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeWidth="2.5"
                    ></path>
                    <circle cx="100" cy="34" fill="currentColor" r="3"></circle>
                  </svg>
                </div>
              </div>

              {/* Physician Validation Quote */}
              <div className="mt-space-sm p-space-xs bg-surface-subtle rounded-lg flex gap-space-xs items-start">
                <span className="material-symbols-outlined text-secondary text-[18px] flex-shrink-0 mt-0.5">
                  format_quote
                </span>
                <div>
                  <p className="text-body-sm text-on-surface italic">
                    "Bio-equivalence verified across 9 months. Complete lipid normalization with zero myopathy reports on generic Atorvastatin."
                  </p>
                  <span className="text-label-sm text-on-surface-variant font-medium block mt-1">
                    — Dr. S. K. Mahapatra, MD (Internal Medicine)
                  </span>
                </div>
              </div>
            </div>
          </section>
        </>
      )}

      {/* SEGMENT 2: CLINICAL VITALS */}
      {activeSegment === 'vitals' && (
        <section className="px-space-md mt-space-md space-y-space-sm">
          <div className="flex items-center justify-between pb-1">
            <h3 className="font-semibold text-headline-sm text-on-surface">Biomarker Trends</h3>
            <span className="text-label-sm text-secondary font-medium">All parameters normal</span>
          </div>

          {VITALS_DATA.map((vital, idx) => (
            <div
              key={idx}
              className="bg-surface-card p-space-md rounded-xl border border-border-crisp shadow-sm"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-semibold text-xs text-on-surface">{vital.title}</h4>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-xl font-bold text-on-surface">{vital.currentValue}</span>
                    <span className="text-xs text-on-surface-variant">{vital.unit}</span>
                    <span className="text-xs font-semibold text-status-verified ml-2">{vital.change}</span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded bg-status-verified-bg text-status-verified text-[10px] font-semibold">
                  {vital.status}
                </span>
              </div>
              <p className="text-[11px] text-on-surface-variant mt-2 font-mono">{vital.baseline}</p>

              {/* Mini history bar */}
              <div className="mt-3 flex items-end gap-1.5 h-10 pt-2">
                {vital.history.map((val, hIdx) => {
                  const maxVal = Math.max(...vital.history);
                  const heightPercent = Math.max(20, Math.round((val / maxVal) * 100));
                  return (
                    <div key={hIdx} className="flex-1 flex flex-col items-center gap-1">
                      <div
                        className="w-full bg-secondary/80 rounded-t transition-all hover:bg-secondary"
                        style={{ height: `${heightPercent}%` }}
                        title={`${val} ${vital.unit}`}
                      ></div>
                      <span className="text-[9px] text-on-surface-variant/70">M{hIdx + 1}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </section>
      )}

      {/* SEGMENT 3: DOCTOR NETWORK */}
      {activeSegment === 'doctors' && (
        <section className="px-space-md mt-space-md space-y-space-sm">
          <div className="flex items-center justify-between pb-1">
            <h3 className="font-semibold text-headline-sm text-on-surface">Authenticated Physicians</h3>
            <span className="text-label-sm text-status-verified font-medium">2 Verified</span>
          </div>

          {DOCTORS.map((doc) => (
            <div
              key={doc.id}
              className="bg-surface-card p-space-md rounded-xl border border-border-crisp shadow-sm flex flex-col gap-3"
            >
              <div className="flex items-start gap-3">
                <img
                  src={doc.avatar}
                  alt={doc.name}
                  className="w-12 h-12 rounded-full object-cover border border-border-crisp"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-sm text-on-surface truncate">{doc.name}</h4>
                    <span className="text-[10px] font-mono text-secondary bg-surface-subtle px-1.5 py-0.5 rounded">
                      {doc.licenseNumber}
                    </span>
                  </div>
                  <p className="text-xs text-on-surface-variant font-medium mt-0.5">{doc.specialty}</p>
                  <p className="text-[11px] text-on-surface-variant/80 truncate mt-0.5">{doc.hospital}</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-border-crisp text-xs">
                <span className="text-on-surface-variant text-[11px]">
                  Last consult: <strong>{doc.lastConsultation}</strong>
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={onOpenClinicalDesk}
                    className="px-2.5 py-1 rounded-lg bg-surface-subtle text-secondary font-semibold hover:bg-border-crisp flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-[14px]">call</span>
                    Consult
                  </button>
                  <button
                    onClick={() => onOpenPdf(`Prescription_${doc.name.replace(/\s+/g, '_')}.pdf`)}
                    className="px-2.5 py-1 rounded-lg bg-secondary text-white font-semibold hover:bg-secondary/90 flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-[14px]">description</span>
                    View Rx
                  </button>
                </div>
              </div>
            </div>
          ))}
        </section>
      )}

      {/* SEGMENT 4: DOCUMENTS & COAS */}
      {activeSegment === 'documents' && (
        <section className="px-space-md mt-space-md space-y-space-sm">
          <div className="flex items-center justify-between pb-1">
            <h3 className="font-semibold text-headline-sm text-on-surface">Verified Clinical Dossiers</h3>
            <span className="text-label-sm text-secondary font-medium">4 Authenticated</span>
          </div>

          {DOCUMENTS.map((doc) => (
            <div
              key={doc.id}
              onClick={() => {
                if (doc.type === 'coa') {
                  onOpenCoA();
                } else {
                  onOpenPdf(doc.title);
                }
              }}
              className="bg-surface-card p-space-md rounded-xl border border-border-crisp shadow-sm flex items-center justify-between gap-3 hover:bg-surface-canvas cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-lg bg-surface-subtle flex items-center justify-center text-secondary flex-shrink-0">
                  <span className="material-symbols-outlined text-[20px]">
                    {doc.type === 'coa' ? 'workspace_premium' : 'description'}
                  </span>
                </div>
                <div className="min-w-0">
                  <h4 className="font-semibold text-xs text-on-surface truncate">{doc.title}</h4>
                  <p className="text-[11px] text-on-surface-variant mt-0.5 truncate">{doc.doctorOrLab}</p>
                  <span className="text-[10px] font-mono text-on-surface-variant/70">{doc.date} • {doc.size}</span>
                </div>
              </div>
              <span className="material-symbols-outlined text-secondary text-[20px] flex-shrink-0">
                visibility
              </span>
            </div>
          ))}
        </section>
      )}

      {/* Rx Vault Security & Regulatory Guarantee Banner */}
      <section className="px-space-md mt-space-md">
        <div className="bg-surface-canvas p-space-sm rounded-xl flex items-center gap-space-sm border border-border-crisp/60">
          <div className="w-9 h-9 rounded-lg bg-surface-card flex items-center justify-center text-secondary shadow-sm flex-shrink-0 border border-border-crisp">
            <span className="material-symbols-outlined text-[20px]">shield</span>
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-label-sm text-on-surface uppercase tracking-wider">
              Vault Integrity & Compliance
            </p>
            <p className="font-mono text-code-xs text-on-surface-variant mt-0.5 leading-normal">
              AES-256 • HIPAA & ISO-27001 Encrypted Storage • Validated under State Medical Council Protocol #SMC-GEN-1940
            </p>
          </div>
        </div>
      </section>

      {/* 24/7 Clinical Escalation & Doctor PDF Export Footer Action Strip */}
      <section className="px-space-md pt-space-md pb-space-lg flex flex-col gap-space-sm">
        <div className="grid grid-cols-2 gap-space-sm">
          <button
            onClick={onOpenClinicalDesk}
            className="bg-surface-card hover:bg-surface-subtle text-on-surface font-semibold text-label-md py-space-sm px-space-xs rounded-xl flex items-center justify-center gap-space-xs shadow-sm transition-colors border border-border-crisp"
          >
            <span className="material-symbols-outlined text-secondary text-[18px]">
              support_agent
            </span>
            Call Clinical Desk
          </button>
          <button
            onClick={exportHistoryPDF}
            className="bg-surface-card hover:bg-surface-subtle text-on-surface font-semibold text-label-md py-space-sm px-space-xs rounded-xl flex items-center justify-center gap-space-xs shadow-sm transition-colors border border-border-crisp"
          >
            <span className="material-symbols-outlined text-on-surface-variant text-[18px]">
              picture_as_pdf
            </span>
            Export Rx History
          </button>
        </div>
        <p className="font-mono text-code-xs text-center text-on-surface-variant/70 mt-space-xs">
          Session secured for Robert C. • Last synced 2 mins ago
        </p>
      </section>
    </div>
  );
};
