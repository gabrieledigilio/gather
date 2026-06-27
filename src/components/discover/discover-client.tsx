"use client";

import Link from "next/link";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";
import { MatchCard, MatchPassButton, MatchSaveButton } from "@/components/discover/match-card";
import { Button } from "@/components/ui/button";
import { useEvents } from "@/hooks/use-events";
import { usePreferences } from "@/hooks/use-preferences";
import { recommendEventsWithScores } from "@/lib/recommendations";
import {
  dismissEvent,
  toggleSavedEvent,
} from "@/lib/storage";

export function DiscoverClient() {
  const { prefs, update } = usePreferences();
  const { events, loading, error } = useEvents();
  const [index, setIndex] = useState(0);
  const [, setTick] = useState(0);

  const matches = useMemo(() => {
    if (!prefs || !events) return [];
    return recommendEventsWithScores(events, prefs);
  }, [prefs, events]);

  const current = matches[index];
  const next = matches[index + 1];

  const advance = useCallback(() => {
    setIndex((i) => i + 1);
  }, []);

  const handlePass = useCallback(() => {
    if (!current) return;
    dismissEvent(current.event.id);
    toast.message("Passed — we'll show you fewer like this");
    advance();
  }, [current, advance]);

  const handleSave = useCallback(() => {
    if (!current) return;
    const saved = toggleSavedEvent(current.event.id);
    update({});
    setTick((t) => t + 1);
    toast.success(saved ? "Saved to your list" : "Removed from saved");
    advance();
  }, [current, advance, update]);

  if (!prefs || loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-muted-foreground">
        Finding today&apos;s events in Rome…
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <DiscoverHeader location={prefs.location?.label} userName={prefs.displayName || "Roxy"} />
        <div className="glass-card p-12 text-center">
          <p className="font-medium">Couldn&apos;t load live events</p>
          <p className="mt-2 text-sm text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  const userName = prefs.displayName || "Roxy";

  if (matches.length === 0 || index >= matches.length) {
    return (
      <div className="space-y-6">
        <DiscoverHeader
          location={prefs.location?.label}
          userName={userName}
        />
        <div className="glass-card p-12 text-center">
          <p className="font-medium">No more matches for now</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Check back later or update your preferences for fresh picks.
          </p>
          <div className="mt-6 flex flex-col gap-3">
            <Button
              className="btn-rainbow rounded-full"
              onClick={() => setIndex(0)}
            >
              Review matches again
            </Button>
            <Button variant="glass" className="rounded-full" asChild>
              <Link href="/onboarding">Update preferences</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const isSaved = prefs.savedEventIds.includes(current.event.id);

  return (
    <div className="flex flex-col">
      <DiscoverHeader
        location={prefs.location?.label}
        userName={userName}
        matchPercent={current.matchPercent}
        remaining={matches.length - index}
      />

      <div className="relative mx-auto mt-3 w-full max-w-lg">
        <MatchPassButton
          onPass={handlePass}
          className="absolute left-0 top-1/2 z-20 -translate-y-1/2"
        />
        <MatchSaveButton
          onSave={handleSave}
          saved={isSaved}
          className="absolute right-0 top-1/2 z-20 -translate-y-1/2"
        />

        <div className="relative mx-8 h-[min(560px,calc(100dvh-250px))]">
          {next && (
            <MatchCard
              key={next.event.id}
              event={next.event}
              matchPercent={next.matchPercent}
              isTop={false}
              onSwipeLeft={() => {}}
              onSwipeRight={() => {}}
            />
          )}
          <MatchCard
            key={current.event.id}
            event={current.event}
            matchPercent={current.matchPercent}
            isTop
            onSwipeLeft={handlePass}
            onSwipeRight={handleSave}
          />
        </div>
      </div>

      <p className="mt-3 text-center text-xs text-muted-foreground">
        Swipe right to save · left to pass · {matches.length - index} left today
      </p>
    </div>
  );
}

function DiscoverHeader({
  location,
  userName,
  matchPercent,
  remaining,
}: {
  location?: string;
  userName: string;
  matchPercent?: number;
  remaining?: number;
}) {
  return (
    <header className="space-y-1 text-center">
      <p className="text-sm text-muted-foreground">{location ?? "Your area"}</p>
      <h1 className="font-heading text-2xl tracking-tight sm:text-3xl">
        Today&apos;s match for{" "}
        <span className="text-rainbow">{userName}</span>
      </h1>
      {matchPercent !== undefined && (
        <p className="text-sm text-muted-foreground">
          <span className="font-medium text-rainbow">{matchPercent}% match</span>
          {remaining !== undefined && remaining > 1 && (
            <> · {remaining - 1} more after this</>
          )}
        </p>
      )}
    </header>
  );
}
