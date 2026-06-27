"use client";

import type { GatherEvent } from "@/lib/types";
import { cn } from "@/lib/utils";

interface MapViewProps {
  events: GatherEvent[];
  center?: { lat: number; lng: number };
  activeId?: string;
  onSelect?: (id: string) => void;
}

export function MapView({ events, center, activeId, onSelect }: MapViewProps) {
  const refLat = center?.lat ?? events[0]?.lat ?? 43.65;
  const refLng = center?.lng ?? events[0]?.lng ?? -79.38;
  const spread = 0.08;

  const toPosition = (lat: number, lng: number) => ({
    left: `${50 + ((lng - refLng) / spread) * 40}%`,
    top: `${50 - ((lat - refLat) / spread) * 40}%`,
  });

  return (
    <div className="glass-card-lg relative h-[420px] overflow-hidden">
      <div
        className="absolute inset-0 opacity-60 dark:opacity-30"
        style={{
          backgroundImage: `
            linear-gradient(var(--glass-border) 1px, transparent 1px),
            linear-gradient(90deg, var(--glass-border) 1px, transparent 1px)
          `,
          backgroundSize: "32px 32px",
        }}
      />
      <div className="absolute inset-0 bg-rainbow-soft opacity-30" />

      {center && (
        <div
          className="absolute z-10 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-rainbow shadow-lg"
          style={toPosition(center.lat, center.lng)}
        />
      )}

      {events.map((event) => {
        const pos = toPosition(event.lat, event.lng);
        const isActive = activeId === event.id;
        return (
          <button
            key={event.id}
            type="button"
            onClick={() => onSelect?.(event.id)}
            className={cn(
              "absolute z-20 -translate-x-1/2 -translate-y-full transition-transform",
              isActive && "z-30 scale-110"
            )}
            style={pos}
          >
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "rounded-full px-2 py-1 text-[10px] font-medium shadow-md",
                  isActive ? "badge-rainbow" : "badge-glass"
                )}
              >
                {event.price === 0 ? "Free" : `$${event.price}`}
              </div>
              <div
                className={cn(
                  "mt-0.5 size-3 rotate-45 rounded-sm",
                  isActive ? "bg-rainbow" : "bg-foreground/70"
                )}
              />
            </div>
          </button>
        );
      })}

      <div className="glass-pill absolute bottom-3 left-3 px-3 py-1.5 text-xs font-medium">
        {events.length} events nearby
      </div>
    </div>
  );
}
