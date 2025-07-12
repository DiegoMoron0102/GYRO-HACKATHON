"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";

interface SplashScreenProps {
  onComplete: () => void;
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Mostrar splash por 2.5 segundos, luego iniciar fade out
    const timer = setTimeout(() => {
      setIsVisible(false);
      // Después del fade out (0.5s), llamar onComplete
      setTimeout(onComplete, 500);
    }, 2500);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 bg-[#FFFBF2] flex items-center justify-center z-50 transition-opacity duration-500 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* Logo GYRO centrado */}
      <div className="flex items-center justify-center">
        <Image
          src="/images/gyro-logo.png"
          alt="GYRO Logo"
          width={250}
          height={185}
          className="object-contain animate-pulse"
        />
      </div>
    </div>
  );
}
