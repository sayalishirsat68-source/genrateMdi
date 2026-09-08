import React, { useState } from 'react';
import { TabType } from '../types';

interface HeaderProps {
  currentTab: TabType;
  onOpenNotifications: () => void;
  unreadCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onOpenNotifications,
  unreadCount = 2,
}) => {
  const getTabTitle = () => {
    switch (currentTab) {
      case 'rx-vault':
        return 'Rx Vault';
      case 'explore':
        return 'Bio-Parity Catalog';
      case 'compare':
        return 'Pharmacokinetic Compare';
      case 'cart':
        return 'Refill Dispatch';
      case 'profile':
        return 'Patient Profile';
      default:
        return 'Rx Vault';
    }
  };

  return (
    <header className="fixed top-0 w-full z-50 bg-surface-card/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] pt-safe">
      <div className="h-16 px-space-md flex items-center justify-between gap-space-sm max-w-md mx-auto">
        <div className="flex items-center gap-space-xs">
          <img
            alt="genraticMed"
            className="h-7 w-auto object-contain"
            src="https://lh3.googleusercontent.com/aida/AEtjO1WnghMguPjpwDIdqZMRiwP61v1kWO46KeJlmg1mn1QkX-hWiaKqJ6jfcduT9bAU0yyxwrcZGHXWg7m92c-TkBk8yXun10Y2nsPUCSzwoR-LHFInbtryeZQ4yiwXrm1Ol5wbk1p5a1ZC7wcz0UbPiNzgS0fB2HutcCKL8aIPpKQBcYLTi7pgYyz7O7D05BPpLVJRANggces03wW6IqFzd4zoUAWgwDFDH9Nw4ejrk_xlLehyQaPpZjTYFZM"
          />
          <span className="font-semibold text-headline-sm text-on-surface line-clamp-1 ml-space-xs leading-tight">
            {getTabTitle()}
          </span>
        </div>
        <div className="flex items-center gap-space-sm">
          <div className="flex items-center gap-space-xs px-space-sm py-space-2xs bg-status-verified-bg text-status-verified rounded-full border border-status-verified-border">
            <span className="w-2 h-2 rounded-full bg-status-verified animate-pulse"></span>
            <span className="font-semibold text-label-sm uppercase tracking-wider">
              HIPAA SECURE
            </span>
          </div>
          <button
            id="notifications-button"
            onClick={onOpenNotifications}
            aria-label="Notifications"
            className="relative min-w-[44px] min-h-[44px] flex items-center justify-center text-on-surface-variant hover:text-on-surface transition-colors rounded-full hover:bg-surface-subtle"
          >
            <span className="material-symbols-outlined text-[22px]">notifications</span>
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-status-critical"></span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
