import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import CorbadoWrapper from "./components/CorbadoWrapper";
import SorobanProviderWrapper from "./components/SorobanProviderWrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "GYRO Wallet",
  description: "Secure digital wallet with biometric authentication",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <SorobanProviderWrapper>
          <CorbadoWrapper>
            {children}
          </CorbadoWrapper>
        </SorobanProviderWrapper>
      </body>
    </html>
  );
}
