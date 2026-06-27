import { inferCategory, inferVibe } from "@/lib/events/infer-category";
import type { GatherEvent } from "@/lib/types";

const USER_AGENT = "Mozilla/5.0 (compatible; Gather/1.0; +https://gather.app)";

interface EventbriteContext {
  basicInfo: {
    id: string;
    name: string;
    summary?: string;
    startDate?: { local: string; utc: string };
    endDate?: { local: string; utc: string };
    isFree?: boolean;
    url: string;
    organizer?: {
      name?: string | null;
      totalAttendees?: number;
      numEvents?: number;
    };
    venue?: {
      name?: string;
      address?: {
        localizedMultiLineAddressDisplay?: string[];
        latitude?: string;
        longitude?: string;
        city?: string;
      };
    };
  };
  gallery?: {
    images?: { url?: string; croppedLogoUrl940?: string }[];
  };
  tags?: { text?: { text?: string } }[];
  taxonomies?: {
    category?: string;
    format?: string;
  };
  structuredContent?: {
    modules?: { type?: string; text?: string }[];
  };
}

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function extractDescription(ctx: EventbriteContext): string {
  const summary = ctx.basicInfo.summary?.trim();
  if (summary) return summary;

  const textModule = ctx.structuredContent?.modules?.find(
    (m) => m.type === "text" && m.text,
  );
  if (textModule?.text) {
    const plain = stripHtml(textModule.text);
    return plain.length > 280 ? `${plain.slice(0, 277)}…` : plain;
  }

  return "Discover this event on Eventbrite.";
}

function parseEventbritePage(html: string): EventbriteContext | null {
  const match = html.match(
    /<script id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/,
  );
  if (!match) return null;

  try {
    const data = JSON.parse(match[1]) as {
      props?: { pageProps?: { context?: EventbriteContext } };
    };
    return data.props?.pageProps?.context ?? null;
  } catch {
    return null;
  }
}

export async function fetchEventbriteListingUrls(): Promise<string[]> {
  const res = await fetch(
    "https://www.eventbrite.com/d/italy--roma/events--today/",
    {
      headers: { "User-Agent": USER_AGENT },
      next: { revalidate: 3600 },
    },
  );

  if (!res.ok) return [];

  const html = await res.text();
  const urls = [
    ...new Set(
      (html.match(/https:\/\/www\.eventbrite\.com\/e\/[^"]+/g) ?? []).map(
        (u) => u.split("?")[0],
      ),
    ),
  ];

  // Known Rome events that may not appear in the listing HTML
  urls.push(
    "https://www.eventbrite.com/e/super-saturday-roma-tickets-1991068163475",
  );

  return urls;
}

export function eventbriteContextToGatherEvent(
  ctx: EventbriteContext,
): GatherEvent | null {
  const info = ctx.basicInfo;
  if (!info.startDate?.utc) return null;

  const tags =
    ctx.tags?.map((t) => t.text?.text).filter(Boolean) as string[] | undefined;

  const addressLines = info.venue?.address?.localizedMultiLineAddressDisplay ?? [];
  const lat = parseFloat(info.venue?.address?.latitude ?? "41.9028");
  const lng = parseFloat(info.venue?.address?.longitude ?? "12.4964");
  const attendeeCount = info.organizer?.totalAttendees ?? 0;
  const imageUrl =
    ctx.gallery?.images?.[0]?.url ??
    ctx.gallery?.images?.[0]?.croppedLogoUrl940 ??
    "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80";

  const category = inferCategory(info.name, tags ?? [], ctx.taxonomies);

  return {
    id: `eb-${info.id}`,
    title: info.name,
    description: extractDescription(ctx),
    category,
    startAt: info.startDate.utc,
    endAt: info.endDate?.utc ?? info.startDate.utc,
    venue: info.venue?.name ?? "Rome",
    address: addressLines.join(", ") || "Rome, Italy",
    city: info.venue?.address?.city ?? "Roma",
    lat,
    lng,
    imageUrl,
    price: info.isFree ? 0 : 20,
    currency: "EUR",
    priceLabel: info.isFree ? undefined : "See Eventbrite",
    capacity: Math.max(attendeeCount + 50, 100),
    attendeeCount,
    hostName: info.organizer?.name ?? "Eventbrite Organizer",
    hostAvatar: `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(info.name.slice(0, 2))}`,
    tags: tags ?? [],
    vibe: inferVibe(attendeeCount, tags ?? []),
    soloFriendly: true,
    friendsGoing: [],
    source: "eventbrite",
    sourceUrl: info.url,
  };
}

export async function fetchEventbriteEvent(url: string): Promise<GatherEvent | null> {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": USER_AGENT },
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;

    const ctx = parseEventbritePage(await res.text());
    if (!ctx) return null;

    return eventbriteContextToGatherEvent(ctx);
  } catch {
    return null;
  }
}

export async function fetchEventbriteRomeEvents(
  targetDate: string,
): Promise<GatherEvent[]> {
  const urls = await fetchEventbriteListingUrls();
  const batchSize = 5;
  const events: GatherEvent[] = [];

  for (let i = 0; i < urls.length; i += batchSize) {
    const batch = urls.slice(i, i + batchSize);
    const results = await Promise.all(
      batch.map(async (url) => {
        try {
          const res = await fetch(url, {
            headers: { "User-Agent": USER_AGENT },
            next: { revalidate: 3600 },
          });
          if (!res.ok) return null;
          const html = await res.text();
          const match = html.match(
            /<script id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/,
          );
          if (!match) return null;
          const data = JSON.parse(match[1]) as {
            props?: { pageProps?: { context?: EventbriteContext } };
          };
          const ctx = data.props?.pageProps?.context;
          if (!ctx) return null;
          const localDate = ctx.basicInfo.startDate?.local?.slice(0, 10);
          if (localDate !== targetDate) return null;
          return eventbriteContextToGatherEvent(ctx);
        } catch {
          return null;
        }
      }),
    );
    events.push(...results.filter((e): e is GatherEvent => e !== null));
  }

  const seen = new Set<string>();
  return events.filter((e) => {
    if (seen.has(e.id)) return false;
    seen.add(e.id);
    return true;
  });
}
