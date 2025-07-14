"use client";

import React, { useState } from "react";
import Image from "next/image";

interface User {
  id: number;
  name: string;
  email: string;
  pin: string;
  createdAt: string;
}

interface CorbadoAuthProps {
  onAuthSuccess?: (user: User) => void;
  onShowSignup?: () => void;
}

export default function CorbadoAuth({ onAuthSuccess, onShowSignup }: CorbadoAuthProps) {
  const [pin, setPin] = useState(['', '', '', '']);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [error, setError] = useState('');

  const ADMIN_PIN = "admn"; 

  const handlePinChange = (index: number, value: string) => {
    if (value.length > 1) return; // Solo un dígito por input
    
    const newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);
    setError('');

    // Auto-focus next input
    if (value && index < 3) {
      const nextInput = document.getElementById(`pin-${index + 1}`);
      nextInput?.focus();
    }

    // Auto-submit when all 4 digits are entered
    if (index === 3 && value && newPin.every(digit => digit !== '')) {
      handlePinLogin(newPin.join(''));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !pin[index] && index > 0) {
      const prevInput = document.getElementById(`pin-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handlePinLogin = async (pinValue: string) => {
    setIsAuthenticating(true);
    setError('');

     if (pinValue.toLowerCase() === ADMIN_PIN) {
      const adminUser: User = {
        id        : 0,
        name      : "Administrador",
        email     : "admin@gyro.local",
        pin       : ADMIN_PIN,
        createdAt : new Date().toISOString()
      };
      // pequeño retardo para mostrar animación
      setTimeout(() => {
        onAuthSuccess?.(adminUser);
        setIsAuthenticating(false);
      }, 600);
      return;
    }

    try {
      // Buscar usuarios en localStorage
      const existingUsers: User[] = JSON.parse(localStorage.getItem("gyro_users") || "[]");
      
      if (existingUsers.length === 0) {
        setError('No hay usuarios registrados');
        setIsAuthenticating(false);
        return;
      }

      const user = existingUsers.find(u => u.pin === pinValue);

      if (user) {
        // Simular tiempo de autenticación
        setTimeout(() => {
          onAuthSuccess?.(user);
          setIsAuthenticating(false);
        }, 1000);
      } else {
        setError('PIN incorrecto');
        setPin(['', '', '', '']);
        setIsAuthenticating(false);
        // Focus first input
        document.getElementById('pin-0')?.focus();
      }
    } catch {
      setError('Error al autenticar');
      setIsAuthenticating(false);
    }
  };

  if (isAuthenticating) {
    return (
      <div className="min-h-screen bg-white flex justify-center items-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#2A906F] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Autenticando...
          </h3>
          <p className="text-sm text-gray-600">Verificando tu PIN</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex justify-center">
      <main className="w-full max-w-[360px] h-screen flex flex-col overflow-hidden">
        {/* Hero Section */}
        <section className="flex flex-col items-center pt-9 pb-8 bg-[#FFFBF2] relative" style={{ height: "364px" }}>
          {/* Logo GYRO */}
          <div className="mb-8">
            <Image 
              src="/images/gyro-logo.png" 
              alt="GYRO Logo" 
              width={110}
              height={62}
              className="object-contain"
            />
          </div>

          {/* Título */}
          <div className="text-center px-6">
            <h1 className="text-[28px] font-bold text-gray-900 leading-tight mb-3">
              Bienvenido a
            </h1>
            <h2 className="text-[28px] font-bold text-[#2A906F] leading-tight">
              GYRO Wallet
            </h2>
            <p className="text-base text-gray-600 mt-4">
              Ingresa tu PIN de seguridad
            </p>
          </div>

          {/* Decorative elements */}
          <div className="absolute top-4 left-4 w-6 h-6 bg-yellow-200 rounded-full opacity-60"></div>
          <div className="absolute top-16 right-8 w-4 h-4 bg-blue-200 rounded-full opacity-40"></div>
          <div className="absolute bottom-8 left-8 w-5 h-5 bg-green-200 rounded-full opacity-50"></div>
        </section>

        {/* PIN Section */}
        <section className="flex-1 px-6 py-8 bg-white">
          <div className="h-full flex flex-col justify-center">
            <div className="mb-8 text-center">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Iniciar Sesión
              </h3>
              <p className="text-sm text-gray-600">
                Ingresa tu PIN de 4 dígitos
              </p>
            </div>

            {/* PIN Input */}
            <div className="mb-6">
              <div className="flex justify-center gap-4 mb-4">
                {pin.map((digit, index) => (
                  <input
                    key={index}
                    id={`pin-${index}`}
                    type="password"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handlePinChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-14 h-14 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg focus:border-[#2A906F] focus:outline-none transition-colors"
                    disabled={isAuthenticating}
                  />
                ))}
              </div>

              {error && (
                <p className="text-center text-sm text-red-600 mb-4">
                  {error}
                </p>
              )}

              <div className="text-center">
                <button
                  onClick={() => {
                    setPin(['', '', '', '']);
                    setError('');
                    document.getElementById('pin-0')?.focus();
                  }}
                  className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
                >
                  Limpiar PIN
                </button>
              </div>
            </div>

            {/* Signup Button */}
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-4">
                  ¿No tienes una cuenta?
                </p>
                <button
                  onClick={onShowSignup}
                  className="w-full border-2 border-[#2A906F] text-[#2A906F] py-4 rounded-lg font-semibold text-lg hover:bg-[#2A906F] hover:text-white transition-colors"
                >
                  Crear Nueva Cuenta
                </button>
              </div>
            </div>

            {/* Security Notice */}
            <div className="mt-8 text-center">
              <p className="text-xs text-gray-500">
                🔒 Tu información está protegida con PIN de seguridad
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}