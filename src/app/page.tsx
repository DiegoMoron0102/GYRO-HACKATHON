"use client";

import React, { useState, useEffect, useCallback } from "react";
import SplashScreen from "./components/SplashScreen";
import CorbadoAuth from "./components/CorbadoAuth";
import SignupForm from "./signup/SignupForm";
import Dashboard from "./components/Dashboard";
import HistoryPage from "./components/HistoryPage";
import MorePage from "./components/MorePage";
import ProfileSettingsPage from "./components/ProfileSettingsPage";
import KYCModal from "./components/KYCModal";
import DepositPage from "./components/DepositPage";
import DepositBolivianosPage from "./components/DepositBolivianosPage";
import DepositQRPage from "./components/DepositQRPage";
import DepositCryptoPage from "./components/DepositCryptoPage";
import WithdrawPage from "./components/WithdrawPage";
import WithdrawBolivianosPage from "./components/WithdrawBolivianosPage";
import WithdrawCryptoPage from "./components/WithdrawCryptoPage";
import AccountTypeSelectionPage from "./components/AccountTypeSelectionPage";
import QRScannerPage from "./components/QRScannerPage";
import CreateAccountPage from "./components/CreateAccountPage";
import WithdrawConfirmationPage from "./components/WithdrawConfirmationPage";
import CreateCryptoWalletPage from "./components/CreateCryptoWalletPage";
import WithdrawSuccessPage from "./components/WithdrawSuccessPage";

interface SavedAccount {
  id: string;
  type: 'bank' | 'crypto';
  name: string;
  details: string;
  bank?: string;
}

// ...existing code...

interface User {
  id: number;
  name: string;
  email: string;
  pin: string;
  createdAt: string;
  stellarPublicKey?: string; // Cambiar a opcional con ?
}

// ...existing code...

export default function Home() {
  const [showSplash, setShowSplash] = useState(true);
  const [currentView, setCurrentView] = useState<
    "splash" | "auth" | "signup" | "dashboard" | "history" | "more" | "settings" | "deposit"
  >("splash");
  const [user, setUser] = useState<User | null>(null);
  const [lastActivity, setLastActivity] = useState<number>(Date.now());
  const [showDepositPage, setShowDepositPage] = useState(false);
  const [showKycModal, setShowKycModal] = useState(false);
  const [showWithdrawPage, setShowWithdrawPage] = useState(false);
  const [showDepositBolivianosPage, setShowDepositBolivianosPage] = useState(false);
  const [showDepositQRPage, setShowDepositQRPage] = useState(false);
  const [showDepositCryptoPage, setShowDepositCryptoPage] = useState(false);
  const [showWithdrawBolivianosPage, setShowWithdrawBolivianosPage] = useState(false);
  const [showWithdrawCryptoPage, setShowWithdrawCryptoPage] = useState(false);
  const [showAccountTypeSelection, setShowAccountTypeSelection] = useState(false);
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [showCreateBankAccount, setShowCreateBankAccount] = useState(false);
  const [showCreateCryptoAccount, setShowCreateCryptoAccount] = useState(false);
  const [kycTransactionType, setKycTransactionType] = useState<"deposito" | "retiro" | null>(null);
  const [depositData, setDepositData] = useState<{amount: number, reference?: string, currency?: string, cryptocurrency?: string} | null>(null);
  const [selectedAccount, setSelectedAccount] = useState<SavedAccount | null>(null);
  const [showWithdrawConfirmation, setShowWithdrawConfirmation] = useState(false);
  const [showWithdrawSuccess, setShowWithdrawSuccess] = useState(false);
  const [withdrawData, setWithdrawData] = useState<{amount: number, accountName: string, transactionId: string} | null>(null);

  // Auto-logout después de 3 minutos de inactividad
  const AUTO_LOGOUT_TIME = 3 * 60 * 1000; // 3 minutos en millisegundos

  const resetActivity = useCallback(() => {
    setLastActivity(Date.now());
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("gyro_user");
    setUser(null);
    setCurrentView("auth");
  }, []);

  useEffect(() => {
    // Siempre comenzar con splash, nunca auto-login
    // Esto asegura que siempre se pida PIN
    const timer = setTimeout(() => {
      setShowSplash(false);
      setCurrentView("auth");
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  // Monitor de inactividad
  useEffect(() => {
    const checkInactivity = () => {
      const now = Date.now();
      const timeSinceLastActivity = now - lastActivity;

      if (
        timeSinceLastActivity >= AUTO_LOGOUT_TIME &&
        user &&
        currentView === "dashboard"
      ) {
        console.log("Auto-logout por inactividad");
        logout();
      }
    };

    const interval = setInterval(checkInactivity, 30000); // Verificar cada 30 segundos
    return () => clearInterval(interval);
  }, [lastActivity, user, currentView, logout, AUTO_LOGOUT_TIME]);

  // Detectar actividad del usuario
  useEffect(() => {
    const events = [
      "mousedown",
      "mousemove",
      "keypress",
      "scroll",
      "touchstart",
      "click",
    ];

    const resetTimer = () => {
      if (currentView === "dashboard") {
        resetActivity();
      }
    };

    // Agregar listeners para detectar actividad
    events.forEach((event) => {
      document.addEventListener(event, resetTimer, true);
    });

    return () => {
      events.forEach((event) => {
        document.removeEventListener(event, resetTimer, true);
      });
    };
  }, [currentView, resetActivity]);

  const handleSplashComplete = () => {
    setShowSplash(false);
    setCurrentView("auth");
  };

  const handleAuthSuccess = (userData: User) => {
    // Asegurar que siempre haya un stellarPublicKey
    const userWithStellar: User = {
      ...userData,
      stellarPublicKey: userData.stellarPublicKey || `STELLAR_${userData.id}_${Date.now()}`
    };
    
    setUser(userWithStellar);
    localStorage.setItem("gyro_user", JSON.stringify(userWithStellar));
    setCurrentView("dashboard");
    resetActivity();
  };


  const handleShowSignup = () => {
    setCurrentView("signup");
  };

  const handleDeposit = () => {
    // Check if KYC is completed
    if (typeof window !== 'undefined') {
      const kycCompleted = localStorage.getItem("kyc_completed");
      if (!kycCompleted) {
        setKycTransactionType("deposito");
        setShowKycModal(true);
        return;
      }
    }
    
    // If KYC is completed, go to deposit page
    setShowDepositPage(true);
  };

  const handleWithdraw = () => {
    // Check if KYC is completed
    if (typeof window !== 'undefined') {
      const kycCompleted = localStorage.getItem("kyc_completed");
      if (!kycCompleted) {
        setKycTransactionType("retiro");
        setShowKycModal(true);
        return;
      }
    }
    
    // If KYC is completed, go to withdraw page
    setShowWithdrawPage(true);
  };

  const handleKycComplete = () => {
    setShowKycModal(false);
    if (kycTransactionType === "deposito") {
      setShowDepositPage(true);
    } else if (kycTransactionType === "retiro") {
      setShowWithdrawPage(true);
    }
    // Reset KYC transaction type
    setKycTransactionType(null);
  };

  // Add function to clear all data for testing
  const clearAllData = () => {
    localStorage.removeItem("gyro_user");
    localStorage.removeItem("gyro_users");
    window.location.reload();
  };

  // Add function to clear only KYC status for testing
  const clearKYCStatus = () => {
    localStorage.removeItem("kyc_completed");
    alert("Estado KYC limpiado. El próximo depósito/retiro solicitará verificación.");
  };

  // Show splash screen
  if (showSplash || currentView === "splash") {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  // Show signup form
  if (currentView === "signup") {
    return (
      <div>
        <SignupForm
          onSignupSuccess={handleAuthSuccess}
          onBackToLogin={() => setCurrentView("auth")}
        />
        {/* Debug buttons */}
        <div className="fixed bottom-4 right-4 space-y-2">
          <button
            onClick={() => setCurrentView("auth")}
            className="block w-full bg-blue-500 text-white px-4 py-2 rounded text-sm"
          >
            Volver a Login
          </button>
          <button
            onClick={clearKYCStatus}
            className="block w-full bg-orange-500 text-white px-4 py-2 rounded text-sm"
          >
            Limpiar KYC
          </button>
          <button
            onClick={clearAllData}
            className="block w-full bg-red-500 text-white px-4 py-2 rounded text-sm"
          >
            Limpiar Datos
          </button>
        </div>
      </div>
    );
  }

  // Show history page
  if (currentView === "history" && user) {
    return (
      <div className="history-container">
        <HistoryPage
          onBack={() => setCurrentView("dashboard")}
          onNavigateToMore={() => setCurrentView("more")}
        />
      </div>
    );
  }

  // Show more page
  if (currentView === "more" && user) {
    return (
      <div className="more-container">
        <MorePage
          user={user}
          onBack={() => setCurrentView("dashboard")}
          onNavigateToHistory={() => setCurrentView("history")}
        />
      </div>
    );
  }

  // Show settings page
  if (currentView === "settings" && user) {
    return (
      <div className="more-container">
        <ProfileSettingsPage
          user={user}
          onBack={() => setCurrentView("dashboard")}
        />
      </div>
    );
  }

  // Show deposit page
  if (showDepositPage && user) {
    return (
      <div className="deposit-container">
        <DepositPage
          onBack={() => {
            setShowDepositPage(false);
            setCurrentView("dashboard");
          }}
          onDepositBolivianos={() => {
            setShowDepositPage(false);
            setShowDepositBolivianosPage(true);
          }}
          onDepositCrypto={() => {
            setShowDepositPage(false);
            setShowDepositCryptoPage(true);
          }}
        />
      </div>
    );
  }

  // Show deposit bolivianos page
  if (showDepositBolivianosPage && user) {
    return (
      <div className="deposit-bolivianos-container">
        <DepositBolivianosPage
          onBack={() => {
            setShowDepositBolivianosPage(false);
            setShowDepositPage(true);
          }}
          onConfirmDeposit={(amount, reference) => {
            setDepositData({ amount, reference, currency: "BOB" });
            setShowDepositBolivianosPage(false);
            setShowDepositQRPage(true);
          }}
        />
      </div>
    );
  }

  // Show deposit crypto page
  if (showDepositCryptoPage && user) {
    return (
      <div className="deposit-crypto-container">
        <DepositCryptoPage
          onBack={() => {
            setShowDepositCryptoPage(false);
            setShowDepositPage(true);
          }}
        />
      </div>
    );
  }

  // Show deposit QR page
  if (showDepositQRPage && user && depositData) {
    return (
      <div className="deposit-qr-container">
        <DepositQRPage
          onBack={() => {
            setShowDepositQRPage(false);
            setDepositData(null);
            setCurrentView("dashboard");
          }}
          amount={depositData.amount}
          reference={depositData.reference}
          currency={depositData.currency}
          cryptocurrency={depositData.cryptocurrency}
        />
      </div>
    );
  }

  // Show withdraw crypto page
  if (showWithdrawCryptoPage && user) {
    return (
      <div className="withdraw-crypto-container">
        <WithdrawCryptoPage
          onBack={() => {
            setShowWithdrawCryptoPage(false);
            setShowWithdrawPage(true);
          }}
          onConfirmWithdraw={(cryptocurrency, amount, walletAddress) => {
            // TODO: Implement crypto withdrawal logic
            console.log('Confirming crypto withdrawal:', { cryptocurrency, amount, walletAddress, selectedAccount });
            alert(`Retiro confirmado: ${amount} USDT a ${cryptocurrency} (${walletAddress.slice(0, 10)}...)`);
            setShowWithdrawCryptoPage(false);
            setSelectedAccount(null); // Reset selected account
            setCurrentView("dashboard");
          }}
        />
      </div>
    );
  }

  // Show withdraw bolivianos page
  if (showWithdrawBolivianosPage && user) {
    return (
      <div className="withdraw-bolivianos-container">
        <WithdrawBolivianosPage
          onBack={() => {
            setShowWithdrawBolivianosPage(false);
            setShowWithdrawPage(true);
          }}
          onConfirmWithdraw={(amount, bankAccount) => {
            // TODO: Implement bolivianos withdrawal logic
            console.log('Confirming bolivianos withdrawal:', { amount, bankAccount, selectedAccount });
            alert(`Retiro confirmado: ${amount} USDT a cuenta ${bankAccount}`);
            setShowWithdrawBolivianosPage(false);
            setSelectedAccount(null); // Reset selected account
            setCurrentView("dashboard");
          }}
        />
      </div>
    );
  }

  // Show Account Type Selection page
  if (showAccountTypeSelection && user) {
    return (
      <div className="account-type-container">
        <AccountTypeSelectionPage
          onBack={() => {
            setShowAccountTypeSelection(false);
            setShowWithdrawPage(true);
          }}
          onSelectBolivianos={() => {
            setShowAccountTypeSelection(false);
            setShowCreateBankAccount(true);
          }}
          onSelectCrypto={() => {
            setShowAccountTypeSelection(false);
            setShowCreateCryptoAccount(true);
          }}
        />
      </div>
    );
  }

  // Show QR Scanner page
  if (showQRScanner && user) {
    return (
      <div className="qr-scanner-container">
        <QRScannerPage
          onBack={() => {
            setShowQRScanner(false);
            setShowWithdrawPage(true);
          }}
          onQRScanned={(data) => {
            console.log('QR Scanned:', data);
            // Procesar datos del QR y crear objeto de cuenta temporal
            try {
              const parts = data.split(':');
              if (parts.length >= 3) {
                const [type, bank, accountNumber, accountName] = parts;
                
                if (type === 'bank') {
                  // Crear objeto de cuenta temporal para usar en la confirmación
                  const tempAccount: SavedAccount = {
                    id: 'temp_qr',
                    type: 'bank',
                    name: accountName || 'Cuenta QR',
                    details: `${bank} - ${accountNumber}`,
                    bank: bank
                  };
                  
                  console.log('Cuenta temporal creada desde QR:', tempAccount);
                  setSelectedAccount(tempAccount);
                  
                  // Ir directamente a la confirmación de retiro
                  setShowQRScanner(false);
                  setShowWithdrawConfirmation(true);
                } else {
                  alert('Tipo de QR no soportado');
                  setShowQRScanner(false);
                  setShowWithdrawPage(true);
                }
              } else {
                alert('Formato de QR no válido');
                setShowQRScanner(false);
                setShowWithdrawPage(true);
              }
            } catch (error) {
              console.error('Error procesando QR:', error);
              alert('Error al procesar el código QR');
              setShowQRScanner(false);
              setShowWithdrawPage(true);
            }
          }}
        />
      </div>
    );
  }

  // Show Create Bank Account page
  if (showCreateBankAccount && user) {
    return (
      <div className="create-bank-account-container">
        <CreateAccountPage
          onBack={() => {
            setShowCreateBankAccount(false);
            setShowAccountTypeSelection(true);
          }}
          onCreateAccount={(accountData) => {
            console.log('Bank account created:', accountData);
            // TODO: Save bank account
            setShowCreateBankAccount(false);
            setShowWithdrawPage(true);
          }}
        />
      </div>
    );
  }

  // Show Create Crypto Account page
  if (showCreateCryptoAccount && user) {
    return (
      <div className="create-crypto-account-container">
        <CreateCryptoWalletPage
          onBack={() => {
            setShowCreateCryptoAccount(false);
            setShowAccountTypeSelection(true);
          }}
          onCreateWallet={(walletData) => {
            console.log('Crypto wallet created:', walletData);
            // TODO: Save crypto wallet
            setShowCreateCryptoAccount(false);
            setShowWithdrawPage(true);
          }}
        />
      </div>
    );
  }

  // Show withdraw success page
  if (showWithdrawSuccess && user && withdrawData) {
    return (
      <div className="withdraw-success-container">
        <WithdrawSuccessPage
          onDone={() => {
            setShowWithdrawSuccess(false);
            setWithdrawData(null);
            setSelectedAccount(null);
            setCurrentView("dashboard");
          }}
          amount={withdrawData.amount}
          accountName={withdrawData.accountName}
          transactionId={withdrawData.transactionId}
        />
      </div>
    );
  }

  // Show withdraw confirmation page
  if (showWithdrawConfirmation && user && selectedAccount) {
    return (
      <div className="withdraw-confirmation-container">
        <WithdrawConfirmationPage
          onBack={() => {
            setShowWithdrawConfirmation(false);
            setShowWithdrawPage(true);
          }}
          onConfirmWithdraw={(amount) => {
            console.log('Final withdrawal confirmation:', { amount, selectedAccount });
            
            // Crear datos del retiro
            const transactionId = Math.floor(1000 + Math.random() * 9000).toString();
            setWithdrawData({
              amount,
              accountName: selectedAccount.name,
              transactionId
            });
            
            setShowWithdrawConfirmation(false);
            setShowWithdrawSuccess(true);
          }}
          selectedAccount={selectedAccount}
        />
      </div>
    );
  }

  // Show withdraw page
  if (showWithdrawPage && user) {
    return (
      <div className="withdraw-container">
        <WithdrawPage
          onBack={() => {
            setShowWithdrawPage(false);
            setCurrentView("dashboard");
          }}
          onSelectAccount={(account) => {
            setSelectedAccount(account);
            setShowWithdrawPage(false);
            setShowWithdrawConfirmation(true);
          }}
          onAddAccount={() => {
            setShowWithdrawPage(false);
            setShowAccountTypeSelection(true);
          }}
          onScanQR={() => {
            setShowWithdrawPage(false);
            setShowQRScanner(true);
          }}
        />
      </div>
    );
  }

  // Show dashboard if authenticated
  if (currentView === "dashboard" && user) {
    return (
      <div className="dashboard-container">
        <Dashboard
          user={user}
          onLogout={logout}
          onNavigateToHistory={() => setCurrentView("history")}
          onNavigateToMore={() => setCurrentView("more")}
          onNavigateToSettings={() => setCurrentView("settings")}
          onNavigateToDeposit={handleDeposit}
          onNavigateToWithdraw={handleWithdraw}
          onNavigateToQRScanner={() => {
            if (typeof window !== 'undefined') {
              const kycCompleted = localStorage.getItem("kyc_completed");
              if (!kycCompleted) {
                setKycTransactionType("retiro");
                setShowKycModal(true);
                return;
              }
            }
            setShowQRScanner(true);
          }}
          onNavigateToDepositQR={() => {
            if (typeof window !== 'undefined') {
              const kycCompleted = localStorage.getItem("kyc_completed");
              if (!kycCompleted) {
                setKycTransactionType("deposito");
                setShowKycModal(true);
                return;
              }
            }
            // Crear datos de depósito sin monto para QR directo
            setDepositData({ amount: 0, reference: "QR-Directo" });
            setShowDepositQRPage(true);
          }}
        />
        
        {/* KYC Modal */}
        {showKycModal && kycTransactionType && (
          <KYCModal
            isOpen={showKycModal}
            onClose={() => setShowKycModal(false)}
            onComplete={handleKycComplete}
            transactionType={kycTransactionType}
          />
        )}
      </div>
    );
  }

  // Show Corbado authentication
  return (
    <div>
      <CorbadoAuth
        onAuthSuccess={handleAuthSuccess}
        onShowSignup={handleShowSignup}
      />
      {/* Add debug buttons */}
      <div className="fixed bottom-4 right-4 space-y-2">
        <button
          onClick={clearKYCStatus}
          className="bg-orange-500 text-white px-4 py-2 rounded text-sm block w-full"
        >
          Limpiar KYC
        </button>
        <button
          onClick={clearAllData}
          className="bg-red-500 text-white px-4 py-2 rounded text-sm block w-full"
        >
          Limpiar Datos
        </button>
      </div>
    </div>
  );
}