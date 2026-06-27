"use client";

import { notFound } from "next/navigation";
import { useEffect, useState } from "react";
import { EventDetailClient } from "@/components/events/event-detail-client";
import { findEventInList, useEvents } from "@/hooks/use-events";
import { getPreferences } from "@/lib/storage";
import type { GatherEvent } from "@/lib/types";

export function EventDetailLoader({ id }: { id: string }) {
  const { events, loading } = useEvents();
  const [event, setEvent] = useState<GatherEvent | null | undefined>(undefined);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (loading) return;
    const found = findEventInList(id, events);
    setEvent(found ?? null);
    if (found) {
      setSaved(getPreferences().savedEventIds.includes(id));
    }
  }, [id, events, loading]);

  if (loading || event === undefined) {
    return <div className="py-20 text-center text-muted-foreground">Loading…</div>;
  }

  if (!event) {
    notFound();
  }

  return <EventDetailClient event={event} saved={saved} />;
}
