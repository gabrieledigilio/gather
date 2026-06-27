"use client";

import { useCallback, useEffect, useState } from "react";
import type { GatherEvent } from "@/lib/types";
import { getCreatedEvents } from "@/lib/storage";
import { mergeWithCreatedEvents } from "@/lib/events/fetch-rome-events";

interface EventsResponse {
  events: GatherEvent[];
  fetchedAt: string;
}

export function useEvents() {
  const [events, setEvents] = useState<GatherEvent[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/events");
      if (!res.ok) throw new Error("Could not load events");
      const data = (await res.json()) as EventsResponse;
      setEvents(mergeWithCreatedEvents(data.events, getCreatedEvents()));
    } catch {
      setError("Could not load live events");
      setEvents(mergeWithCreatedEvents([], getCreatedEvents()));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return { events, loading, error, reload: load };
}

export function findEventInList(
  id: string,
  events: GatherEvent[] | null,
): GatherEvent | undefined {
  if (!events) return undefined;
  return events.find((e) => e.id === id);
}
