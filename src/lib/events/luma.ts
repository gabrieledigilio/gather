import { inferCategory, inferVibe } from "@/lib/events/infer-category";
import type { GatherEvent } from "@/lib/types";

const LUMA_ROME_PLACE_ID = "discplace-CLGg2G8Q96daz0w";

interface LumaDocNode {
  type?: string;
  text?: string;
  content?: LumaDocNode[];
}

interface LumaEventPayload {
  event?: {
    api_id: string;
    name: string;
    start_at: string;
    end_at?: string;
    cover_url?: string;
    social_image_url?: string;
    url?: string;
    coordinate?: { latitude: number; longitude: number };
    geo_address_info?: {
      address?: string;
      full_address?: string;
      city?: string;
    };
  };
  guest_count?: number;
  ticket_info?: {
    is_free?: boolean;
    price?: number | null;
    max_price?: number | null;
    is_sold_out?: boolean;
  };
  description_mirror?: { content?: LumaDocNode[] };
  hosts?: { name?: string; avatar_url?: string }[];
}

function extractLumaDescription(doc?: { content?: LumaDocNode[] }): string {
  if (!doc?.content) return "";

  const parts: string[] = [];
  const walk = (nodes: LumaDocNode[]) => {
    for (const node of nodes) {
      if (node.text) parts.push(node.text);
      if (node.content) walk(node.content);
    }
  };
  walk(doc.content);

  const text = parts.join(" ").replace(/\s+/g, " ").trim();
  return text.length > 320 ? `${text.slice(0, 317)}…` : text;
}

function lumaPayloadToGatherEvent(data: LumaEventPayload): GatherEvent | null {
  const ev = data.event;
  if (!ev?.start_at) return null;

  const host = data.hosts?.[0];
  const attendeeCount = data.guest_count ?? 0;
  const tags = ["luma", "meetup"];
  const title = ev.name;
  const category = inferCategory(title, tags);
  const ticket = data.ticket_info;
  const isFree = ticket?.is_free ?? true;
  const price = ticket?.price ?? (isFree ? 0 : 0);

  return {
    id: `luma-${ev.api_id}`,
    title,
    description:
      extractLumaDescription(data.description_mirror) ||
      `${title} — listed on Luma.`,
    category,
    startAt: ev.start_at,
    endAt: ev.end_at ?? ev.start_at,
    venue: ev.geo_address_info?.address ?? "Rome",
    address: ev.geo_address_info?.full_address ?? "Rome, Italy",
    city: ev.geo_address_info?.city ?? "Roma",
    lat: ev.coordinate?.latitude ?? 41.9028,
    lng: ev.coordinate?.longitude ?? 12.4964,
    imageUrl:
      ev.cover_url ??
      ev.social_image_url ??
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80",
    price,
    currency: "EUR",
    priceLabel: ticket?.is_sold_out ? "Sold out" : isFree ? undefined : "See Luma",
    capacity: Math.max(attendeeCount + 50, 100),
    attendeeCount,
    hostName: host?.name ?? "Luma Host",
    hostAvatar:
      host?.avatar_url ??
      `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(title.slice(0, 2))}`,
    tags,
    vibe: inferVibe(attendeeCount, tags),
    soloFriendly: true,
    friendsGoing: [],
    featured: title.toLowerCase().includes("cursor"),
    source: "luma",
    sourceUrl: ev.url ? `https://lu.ma/${ev.url}` : undefined,
  };
}

export async function fetchLumaEvent(apiId: string): Promise<GatherEvent | null> {
  try {
    const res = await fetch(`https://api.lu.ma/event/get?event_api_id=${apiId}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    return lumaPayloadToGatherEvent((await res.json()) as LumaEventPayload);
  } catch {
    return null;
  }
}

export async function fetchLumaRomeEvents(targetDate: string): Promise<GatherEvent[]> {
  try {
    const res = await fetch(
      `https://api.lu.ma/discover/get-paginated-events?discover_place_api_id=${LUMA_ROME_PLACE_ID}`,
      { next: { revalidate: 3600 } },
    );
    if (!res.ok) return [];

    const data = (await res.json()) as {
      entries?: { event?: { api_id: string; start_at: string } }[];
    };

    const apiIds =
      data.entries
        ?.filter((entry) => entry.event?.start_at.slice(0, 10) === targetDate)
        .map((entry) => entry.event!.api_id) ?? [];

    const events = await Promise.all(apiIds.map(fetchLumaEvent));
    return events.filter((e): e is GatherEvent => e !== null);
  } catch {
    return [];
  }
}
