"use client";

import React from "react";

interface User {
  id: number;
  name: string;
  email: string;
  pin: string;
  createdAt: string;
}

interface DashboardProps {
  user: User;
  onLogout?: () => void;
}

export default function Dashboard({ user, onLogout }: DashboardProps) {
  const handleLogout = () => {
    localStorage.removeItem("gyro_user");
    if (onLogout) {
      onLogout();
    } else {
      window.location.reload();
    }
  };

  return (
    <div className="dashboard-full-screen">
      <main className="dashboard-main">
        {/* Top Section */}
        <section className="dashboard-top-section">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <div className="w-12 h-12 bg-gray-300 rounded-full overflow-hidden">
                <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500"></div>
              </div>
              <div>
                <p className="text-sm opacity-90">Hello,</p>
                <p className="font-semibold">{user.name.split(" ")[0]}</p>
              </div>
            </div>
            <button className="p-2">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                className="text-white"
              >
                <path
                  d="M12 15.5A3.5 3.5 0 0 1 8.5 12A3.5 3.5 0 0 1 12 8.5a3.5 3.5 0 0 1 3.5 3.5a3.5 3.5 0 0 1-3.5 3.5m7.43-2.53c.04-.32.07-.64.07-.97c0-.33-.03-.66-.07-1l2.11-1.63c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.31-.61-.22l-2.49 1c-.52-.39-1.06-.73-1.69-.98l-.37-2.65A.506.506 0 0 0 14 2h-4c-.25 0-.46.18-.5.42l-.37 2.65c-.63.25-1.17.59-1.69.98l-2.49-1c-.22-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64L4.57 11c-.04.34-.07.67-.07 1c0 .33.03.65.07.97l-2.11 1.66c-.19.15-.25.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1.01c.52.4 1.06.74 1.69.99l.37 2.65c.04.24.25.42.5.42h4c.25 0 .46-.18.5-.42l.37-2.65c.63-.26 1.17-.59 1.69-.99l2.49 1.01c.22.08.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.66Z"
                  fill="currentColor"
                />
              </svg>
            </button>
          </div>

          {/* Balance Card */}
          <div className="bg-gradient-to-br from-[#2A906F] to-[#1F6B52] rounded-2xl p-6">
            <div className="text-center mb-6">
              <p className="text-sm opacity-75 mb-1">Saldo</p>
              <p className="text-4xl font-bold">$14,235.34</p>
            </div>

            <div className="flex justify-center gap-6">
              <button className="flex flex-col items-center gap-2">
                <div className="w-8 h-8 flex items-center justify-center">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M8 2L8 14M2 8L14 8"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
                <span className="text-sm">Depositar</span>
              </button>

              <div className="w-px h-8 bg-white/30 self-center"></div>

              <button className="flex flex-col items-center gap-2">
                <div className="w-8 h-8 flex items-center justify-center">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M8 14L8 2M14 8L2 8"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
                <span className="text-sm">Retirar</span>
              </button>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="dashboard-content">
          {/* Exchange Rates */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              Tasa de Interes
            </h3>
            <p className="text-gray-600 mb-4">Dolar Gyros</p>

            <div className="flex justify-center gap-6 mb-6">
              <div className="text-center">
                <p className="text-[#2A906F] font-medium">Depositar</p>
                <p className="text-sm text-gray-600">16.55</p>
              </div>
              <div className="w-px h-8 bg-gray-200"></div>
              <div className="text-center">
                <p className="text-[#2A906F] font-medium">Retirar</p>
                <p className="text-sm text-gray-600">16.03</p>
              </div>
            </div>
          </div>

          {/* Transactions */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Movimientos</h3>
              <button className="text-sm text-gray-500">View all</button>
            </div>

            <div className="space-y-3">
              {/* Transaction 1 */}
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path
                        d="M8 14L8 2M14 8L2 8"
                        stroke="#DC2626"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Retiro</p>
                    <p className="text-sm text-gray-500">Hoy 12:32</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-red-600 font-medium">-$35.23</span>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M6 12L10 8L6 4"
                      stroke="#6B7280"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>

              <div className="h-px bg-gray-100"></div>

              {/* Transaction 2 */}
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path
                        d="M8 2L8 14M2 8L14 8"
                        stroke="#059669"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">De Diego</p>
                    <p className="text-sm text-gray-500">Ayer 02:15</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-green-600 font-medium">+$430.00</span>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M6 12L10 8L6 4"
                      stroke="#6B7280"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>

              <div className="h-px bg-gray-100"></div>

              {/* Transaction 3 */}
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path
                        d="M8 14L8 2M14 8L2 8"
                        stroke="#DC2626"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Retiro</p>
                    <p className="text-sm text-gray-500">Dic 26, 14:5</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-red-600 font-medium">-$19.00</span>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M6 12L10 8L6 4"
                      stroke="#6B7280"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Navigation */}
        <nav className="dashboard-nav">
          <div className="flex justify-between">
            <button className="flex flex-col items-center gap-1 py-2 px-6 text-[#2A906F]">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
              </svg>
              <span className="text-xs">Home</span>
            </button>
            <button className="flex flex-col items-center gap-1 py-2 px-6 text-gray-400">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" />
              </svg>
              <span className="text-xs">History</span>
            </button>
            <button className="flex flex-col items-center gap-1 py-2 px-6 text-gray-400">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z" />
              </svg>
              <span className="text-xs">Cards</span>
            </button>
            <button
              className="flex flex-col items-center gap-1 py-2 px-6 text-gray-400"
              onClick={handleLogout}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M21 18v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v1" />
              </svg>
              <span className="text-xs">More</span>
            </button>
          </div>
        </nav>
      </main>
    </div>
  );
}
