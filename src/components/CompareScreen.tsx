import React, { useState } from 'react';

export const CompareScreen: React.FC = () => {
  const [selectedPair, setSelectedPair] = useState<'statin' | 'metformin' | 'antibiotic'>('statin');

  const pairs = {
    statin: {
      brand: 'Lipitor (Pfizer)',
      generic: 'Atorvastatin Calcium (Cipla)',
      brandCost: '$48.00 / mo',
      genericCost: '$4.20 / mo',
      annualSavings: '$525.60',
      aucMatch: '99.4%',
      cMaxMatch: '99.1%',
      tMax: '1.2h vs 1.1h',
      halfLife: '14.2h vs 14.1h',
      fdaRating: 'AB Rated (Therapeutically Equivalent)',
      cdscoStatus: 'Validated Under Schedule M',
    },
    metformin: {
      brand: 'Glucophage XR (Bristol Myers)',
      generic: 'Metformin HCl ER (Zydus Cadila)',
      brandCost: '$62.00 / mo',
      genericCost: '$5.10 / mo',
      annualSavings: '$682.80',
      aucMatch: '99.7%',
      cMaxMatch: '99.3%',
      tMax: '4.0h vs 4.2h',
      halfLife: '6.2h vs 6.1h',
      fdaRating: 'AB Rated (Therapeutically Equivalent)',
      cdscoStatus: 'Validated Under Schedule M',
    },
    antibiotic: {
      brand: 'Augmentin 625 (GSK)',
      generic: 'Moxikind-CV 625 (Mankind)',
      brandCost: '$76.00 / course',
      genericCost: '$8.50 / course',
      annualSavings: '$67.50 / course',
      aucMatch: '99.1%',
      cMaxMatch: '98.8%',
      tMax: '1.5h vs 1.4h',
      halfLife: '1.3h vs 1.3h',
      fdaRating: 'AB Rated (Therapeutically Equivalent)',
      cdscoStatus: 'Validated Under Schedule M',
    },
  };

  const current = pairs[selectedPair];

  return (
    <div className="flex flex-col w-full max-w-md mx-auto px-space-md pt-space-md pb-24 space-y-space-md">
      <div className="bg-surface-card p-space-md rounded-xl border border-border-crisp shadow-sm">
        <h2 className="text-headline-md font-semibold text-on-surface">Pharmacokinetic Bio-Parity</h2>
        <p className="text-body-sm text-on-surface-variant mt-0.5">
          Side-by-side analytical assay, blood absorption kinetics, and cost variance.
        </p>

        {/* Pair Switcher */}
        <div className="grid grid-cols-3 gap-1.5 mt-space-sm bg-surface-canvas p-1 rounded-xl border border-border-crisp text-xs font-semibold">
          <button
            onClick={() => setSelectedPair('statin')}
            className={`py-1.5 rounded-lg transition-colors ${
              selectedPair === 'statin'
                ? 'bg-secondary text-white shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Lipitor
          </button>
          <button
            onClick={() => setSelectedPair('metformin')}
            className={`py-1.5 rounded-lg transition-colors ${
              selectedPair === 'metformin'
                ? 'bg-secondary text-white shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Glucophage
          </button>
          <button
            onClick={() => setSelectedPair('antibiotic')}
            className={`py-1.5 rounded-lg transition-colors ${
              selectedPair === 'antibiotic'
                ? 'bg-secondary text-white shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Augmentin
          </button>
        </div>
      </div>

      {/* Comparison Grid */}
      <div className="bg-surface-card rounded-xl border border-border-crisp p-space-md shadow-sm space-y-4">
        <div className="grid grid-cols-2 gap-3 text-center">
          <div className="p-3 bg-surface-canvas rounded-xl border border-border-crisp">
            <span className="text-[10px] uppercase font-bold text-on-surface-variant tracking-wider block">
              Innovator Brand
            </span>
            <h4 className="font-bold text-xs text-on-surface mt-1">{current.brand}</h4>
            <div className="text-sm font-bold text-on-surface-variant line-through mt-2">
              {current.brandCost}
            </div>
          </div>

          <div className="p-3 bg-status-verified-bg rounded-xl border border-status-verified-border">
            <span className="text-[10px] uppercase font-bold text-status-verified tracking-wider block">
              Bio-Generic Parity
            </span>
            <h4 className="font-bold text-xs text-status-verified mt-1">{current.generic}</h4>
            <div className="text-base font-bold text-status-verified mt-2">
              {current.genericCost}
            </div>
          </div>
        </div>

        {/* Savings banner */}
        <div className="p-2.5 bg-emerald-50 rounded-lg text-center text-xs text-emerald-900 border border-emerald-200">
          Projected Annual Patient Savings: <strong className="text-emerald-700 text-sm font-bold">{current.annualSavings}</strong>
        </div>

        {/* Pharmacokinetic Parameters */}
        <div className="space-y-2 text-xs">
          <h4 className="font-bold text-on-surface uppercase tracking-wider text-[11px]">
            Clinical Pharmacokinetic Metrics
          </h4>

          <div className="divide-y divide-border-crisp border border-border-crisp rounded-lg overflow-hidden">
            <div className="p-2.5 flex justify-between bg-surface-canvas">
              <span className="text-on-surface-variant">AUC (Area Under Curve) Parity</span>
              <span className="font-bold text-secondary">{current.aucMatch}</span>
            </div>
            <div className="p-2.5 flex justify-between bg-white">
              <span className="text-on-surface-variant">Peak Concentration (Cmax) Match</span>
              <span className="font-bold text-secondary">{current.cMaxMatch}</span>
            </div>
            <div className="p-2.5 flex justify-between bg-surface-canvas">
              <span className="text-on-surface-variant">Absorption Time (Tmax)</span>
              <span className="font-mono text-on-surface">{current.tMax}</span>
            </div>
            <div className="p-2.5 flex justify-between bg-white">
              <span className="text-on-surface-variant">Elimination Half-Life</span>
              <span className="font-mono text-on-surface">{current.halfLife}</span>
            </div>
            <div className="p-2.5 flex justify-between bg-surface-canvas">
              <span className="text-on-surface-variant">US FDA Equivalence Code</span>
              <span className="font-semibold text-status-verified">{current.fdaRating}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
