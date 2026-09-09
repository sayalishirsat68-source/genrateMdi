import React, { useEffect, useState } from 'react';
import { TabType, Prescription, ExtractedPrescriptionData } from './types';
import { INITIAL_PRESCRIPTIONS, EXPLORE_CATALOG } from './data/mockData';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { RxVaultScreen } from './components/RxVaultScreen';
import { ExploreScreen } from './components/ExploreScreen';
import { CompareScreen } from './components/CompareScreen';
import { CartScreen } from './components/CartScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { persistedVault, queueRefill } from './services/storageService';
import { hasClinicalSession } from './services/authService';
import { AuthGate } from './components/AuthGate';
import {
  QrPassModal,
  CameraScanModal,
  PdfPreviewModal,
  CoAModal,
  ClinicalDeskModal,
  DosageGuideModal,
  AUCDetailModal,
  NotificationsModal,
} from './components/modals';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => hasClinicalSession());
  const [currentTab, setCurrentTab] = useState<TabType>('rx-vault');
  const [prescriptions, setPrescriptions] = useState<Prescription[]>(() => persistedVault.readPrescriptions(INITIAL_PRESCRIPTIONS));
  const [cartItems, setCartItems] = useState<Prescription[]>(() => persistedVault.readCart([INITIAL_PRESCRIPTIONS[0]]));
  const [compareDrugId, setCompareDrugId] = useState<string>('cat-1');
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

  useEffect(() => {
    persistedVault.writePrescriptions(prescriptions);
  }, [prescriptions]);

  useEffect(() => {
    persistedVault.writeCart(cartItems);
  }, [cartItems]);

  const handleAddToCart = (rx: Prescription) => {
    if (!cartItems.some((item) => item.id === rx.id)) {
      setCartItems((prev) => [...prev, rx]);
    }
    void queueRefill(rx.id);
    showToast(`Refill for ${rx.name} added to cart & scheduled!`);
  };

  const handleRemoveFromCart = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
    showToast('Item removed from refill queue.');
  };

  const handleClearCart = () => {
    setCartItems([]);
    showToast('Refill order dispatched successfully via SkyRoute Drone Hub!');
  };

  // Add prescription from Explore formulary catalog
  const handleAddFromExplore = (drugName: string) => {
    const catalogItem = EXPLORE_CATALOG.find(
      (c) =>
        c.genericName.toLowerCase() === drugName.toLowerCase() ||
        c.brandName.toLowerCase() === drugName.toLowerCase()
    );

    if (catalogItem) {
      if (
        prescriptions.some(
          (p) => p.name.toLowerCase() === catalogItem.genericName.toLowerCase()
        )
      ) {
        showToast(`${catalogItem.genericName} is already active in your Rx Vault.`);
        return;
      }

      const newRx: Prescription = {
        id: `rx-explore-${Date.now()}`,
        name: catalogItem.genericName,
        dosage: `${catalogItem.strengths.split(',')[0].trim()} • Bio-Parity Validated`,
        manufacturer: 'CDSCO / FDA Schedule M Generic',
        brandEquivalent: catalogItem.brandName,
        status: 'active',
        statusLabel: 'Active Therapy • Parity Validated',
        remainingInfo: '30 tabs • 30 days left',
        daysLeft: 30,
        imageUrl:
          'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=150&auto=format&fit=crop&q=80',
        imageAlt: catalogItem.genericName,
        aucMatch: `${catalogItem.aucMatch} AUC Match to ${catalogItem.brandName}`,
        pdfFile: `Dr_Consultation_${catalogItem.brandName.replace(/\s+/g, '_')}.pdf`,
        ocrMatch: '99.3% Parity Verified',
        doctor: 'Dr. A. K. Verma',
        doctorSpecialty: 'Cardiology / General Medicine',
        instructions: '1 Tab Daily with Meals',
        directGenericPrice: parseFloat(catalogItem.genericPrice.replace('$', '')) || 5.0,
        innovatorPrice: parseFloat(catalogItem.brandPrice.replace('$', '')) || 50.0,
        clinicalNote: `Generic Bio-Equivalence verified under ${catalogItem.regulators.join(', ')} standards.`,
      };

      setPrescriptions((prev) => [newRx, ...prev]);
      showToast(`${catalogItem.genericName} successfully added to Rx Vault!`);
    } else {
      showToast(`${drugName} linked to your clinical review queue.`);
    }
  };

  // Add prescription from optical camera scan
  const handleScanComplete = (extractedData: ExtractedPrescriptionData) => {
    const genericName =
      typeof extractedData === 'string'
        ? extractedData
        : extractedData?.genericEquivalent || 'Cipla Atorvastatin Calcium 20mg';
    const brandName =
      typeof extractedData === 'object' ? extractedData?.brand || 'Lipitor' : 'Lipitor';
    const directPrice =
      typeof extractedData === 'object' && extractedData?.genericCost
        ? parseFloat(extractedData.genericCost.replace('$', '')) || 4.20
        : 4.20;
    const innovatorPrice =
      typeof extractedData === 'object' && extractedData?.brandCost
        ? parseFloat(extractedData.brandCost.replace('$', '')) || 48.00
        : 48.00;

    const dosageText =
      typeof extractedData === 'object' && extractedData?.dosage
        ? extractedData.dosage
        : '20mg Film-coated tab • Optical Scan Ingested';
    const instructionsText =
      typeof extractedData === 'object' && extractedData?.instructions
        ? extractedData.instructions
        : '1 Tab Daily at Bedtime';
    const doctorNameText =
      typeof extractedData === 'object' && extractedData?.doctorName
        ? extractedData.doctorName
        : 'Dr. A. K. Verma';
    const aucText =
      typeof extractedData === 'object' && extractedData?.aucMatch
        ? extractedData.aucMatch
        : '99.4% AUC Match to Innovator';
    const confidenceText =
      typeof extractedData === 'object' && extractedData?.confidence
        ? extractedData.confidence
        : '99.4% High-Confidence OCR Ingest';

    const newRx: Prescription = {
      id: `rx-scan-${Date.now()}`,
      name: genericName.split(' • ')[0],
      dosage: dosageText,
      manufacturer: 'CDSCO / FDA Schedule M Partner',
      brandEquivalent: brandName.split(' (')[0],
      status: 'active',
      statusLabel: 'Recently Ingested via OCR Scanner',
      remainingInfo: `${extractedData?.daysLeft || 30} tabs • ${extractedData?.daysLeft || 30} days left`,
      daysLeft: extractedData?.daysLeft || 30,
      imageUrl:
        'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=150&auto=format&fit=crop&q=80',
      imageAlt: genericName,
      aucMatch: aucText,
      pdfFile: 'Optical_Ingested_Prescription.pdf',
      ocrMatch: confidenceText,
      doctor: doctorNameText,
      doctorSpecialty: extractedData?.doctorSpecialty || 'Cardiology / General Medicine',
      instructions: instructionsText,
      directGenericPrice: directPrice,
      innovatorPrice: innovatorPrice,
      clinicalNote: 'Extracted via Optical Bio-Parity Viewfinder. Pharmacist validated.',
    };

    setPrescriptions((prev) => [newRx, ...prev]);
    setCurrentTab('rx-vault');
    showToast(`Prescription for ${newRx.name} ingested into Rx Vault!`);
  };

  return (
    <div className="bg-surface font-sans text-body-md text-on-surface flex flex-col min-h-screen">
      {!isAuthenticated && <AuthGate onAuthenticated={() => setIsAuthenticated(true)} />}
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
            prescriptions={prescriptions}
            onOpenQr={() => setIsQrOpen(true)}
            onOpenScan={() => setIsScanOpen(true)}
            onOpenPdf={(filename) =>
              setPdfFileName(filename || 'Dr_Verma_Cardio_Sept2026.pdf')
            }
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
              setCompareDrugId(drugId);
              setCurrentTab('compare');
            }}
            onAddToVault={handleAddFromExplore}
          />
        )}

        {currentTab === 'compare' && (
          <CompareScreen selectedDrugId={compareDrugId} />
        )}

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
        onScanComplete={handleScanComplete}
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
