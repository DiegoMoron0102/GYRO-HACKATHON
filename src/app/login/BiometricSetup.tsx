"use client";

import React from "react";
import Image from "next/image";

interface BiometricSetupProps {
  onContinue?: () => void;
  onSkip?: () => void;
}

export default function BiometricSetup({ onContinue, onSkip }: BiometricSetupProps) {
  return (
    <div className="min-h-screen bg-white flex justify-center">
      <main className="w-full max-w-[360px] h-screen flex flex-col overflow-hidden">
        {/* ─────────────────── Hero ─────────────────── */}
        <section className="flex flex-col items-center pt-16 pb-8 bg-[#FFFBF2] relative flex-1">
          {/* Logo */}
          <div className="mb-8">
            <Image 
              src="/images/gyro-logo.png" 
              alt="GYRO Logo" 
              width={110}
              height={62}
              className="object-contain"
            />
          </div>

          {/* Biometric illustration */}
          <div className="relative mb-8">
            <div className="w-32 h-32 bg-[#2A906F] rounded-full flex items-center justify-center">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                <path d="M12 1C15.5 1 18.5 3.5 18.5 6.5C18.5 8.5 17.5 10.5 16 11.5L16 14C16 17.5 13.5 20 10 20C6.5 20 4 17.5 4 14L4 11.5C2.5 10.5 1.5 8.5 1.5 6.5C1.5 3.5 4.5 1 8 1L12 1Z" stroke="white" strokeWidth="2"/>
                <circle cx="8" cy="6" r="1.5" fill="white"/>
                <circle cx="12" cy="6" r="1.5" fill="white"/>
              </svg>
            </div>
          </div>

          {/* Title and description */}
          <div className="text-center px-8 mb-8">
            <h1 className="text-[24px] font-bold text-gray-900 mb-4">
              ¡Cuenta creada exitosamente!
            </h1>
            <p className="text-base text-gray-600 leading-relaxed">
              Configura tu autenticación biométrica para acceder de forma rápida y segura a tu billetera GYRO.
            </p>
          </div>
        </section>

        {/* ──────────────── Buttons ──────────────── */}
        <section className="px-8 pb-8 bg-white">
          <div className="space-y-4">
            <button
              onClick={onContinue}
              className="w-full h-12 rounded-md bg-[#2A906F] text-white text-base font-semibold hover:bg-[#237A5E] transition-colors shadow-sm"
            >
              Configurar ahora
            </button>
            
            <button
              onClick={onSkip}
              className="w-full h-12 rounded-md border border-gray-300 text-gray-700 text-base font-medium hover:bg-gray-50 transition-colors"
            >
              Omitir por ahora
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
