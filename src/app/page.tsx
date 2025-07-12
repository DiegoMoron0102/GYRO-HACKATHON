"use client";

import React, { useState, useEffect, useCallback } from "react";
import SplashScreen from "./components/SplashScreen";
import CorbadoAuth from "./components/CorbadoAuth";
import SignupForm from "./signup/SignupForm";
import Dashboard from "./components/Dashboard";
import HistoryPage from "./components/HistoryPage";
import MorePage from "./components/MorePage";
import ProfileSettingsPage from "./components/ProfileSettingsPage";

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
    "splash" | "auth" | "signup" | "dashboard" | "history" | "more" | "settings"
  >("splash");
  const [user, setUser] = useState<User | null>(null);
  const [lastActivity, setLastActivity] = useState<number>(Date.now());

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
        />
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