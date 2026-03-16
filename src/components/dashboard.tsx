

import { Header } from "./header";
import { NoiseClassificationCard } from "./dashboard/noise-classification-card";
import { NoiseLevelCard } from "./dashboard/noise-level-card";
import { RecentAlertsCard } from "./dashboard/recent-alerts-card";
import { HealthSuggestionsCard } from "./dashboard/health-suggestions-card";
import { AlertsProvider } from "@/context/alerts-context";
import { NoiseProvider } from "@/context/noise-context";
import { LocationProvider } from "@/context/location-context";
import { SuggestionsProvider } from "@/context/suggestions-context";
import { LocationCard } from "./dashboard/location-card";
import { HistoricalDataCard } from "./dashboard/historical-data-card";
import { DashboardNav } from "./dashboard-nav";

export function Dashboard() {
  return (
    <LocationProvider>
      <AlertsProvider>
        <NoiseProvider>
          <SuggestionsProvider>
            <div className="flex flex-col h-screen bg-background">
              <Header />
              <DashboardNav />
              <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
                <div className="max-w-7xl mx-auto w-full">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div id="noise-level">
                        <NoiseLevelCard />
                      </div>
                      <div id="noise-classification">
                        <NoiseClassificationCard />
                      </div>
                      <div id="historical-data" className="md:col-span-2">
                        <HistoricalDataCard />
                      </div>
                    </div>
                    <div className="flex flex-col gap-6">
                      <div id="location">
                        <LocationCard />
                      </div>
                      <div id="health-suggestions">
                        <HealthSuggestionsCard />
                      </div>
                    </div>
                  </div>
                  <div id="recent-alerts" className="mt-6">
                    <RecentAlertsCard />
                  </div>
                </div>
              </main>
            </div>
          </SuggestionsProvider>
        </NoiseProvider>
      </AlertsProvider>
    </LocationProvider>
  );
}
