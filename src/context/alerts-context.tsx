
"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Alert = {
  location: string;
  type: string;
  level: number;
  time: Date;
  badgeVariant: "destructive" | "secondary";
};

type AlertsContextType = {
  alerts: Alert[];
  addAlert: (alert: Omit<Alert, 'time'> & { time?: Date }) => void;
};

const AlertsContext = createContext<AlertsContextType | undefined>(undefined);

export const AlertsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [alerts, setAlerts] = useState<Alert[]>([]);

  const addAlert = (alert: Omit<Alert, 'time'> & { time?: Date }) => {
    const newAlert = { ...alert, time: alert.time || new Date() };
    setAlerts(prevAlerts => [newAlert, ...prevAlerts].slice(0, 10)); // Keep last 10 alerts
  };

  return (
    <AlertsContext.Provider value={{ alerts, addAlert }}>
      {children}
    </AlertsContext.Provider>
  );
};

export const useAlerts = (): AlertsContextType => {
  const context = useContext(AlertsContext);
  if (context === undefined) {
    throw new Error('useAlerts must be used within an AlertsProvider');
  }
  return context;
};
