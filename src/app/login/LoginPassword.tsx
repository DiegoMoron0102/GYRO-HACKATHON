"use client";

import { useForm } from "react-hook-form";
import React, { useState } from "react";
import Image from "next/image";

/* ------------------------------------------------------------
 * Tipo del formulario
 * -----------------------------------------------------------*/
interface FormData {
  password: string;
}

interface LoginPasswordProps {
  onBack?: () => void;
}

/**
 * Pantalla de Login con Contraseña
 * ——————————————————————————————————————————
 * Réplica visual exacta del mockup de Figma.
 *  • Header con botón back y logo
 *  • Ilustración del escudo con candado
 *  • Formulario de contraseña con toggle de visibilidad
 *  • Mobile-first (360 × 800) y totalmente responsive.
 */
export default function LoginPassword({ onBack }: LoginPasswordProps) {
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ defaultValues: { password: "" } });

  const onSubmit = async (data: FormData) => {
    console.log("Password:", data.password);
    // TODO: lógica de autenticación
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen bg-white flex justify-center">
      <main className="w-full max-w-[360px] h-screen flex flex-col overflow-hidden">
        {/* ─────────────────── Header ─────────────────── */}
        <header className="flex items-center justify-between px-4 pt-4 pb-6 bg-[#FFFBF2]">
          {/* Back button */}
          <button onClick={onBack} className="flex items-center gap-2 text-gray-600">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="text-sm font-medium">Back</span>
          </button>

          
        </header>

        {/* ─────────────────── Hero ─────────────────── */}
        <section className="flex flex-col items-center pt-12 pb-16 bg-[#FFFBF2] relative">
          <div className="mb-8">
                      <Image 
                        src="/images/gyro-logo.png" 
                        alt="GYRO Logo" 
                        width={110}
                        height={62}
                        className="object-contain"
                      />
                    </div>
          {/* Shield with lock illustration */}
          <div className="relative mb-8">
            {/* Shadow */}
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-8 w-32 h-3 bg-black/10 rounded-full blur-sm"></div>
            
            {/* Shield and lock image */}
            <Image 
              src="/images/password-illustration.png" 
              alt="Security Shield" 
              width={200}
              height={200}
              className="object-contain relative z-10"
            />
          </div>
        </section>

        {/* ──────────────── Formulario ──────────────── */}
        <section className="flex-1 px-6 pt-8 pb-6 bg-white">
          {/* Title */}
          <div className="mb-8">
            <h1 className="text-[20px] font-bold text-gray-900 leading-relaxed">
              Ingresa tu contraseña
            </h1>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8" noValidate>
            {/* Password field */}
            <div className="space-y-3">
              {/* Label with asterisk */}
              <div className="flex items-center gap-1 mb-2">
                <label htmlFor="password" className="text-sm font-medium text-gray-900">
                  Contraseña
                </label>
                <span className="text-red-600 text-sm">*</span>
              </div>
              
              {/* Input container */}
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Ingresa tu contraseña"
                  autoComplete="current-password"
                  className="w-full h-12 rounded border border-gray-300 px-4 py-3 text-sm placeholder-gray-400 focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20 outline-none bg-white transition-colors pr-12"
                  {...register("password", {
                    required: "Obligatorio",
                    minLength: {
                      value: 6,
                      message: "Mínimo 6 caracteres",
                    },
                  })}
                />
                
                {/* Eye toggle button */}
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? (
                    // Eye open icon
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M10 3C14.5 3 18.5 6.5 18.5 10C18.5 13.5 14.5 17 10 17C5.5 17 1.5 13.5 1.5 10C1.5 6.5 5.5 3 10 3Z" stroke="currentColor" strokeWidth="1.5"/>
                      <circle cx="10" cy="10" r="3" stroke="currentColor" strokeWidth="1.5"/>
                    </svg>
                  ) : (
                    // Eye closed icon
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M3 3L17 17M10.5 10.5C10.1 10.9 9.6 11.1 9 11.1C7.9 11.1 7 10.2 7 9.1C7 8.5 7.2 8 7.6 7.6M12.7 12.7C11.9 13.3 10.9 13.7 10 13.7C6.5 13.7 3.5 11.2 2 8.7C2.9 7.2 4.1 6 5.6 5.3M8.5 4.5C9 4.3 9.5 4.3 10 4.3C13.5 4.3 16.5 6.8 18 9.3C17.5 10.2 16.9 11 16.1 11.7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  )}
                </button>
              </div>
              
              {errors.password && (
                <p className="text-xs text-red-600 mt-2">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Login button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 rounded bg-[#2A906F] text-white text-base font-semibold hover:bg-[#237A5E] disabled:opacity-60 disabled:cursor-not-allowed transition-colors shadow-sm mt-10"
            >
              {isSubmitting ? "Iniciando sesión…" : "Login"}
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}
