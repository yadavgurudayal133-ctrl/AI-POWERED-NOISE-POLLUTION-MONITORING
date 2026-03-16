
"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';
import type { LucideProps } from "lucide-react";
import { HelpCircle } from "lucide-react";

export type NoiseClassification = {
    name: string;
    icon: React.ForwardRefExoticComponent<
      Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
    >;
    description: string;
    isHuman: boolean;
};

type NoiseContextType = {
  currentNoise: NoiseClassification;
  setCurrentNoise: (noise: NoiseClassification) => void;
};

const defaultNoise: NoiseClassification = {
    name: "Unknown",
    icon: HelpCircle,
    description: "Listening for ambient noise...",
    isHuman: false,
};

const NoiseContext = createContext<NoiseContextType | undefined>(undefined);

export const NoiseProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentNoise, setCurrentNoise] = useState<NoiseClassification>(defaultNoise);

  return (
    <NoiseContext.Provider value={{ currentNoise, setCurrentNoise }}>
      {children}
    </NoiseContext.Provider>
  );
};

export const useNoise = (): NoiseContextType => {
  const context = useContext(NoiseContext);
  if (context === undefined) {
    throw new Error('useNoise must be used within a NoiseProvider');
  }
  return context;
};
