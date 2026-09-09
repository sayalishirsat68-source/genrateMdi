import React, { useState, useEffect } from 'react';

export type DrugPairKey = 'statin' | 'metformin' | 'antibiotic' | 'antiplatelet' | 'crestor' | 'amlodipine';

interface CompareScreenProps {
  selectedDrugId?: string;
}

export const CompareScreen: React.FC<CompareScreenProps> = ({ selectedDrugId }) => {
  const [selectedPair, setSelectedPair] = useState<DrugPairKey>('statin');

  // Map explore catalog ID to pair key
  useEffect(() => {
    if (!selectedDrugId) return;
    const map: { [key: string]: DrugPairKey } = {
      'cat-1': 'statin',
      'cat-2': 'metformin',
      'cat-3': 'antibiotic',
      'cat-4': 'antiplatelet',
      'cat-5': 'crestor',
      'cat-6': 'amlodipine',
    };
    if (map[selectedDrugId]) {
      setSelectedPair(map[selectedDrugId]);
    }
  }, [selectedDrugId]);

  const pairs: Record<
    DrugPairKey,
    {
      label: string;
      brand: string;
      generic: string;
      brandCost: string;
      genericCost: string;
      annualSavings: string;
      savingsPercent: string;
      aucMatch: string;
      cMaxMatch: string;
      tMax: string;
      halfLife: string;
      fdaRating: string;
      cdscoStatus: string;
      category: string;
    }
  > = {
    statin: {
      label: 'Lipitor / Atorvastatin',
      brand: 'Lipitor (Pfizer)',
      generic: 'Atorvastatin Calcium (Cipla)',
      brandCost: '$48.00 / mo',
      genericCost: '$4.20 / mo',
      annualSavings: '$525.60',
      savingsPercent: '91%',
      aucMatch: '99.4%',
      cMaxMatch: '99.1%',
      tMax: '1.2h vs 1.1h',
      halfLife: '14.2h vs 14.1h',
      fdaRating: 'AB Rated (Therapeutically Equivalent)',
      cdscoStatus: 'Validated Under Schedule M',
      category: 'Cardiovascular / Lipid Lowering',
    },
    metformin: {
      label: 'Glucophage / Metformin',
      brand: 'Glucophage XR (Bristol Myers)',
      generic: 'Metformin HCl ER (Zydus Cadila)',
      brandCost: '$62.00 / mo',
      genericCost: '$5.10 / mo',
      annualSavings: '$682.80',
      savingsPercent: '92%',
      aucMatch: '99.7%',
      cMaxMatch: '99.3%',
      tMax: '4.0h vs 4.2h',
      halfLife: '6.2h vs 6.1h',
      fdaRating: 'AB Rated (Therapeutically Equivalent)',
      cdscoStatus: 'Validated Under Schedule M',
      category: 'Endocrinology / Type 2 Diabetes',
    },
    antibiotic: {
      label: 'Augmentin / Moxikind',
      brand: 'Augmentin 625 (GSK)',
      generic: 'Moxikind-CV 625 (Mankind)',
      brandCost: '$76.00 / course',
      genericCost: '$8.50 / course',
      annualSavings: '$67.50 / course',
      savingsPercent: '89%',
      aucMatch: '99.1%',
      cMaxMatch: '98.8%',
      tMax: '1.5h vs 1.4h',
      halfLife: '1.3h vs 1.3h',
      fdaRating: 'AB Rated (Therapeutically Equivalent)',
      cdscoStatus: 'Validated Under Schedule M',
      category: 'Anti-infective / Broad Spectrum',
    },
    antiplatelet: {
      label: 'Plavix / Clopidogrel',
      brand: 'Plavix (Bristol Myers)',
      generic: 'Clopidogrel Bisulfate (Sun Pharma)',
      brandCost: '$84.00 / mo',
      genericCost: '$6.40 / mo',
      annualSavings: '$931.20',
      savingsPercent: '92%',
      aucMatch: '99.5%',
      cMaxMatch: '99.2%',
      tMax: '0.8h vs 0.8h',
      halfLife: '7.8h vs 7.9h',
      fdaRating: 'AB Rated (Therapeutically Equivalent)',
      cdscoStatus: 'Validated Under Schedule M',
      category: 'Hematology / Antiplatelet Therapy',
    },
    crestor: {
      label: 'Crestor / Rosuvastatin',
      brand: 'Crestor (AstraZeneca)',
      generic: 'Rosuvastatin Calcium (Cipla)',
      brandCost: '$92.00 / mo',
      genericCost: '$7.80 / mo',
      annualSavings: '$1,010.40',
      savingsPercent: '91%',
      aucMatch: '99.8%',
      cMaxMatch: '99.4%',
      tMax: '5.0h vs 4.8h',
      halfLife: '19.0h vs 18.9h',
      fdaRating: 'AB Rated (Therapeutically Equivalent)',
      cdscoStatus: 'Validated Under Schedule M',
      category: 'Cardiovascular / Statins',
    },
    amlodipine: {
      label: 'Norvasc / Amlodipine',
      brand: 'Norvasc (Pfizer)',
      generic: 'Amlodipine Besylate (Lupin)',
      brandCost: '$42.00 / mo',
      genericCost: '$3.50 / mo',
      annualSavings: '$462.00',
      savingsPercent: '92%',
      aucMatch: '99.3%',
      cMaxMatch: '99.0%',
      tMax: '6.0h vs 6.2h',
      halfLife: '35.0h vs 34.5h',
      fdaRating: 'AB Rated (Therapeutically Equivalent)',
      cdscoStatus: 'Validated Under Schedule M',
      category: 'Cardiovascular / Hypertension',
    },
  };

  const current = pairs[selectedPair] || pairs.statin;

  return (
    <div className="flex flex-col w-full max-w-md mx-auto px-space-md pt-space-md pb-24 space-y-space-md">
      {/* Header Tile */}
      <div className="bg-surface-card p-space-md rounded-xl border border-border-crisp shadow-sm">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-secondary text-[22px]">biotech</span>
          <h2 className="text-headline-md font-semibold text-on-surface">Pharmacokinetic Bio-Parity</h2>
        </div>
        <p className="text-body-sm text-on-surface-variant mt-1">
          Side-by-side analytical assays, blood serum kinetics, and patient financial variance.
        </p>

        {/* Pair Switcher Tabs */}
        <div className="flex gap-1.5 overflow-x-auto no-scrollbar mt-space-sm pt-1 pb-0.5">
          {(Object.keys(pairs) as DrugPairKey[]).map((key) => {
            const p = pairs[key];
            const isSelected = selectedPair === key;
            return (
              <button
                key={key}
                onClick={() => setSelectedPair(key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-secondary text-white shadow-sm'
                    : 'bg-surface-canvas text-on-surface-variant hover:text-on-surface border border-border-crisp/60'
                }`}
              >
                {p.label.split(' / ')[0]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Comparison Grid Card */}
      <div className="bg-surface-card rounded-xl border border-border-crisp p-space-md shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono uppercase tracking-wider text-secondary font-semibold">
            {current.category}
          </span>
          <span className="px-2 py-0.5 rounded bg-status-verified-bg text-status-verified text-[11px] font-bold border border-status-verified-border">
            Save {current.savingsPercent}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 text-center">
          <div className="p-3 bg-surface-canvas rounded-xl border border-border-crisp">
            <span className="text-[10px] uppercase font-bold text-on-surface-variant tracking-wider block">
              Innovator Brand
            </span>
            <h4 className="font-bold text-xs text-on-surface mt-1 truncate">{current.brand}</h4>
            <div className="text-sm font-bold text-on-surface-variant line-through mt-2">
              {current.brandCost}
            </div>
          </div>

          <div className="p-3 bg-status-verified-bg rounded-xl border border-status-verified-border">
            <span className="text-[10px] uppercase font-bold text-status-verified tracking-wider block">
              Bio-Generic Parity
            </span>
            <h4 className="font-bold text-xs text-status-verified mt-1 truncate">{current.generic}</h4>
            <div className="text-base font-bold text-status-verified mt-2">
              {current.genericCost}
            </div>
          </div>
        </div>

        {/* Projected Savings Banner */}
        <div className="p-3 bg-emerald-50 rounded-xl text-center text-xs text-emerald-900 border border-emerald-200 shadow-inner flex items-center justify-center gap-2">
          <span className="material-symbols-outlined text-status-verified text-[18px]">savings</span>
          <span>
            Projected Annual Patient Savings:{' '}
            <strong className="text-emerald-700 text-sm font-bold">{current.annualSavings}</strong>
          </span>
        </div>

        {/* Pharmacokinetic Parameters Breakdown */}
        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-on-surface uppercase tracking-wider text-[11px]">
              Clinical Pharmacokinetic Assays
            </h4>
            <span className="text-[10px] font-mono text-on-surface-variant">90% CI: 80%–125%</span>
          </div>

          <div className="divide-y divide-border-crisp border border-border-crisp rounded-xl overflow-hidden text-xs">
            <div className="p-2.5 flex justify-between items-center bg-surface-canvas">
              <span className="text-on-surface-variant">AUC (Area Under Curve) Parity</span>
              <span className="font-bold text-secondary text-sm">{current.aucMatch}</span>
            </div>
            <div className="p-2.5 flex justify-between items-center bg-white">
              <span className="text-on-surface-variant">Peak Concentration (Cmax) Match</span>
              <span className="font-bold text-secondary text-sm">{current.cMaxMatch}</span>
            </div>
            <div className="p-2.5 flex justify-between items-center bg-surface-canvas">
              <span className="text-on-surface-variant">Absorption Time (Tmax)</span>
              <span className="font-mono text-on-surface font-medium">{current.tMax}</span>
            </div>
            <div className="p-2.5 flex justify-between items-center bg-white">
              <span className="text-on-surface-variant">Elimination Half-Life (t½)</span>
              <span className="font-mono text-on-surface font-medium">{current.halfLife}</span>
            </div>
            <div className="p-2.5 flex justify-between items-center bg-surface-canvas">
              <span className="text-on-surface-variant">US FDA Equivalence Code</span>
              <span className="font-semibold text-status-verified">{current.fdaRating}</span>
            </div>
            <div className="p-2.5 flex justify-between items-center bg-white">
              <span className="text-on-surface-variant">Regulatory Audit Standard</span>
              <span className="font-medium text-on-surface">{current.cdscoStatus}</span>
            </div>
          </div>
        </div>

        {/* Clinical Note */}
        <div className="p-3 bg-surface-subtle rounded-xl text-[11px] text-on-surface-variant leading-relaxed border border-border-crisp/60 flex items-start gap-2">
          <span className="material-symbols-outlined text-secondary text-[16px] flex-shrink-0 mt-0.5">
            verified
          </span>
          <span>
            Pharmacokinetic parity confirms that the rate and extent of systemic absorption of{' '}
            <strong className="text-on-surface">{current.generic.split(' (')[0]}</strong> is statistically
            indistinguishable from <strong className="text-on-surface">{current.brand.split(' (')[0]}</strong>.
          </span>
        </div>
      </div>
    </div>
  );
};
