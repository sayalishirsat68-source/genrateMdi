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

  const categories = ['All', 'Cardiovascular', 'Diabetes', 'Antibiotic'];

  const filteredCatalog = EXPLORE_CATALOG.filter((item) => {
    const matchesSearch =
      item.brandName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.genericName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat =
      selectedCategory === 'All' || item.category.toLowerCase().includes(selectedCategory.toLowerCase());
    return matchesSearch && matchesCat;
  });

  return (
    <div className="flex flex-col w-full max-w-md mx-auto px-space-md pt-space-md pb-24 space-y-space-md">
      {/* Search and Header */}
      <div className="bg-surface-card p-space-md rounded-xl border border-border-crisp shadow-sm">
        <h2 className="text-headline-md font-semibold text-on-surface">Bio-Parity Formulary</h2>
        <p className="text-body-sm text-on-surface-variant mt-0.5">
          Search branded medicines to discover certified generic bio-equivalents saving up to 94%.
        </p>

        {/* Search Input */}
        <div className="relative mt-space-sm">
          <span className="material-symbols-outlined absolute left-3 top-2.5 text-on-surface-variant text-[20px]">
            search
          </span>
          <input
            type="text"
            placeholder="Search Lipitor, Glucophage, Metformin..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-surface-canvas rounded-lg border border-border-crisp text-xs text-on-surface focus:outline-none focus:ring-1 focus:ring-secondary"
          />
        </div>

        {/* Category Pills */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar mt-space-sm pt-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-secondary text-white'
                  : 'bg-surface-subtle text-on-surface-variant hover:text-on-surface'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Catalog Stream */}
      <div className="space-y-space-sm">
        {filteredCatalog.map((item) => (
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
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-status-verified bg-status-verified-bg px-2 py-0.5 rounded border border-status-verified-border">
                  Save {item.savings}
                </span>
                <p className="text-[10px] text-on-surface-variant mt-1 font-mono">
                  {item.aucMatch} AUC Match
                </p>
              </div>
            </div>

            {/* Price Row */}
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
                  className="px-2.5 py-1.5 rounded-lg bg-surface-subtle text-on-surface font-semibold text-[11px] hover:bg-border-crisp flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[14px]">compare_arrows</span>
                  Compare
                </button>
                <button
                  onClick={() => {
                    onAddToVault(item.genericName);
                    alert(`Added ${item.genericName} to your Rx Vault inquiry list.`);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-secondary text-white font-semibold text-[11px] hover:bg-secondary/90 flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[14px]">add</span>
                  Add to Vault
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
