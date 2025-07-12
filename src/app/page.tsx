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

interface User {
  id: number;
  name: string;
  email: string;
  pin: string;
  createdAt: string;
}

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
  const [kycTransactionType, setKycTransactionType] = useState<"deposito" | "retiro" | null>(null);
  const [depositData, setDepositData] = useState<{amount: number, reference?: string, currency?: string, cryptocurrency?: string} | null>(null);

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
    setUser(userData);
    localStorage.setItem("gyro_user", JSON.stringify(userData));
    setCurrentView("dashboard");
    resetActivity(); // Resetear timer al hacer login
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
          onConfirmDeposit={(cryptocurrency, amount) => {
            setDepositData({ amount, cryptocurrency });
            setShowDepositCryptoPage(false);
            setShowDepositQRPage(true);
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
            console.log('Confirming crypto withdrawal:', { cryptocurrency, amount, walletAddress });
            alert(`Retiro confirmado: ${amount} USDT a ${cryptocurrency} (${walletAddress.slice(0, 10)}...)`);
            setShowWithdrawCryptoPage(false);
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
            console.log('Confirming bolivianos withdrawal:', { amount, bankAccount });
            alert(`Retiro confirmado: ${amount} USDT a cuenta ${bankAccount}`);
            setShowWithdrawBolivianosPage(false);
            setCurrentView("dashboard");
          }}
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
          onWithdrawBolivianos={() => {
            setShowWithdrawPage(false);
            setShowWithdrawBolivianosPage(true);
          }}
          onWithdrawCrypto={() => {
            setShowWithdrawPage(false);
            setShowWithdrawCryptoPage(true);
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