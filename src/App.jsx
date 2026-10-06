import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { DocumentModal } from './components/DocumentModal';
import { ImageViewerModal } from './components/ImageViewerModal';
import { Customer360Modal } from './components/Customer360Modal';
import { SendAlertModal } from './components/SendAlertModal';
import { AnimatedBackground } from './components/AnimatedBackground';
import { LoadingScreen } from './components/LoadingScreen';

import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { NewLoan } from './pages/NewLoan';
import { LoanList } from './pages/LoanList';
import { CustomerList } from './pages/CustomerList';
import { ItemGallery } from './pages/ItemGallery';
import { LoanCalculator } from './pages/LoanCalculator';
import { Payments } from './pages/Payments';
import { Reports } from './pages/Reports';
import { Settings } from './pages/Settings';
import { EmiTracker } from './pages/EmiTracker';

const MainLayout = () => {
  const { isAuthenticated } = useApp();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isLoading, setIsLoading] = useState(true);

  // Modals state
  const [documentModalLoan, setDocumentModalLoan] = useState(null);
  const [imageViewerLoan, setImageViewerLoan] = useState(null);
  const [customer360ModalData, setCustomer360ModalData] = useState(null);
  const [sendAlertEmiItem, setSendAlertEmiItem] = useState(null);

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  const handleOpenDocument = (loan) => {
    setDocumentModalLoan(loan);
  };

  const handleOpenImageViewer = (loan) => {
    setImageViewerLoan(loan);
  };

  const handleOpenCustomer360 = (params) => {
    // params can be { customer } or { loan }
    if (params?.customer) {
      setCustomer360ModalData({ customer: params.customer });
    } else if (params?.loan) {
      setCustomer360ModalData({ loan: params.loan });
    } else if (params) {
      setCustomer360ModalData(params);
    }
  };

  const handleOpenSendAlert = (emiItem) => {
    setSendAlertEmiItem(emiItem);
  };

  const handleOpenPaymentModal = () => {
    setActiveTab('payments');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <Dashboard 
            onNavigate={setActiveTab} 
            onOpenDocument={handleOpenDocument} 
            onOpenImageViewer={handleOpenImageViewer}
            onOpenCustomer360={handleOpenCustomer360}
          />
        );
      case 'new-loan':
        return (
          <NewLoan 
            onNavigate={setActiveTab} 
            onOpenDocument={handleOpenDocument} 
          />
        );
      case 'active-loans':
        return (
          <LoanList 
            onOpenDocument={handleOpenDocument} 
            onOpenImageViewer={handleOpenImageViewer} 
            onOpenPaymentModal={handleOpenPaymentModal}
            onOpenCustomer360={handleOpenCustomer360}
          />
        );
      case 'emi-tracker':
        return (
          <EmiTracker
            onOpenPaymentModal={handleOpenPaymentModal}
            onOpenSendAlert={handleOpenSendAlert}
            onOpenCustomer360={handleOpenCustomer360}
          />
        );
      case 'customers':
        return (
          <CustomerList 
            onNavigate={setActiveTab}
            onOpenCustomer360={handleOpenCustomer360}
          />
        );
      case 'item-gallery':
        return (
          <ItemGallery 
            onOpenImageViewer={handleOpenImageViewer} 
            onOpenDocument={handleOpenDocument} 
          />
        );
      case 'calculator':
        return <LoanCalculator onNavigate={setActiveTab} />;
      case 'payments':
        return <Payments />;
      case 'reports':
        return <Reports />;
      case 'settings':
        return <Settings />;
      default:
        return (
          <Dashboard 
            onNavigate={setActiveTab} 
            onOpenDocument={handleOpenDocument} 
            onOpenImageViewer={handleOpenImageViewer} 
            onOpenCustomer360={handleOpenCustomer360}
          />
        );
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'transparent', position: 'relative' }}>
      {/* Animated Deep Navy Background with Red & Blue Light Orbs & Particles */}
      <AnimatedBackground />

      {/* Initial Luxury Brand Loading Screen */}
      {isLoading && <LoadingScreen onComplete={handleLoadingComplete} />}

      {!isAuthenticated ? (
        <Login />
      ) : (
        <>
          {/* Top Header Navbar */}
          <Navbar 
            onOpenCalculator={() => setActiveTab('calculator')} 
            onNavigate={setActiveTab}
          />

          {/* Main Viewport */}
          <div style={{ display: 'flex', flex: 1 }}>
            {/* Left Navigation Sidebar */}
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

            {/* Dynamic Workspace Container */}
            <main style={{ flex: 1, padding: '1.8rem 2.2rem', overflowY: 'auto', maxHeight: 'calc(100vh - 65px)' }}>
              {renderContent()}
            </main>
          </div>

          {/* Customer 360 & ID Search Modal */}
          <Customer360Modal
            isOpen={!!customer360ModalData}
            onClose={() => setCustomer360ModalData(null)}
            customerData={customer360ModalData?.customer}
            loanData={customer360ModalData?.loan}
            onOpenPaymentModal={handleOpenPaymentModal}
            onOpenSendAlert={handleOpenSendAlert}
            onOpenDocument={handleOpenDocument}
          />

          {/* Overdue EMI Alert Modal */}
          <SendAlertModal
            isOpen={!!sendAlertEmiItem}
            onClose={() => setSendAlertEmiItem(null)}
            emiItem={sendAlertEmiItem}
          />

          {/* Printable Document Modal */}
          <DocumentModal 
            isOpen={!!documentModalLoan} 
            onClose={() => setDocumentModalLoan(null)} 
            loan={documentModalLoan} 
          />

          {/* Pledged Item Photo Viewer Modal */}
          <ImageViewerModal 
            isOpen={!!imageViewerLoan} 
            onClose={() => setImageViewerLoan(null)} 
            loan={imageViewerLoan} 
          />
        </>
      )}
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
