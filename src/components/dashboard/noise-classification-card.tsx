
"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import {
  Car,
  Building2,
  Users,
  Wind,
  Music,
  HelpCircle,
  Siren,
  Dog,
  Loader2,
  Image as ImageIcon,
  RefreshCw,
} from "lucide-react";
import type { LucideProps } from "lucide-react";
import React from "react";
import { classifyNoise } from "@/ai/flows/classify-noise";
import { generateNoiseImage } from "@/ai/flows/generate-noise-image";
import { useToast } from "@/hooks/use-toast";
import { useNoise } from "@/context/noise-context";
import type { NoiseClassification } from "@/context/noise-context";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";

const noiseTypeMap: Record<string, Omit<NoiseClassification, 'description' | 'isHuman'>> = {
  Traffic: { name: "Traffic", icon: Car },
  Construction: { name: "Construction", icon: Building2 },
  "Human Chatter": { name: "Human Chatter", icon: Users },
  Wind: { name: "Wind", icon: Wind },
  Music: { name: "Music", icon: Music },
  Siren: { name: "Siren", icon: Siren },
  "Dog Barking": { name: "Dog Barking", icon: Dog },
  Unknown: { name: "Unknown", icon: HelpCircle },
};

export function NoiseClassificationCard() {
  const { currentNoise, setCurrentNoise } = useNoise();
  const [isClassifying, setIsClassifying] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [backgroundImage, setBackgroundImage] = useState<string | null>("/noise-card-bg.jpg");
  const [imageCache, setImageCache] = useState<Record<string, string>>({});
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const { toast } = useToast();

  const getClassification = async (audioBlob: Blob) => {
    if (isClassifying) return;
    setIsClassifying(true);
    try {
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      await new Promise<void>((resolve, reject) => {
        reader.onloadend = async () => {
          try {
            const base64Audio = reader.result as string;
            const results = await classifyNoise({ audioDataUri: base64Audio });
            
            if (results && results.length > 0) {
              const primaryResult = results[0];
              const primaryClassification = noiseTypeMap[primaryResult.name]
                ? { ...noiseTypeMap[primaryResult.name], description: primaryResult.description, isHuman: primaryResult.isHuman }
                : { ...noiseTypeMap.Unknown, name: primaryResult.name, description: primaryResult.description, isHuman: primaryResult.isHuman };
              
              if (currentNoise.name !== primaryClassification.name) {
                setCurrentNoise(primaryClassification);
              }
            } else {
               setCurrentNoise({ name: "Unknown", icon: HelpCircle, description: "Could not identify a dominant noise source.", isHuman: false });
            }
            resolve();
          } catch (error) {
            reject(error);
          }
        };
        reader.onerror = reject;
      });
    } catch (error) {
      console.error("Error during noise classification:", error);
      toast({
        variant: "destructive",
        title: "Error Classifying Noise",
        description: "The AI classification service might be temporarily unavailable.",
      });
      setCurrentNoise({ name: "Unknown", icon: HelpCircle, description: "Cannot identify the primary noise source.", isHuman: false});
    } finally {
      setIsClassifying(false);
    }
  };

  const manualClassify = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'inactive') {
        mediaRecorderRef.current.start();
        setTimeout(() => {
            if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
                mediaRecorderRef.current.stop();
            }
        }, 3000); // Record for 3 seconds
    }
  };
  
  useEffect(() => {
    const fetchImage = async () => {
      if (!currentNoise.name || currentNoise.name === "Unknown") {
        setBackgroundImage("/noise-card-bg.jpg"); // Revert to static image
        return;
      }
      
      if (imageCache[currentNoise.name]) {
        setBackgroundImage(imageCache[currentNoise.name]);
        return;
      }

      setIsGeneratingImage(true);
      try {
        const { icon, ...classification } = currentNoise;
        const result = await generateNoiseImage({ classification });
        const newImageDataUri = result.imageDataUri;
        setBackgroundImage(newImageDataUri);
        setImageCache(prev => ({ ...prev, [currentNoise.name]: newImageDataUri }));
      } catch (error) {
        console.error("Error generating noise image:", error);
        // Do not show a toast for this, as it's a background process
      } finally {
        setIsGeneratingImage(false);
      }
    };

    fetchImage();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentNoise]);

  useEffect(() => {
    let stream: MediaStream | null = null;
    let audioChunks: Blob[] = [];

    const setupMediaRecorder = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorderRef.current = new MediaRecorder(stream);
        
        mediaRecorderRef.current.ondataavailable = (event) => {
            if (event.data.size > 0) {
                audioChunks.push(event.data);
            }
        };

        mediaRecorderRef.current.onstop = () => {
            const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
            getClassification(audioBlob);
            audioChunks = []; // Clear chunks for the next recording
        };

        // Initial classification
        manualClassify();
        // Automatic classification every 20 seconds
        const interval = setInterval(manualClassify, 20000); 

        return () => {
            clearInterval(interval);
            stream?.getTracks().forEach(track => track.stop());
        };

      } catch (err) {
        console.error("Error accessing microphone:", err);
        toast({
            variant: "destructive",
            title: "Microphone Access Denied",
            description: "Please allow microphone access to enable noise classification.",
        });
      }
    };

    setupMediaRecorder();

    return () => {
      stream?.getTracks().forEach(track => track.stop());
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toast]);

  const Icon = isClassifying ? Loader2 : currentNoise.icon;

  return (
    <Card className="h-full flex flex-col relative overflow-hidden transition-all duration-500">
      {backgroundImage && (
        <Image
          src={backgroundImage}
          alt={`AI-generated image for ${currentNoise.name}`}
          width={400}
          height={400}
          className="absolute inset-0 w-full h-full object-cover opacity-30 dark:opacity-15"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/50 to-transparent" />
      <CardHeader className="relative z-10 flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-base font-medium">
            AI Noise Classification
          </CardTitle>
          <CardDescription>Primary detected sound source.</CardDescription>
        </div>
        <div className={cn(
          "flex items-center gap-2 text-xs text-muted-foreground transition-opacity",
          isGeneratingImage ? "opacity-100" : "opacity-0"
        )}>
          <ImageIcon className="h-3 w-3 animate-pulse" />
          <span>Generating...</span>
        </div>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col items-center justify-center gap-4 relative z-10">
        <div className="w-24 h-24 bg-accent/20 rounded-full flex items-center justify-center">
          <Icon className={`w-12 h-12 text-accent ${isClassifying ? 'animate-spin' : ''}`} />
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold font-headline text-foreground">
            {isClassifying ? "Classifying..." : currentNoise.name}
          </p>
          <p className="text-sm text-muted-foreground max-w-xs mx-auto">
            {isClassifying ? "Analyzing audio from your microphone..." : currentNoise.description}
          </p>
        </div>
      </CardContent>
      <CardFooter className="relative z-10 flex justify-center pt-4 pb-4">
        <Button variant="outline" onClick={manualClassify} disabled={isClassifying}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Restart
        </Button>
      </CardFooter>
    </Card>
  );
}
