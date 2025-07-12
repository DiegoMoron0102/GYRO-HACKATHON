// src/app/page.tsx
"use client";

import React, { useState } from "react";
import SplashScreen from "./components/SplashScreen";
import LoginCorreo from "./login/LoginCorreo";
import LoginPassword from "./login/LoginPassword";
import SignupForm from "./signup/SignupForm";

/**
 * Página raíz que controla la transición entre splash screen y login.
 * Maneja el fade out del splash hacia la página de login.
 */
export default function Home() {
  const [showSplash, setShowSplash] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  const handleContinueToPassword = () => {
    setShowPassword(true);
  };

  const handleGoToSignup = () => {
    setShowSignup(true);
  };

  const handleBackToEmail = () => {
    setShowPassword(false);
    setShowSignup(false);
  };

  return (
    <>
      {showSplash && <SplashScreen onComplete={handleSplashComplete} />}
      {!showSplash && !showPassword && !showSignup && <LoginCorreo onContinue={handleContinueToPassword} onSignup={handleGoToSignup} />}
      {!showSplash && showPassword && <LoginPassword onBack={handleBackToEmail} />}
      {!showSplash && showSignup && <SignupForm onBack={handleBackToEmail} />}
    </>
  );
}