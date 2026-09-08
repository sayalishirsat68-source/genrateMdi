import React, { useState } from 'react';
import { TabType, Prescription } from './types';
import { INITIAL_PRESCRIPTIONS } from './data/mockData';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { RxVaultScreen } from './components/RxVaultScreen';
import { ExploreScreen } from './components/ExploreScreen';
import { CompareScreen } from './components/CompareScreen';
import { CartScreen } from './components/CartScreen';
import { ProfileScreen } from './components/ProfileScreen';
import {
  QrPassModal,
  CameraScanModal,
  PdfPreviewModal,
  CoAModal,
  ClinicalDeskModal,
  DosageGuideModal,
  AUCDetailModal,
  NotificationsModal,
} from './components/Modals';

export default function App() {
  const [currentTab, setCurrentTab] = useState<TabType>('rx-vault');
  const [cartItems, setCartItems] = useState<Prescription[]>([INITIAL_PRESCRIPTIONS[0]]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modals state
  const [isQrOpen, setIsQrOpen] = useState(false);
  const [isScanOpen, setIsScanOpen] = useState(false);
  const [pdfFileName, setPdfFileName] = useState<string | null>(null);
  const [isCoAOpen, setIsCoAOpen] = useState(false);
  const [isClinicalDeskOpen, setIsClinicalDeskOpen] = useState(false);
  const [isDosageGuideOpen, setIsDosageGuideOpen] = useState(false);
  const [isAUCOpen, setIsAUCOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handleAddToCart = (rx: Prescription) => {
    if (!cartItems.some((item) => item.id === rx.id)) {
      setCartItems((prev) => [...prev, rx]);
    }
    showToast(`Refill for ${rx.name} added to cart & scheduled!`);
  };

  const handleRemoveFromCart = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
    showToast('Item removed from refill queue.');
  };

  const handleClearCart = () => {
    setCartItems([]);
    showToast('Refill order processed successfully!');
  };

  return (
    <div className="bg-surface font-sans text-body-md text-on-surface flex flex-col min-h-screen">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-18 left-1/2 -translate-x-1/2 z-50 bg-inverse-surface text-on-primary px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2 text-xs font-medium animate-bounce border border-white/20">
          <span className="material-symbols-outlined text-brand-accent-cyan text-[18px]">
            check_circle
          </span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header */}
      <Header
        currentTab={currentTab}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        unreadCount={2}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative w-full pt-16 bg-surface">
        {currentTab === 'rx-vault' && (
          <RxVaultScreen
            onOpenQr={() => setIsQrOpen(true)}
            onOpenScan={() => setIsScanOpen(true)}
            onOpenPdf={(filename) => setPdfFileName(filename || 'Dr_Verma_Cardio_Sept2026.pdf')}
            onOpenCoA={() => setIsCoAOpen(true)}
            onOpenClinicalDesk={() => setIsClinicalDeskOpen(true)}
            onOpenDosageGuide={() => setIsDosageGuideOpen(true)}
            onOpenAUC={() => setIsAUCOpen(true)}
            onAddToCart={handleAddToCart}
          />
        )}

        {currentTab === 'explore' && (
          <ExploreScreen
            onSelectForCompare={(drugId) => {
              setCurrentTab('compare');
            }}
            onAddToVault={(drugName) => {
              showToast(`${drugName} linked to your clinical review queue.`);
            }}
          />
        )}

        {currentTab === 'compare' && <CompareScreen />}

        {currentTab === 'cart' && (
          <CartScreen
            items={cartItems}
            onRemoveItem={handleRemoveFromCart}
            onClearCart={handleClearCart}
          />
        )}

        {currentTab === 'profile' && (
          <ProfileScreen
            onOpenQr={() => setIsQrOpen(true)}
            onOpenClinicalDesk={() => setIsClinicalDeskOpen(true)}
          />
        )}
      </main>

      {/* Fixed Bottom Navigation */}
      <BottomNav
        currentTab={currentTab}
        onTabChange={(tab) => setCurrentTab(tab)}
        cartCount={cartItems.length}
      />

      {/* Interactive Modals */}
      <QrPassModal isOpen={isQrOpen} onClose={() => setIsQrOpen(false)} />

      <CameraScanModal
        isOpen={isScanOpen}
        onClose={() => setIsScanOpen(false)}
        onScanComplete={(name) => {
          showToast(`Ingested prescription for ${name}. Added to Rx Vault.`);
        }}
      />

      <PdfPreviewModal
        isOpen={!!pdfFileName}
        onClose={() => setPdfFileName(null)}
        fileName={pdfFileName || undefined}
      />

      <CoAModal isOpen={isCoAOpen} onClose={() => setIsCoAOpen(false)} />

      <ClinicalDeskModal
        isOpen={isClinicalDeskOpen}
        onClose={() => setIsClinicalDeskOpen(false)}
      />

      <DosageGuideModal
        isOpen={isDosageGuideOpen}
        onClose={() => setIsDosageGuideOpen(false)}
      />

      <AUCDetailModal isOpen={isAUCOpen} onClose={() => setIsAUCOpen(false)} />

      <NotificationsModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
      />
    </div>
  );
}
