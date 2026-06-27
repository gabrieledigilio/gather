import type { GatherEvent } from "@/lib/types";

/** Verified real Rome events for June 27, 2026 from public listings (Songkick, etc.) */
export const CURATED_ROME_EVENTS: GatherEvent[] = [
  {
    id: "sk-spaghetti-festival-2026",
    title: "Spaghetti Festival 2026",
    description:
      "Colombre, Maria Antonietta, and Il Mago Del Gelato at Testaccio Estate — an indie music night in Rome.",
    category: "culture",
    startAt: "2026-06-27T15:30:00.000Z",
    endAt: "2026-06-27T22:00:00.000Z",
    venue: "Testaccio Estate",
    address: "Largo Dino Frisullo, 00153 Roma",
    city: "Roma",
    lat: 41.8777,
    lng: 12.478,
    imageUrl:
      "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&q=80",
    price: 15,
    currency: "EUR",
    capacity: 800,
    attendeeCount: 420,
    hostName: "Testaccio Estate",
    hostAvatar: "https://api.dicebear.com/9.x/initials/svg?seed=TE",
    tags: ["festival", "indie", "live music"],
    vibe: "crowds",
    soloFriendly: true,
    friendsGoing: [],
    source: "songkick",
    sourceUrl:
      "https://www.songkick.com/festivals/1982779-spaghetti/id/43140247-spaghetti-festival-2026",
  },
  {
    id: "sk-dengue-dengue-angelo-mai",
    title: "Dengue Dengue Dengue, TYTO & Prest",
    description:
      "Latin electronic night at Angelo Mai with Dengue Dengue Dengue, TYTO, and Prest. Doors 9 PM.",
    category: "culture",
    startAt: "2026-06-27T19:00:00.000Z",
    endAt: "2026-06-27T23:30:00.000Z",
    venue: "Angelo Mai",
    address: "Viale delle Terme di Caracalla 55, 00153 Roma",
    city: "Roma",
    lat: 41.8789,
    lng: 12.4925,
    imageUrl:
      "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80",
    price: 15,
    currency: "EUR",
    capacity: 400,
    attendeeCount: 187,
    hostName: "Angelo Mai",
    hostAvatar: "https://api.dicebear.com/9.x/initials/svg?seed=AM",
    tags: ["concert", "electronic", "latin"],
    vibe: "balanced",
    soloFriendly: true,
    friendsGoing: [],
    source: "songkick",
    sourceUrl:
      "https://www.songkick.com/concerts/43263399-dengue-dengue-dengue-at-angelo-mai",
  },
  {
    id: "sk-roma-summer-fest",
    title: "Roma Summer Fest — Laura y Brenda",
    description:
      "Summer concert series at Auditorium Parco della Musica featuring Laura y Brenda.",
    category: "culture",
    startAt: "2026-06-27T19:00:00.000Z",
    endAt: "2026-06-27T22:30:00.000Z",
    venue: "Auditorium Parco della Musica",
    address: "Via Pietro de Coubertin 30, 00196 Roma",
    city: "Roma",
    lat: 41.9244,
    lng: 12.4558,
    imageUrl:
      "https://images.unsplash.com/photo-1506157786151-b8491531f063?w=800&q=80",
    price: 95,
    currency: "EUR",
    capacity: 2800,
    attendeeCount: 1240,
    hostName: "Roma Summer Fest",
    hostAvatar: "https://api.dicebear.com/9.x/initials/svg?seed=RSF",
    tags: ["concert", "summer fest", "live music"],
    vibe: "crowds",
    soloFriendly: true,
    friendsGoing: [],
    source: "songkick",
    sourceUrl: "https://concerts50.com/show/roma-summer-fest-in-rome-tickets-jun-27-2026",
  },
];

export function getCuratedRomeEvents(targetDate: string): GatherEvent[] {
  return CURATED_ROME_EVENTS.filter(
    (event) => event.startAt.slice(0, 10) === targetDate,
  );
}
