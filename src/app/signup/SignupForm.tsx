"use client";

import React, { useState } from "react";
import { createAccount } from "../../lib/keys";
import { useRegisterUserWithSponsor } from "@/hooks/useRegisterUser"; // Ajusta el path si es necesario

interface User {
  id: number;
  name: string;
  email: string;
  pin: string;
  stellarPublicKey?: string;
  createdAt: string;
}

interface SignupFormProps {
  onSignupSuccess: (user: User) => void;
  onBackToLogin: () => void;
}

export default function SignupForm({ onSignupSuccess, onBackToLogin }: SignupFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    pin: '',
    confirmPin: ''
  });
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [isLoading, setIsLoading] = useState(false);

  // Hook para registrar usuario en Soroban (con sponsor)
  const { register, loading: loadingRegister, error: errorRegister } = useRegisterUserWithSponsor();

  const validateField = (field: string, value: string) => {
    switch (field) {
      case 'name':
        return value.trim().length >= 2 ? '' : 'El nombre debe tener al menos 2 caracteres';
      case 'email':
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? '' : 'Email inválido';
      case 'pin':
        return /^\d{4}$/.test(value) ? '' : 'El PIN debe tener 4 dígitos';
      case 'confirmPin':
        return value === formData.pin ? '' : 'Los PINs no coinciden';
      default:
        return '';
    }
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    let processedValue = value;

    // Procesar PIN para solo permitir números
    if (field === 'pin' || field === 'confirmPin') {
      processedValue = value.replace(/\D/g, '').slice(0, 4);
    }

    setFormData(prev => ({ ...prev, [field]: processedValue }));

    // Validar en tiempo real
    const error = validateField(field, processedValue);
    setErrors(prev => ({ ...prev, [field]: error }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validar todos los campos
    const newErrors: {[key: string]: string} = {};
    Object.entries(formData).forEach(([field, value]) => {
      const error = validateField(field, value);
      if (error) newErrors[field] = error;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);

    try {
      // 1. Crear cuenta Stellar (local)
      const stellarPublicKey = await createAccount(formData.pin);

      // 2. Registrar usuario en Soroban con sponsor
      await register(stellarPublicKey);

      // 3. Crear usuario local
      const newUser: User = {
        id: Date.now(),
        name: formData.name,
        email: formData.email,
        pin: formData.pin,
        stellarPublicKey,
        createdAt: new Date().toISOString()
      };

      // 4. Guardar en localStorage (simulando backend)
      const existingUsers = JSON.parse(localStorage.getItem("gyro_users") || "[]");

      // Verificar si el email ya existe
      if (existingUsers.some((user: User) => user.email === formData.email)) {
        setErrors({ email: 'Este email ya está registrado' });
        setIsLoading(false);
        return;
      }

      existingUsers.push(newUser);
      localStorage.setItem("gyro_users", JSON.stringify(existingUsers));

      onSignupSuccess(newUser);

    } catch {
      // Manejo robusto del error
      if (
          typeof errorRegister === "object" &&
          errorRegister !== null &&
          "message" in errorRegister &&
          typeof (errorRegister as { message: unknown }).message === "string"
        ) {
          setErrors({ general: (errorRegister as { message: string }).message });
        }

    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="signup-full-screen">
      <main className="signup-main">
        {/* Header */}
        <header className="flex items-center justify-between p-4 bg-white">
          <button 
            onClick={onBackToLogin} 
            className="p-2 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M15 18L9 12L15 6" stroke="#1C2317" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <h1 className="text-xl font-semibold text-[#1C2317]">Crear cuenta</h1>
          <div className="w-10"></div>
        </header>

        {/* Content */}
        <section className="flex-1 bg-white p-6">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold text-[#1C2317] mb-2">Únete a GYRO</h2>
            <p className="text-gray-600">Tu billetera digital segura con tecnología Stellar</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nombre */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre completo
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={`w-full p-4 border rounded-xl focus:ring-2 focus:ring-[#2A906F] focus:border-transparent outline-none transition-all ${
                  errors.name ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="Tu nombre completo"
                disabled={isLoading || loadingRegister}
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={`w-full p-4 border rounded-xl focus:ring-2 focus:ring-[#2A906F] focus:border-transparent outline-none transition-all ${
                  errors.email ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="tu@email.com"
                disabled={isLoading || loadingRegister}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            {/* PIN */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                PIN de seguridad (4 dígitos)
              </label>
              <input
                type="password"
                value={formData.pin}
                onChange={(e) => handleInputChange('pin', e.target.value)}
                className={`w-full p-4 border rounded-xl focus:ring-2 focus:ring-[#2A906F] focus:border-transparent outline-none transition-all text-center text-2xl tracking-widest ${
                  errors.pin ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="••••"
                maxLength={4}
                disabled={isLoading || loadingRegister}
              />
              {errors.pin && <p className="text-red-500 text-sm mt-1">{errors.pin}</p>}
            </div>

            {/* Confirmar PIN */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirmar PIN
              </label>
              <input
                type="password"
                value={formData.confirmPin}
                onChange={(e) => handleInputChange('confirmPin', e.target.value)}
                className={`w-full p-4 border rounded-xl focus:ring-2 focus:ring-[#2A906F] focus:border-transparent outline-none transition-all text-center text-2xl tracking-widest ${
                  errors.confirmPin ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="••••"
                maxLength={4}
                disabled={isLoading || loadingRegister}
              />
              {errors.confirmPin && <p className="text-red-500 text-sm mt-1">{errors.confirmPin}</p>}
            </div>

            {/* Error general */}
            {errors.general && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <p className="text-red-600 text-sm">{errors.general}</p>
              </div>
            )}
            

            {/* Info sobre Stellar */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <div className="flex items-start">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-blue-600 mt-0.5 mr-3">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                  <path d="M12 16v-4M12 8h.01" stroke="currentColor" strokeWidth="2"/>
                </svg>
                <div>
                  <p className="text-blue-800 text-sm font-medium mb-1">
                    Stellar Testnet
                  </p>
                  <p className="text-blue-700 text-xs">
                    Tu billetera se creará en la red de prueba de Stellar. Cifrado AES-256 protege tus claves.
                  </p>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={
                isLoading ||
                loadingRegister ||
                Object.keys(errors).some(key => errors[key] && key !== 'general')
              }
              className="w-full py-4 bg-[#2A906F] text-white font-semibold rounded-xl hover:bg-[#1F6B52] transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading || loadingRegister ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Creando cuenta...
                </>
              ) : (
                'Crear cuenta'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm">
              ¿Ya tienes cuenta?{' '}
              <button
                onClick={onBackToLogin}
                className="text-[#2A906F] font-medium hover:underline"
                disabled={isLoading || loadingRegister}
              >
                Iniciar sesión
              </button>
            </p>
          </div>
        </section>
      </main>

      <style jsx>{`
        .signup-full-screen {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: white;
          z-index: 50;
        }
        .signup-main {
          height: 100vh;
          max-width: 390px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          background: white;
        }
      `}</style>
    </div>
  );
}
