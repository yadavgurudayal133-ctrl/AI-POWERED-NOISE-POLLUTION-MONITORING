
"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Car, Building2, Users, Wind, Music, Siren, Dog, HelpCircle } from "lucide-react";
import type { LucideProps } from "lucide-react";
import { useAlerts } from "@/context/alerts-context";
import { formatDistanceToNow } from "date-fns";
import React from "react";

const iconMap: Record<string, React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>> = {
    Traffic: Car,
    Construction: Building2,
    "Human Chatter": Users,
    Wind: Wind,
    Music: Music,
    Siren: Siren,
    "Dog Barking": Dog,
    Unknown: HelpCircle,
};


export function RecentAlertsCard() {
  const { alerts } = useAlerts();

  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardHeader>
        <CardTitle>Recent Noise Alerts</CardTitle>
        <CardDescription>
          Threshold breaches detected recently.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {alerts.length === 0 ? (
          <div className="text-center text-muted-foreground py-10">
            No noise alerts have been recorded yet.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Location</TableHead>
                <TableHead className="hidden sm:table-cell">Type</TableHead>
                <TableHead className="text-right">Level (dB)</TableHead>
                <TableHead className="text-right">Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {alerts.map((alert, index) => {
                  const Icon = iconMap[alert.type] || HelpCircle;
                  return (
                    <TableRow key={index}>
                      <TableCell>
                        <div className="font-medium">{alert.location}</div>
                        <div className="text-sm text-muted-foreground sm:hidden flex items-center gap-1 mt-1">
                          <Icon className="h-4 w-4" /> {alert.type}
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4" />
                          <span>{alert.type}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge variant={alert.badgeVariant as any} className="w-16 justify-center">
                          {alert.level} dB
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right text-muted-foreground">
                        {formatDistanceToNow(alert.time, { addSuffix: true })}
                      </TableCell>
                    </TableRow>
                  )
                }
              )}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
