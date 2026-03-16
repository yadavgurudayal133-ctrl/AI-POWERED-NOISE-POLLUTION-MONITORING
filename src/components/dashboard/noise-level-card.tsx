
"use client";

import { useState, useEffect, useRef } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAlerts } from "@/context/alerts-context";
import { useNoise } from "@/context/noise-context";
import { useLocation } from "@/context/location-context";
import { useSuggestions } from "@/context/suggestions-context";
import { getHealthSuggestions } from "@/ai/flows/get-health-suggestions";
import { getGeneralSuggestions } from "@/ai/flows/get-general-suggestions";


const thresholds = {
  Residential: { day: 55, night: 45 },
  Commercial: { day: 65, night: 55 },
  Industrial: { day: 75, night: 65 },
};

type Environment = keyof typeof thresholds;

function getCurrentThreshold(environment: Environment) {
    const hour = new Date().getHours();
    const envThresholds = thresholds[environment];
    if (hour >= 7 && hour < 22) {
        return envThresholds.day;
    }
    return envThresholds.night;
}


export function NoiseLevelCard() {
  const [decibels, setDecibels] = useState(0);
  const [environment, setEnvironment] = useState<Environment>("Residential");
  const [threshold, setThreshold] = useState(0);
  const [isClient, setIsClient] = useState(false);
  const { toast } = useToast();
  const { addAlert } = useAlerts();
  const { currentNoise } = useNoise();
  const { city } = useLocation();
  const { setSuggestions, setIsLoading: setSuggestionsLoading, setError, setIsAlerting, generalSuggestions, setGeneralSuggestions } = useSuggestions();
  const isExceededRef = useRef(false);

  useEffect(() => {
    if (!isClient) return;

    // This runs only on the client, after initial render
    const initialThreshold = getCurrentThreshold(environment);
    setThreshold(initialThreshold);

    const decibelInterval = setInterval(() => {
      // Simulate fluctuating noise levels
      setDecibels((prev) => {
        const change = (Math.random() - 0.5) * 8;
        const newDb = Math.max(30, Math.min(120, prev + change));
        return Math.round(newDb);
      });
    }, 1500);

    const thresholdInterval = setInterval(() => {
        const newThreshold = getCurrentThreshold(environment);
        setThreshold(newThreshold);
    }, 60000); // Check every minute

    return () => {
        clearInterval(decibelInterval);
        clearInterval(thresholdInterval);
    }
  }, [isClient, environment]);

  useEffect(() => {
    if (!isClient || decibels === 0) return;

    const currentThreshold = getCurrentThreshold(environment);
    const wasExceeded = isExceededRef.current;
    const isNowExceeded = decibels > currentThreshold;

    if (isNowExceeded && !wasExceeded) {
      setIsAlerting(true);
      toast({
        variant: "destructive",
        title: "Noise Limit Breached",
        description: `Noise level reached ${decibels}dB, exceeding the ${currentThreshold}dB limit for a ${environment} area.`,
      });
      addAlert({
        location: city || "Current Location",
        type: currentNoise.name,
        level: decibels,
        time: new Date(),
        badgeVariant: decibels > currentThreshold + 10 ? "destructive" : "secondary"
      });
      
      const fetchSuggestions = async () => {
        setSuggestionsLoading(true);
        setError(null);
        try {
          // Fetch and store general suggestions if we don't have them
          if (generalSuggestions.length === 0) {
            const general = await getGeneralSuggestions();
            setGeneralSuggestions(general.suggestions);
          }
          const result = await getHealthSuggestions({
            noiseType: currentNoise.name,
            noiseLevel: decibels,
          });
          setSuggestions(result.suggestions);
        } catch (error) {
          console.error("Error fetching health suggestions:", error);
          setError("The AI service is currently unavailable.");
          setSuggestions([]); // Clear suggestions on error
        } finally {
          setSuggestionsLoading(false);
        }
      };
      fetchSuggestions();

    } else if (!isNowExceeded && wasExceeded) {
      // Noise level has returned to normal
      setIsAlerting(false);
      setSuggestions(generalSuggestions); // Revert to general suggestions
      setError(null);
    }

    isExceededRef.current = isNowExceeded;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [decibels, environment, toast, isClient, addAlert, currentNoise.name, city, setSuggestions, setSuggestionsLoading, setError, setIsAlerting, generalSuggestions, setGeneralSuggestions]);
  
  useEffect(() => {
    setIsClient(true);
    setDecibels(40);
  }, []);

  if (!isClient) {
    // Render a placeholder or loading state on the server and initial client render
    return (
        <Card className="h-full flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                    <CardTitle className="text-base font-medium">
                    Real-time Noise Level
                    </CardTitle>
                    <CardDescription className="text-xs">
                    Live ambient sound measurement.
                    </CardDescription>
                </div>
                <Select disabled>
                    <SelectTrigger className="w-[130px] ml-4">
                        <SelectValue placeholder="Loading..." />
                    </SelectTrigger>
                </Select>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col items-center justify-center gap-4">
                <div className="relative w-40 h-40">
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-4xl font-bold font-headline text-foreground">
                        --
                        </span>
                        <span className="text-sm text-muted-foreground">dB</span>
                    </div>
                </div>
                <div className="text-center">
                    <p className={'text-lg font-semibold'}>
                        Loading...
                    </p>
                    <p className="text-xs text-muted-foreground">Limit: -- dB</p>
                </div>
            </CardContent>
        </Card>
    );
  }

  const handleEnvironmentChange = (value: string) => {
      const newEnvironment = value as Environment;
      setEnvironment(newEnvironment);
      const newThreshold = getCurrentThreshold(newEnvironment);
      setThreshold(newThreshold);
      isExceededRef.current = decibels > newThreshold;
      if (decibels <= newThreshold) {
        setSuggestions(generalSuggestions); // Revert to general on env change if safe
        setError(null);
        setIsAlerting(false);
      }
  };

  const isExceeded = decibels > threshold;

  const getStatus = (db: number) => {
    if (isExceeded) return { text: "Exceeded Limit", color: "text-destructive" };
    if (db < 50) return { text: "Quiet", color: "text-green-500" };
    if (db < 70) return { text: "Moderate", color: "text-yellow-500" };
    return { text: "Loud", color: "text-orange-500" };
  };

  const status = getStatus(decibels);
  const progressValue = (decibels / 120) * 100;
  const thresholdAngle = (threshold / 120) * 360 - 90;

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
            <CardTitle className="text-base font-medium">
            Real-time Noise Level
            </CardTitle>
            <CardDescription className="text-xs">
            Live ambient sound measurement.
            </CardDescription>
        </div>
        <Select value={environment} onValueChange={handleEnvironmentChange}>
            <SelectTrigger className="w-[130px] ml-4">
                <SelectValue placeholder="Select area" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="Residential">Residential</SelectItem>
                <SelectItem value="Commercial">Commercial</SelectItem>
                <SelectItem value="Industrial">Industrial</SelectItem>
            </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col items-center justify-center gap-4 pt-4">
        <div className="relative w-40 h-40">
          <svg className="w-full h-full" viewBox="0 0 36 36">
            <path
              className="text-secondary"
              d="M18 2.0845
              a 15.9155 15.9155 0 0 1 0 31.831
              a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
            />
            <path
              className={`transition-all duration-500 ${isExceeded ? "text-destructive" : "text-primary"}`}
              stroke="currentColor"
              strokeWidth="3"
              strokeDasharray={`${progressValue}, 100`}
              d="M18 2.0845
              a 15.9155 15.9155 0 0 1 0 31.831
              a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              strokeLinecap="round"
              transform="rotate(-90 18 18)"
            />
            {/* Threshold Marker */}
            <g transform={`rotate(${thresholdAngle} 18 18)`}>
                <line x1="18" y1="2" x2="18" y2="4" stroke="hsl(var(--foreground))" strokeWidth="0.7" />
            </g>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            {isExceeded && <AlertTriangle className="h-6 w-6 text-destructive mb-1" />}
            <span className="text-4xl font-bold font-mono text-foreground">
              {decibels}
            </span>
            <span className="text-sm text-muted-foreground">dB</span>
          </div>
        </div>
        <div className="text-center">
          <p className={`text-lg font-semibold ${status.color}`}>
            {status.text}
          </p>
          <p className="text-xs text-muted-foreground">Limit: {threshold} dB</p>
        </div>
      </CardContent>
    </Card>
  );
}
