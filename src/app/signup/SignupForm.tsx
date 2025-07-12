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

interface SignupFormProps {
  onSignupSuccess?: (user: User) => void;
  onBackToLogin?: () => void;
}

export default function SignupForm({ onSignupSuccess, onBackToLogin }: SignupFormProps) {
  // Debug: verificar que las props lleguen correctamente
  console.log('SignupForm mounted with props:', { onSignupSuccess, onBackToLogin });

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    pin: '',
    confirmPin: ''
  });
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es obligatorio';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El email es obligatorio';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.pin) {
      newErrors.pin = 'El PIN es obligatorio';
    } else if (!/^\d{4}$/.test(formData.pin)) {
      newErrors.pin = 'El PIN debe tener 4 dígitos numéricos';
    }

    if (formData.pin !== formData.confirmPin) {
      newErrors.confirmPin = 'Los PINs no coinciden';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted with data:', formData);
    
    if (!validateForm()) {
      console.log('Form validation failed:', errors);
      return;
    }

    setIsSubmitting(true);
    console.log('Starting signup process...');

    try {
      // Verificar si el email ya existe
      const existingUsers: User[] = JSON.parse(localStorage.getItem("gyro_users") || "[]");
      console.log('Existing users:', existingUsers);
      
      if (existingUsers.find(u => u.email === formData.email)) {
        console.log('Email already exists');
        setErrors({ email: 'Este email ya está registrado' });
        setIsSubmitting(false);
        return;
      }

      // Crear nuevo usuario
      const newUser: User = {
        id: Date.now(),
        name: formData.name,
        email: formData.email,
        pin: formData.pin,
        createdAt: new Date().toISOString(),
      };

      console.log('Creating new user:', newUser);

      // Guardar en localStorage
      existingUsers.push(newUser);
      localStorage.setItem("gyro_users", JSON.stringify(existingUsers));
      localStorage.setItem("gyro_user", JSON.stringify(newUser));

      console.log('User saved to localStorage');
      console.log('Updated users list:', JSON.parse(localStorage.getItem("gyro_users") || "[]"));

      // Simular delay de creación
      setTimeout(() => {
        console.log('Calling onSignupSuccess with user:', newUser);
        setIsSubmitting(false);
        
        // Verificar si la función existe antes de llamarla
        if (onSignupSuccess) {
          onSignupSuccess(newUser);
        } else {
          console.error('onSignupSuccess is not defined!');
          alert('¡Cuenta creada exitosamente! PIN: ' + formData.pin);
        }
      }, 1000);

    } catch (error) {
      console.error('Error al crear cuenta:', error);
      setErrors({ general: 'Error al crear la cuenta' });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex justify-center">
      <main className="w-full max-w-[360px] h-screen flex flex-col overflow-hidden">
        {/* Header */}
        <header className="flex items-center justify-between px-4 pt-4 pb-6 bg-[#FFFBF2]">
          <button onClick={onBackToLogin} className="flex items-center gap-2 text-gray-600">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="text-sm font-medium">Volver</span>
          </button>
        </header>

        {/* Hero */}
        <section className="flex flex-col items-center pt-8 pb-8 bg-[#FFFBF2]">
          <div className="mb-6">
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
          
          <div className="text-center px-6">
            <h1 className="text-[24px] font-bold text-gray-900 mb-2">
              Crear Cuenta
            </h1>
            <p className="text-sm text-gray-600">
              Registra tus datos para configurar tu GYRO Wallet
            </p>
          </div>
        </section>

        {/* Form */}
        <section className="flex-1 px-6 py-6 bg-white">
          <form onSubmit={handleSubmit} className="space-y-4">
            {errors.general && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                {errors.general}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Nombre completo *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2A906F]"
                placeholder="Ingresa tu nombre completo"
              />
              {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Correo electrónico *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2A906F]"
                placeholder="ejemplo@correo.com"
              />
              {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                PIN de seguridad *
              </label>
              <input
                type="password"
                maxLength={4}
                value={formData.pin}
                onChange={(e) => setFormData({...formData, pin: e.target.value})}
                className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2A906F]"
                placeholder="4 dígitos"
              />
              {errors.pin && <p className="text-xs text-red-600 mt-1">{errors.pin}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Confirmar PIN *
              </label>
              <input
                type="password"
                maxLength={4}
                value={formData.confirmPin}
                onChange={(e) => setFormData({...formData, confirmPin: e.target.value})}
                className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2A906F]"
                placeholder="Repite el PIN"
              />
              {errors.confirmPin && <p className="text-xs text-red-600 mt-1">{errors.confirmPin}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#2A906F] text-white py-4 rounded-lg font-semibold text-lg hover:bg-[#237A5F] disabled:opacity-60 disabled:cursor-not-allowed transition-colors mt-6"
              onClick={() => {
                console.log('Button clicked!');
                // No llamar handleSubmit aquí, el form se encarga
              }}
            >
              {isSubmitting ? "Creando cuenta..." : "Crear Cuenta"}
            </button>

            
          </form>
        </section>
      </main>
    </div>
  );
}
