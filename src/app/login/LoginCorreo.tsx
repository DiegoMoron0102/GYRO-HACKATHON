"use client";

import { useForm } from "react-hook-form";
import React, { useEffect, useState } from "react";
import Image from "next/image";


/* ------------------------------------------------------------
 * Tipo del formulario
 * -----------------------------------------------------------*/
interface FormData {
  email: string;
}

interface LoginCorreoProps {
  onContinue?: () => void;
  onSignup?: () => void;
  onBiometricLogin?: () => void;
}

export default function LoginCorreo({ onContinue, onSignup, onBiometricLogin }: LoginCorreoProps) {
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ defaultValues: { email: "" } });

  useEffect(() => {
    // Check if user has biometric authentication enabled
    const biometricPref = localStorage.getItem('biometricEnabled');
    setBiometricEnabled(biometricPref === 'true');
  }, []);

  const handleBiometricLogin = async () => {
    setIsAuthenticating(true);
    try {
      // Simulate biometric authentication
      // In a real app, this would use device biometric APIs
      const hasPasskey = typeof window !== 'undefined' && 
                        'navigator' in window && 
                        'credentials' in navigator;
      
      if (hasPasskey) {
        // Simulate successful biometric auth
        setTimeout(() => {
          onBiometricLogin?.();
        }, 1000);
      } else {
        throw new Error('Biometric not supported');
      }
    } catch {
      console.log('Biometric authentication failed');
      alert('Autenticación biométrica falló. Usa tu correo para iniciar sesión.');
    } finally {
      setIsAuthenticating(false);
    }
  };

  const onSubmit = async (data: FormData) => {
    console.log("Email:", data.email);
    onContinue?.();
  };

  return (
    <div className="min-h-screen bg-white flex justify-center">
      <main className="w-full max-w-[360px] h-screen flex flex-col overflow-hidden">
        {/* ─────────────────── Hero ─────────────────── */}
        <section className="flex flex-col items-center pt-9 pb-8 bg-[#FFFBF2] relative" style={{ height: "364px" }}>
          {/* Logo GYRO - ruta desde public */}
          <div className="mb-8">
            <Image 
              src="/images/gyro-logo.png" 
              alt="GYRO Logo" 
              width={110}
              height={62}
              className="object-contain"
            />
          </div>

          {/* Smartphone illustration - ruta desde public */}
          <div className="relative">
            {/* Phone shadow */}
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-3 w-40 h-3 bg-black/10 rounded-full blur-sm"></div>
            
            {/* Phone image */}
            <Image 
              src="/images/phone-illustration.png" 
              alt="Phone Illustration" 
              width={140}
              height={240}
              className="object-contain relative z-10"
            />
          </div>
        </section>

        {/* ──────────────── Formulario ──────────────── */}
        <section className="flex-1 px-8 pt-8 pb-6">
          {/* Title */}
          <div className="mb-8">
            <h1 className="text-[20px] font-bold text-gray-900 leading-relaxed">
              {biometricEnabled ? 'Accede a tu cuenta' : 'Ingresa tu correo electrónico'}
            </h1>
          </div>

          {biometricEnabled ? (
            /* Biometric Login Section */
            <div className="space-y-6">
              <div className="flex flex-col items-center py-8">
                <div className="w-20 h-20 bg-[#2A906F] rounded-full flex items-center justify-center mb-4">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                    <path d="M12 1C15.5 1 18.5 3.5 18.5 6.5C18.5 8.5 17.5 10.5 16 11.5L16 14C16 17.5 13.5 20 10 20C6.5 20 4 17.5 4 14L4 11.5C2.5 10.5 1.5 8.5 1.5 6.5C1.5 3.5 4.5 1 8 1L12 1Z" stroke="white" strokeWidth="2"/>
                    <circle cx="8" cy="6" r="1" fill="white"/>
                    <circle cx="12" cy="6" r="1" fill="white"/>
                  </svg>
                </div>
                <p className="text-sm text-gray-600 text-center mb-6">
                  Usa tu autenticación biométrica para acceder de forma segura
                </p>
                
                <button
                  onClick={handleBiometricLogin}
                  disabled={isAuthenticating}
                  className="w-full h-12 rounded-md bg-[#2A906F] text-white text-base font-semibold hover:bg-[#237A5E] disabled:opacity-60 disabled:cursor-not-allowed transition-colors shadow-sm"
                >
                  {isAuthenticating ? "Autenticando..." : "Usar Face ID / Huella"}
                </button>
              </div>
              
              <div className="text-center">
                <button 
                  type="button"
                  onClick={() => setBiometricEnabled(false)}
                  className="text-sm font-medium text-[#1C628B] hover:text-blue-800 underline bg-transparent border-none p-0 cursor-pointer"
                >
                  Usar correo electrónico
                </button>
              </div>
            </div>
          ) : (
            /* Email Login Form */
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
              {/* Input field */}
              <div className="space-y-3">
                {/* Label */}
                <label htmlFor="email" className="text-sm font-medium text-black-600 block leading-relaxed">
                  correo electrónico
                </label>
                
                {/* Input container */}
                <input
                  id="email"
                  type="email"
                  placeholder="ejemplo@gmail.com"
                  autoComplete="email"
                  className="w-full h-12 rounded-md border border-gray-300 px-4 py-3 text-sm placeholder-gray-400 focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20 outline-none bg-white transition-colors"
                  {...register("email", {
                    required: "Obligatorio",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Correo inválido",
                    },
                  })}
                />
                
                {errors.email && (
                  <p className="text-xs text-red-600 mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Crear cuenta link */}
              <div className="py-2">
                <button 
                  type="button"
                  onClick={onSignup}
                  className="text-sm font-medium text-[#1C628B] hover:text-blue-800 underline bg-transparent border-none p-0 cursor-pointer"
                >
                  Crear cuenta
                </button>
              </div>

              {/* Continue button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-12 rounded-md bg-[#2A906F] text-white text-base font-semibold hover:bg-[#237A5E] disabled:opacity-60 disabled:cursor-not-allowed transition-colors shadow-sm mt-8"
              >
                {isSubmitting ? "Enviando…" : "Continuar"}
              </button>
            </form>
          )}
        </section>
      </main>
    </div>
  );
}