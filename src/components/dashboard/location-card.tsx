
"use client";

import { MapPin, Loader2, AlertTriangle } from "lucide-react";
import Image from 'next/image';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { useLocation } from "@/context/location-context";

export function LocationCard() {
  const { location, city, isLoading, error } = useLocation();

  return (
    <Card className="h-full flex flex-col relative overflow-hidden">
       <Image
        src="https://picsum.photos/seed/world-map/400/600"
        alt="Stylized world map"
        width={400}
        height={600}
        className="absolute inset-0 w-full h-full object-cover opacity-30 dark:opacity-15"
        data-ai-hint="world map"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/50 to-transparent" />
      <CardHeader className="relative z-10">
        <CardTitle className="text-base font-medium">
          Current Location
        </CardTitle>
        <CardDescription>Detected from your browser.</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col items-center justify-center gap-4 relative z-10">
        <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center">
            {isLoading ? (
                <Loader2 className="w-12 h-12 text-primary animate-spin" />
            ) : error ? (
                <AlertTriangle className="w-12 h-12 text-destructive" />
            ) : (
                <MapPin className="w-12 h-12 text-primary" />
            )}
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold font-headline text-foreground">
            {isLoading ? "Detecting..." : error ? "Error" : city}
          </p>
          <p className="text-sm text-muted-foreground">
            {isLoading ? "Fetching your current position..." : error ? "Could not get location." : "Your approximate location"}
          </p>
          {!isLoading && !error && location && (
            <p className="text-xs text-muted-foreground font-mono mt-1">
                {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
