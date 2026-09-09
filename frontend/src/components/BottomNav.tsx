import React from 'react';
import { TabType } from '../types';

interface BottomNavProps {
  currentTab: TabType;
  onTabChange: (tab: TabType) => void;
  cartCount?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onTabChange,
  cartCount = 1,
}) => {
  const tabs: { id: TabType; label: string; icon: string; count?: number }[] = [
    { id: 'explore', label: 'Explore', icon: 'local_pharmacy' },
    { id: 'compare', label: 'Compare', icon: 'compare_arrows' },
    { id: 'rx-vault', label: 'Rx Vault', icon: 'lock_clock' },
    { id: 'cart', label: 'Cart', icon: 'shopping_bag', count: cartCount },
    { id: 'profile', label: 'Profile', icon: 'account_circle' },
  ];

  return (
    <nav
      aria-label="Bottom Navigation"
      className="fixed bottom-0 w-full z-50 pb-safe bg-surface-card/95 backdrop-blur-xl shadow-[0_-2px_12px_rgba(0,0,0,0.05)] border-t border-border-crisp/60"
    >
      <div className="h-16 px-space-xs flex items-center justify-around max-w-md mx-auto">
        {tabs.map((tab) => {
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              id={`nav-tab-${tab.id}`}
              onClick={() => onTabChange(tab.id)}
              className={`flex-1 min-h-[44px] flex flex-col items-center justify-center gap-0.5 transition-colors relative ${
                isActive
                  ? 'text-secondary font-semibold'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
              data-path={tab.id}
              aria-current={isActive ? 'page' : undefined}
            >
              <div className="relative">
                <span className="material-symbols-outlined text-[22px]">
                  {tab.icon}
                </span>
                {tab.count !== undefined && tab.count > 0 && (
                  <span className="absolute -top-1 -right-2 bg-secondary text-on-secondary text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {tab.count}
                  </span>
                )}
              </div>
              <span className="text-[11px] leading-[14px] tracking-tight">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
