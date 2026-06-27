"use client";

import Link from "next/link";
import { useMemo } from "react";
import { EventCard } from "@/components/events/event-card";
import { Button } from "@/components/ui/button";
import { useEvents } from "@/hooks/use-events";
import { usePreferences } from "@/hooks/use-preferences";
import { toggleSavedEvent } from "@/lib/storage";

export function SavedClient() {
  const { prefs, update } = usePreferences();
  const { events, loading } = useEvents();

  const savedEvents = useMemo(() => {
    if (!prefs || !events) return [];
    return events.filter((e) => prefs.savedEventIds.includes(e.id));
  }, [prefs, events]);

  if (!prefs || loading) return null;

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-heading text-3xl tracking-tight">
          <span className="text-rainbow">Saved</span> events
        </h1>
        <p className="mt-1 text-muted-foreground">
          {savedEvents.length} event{savedEvents.length !== 1 ? "s" : ""} saved
        </p>
      </header>

      {savedEvents.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <p className="font-medium">Nothing saved yet</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Tap the bookmark on any event to save it for later.
          </p>
          <Button className="btn-rainbow mt-4 rounded-full" asChild>
            <Link href="/discover">Browse events</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-2">
          {savedEvents.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              saved
              onToggleSave={() => {
                toggleSavedEvent(event.id);
                update({});
              }}
              variant="list"
            />
          ))}
        </div>
      )}
    </div>
  );
}
