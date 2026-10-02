"use client";

import type { ReactNode } from "react";
import { useDemo } from "./providers";

/** Bouton qui ouvre la fenêtre de démonstration, utilisable depuis un composant serveur. */
export function DemoButton({ children, className = "" }: { children: ReactNode; className?: string }) {
  const { open } = useDemo();
  return (
    <button onClick={open} className={`cursor-pointer ${className}`}>
      {children}
    </button>
  );
}
