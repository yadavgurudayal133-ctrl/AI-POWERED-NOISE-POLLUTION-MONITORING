
"use client";

import React from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';
import imageData from '@/lib/placeholder-images.json';
import { useLocation } from '@/context/location-context';
import { Skeleton } from '@/components/ui/skeleton';

// Simulate historical data
const historicalData = [
  { time: '12 AM', db: 45 },
  { time: '3 AM', db: 42 },
  { time: '6 AM', db: 55 },
  { time: '9 AM', db: 68 },
  { time: '12 PM', db: 72 },
  { time: '3 PM', db: 70 },
  { time: '6 PM', db: 65 },
  { time: '9 PM', db: 58 },
];

const chartConfig = {
  db: {
    label: "dB",
    color: "hsl(var(--primary))",
  },
};

export function HistoricalDataCard() {
  const { url, width, height } = imageData.historicalData;
  const { city, isLoading } = useLocation();

  return (
    <Card className="relative overflow-hidden">
      <Image
        src={url}
        alt="Abstract visualization of sound waves"
        width={width}
        height={height}
        className="absolute inset-0 w-full h-full object-cover opacity-30 dark:opacity-15"
        data-ai-hint="sound visualization"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/50 to-transparent" />
      <CardHeader className="relative z-10">
        <CardTitle>Historical Noise Levels</CardTitle>
        {isLoading ? (
          <div className="text-sm text-muted-foreground pt-1">
            <Skeleton className="h-4 w-[250px]" />
          </div>
        ) : (
          <CardDescription>
            {`Average noise levels for ${city || 'your area'} over the last 24 hours.`}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="relative z-10">
        <ChartContainer config={chartConfig} className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart
                    data={historicalData}
                    margin={{
                        top: 5,
                        right: 20,
                        left: -10,
                        bottom: 0,
                    }}
                >
                    <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-border/50" />
                    <XAxis
                        dataKey="time"
                        stroke="hsl(var(--muted-foreground))"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                    />
                    <YAxis
                        stroke="hsl(var(--muted-foreground))"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => `${value}`}
                    />
                    <Tooltip
                        cursor={false}
                        content={<ChartTooltipContent indicator="dot" />}
                    />
                    <Line
                        dataKey="db"
                        type="monotone"
                        stroke="hsl(var(--primary))"
                        strokeWidth={2}
                        dot={false}
                    />
                </LineChart>
            </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
