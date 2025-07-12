"use client";

import { useForm } from "react-hook-form";
import Link from "next/link";
import React, { useState } from "react";
import Image from "next/image";



interface FormData {
  name: string;
  phone: string;
  email: string;
  password: string;
  acceptTerms: boolean;
}

interface SignupFormProps {
  onBack?: () => void;
  onSuccessfulSignup?: () => void;
}

/**
 * Pantalla de Crear Cuenta
 * ——————————————————————————————————————————
 * Réplica del diseño de Figma con:
 * • Header con botón back y logo
 * • Formulario completo con 4 campos
 * • Checkbox de términos y condiciones
 * • Botón de crear cuenta
 */
export default function SignupForm({ onBack, onSuccessfulSignup }: SignupFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [isSettingUpBiometric, setIsSettingUpBiometric] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      password: "",
      acceptTerms: false,
    },
  });

  const setupBiometricAuth = async () => {
    setIsSettingUpBiometric(true);
    try {
      // Simulate biometric setup with a simple check
      // In a real app, this would integrate with device biometric APIs
      const hasPasskey = typeof window !== 'undefined' && 
                        'navigator' in window && 
                        'credentials' in navigator;
      
      if (hasPasskey) {
        // Store biometric preference
        localStorage.setItem('biometricEnabled', 'true');
        localStorage.setItem('userEmail', 'user@example.com');
      } else {
        localStorage.setItem('biometricEnabled', 'false');
      }
      
      // Always proceed to success
      onSuccessfulSignup?.();
    } catch {
      console.log('Biometric setup failed, proceeding without it');
      localStorage.setItem('biometricEnabled', 'false');
      onSuccessfulSignup?.();
    } finally {
      setIsSettingUpBiometric(false);
    }
  };

  const onSubmit = async (data: FormData) => {
    console.log("Signup data:", data);
    // TODO: lógica de registro
    
    // Simulate successful account creation
    setTimeout(() => {
      setupBiometricAuth();
    }, 1000);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen bg-white flex justify-center">
      <main className="w-full max-w-[360px] h-screen flex flex-col overflow-hidden">
        {/* ─────────────────── Header ─────────────────── */}
        <header className="flex items-center justify-between px-4 pt-4 pb-6 bg-white">
          {/* Back button */}
          <button onClick={onBack} className="flex items-center gap-2 text-[#1C628B]">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="text-sm font-medium">Back</span>
          </button>

         
          
        </header>

        {/* ──────────────── Formulario ──────────────── */}
        <section className="flex-1 items-center px-6 pt-8 pb-6 bg-white">
             {/* Logo GYRO - ruta desde public */}
                    <div className="mb-10">
                      <Image 
                        src="/images/gyro-logo.png" 
                        alt="GYRO Logo" 
                        width={110}
                        height={62}
                        className="object-contain"
                      />
                    </div>
                    
          {/* Title */}
          <div className="mb-8">
            <h1 className="text-[20px] font-bold text-gray-900 leading-relaxed">
              Crear Cuenta
            </h1>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8" noValidate>
            {/* Nombre */}
            <div className="space-y-2">
              <div className="flex items-center gap-1">
                <label htmlFor="name" className="text-sm font-medium text-gray-900">
                  Nombre
                </label>
                <span className="text-red-600 text-sm">*</span>
              </div>
              <input
                id="name"
                type="text"
                placeholder="Ej: Leonardo Vaca"
                className="w-full h-11 rounded border border-gray-300 px-3 py-3 text-sm placeholder-gray-400 focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20 outline-none bg-white transition-colors"
                {...register("name", {
                  required: "Obligatorio",
                  minLength: {
                    value: 2,
                    message: "Mínimo 2 caracteres",
                  },
                })}
              />
              {errors.name && (
                <p className="text-xs text-red-600 mt-1">{errors.name.message}</p>
              )}
            </div>

            {/* Número Telefónico */}
            <div className="space-y-2">
              <div className="flex items-center gap-1">
                <label htmlFor="phone" className="text-sm font-medium text-gray-900">
                  Número Telefónico
                </label>
                <span className="text-red-600 text-sm">*</span>
              </div>
              <div className="flex">
                <div className="flex items-center px-3 py-3 border border-r-0 border-gray-300 rounded-l bg-gray-50">
                  <span className="text-sm text-gray-700">+591</span>
                  <svg width="12" height="8" viewBox="0 0 12 8" className="ml-1">
                    <path d="M6 8L0 2L1.5 0.5L6 5L10.5 0.5L12 2L6 8Z" fill="currentColor"/>
                  </svg>
                </div>
                <input
                  id="phone"
                  type="tel"
                  placeholder="Ej: 777-7777"
                  className="flex-1 h-11 rounded-r border border-gray-300 px-3 py-3 text-sm placeholder-gray-400 focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20 outline-none bg-white transition-colors"
                  {...register("phone", {
                    required: "Obligatorio",
                    pattern: {
                      value: /^[0-9\-\s]+$/,
                      message: "Formato inválido",
                    },
                  })}
                />
              </div>
              {errors.phone && (
                <p className="text-xs text-red-600 mt-1">{errors.phone.message}</p>
              )}
            </div>

            {/* Correo Electrónico */}
            <div className="space-y-2">
              <div className="flex items-center gap-1">
                <label htmlFor="email" className="text-sm font-medium text-gray-900">
                  Correo Electrónico
                </label>
                <span className="text-red-600 text-sm">*</span>
              </div>
              <input
                id="email"
                type="email"
                placeholder="ejemplo@gmail.com"
                className="w-full h-11 rounded border border-gray-300 px-3 py-3 text-sm placeholder-gray-400 focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20 outline-none bg-white transition-colors"
                {...register("email", {
                  required: "Obligatorio",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Correo inválido",
                  },
                })}
              />
              {errors.email && (
                <p className="text-xs text-red-600 mt-1">{errors.email.message}</p>
              )}
            </div>

            {/* Contraseña */}
            <div className="space-y-2">
              <div className="flex items-center gap-1">
                <label htmlFor="password" className="text-sm font-medium text-gray-900">
                  Contraseña
                </label>
                <span className="text-red-600 text-sm">*</span>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Contraseña"
                  className="w-full h-11 rounded border border-gray-300 px-3 py-3 text-sm placeholder-gray-400 focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20 outline-none bg-white transition-colors pr-10"
                  {...register("password", {
                    required: "Obligatorio",
                    minLength: {
                      value: 6,
                      message: "Mínimo 6 caracteres",
                    },
                  })}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                >
                  {showPassword ? (
                    <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                      <path d="M10 3C14.5 3 18.5 6.5 18.5 10C18.5 13.5 14.5 17 10 17C5.5 17 1.5 13.5 1.5 10C1.5 6.5 5.5 3 10 3Z" stroke="currentColor" strokeWidth="1.5"/>
                      <circle cx="10" cy="10" r="3" stroke="currentColor" strokeWidth="1.5"/>
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                      <path d="M3 3L17 17M10.5 10.5C10.1 10.9 9.6 11.1 9 11.1C7.9 11.1 7 10.2 7 9.1C7 8.5 7.2 8 7.6 7.6M12.7 12.7C11.9 13.3 10.9 13.7 10 13.7C6.5 13.7 3.5 11.2 2 8.7C2.9 7.2 4.1 6 5.6 5.3M8.5 4.5C9 4.3 9.5 4.3 10 4.3C13.5 4.3 16.5 6.8 18 9.3C17.5 10.2 16.9 11 16.1 11.7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-600 mt-1">{errors.password.message}</p>
              )}
            </div>

            {/* Checkbox términos y condiciones */}
            <div className="flex items-start gap-3 py-8">
              <input
                id="terms"
                type="checkbox"
                className="mt-0.5 w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                {...register("acceptTerms", {
                  required: "Debes aceptar los términos",
                })}
              />
              <label htmlFor="terms" className="text-sm text-gray-700 leading-relaxed">
                Acepto los{" "}
                <Link href="/terms" className="text-[#1C628B] underline">
                  términos y condiciones
                </Link>
              </label>
            </div>
            {errors.acceptTerms && (
              <p className="text-xs text-red-600">{errors.acceptTerms.message}</p>
            )}

            {/* Crear cuenta button */}
            <button
              type="submit"
              disabled={isSubmitting || isSettingUpBiometric}
              className="w-full h-11 rounded bg-[#2A906F] text-white text-base font-semibold hover:bg-[#237A5E] disabled:opacity-60 disabled:cursor-not-allowed transition-colors shadow-sm mt-12"
            >
              {isSubmitting ? "Creando cuenta…" : 
               isSettingUpBiometric ? "Configurando autenticación..." : 
               "Crear la cuenta"}
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}
            