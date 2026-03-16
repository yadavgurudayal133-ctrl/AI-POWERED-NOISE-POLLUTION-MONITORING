"use client";

import React, { useEffect } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Lightbulb, Loader2, AlertTriangle } from "lucide-react";
import { useSuggestions } from "@/context/suggestions-context";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { getGeneralSuggestions } from '@/ai/flows/get-general-suggestions';
import imageData from '@/lib/placeholder-images.json';

export function HealthSuggestionsCard() {
  const { suggestions, isLoading, error, setSuggestions, setIsLoading, setError, isAlerting } = useSuggestions();
  const { url, width, height } = imageData.healthSuggestionsCard;

  useEffect(() => {
    const fetchGeneralSuggestions = async () => {
      if (suggestions.length === 0 && !isLoading) {
        setIsLoading(true);
        setError(null);
        try {
          const result = await getGeneralSuggestions();
          setSuggestions(result.suggestions);
        } catch (error) {
          console.error("Error fetching general health suggestions:", error);
          setError("Could not load general health tips.");
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchGeneralSuggestions();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center py-10">
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <Loader2 className="h-8 w-8 animate-spin" />
            <p>Generating personalized health suggestions...</p>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error Generating Suggestions</AlertTitle>
          <AlertDescription>
            {error} Please try again later.
          </AlertDescription>
        </Alert>
      );
    }

    if (suggestions.length > 0) {
      return suggestions.map((suggestion, index) => (
        <Alert key={index} variant={isAlerting ? "destructive" : "default"} className="bg-background/80">
          <Lightbulb className="h-4 w-4" />
          <AlertTitle>{suggestion.title}</AlertTitle>
          <AlertDescription>
            {suggestion.description}
          </AlertDescription>
        </Alert>
      ));
    }

    return (
      <div className="text-center text-muted-foreground py-10">
        <p>Health suggestions will appear here.</p>
      </div>
    );
  };

  return (
    <Card className="relative overflow-hidden">
      <Image
        src={url}
        alt="Person meditating in a calm environment"
        width={width}
        height={height}
        className="absolute inset-0 w-full h-full object-cover opacity-30 dark:opacity-15"
        data-ai-hint="zen meditation"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/50 to-transparent" />
      <CardHeader className="relative z-10">
        <CardTitle>Health Suggestions</CardTitle>
        <CardDescription>AI-powered tips to protect your hearing and well-being.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 relative z-10">
        {renderContent()}
      </CardContent>
    </Card>
  );
}
