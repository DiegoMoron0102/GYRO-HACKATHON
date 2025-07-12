"use client";

import { ReactNode } from "react";

interface CorbadoWrapperProps {
  children: ReactNode;
}

export default function CorbadoWrapper({ children }: CorbadoWrapperProps) {
  // Temporarily removing CorbadoProvider to fix errors
  // We'll implement simple auth flow first
  return <>{children}</>;
}