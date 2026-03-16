
"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

type Suggestion = {
  title: string;
  description: string;
};

type SuggestionsContextType = {
  suggestions: Suggestion[];
  setSuggestions: (suggestions: Suggestion[]) => void;
  generalSuggestions: Suggestion[];
  setGeneralSuggestions: (suggestions: Suggestion[]) => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  isAlerting: boolean;
  setIsAlerting: (isAlerting: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;
};

const SuggestionsContext = createContext<SuggestionsContextType | undefined>(undefined);

export const SuggestionsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [generalSuggestions, setGeneralSuggestions] = useState<Suggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAlerting, setIsAlerting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <SuggestionsContext.Provider value={{ 
      suggestions, 
      setSuggestions, 
      generalSuggestions,
      setGeneralSuggestions,
      isLoading, 
      setIsLoading, 
      isAlerting,
      setIsAlerting,
      error, 
      setError 
    }}>
      {children}
    </SuggestionsContext.Provider>
  );
};

export const useSuggestions = (): SuggestionsContextType => {
  const context = useContext(SuggestionsContext);
  if (context === undefined) {
    throw new Error('useSuggestions must be used within a SuggestionsProvider');
  }
  return context;
};
