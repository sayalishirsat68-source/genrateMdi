import React, { useState } from 'react';
import { EXPLORE_CATALOG } from '../data/mockData';

interface ExploreScreenProps {
  onSelectForCompare: (drugId: string) => void;
  onAddToVault: (drugName: string) => void;
}

export const ExploreScreen: React.FC<ExploreScreenProps> = ({
  onSelectForCompare,
  onAddToVault,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [addedIds, setAddedIds] = useState<{ [key: string]: boolean }>({});

  const categories = ['All', 'Cardiovascular', 'Diabetes', 'Antibiotic', 'Hematology'];

  const filteredCatalog = EXPLORE_CATALOG.filter((item) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      item.brandName.toLowerCase().includes(term) ||
      item.genericName.toLowerCase().includes(term) ||
      item.category.toLowerCase().includes(term) ||
      item.strengths.toLowerCase().includes(term);
    const matchesCat =
      selectedCategory === 'All' || item.category.toLowerCase().includes(selectedCategory.toLowerCase());
    return matchesSearch && matchesCat;
  });

  const handleAddClick = (item: typeof EXPLORE_CATALOG[0]) => {
    onAddToVault(item.genericName);
    setAddedIds((prev) => ({ ...prev, [item.id]: true }));
    setTimeout(() => {
      setAddedIds((prev) => ({ ...prev, [item.id]: false }));
    }, 2500);
  };

  return (
    <div className="flex flex-col w-full max-w-md mx-auto px-space-md pt-space-md pb-24 space-y-space-md">
      {/* Search and Header */}
      <div className="bg-surface-card p-space-md rounded-xl border border-border-crisp shadow-sm">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-secondary text-[22px]">manage_search</span>
          <h2 className="text-headline-md font-semibold text-on-surface">Bio-Parity Formulary</h2>
        </div>
        <p className="text-body-sm text-on-surface-variant mt-1">
          Search branded medicines to discover certified generic bio-equivalents saving up to 92%.
        </p>

        {/* Search Input */}
        <div className="relative mt-space-sm">
          <span className="material-symbols-outlined absolute left-3 top-2.5 text-on-surface-variant text-[20px]">
            search
          </span>
          <input
            type="text"
            placeholder="Search Lipitor, Glucophage, Plavix, Statin..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-surface-canvas rounded-lg border border-border-crisp text-xs text-on-surface focus:outline-none focus:ring-1 focus:ring-secondary"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-2.5 text-on-surface-variant hover:text-on-surface text-xs"
            >
              ✕
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div className="flex gap-1.5 overflow-x-auto no-scrollbar mt-space-sm pt-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-secondary text-white shadow-sm'
                  : 'bg-surface-subtle text-on-surface-variant hover:text-on-surface border border-border-crisp/60'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Catalog Stream */}
      <div className="space-y-space-sm">
        {filteredCatalog.length === 0 ? (
          <div className="bg-surface-card p-8 rounded-xl border border-border-crisp text-center space-y-2">
            <span className="material-symbols-outlined text-4xl text-on-surface-variant/40">
              medication
            </span>
            <h4 className="font-semibold text-sm text-on-surface">No matching medications found</h4>
            <p className="text-xs text-on-surface-variant">
              Try searching by generic salt (e.g. Atorvastatin) or clear category filters.
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('All');
              }}
              className="mt-2 px-3 py-1.5 bg-secondary text-white rounded-lg text-xs font-semibold"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          filteredCatalog.map((item) => {
            const isAdded = addedIds[item.id];
            return (
              <div
                key={item.id}
                className="bg-surface-card p-space-md rounded-xl border border-border-crisp shadow-sm hover:border-secondary/50 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-mono text-on-surface-variant uppercase tracking-wider">
                      {item.category}
                    </span>
                    <h3 className="font-semibold text-sm text-on-surface">{item.genericName}</h3>
                    <p className="text-xs text-secondary font-medium">Bio-equivalent to {item.brandName}</p>
                    <p className="text-[11px] text-on-surface-variant/80 font-mono mt-0.5">
                      Strengths: {item.strengths}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-status-verified bg-status-verified-bg px-2 py-0.5 rounded border border-status-verified-border inline-block">
                      Save {item.savings}
                    </span>
                    <p className="text-[10px] text-on-surface-variant mt-1 font-mono">
                      {item.aucMatch} AUC Match
                    </p>
                  </div>
                </div>

                {/* Regulatory Badges */}
                <div className="mt-2 flex gap-1 flex-wrap">
                  {item.regulators.map((reg) => (
                    <span
                      key={reg}
                      className="px-1.5 py-0.5 bg-surface-canvas rounded text-[9px] font-mono text-on-surface-variant border border-border-crisp/60"
                    >
                      {reg} Validated
                    </span>
                  ))}
                </div>

                {/* Price Row & Action Triggers */}
                <div className="mt-3 pt-2.5 border-t border-border-crisp flex justify-between items-center text-xs">
                  <div>
                    <span className="text-on-surface-variant text-[11px] block">Direct Cost</span>
                    <span className="font-bold text-sm text-on-surface">{item.genericPrice}</span>
                    <span className="text-on-surface-variant/60 line-through text-[11px] ml-1.5">
                      {item.brandPrice}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => onSelectForCompare(item.id)}
                      className="px-2.5 py-1.5 rounded-lg bg-surface-subtle text-on-surface font-semibold text-[11px] hover:bg-border-crisp flex items-center gap-1 transition-colors"
                      title="View side-by-side pharmacokinetic assay"
                    >
                      <span className="material-symbols-outlined text-[14px]">compare_arrows</span>
                      Compare
                    </button>
                    <button
                      onClick={() => handleAddClick(item)}
                      className={`px-3 py-1.5 rounded-lg font-semibold text-[11px] flex items-center gap-1 transition-all ${
                        isAdded
                          ? 'bg-status-verified text-white'
                          : 'bg-secondary text-white hover:bg-secondary/90 active:scale-95'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[14px]">
                        {isAdded ? 'check' : 'add'}
                      </span>
                      {isAdded ? 'Added!' : 'Add to Vault'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
