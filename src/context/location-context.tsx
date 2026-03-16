
"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

type LocationState = {
  lat: number;
  lng: number;
} | null;

type LocationContextType = {
  location: LocationState;
  city: string | null;
  isLoading: boolean;
  error: string | null;
};

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const LocationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [location, setLocation] = useState<LocationState>(null);
  const [city, setCity] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLocation = () => {
      if (!navigator.geolocation) {
        setError("Geolocation is not supported by your browser.");
        setIsLoading(false);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ lat: latitude, lng: longitude });
          try {
            // Using a free, open reverse-geocoding service (Nominatim)
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
            );
            if (!response.ok) {
              throw new Error('Failed to fetch city name.');
            }
            const data = await response.json();
            const cityName = data.address?.city || data.address?.town || data.address?.village || 'Unknown Location';
            const country = data.address?.country_code?.toUpperCase() || '';
            setCity(`${cityName}, ${country}`);
          } catch (e) {
            setError("Could not determine your city.");
          } finally {
            setIsLoading(false);
          }
        },
        (err) => {
          setError(err.message);
          setIsLoading(false);
        }
      );
    };

    fetchLocation();
  }, []);

  return (
    <LocationContext.Provider value={{ location, city, isLoading, error }}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = (): LocationContextType => {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};
