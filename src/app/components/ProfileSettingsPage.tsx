"use client";

import React from "react";
import Image from "next/image";

interface User {
  id: number;
  name: string;
  email: string;
  pin: string;
  createdAt: string;
}

interface ProfileSettingsPageProps {
  user: User;
  onBack?: () => void;
}

export default function ProfileSettingsPage({ user, onBack }: ProfileSettingsPageProps) {
  const profileItems = [
    {
      id: "nombre",
      icon: "👤",
      iconBg: "bg-purple-100",
      title: "Nombre",
      subtitle: "Leonardo Vaca",
      action: "Edit"
    },
    {
      id: "telefono", 
      icon: "📱",
      iconBg: "bg-green-100",
      title: "Teléfono",
      subtitle: "+591 66666666",
      action: "Edit"
    },
    {
      id: "email",
      icon: "✉️", 
      iconBg: "bg-green-100",
      title: "Email",
      subtitle: user.email || "abcdefg@gmail.com",
      action: "Edit"
    },
    {
      id: "password",
      icon: "🔒",
      iconBg: "bg-red-100", 
      title: "Cambiar contraseña",
      subtitle: "",
      action: ""
    }
  ];

  return (
    <div className="more-full-screen">
      <main className="more-main">
        {/* Header */}
        <header className="more-header">
          <div className="flex items-center justify-between">
            <button onClick={onBack} className="flex items-center text-blue-600">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="mr-2">
                <path d="M12.5 16.25L6.25 10L12.5 3.75" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="text-sm font-medium">Atrás</span>
            </button>
            
            <h1 className="text-xl font-bold text-gray-900">Profile Settings</h1>
            
            <div className="w-16"></div>
          </div>
        </header>

        {/* Content */}
        <section className="more-content">
          {/* Profile Section */}
          <div className="flex flex-col items-center mb-10">
            <div className="relative mb-2">
              <div className="w-26 h-26 rounded-full border-2 border-[#4FBC97] p-1">
                <div className="w-24 h-24 rounded-full overflow-hidden">
                  <Image
                    src="/images/profile.png"
                    alt="Profile Avatar"
                    width={96}
                    height={96}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="absolute bottom-0 right-0 w-6 h-6 bg-[#4FBC97] rounded-full flex items-center justify-center border-2 border-white">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M3.5 6L5 7.5L8.5 4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
            
            <div className="text-center">
              <h2 className="text-lg font-semibold text-gray-900 mb-1">
                GyroBro
              </h2>
              <p className="text-sm text-gray-500">
                Se unió hace 1 año
              </p>
            </div>
          </div>

          {/* Profile Info Items */}
          <div className="space-y-3">
            {profileItems.map((item, index) => (
              <div key={item.id}>
                <button className="w-full flex items-center justify-between py-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 ${item.iconBg} rounded-lg flex items-center justify-center`}>
                      {item.id === "nombre" && (
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                          <path d="M10 10C12.2091 10 14 8.20914 14 6C14 3.79086 12.2091 2 10 2C7.79086 2 6 3.79086 6 6C6 8.20914 7.79086 10 10 10Z" stroke="#8B5CF6" strokeWidth="1.5"/>
                          <path d="M3 18C3 14.6863 6.13401 12 10 12C13.866 12 17 14.6863 17 18" stroke="#8B5CF6" strokeWidth="1.5"/>
                        </svg>
                      )}
                      {item.id === "telefono" && (
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                          <path d="M4.16667 3.33333H7.5L9.16667 8.33333L7.08333 9.375C8.125 11.875 10.125 13.875 12.625 14.9167L13.6667 12.8333L18.6667 14.5V17.8333C18.6667 18.75 17.9167 19.5 17 19.5C9.63542 19.5 3.5 13.3646 3.5 6C3.5 5.08333 4.25 4.33333 5.16667 4.33333" stroke="#10B981" strokeWidth="1.5"/>
                        </svg>
                      )}
                      {item.id === "email" && (
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                          <path d="M3.33333 5L10 10.8333L16.6667 5" stroke="#10B981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M16.6667 5H3.33333C2.41667 5 1.66667 5.75 1.66667 6.66667V13.3333C1.66667 14.25 2.41667 15 3.33333 15H16.6667C17.5833 15 18.3333 14.25 18.3333 13.3333V6.66667C18.3333 5.75 17.5833 5 16.6667 5Z" stroke="#10B981" strokeWidth="1.5"/>
                        </svg>
                      )}
                      {item.id === "password" && (
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                          <path d="M5 8.33333V6.66667C5 4.36548 6.86548 2.5 9.16667 2.5H10.8333C13.1345 2.5 15 4.36548 15 6.66667V8.33333" stroke="#EF4444" strokeWidth="1.5"/>
                          <path d="M4.16667 8.33333H15.8333C16.75 8.33333 17.5 9.08333 17.5 10V15.8333C17.5 16.75 16.75 17.5 15.8333 17.5H4.16667C3.25 17.5 2.5 16.75 2.5 15.8333V10C2.5 9.08333 3.25 8.33333 4.16667 8.33333Z" stroke="#EF4444" strokeWidth="1.5"/>
                        </svg>
                      )}
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
                
                {index < profileItems.length - 1 && (
                  <div className="h-px bg-gray-100 ml-11"></div>
                )}
              </div>
            ))}
          </div>

        </section>
      </main>
    </div>
  );
}
