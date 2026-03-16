"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Bell, Menu, Shield } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import { RecentAlertsCard } from "./dashboard/recent-alerts-card";
import { Logo } from "./logo";

export function Header() {
  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between gap-4 border-b bg-background/80 px-4 backdrop-blur-sm sm:px-6">
      <div className="flex items-center gap-2">
        <Logo className="h-7 w-7 text-primary" />
        <h1 className="text-lg font-semibold tracking-tight">Silent Sentinel</h1>
      </div>
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Bell className="h-5 w-5" />
              <span className="sr-only">Toggle notifications</span>
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader className="mb-4">
              <SheetTitle>Recent Notifications</SheetTitle>
            </SheetHeader>
            <RecentAlertsCard />
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
