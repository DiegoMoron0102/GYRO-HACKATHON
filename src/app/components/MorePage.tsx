"use client";

import React from "react";

interface User {
  id: number;
  name: string;
  email: string;
  pin: string;
  createdAt: string;
}

interface MorePageProps {
  user: User;
  onBack?: () => void;
  onNavigateToHistory?: () => void;
}

export default function MorePage({ onBack, onNavigateToHistory }: MorePageProps) {
  const menuItems = [
    {
      id: "deposito",
      icon: "↗️",
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
      title: "Depositar",
      subtitle: "Transferir dinero",
      action: ""
    },
    {
      id: "retiro", 
      icon: "📱",
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
      title: "Retirar",
      subtitle: "Sacar dinero",
      action: ""
    },
    {
      id: "analisis",
      icon: "✉️", 
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
      title: "Análisis",
      subtitle: "Ver estadísticas",
      action: ""
    },
    {
      id: "ayuda",
      icon: "🔒",
      iconBg: "bg-red-100", 
      iconColor: "text-red-600",
      title: "Ayuda",
      subtitle: "Soporte técnico",
      action: ""
    },
    {
      id: "contactanos",
      icon: "📞",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600", 
      title: "Contáctanos",
      subtitle: "Servicio al cliente",
      action: ""
    },
    {
      id: "sobre",
      icon: "ℹ️",
      iconBg: "bg-gray-100",
      iconColor: "text-gray-600",
      title: "Sobre nosotros", 
      subtitle: "Información de la app",
      action: ""
    }
  ];

    

  return (
    <div className="more-full-screen">
      <main className="more-main">
        {/* Header */}
        <header className="more-header">
          <div className="flex items-center">
            <button onClick={onBack} className="mr-4">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M15 18L9 12L15 6" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Más</h1>
          </div>
        </header>

        {/* Content */}
        <section className="more-content">
          

          {/* Menu Items */}
          <div className="space-y-3">
            {menuItems.map((item, index) => (
              <div key={item.id}>
                <button className="w-full flex items-center justify-between py-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 ${item.iconBg} rounded-lg flex items-center justify-center`}>
                      <span className="text-lg">{item.icon}</span>
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-gray-900">{item.title}</p>
                      {item.subtitle && (
                        <p className="text-sm text-gray-500">{item.subtitle}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {item.action && (
                      <span className="text-sm text-blue-600 font-medium">
                        {item.action}
                      </span>
                    )}
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M6 12L10 8L6 4" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </button>
                
                {index < menuItems.length - 1 && (
                  <div className="h-px bg-gray-100 ml-11"></div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Bottom Navigation */}
        <nav className="bg-white border-t border-gray-100 px-4 py-3">
          <div className="flex items-center justify-around">
            {/* Home */}
            <button 
              onClick={onBack}
              className="flex flex-col items-center p-2 text-gray-500 hover:text-[#2A906F] transition-colors"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                <polyline points="9,22 9,12 15,12 15,22"/>
              </svg>
              <span className="text-xs mt-1">Inicio</span>
            </button>

            {/* History */}
            <button 
              onClick={onNavigateToHistory}
              className="flex flex-col items-center p-2 text-gray-500 hover:text-[#2A906F] transition-colors"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12,6 12,12 16,14"/>
              </svg>
              <span className="text-xs mt-1">Historial</span>
            </button>

            {/* Settings */}
            <button 
              className="flex flex-col items-center p-2 text-gray-500 hover:text-[#2A906F] transition-colors"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="3"/>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
              </svg>
              <span className="text-xs mt-1">Ajustes</span>
            </button>

            {/* More - Active */}
            <button 
              className="flex flex-col items-center p-2 text-[#2A906F]"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="1"/>
                <circle cx="19" cy="12" r="1"/>
                <circle cx="5" cy="12" r="1"/>
              </svg>
              <span className="text-xs mt-1">Más</span>
            </button>
          </div>
        </nav>
      </main>
    </div>
  );
}

