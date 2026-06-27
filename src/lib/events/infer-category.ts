import type { EventCategory, GatherEvent } from "@/lib/types";

const KEYWORDS: Record<EventCategory, string[]> = {
  professional: [
    "business",
    "network",
    "startup",
    "tech",
    "hackathon",
    "cursor",
    "ai",
    "conference",
    "workshop",
  ],
  learning: ["workshop", "class", "talk", "panel", "course", "training", "retreat"],
  food: ["food", "wine", "tasting", "culinary", "dinner", "brunch", "pub crawl", "beer"],
  culture: ["music", "concert", "festival", "art", "theater", "museum", "live"],
  active: ["run", "yoga", "fitness", "sport", "hike", "tennis"],
  social: ["party", "meetup", "mixer", "nightlife", "club", "social"],
};

export function inferCategory(
  title: string,
  tags: string[],
  taxonomy?: { category?: string; format?: string },
): EventCategory {
  const haystack = [
    title,
    ...tags,
    taxonomy?.category ?? "",
    taxonomy?.format ?? "",
  ]
    .join(" ")
    .toLowerCase();

  for (const [category, words] of Object.entries(KEYWORDS) as [
    EventCategory,
    string[],
  ][]) {
    if (words.some((word) => haystack.includes(word))) return category;
  }

  return "social";
}

export function inferVibe(attendeeCount: number, tags: string[]): GatherEvent["vibe"] {
  const text = tags.join(" ").toLowerCase();
  if (text.includes("intimate") || attendeeCount < 40) return "intimate";
  if (attendeeCount > 200 || text.includes("festival")) return "crowds";
  return "balanced";
}
