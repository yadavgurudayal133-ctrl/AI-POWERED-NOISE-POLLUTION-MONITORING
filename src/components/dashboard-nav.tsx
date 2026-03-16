
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

const links = [
  { href: "#noise-level", label: "Noise Level" },
  { href: "#noise-classification", label: "Classification" },
  { href: "#historical-data", label: "History" },
  { href: "#location", label: "Location" },
  { href: "#health-suggestions", label: "Suggestions" },
  { href: "#recent-alerts", label: "Alerts" },
];

export function DashboardNav({ className }: { className?: string }) {
  return (
    <div className={cn("sticky top-16 z-20 bg-background/80 backdrop-blur-sm border-b", className)}>
        <ScrollArea className="w-full whitespace-nowrap">
            <div className="flex justify-center items-center gap-2 p-2">
                {links.map((link) => (
                    <Button key={link.href} variant="link" asChild className="text-muted-foreground hover:text-primary">
                        <a href={link.href}>{link.label}</a>
                    </Button>
                ))}
            </div>
            <ScrollBar orientation="horizontal" className="invisible" />
        </ScrollArea>
    </div>
  );
}
