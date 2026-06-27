import { getCuratedRomeEvents } from "@/lib/events/curated-rome";
import { fetchEventbriteRomeEvents } from "@/lib/events/eventbrite";
import { fetchLumaRomeEvents } from "@/lib/events/luma";
import type { GatherEvent } from "@/lib/types";

export interface RomeEventsResult {
  events: GatherEvent[];
  fetchedAt: string;
  sources: {
    eventbrite: number;
    luma: number;
    curated: number;
  };
}

function romeTargetDate(): string {
  // Demo date: June 27, 2026 (today in the hackathon scenario)
  const envDate = process.env.GATHER_EVENT_DATE;
  if (envDate) return envDate;
  return "2026-06-27";
}

function dedupeEvents(events: GatherEvent[]): GatherEvent[] {
  const seen = new Set<string>();
  return events.filter((event) => {
    const key = `${event.title.toLowerCase()}|${event.startAt.slice(0, 16)}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export async function fetchRomeEventsToday(): Promise<RomeEventsResult> {
  const targetDate = romeTargetDate();

  const [eventbrite, luma, curated] = await Promise.all([
    fetchEventbriteRomeEvents(targetDate),
    fetchLumaRomeEvents(targetDate),
    Promise.resolve(getCuratedRomeEvents(targetDate)),
  ]);

  const events = dedupeEvents(
    [...luma, ...eventbrite, ...curated].sort(
      (a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime(),
    ),
  );

  return {
    events,
    fetchedAt: new Date().toISOString(),
    sources: {
      eventbrite: eventbrite.length,
      luma: luma.length,
      curated: curated.length,
    },
  };
}

export function mergeWithCreatedEvents(
  live: GatherEvent[],
  created: GatherEvent[],
): GatherEvent[] {
  const createdIds = new Set(created.map((e) => e.id));
  const filteredLive = live.filter((e) => !createdIds.has(e.id));
  return [...created, ...filteredLive];
}

export function findEventById(
  id: string,
  live: GatherEvent[],
  created: GatherEvent[] = [],
): GatherEvent | undefined {
  return mergeWithCreatedEvents(live, created).find((e) => e.id === id);
}
