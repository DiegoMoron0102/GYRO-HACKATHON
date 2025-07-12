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

        {/* Navigation */}
        <nav className="more-nav">
          <div className="flex justify-between">
            <button 
              onClick={onBack}
              className="flex flex-col items-center gap-1 py-2 px-6 text-gray-400"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
              </svg>
              <span className="text-xs">Home</span>
            </button>
            <button 
              onClick={onNavigateToHistory}
              className="flex flex-col items-center gap-1 py-2 px-6 text-gray-400 hover:text-[#2A906F]"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" />
              </svg>
              <span className="text-xs">History</span>
            </button>
            
            <button className="flex flex-col items-center gap-1 py-2 px-6 text-[#2A906F]">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1L9 7V9H3V11H21V9M4 13H20V22H4V13Z" />
              </svg>
              <span className="text-xs">More</span>
            </button>
          </div>
        </nav>
      </main>
    </div>
  );
}

