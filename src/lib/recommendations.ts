import type { GatherEvent, PersonalityType, UserPreferences } from "./types";

function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number) {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function budgetScore(price: number, budget: UserPreferences["budget"]) {
  if (budget === "any") return 1;
  if (budget === "free") return price === 0 ? 1 : 0;
  if (budget === "under-20") return price <= 20 ? 1 : Math.max(0, 1 - (price - 20) / 40);
  if (budget === "under-50") return price <= 50 ? 1 : Math.max(0, 1 - (price - 50) / 50);
  return 1;
}

function vibeScore(eventVibe: GatherEvent["vibe"], pref: UserPreferences["vibe"]) {
  if (pref === "balanced") return 0.85;
  return eventVibe === pref ? 1 : 0.5;
}

const PERSONALITY_CATEGORIES: Record<PersonalityType, GatherEvent["category"][]> = {
  "culture-curator": ["culture", "learning"],
  "social-butterfly": ["social", "food"],
  "adventure-seeker": ["active", "social"],
  "knowledge-hunter": ["learning", "professional"],
  "foodie-explorer": ["food", "culture"],
  "network-builder": ["professional", "social"],
};

export function scoreEvent(event: GatherEvent, prefs: UserPreferences): number {
  let score = 0;

  if (prefs.location) {
    const distance = haversineKm(
      prefs.location.lat,
      prefs.location.lng,
      event.lat,
      event.lng
    );
    if (distance <= prefs.radiusKm) {
      score += 40 * (1 - distance / prefs.radiusKm);
    } else if (event.city.toLowerCase() === prefs.location.city.toLowerCase()) {
      score += 15;
    } else {
      score -= 10;
    }
  } else {
    score += 10;
  }

  if (prefs.interests.length > 0) {
    score += prefs.interests.includes(event.category) ? 25 : -5;
  }

  if (prefs.personality) {
    const cats = PERSONALITY_CATEGORIES[prefs.personality];
    if (cats.includes(event.category)) score += 12;
  }

  score += budgetScore(event.price, prefs.budget) * 10;
  score += vibeScore(event.vibe, prefs.vibe) * 8;

  if (prefs.groupSize === "solo" && event.soloFriendly) score += 6;
  if (prefs.groupSize === "small" && event.capacity <= 50) score += 6;

  if (event.featured) score += 5;
  if (event.friendsGoing.length > 0) score += event.friendsGoing.length * 3;
  score += Math.min(event.attendeeCount / 100, 5);

  if (prefs.dismissedEventIds.includes(event.id)) score -= 100;

  return score;
}

const MAX_THEORETICAL_SCORE = 120;

export function toMatchPercent(score: number): number {
  const normalized = Math.round((score / MAX_THEORETICAL_SCORE) * 100);
  return Math.min(99, Math.max(62, normalized));
}

export interface ScoredEvent {
  event: GatherEvent;
  score: number;
  matchPercent: number;
}

const HACKATHON_MATCH_PERCENT = 99;

function isHackathonEvent(event: GatherEvent): boolean {
  return event.title.toLowerCase().includes("cursor meetup");
}

export function recommendEventsWithScores(
  events: GatherEvent[],
  prefs: UserPreferences
): ScoredEvent[] {
  const scored = [...events]
    .map((event) => {
      const score = scoreEvent(event, prefs);
      return { event, score, matchPercent: toMatchPercent(score) };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score);

  const hackathonIndex = scored.findIndex(({ event }) => isHackathonEvent(event));
  if (hackathonIndex === -1) return scored;

  const hackathon = {
    ...scored[hackathonIndex],
    score: MAX_THEORETICAL_SCORE,
    matchPercent: HACKATHON_MATCH_PERCENT,
  };

  if (hackathonIndex === 0) {
    scored[0] = hackathon;
    return scored;
  }

  scored.splice(hackathonIndex, 1);
  return [hackathon, ...scored];
}

export function recommendEvents(
  events: GatherEvent[],
  prefs: UserPreferences
): GatherEvent[] {
  return recommendEventsWithScores(events, prefs).map(({ event }) => event);
}

export function inferPersonality(
  interests: UserPreferences["interests"],
  vibe: UserPreferences["vibe"],
  quizAnswers: string[]
): PersonalityType {
  const counts: Record<PersonalityType, number> = {
    "culture-curator": 0,
    "social-butterfly": 0,
    "adventure-seeker": 0,
    "knowledge-hunter": 0,
    "foodie-explorer": 0,
    "network-builder": 0,
  };

  for (const interest of interests) {
    if (interest === "culture") counts["culture-curator"] += 2;
    if (interest === "social") counts["social-butterfly"] += 2;
    if (interest === "active") counts["adventure-seeker"] += 2;
    if (interest === "learning") counts["knowledge-hunter"] += 2;
    if (interest === "food") counts["foodie-explorer"] += 2;
    if (interest === "professional") counts["network-builder"] += 2;
  }

  if (vibe === "intimate") counts["culture-curator"] += 1;
  if (vibe === "crowds") counts["social-butterfly"] += 1;
  if (vibe === "balanced") counts["knowledge-hunter"] += 1;

  for (const answer of quizAnswers) {
    if (answer in counts) counts[answer as PersonalityType] += 3;
  }

  return (Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0] ??
    "social-butterfly") as PersonalityType;
}
