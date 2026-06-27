export type EventCategory =
  | "social"
  | "culture"
  | "active"
  | "learning"
  | "food"
  | "professional";

export type BudgetPreference = "free" | "under-20" | "under-50" | "any";

export type VibePreference = "intimate" | "balanced" | "crowds";

export type Availability =
  | "weekday-mornings"
  | "weekday-evenings"
  | "weekends"
  | "late-night";

export type GroupSizePreference = "solo" | "small" | "any";

export type PersonalityType =
  | "culture-curator"
  | "social-butterfly"
  | "adventure-seeker"
  | "knowledge-hunter"
  | "foodie-explorer"
  | "network-builder";

export type ViewMode = "feed" | "list" | "map";

export interface LocationPreference {
  lat: number;
  lng: number;
  city: string;
  label: string;
}

export interface UserPreferences {
  onboardingComplete: boolean;
  skippedOnboarding: boolean;
  displayName: string;
  location: LocationPreference | null;
  radiusKm: number;
  interests: EventCategory[];
  availability: Availability[];
  budget: BudgetPreference;
  vibe: VibePreference;
  groupSize: GroupSizePreference;
  personality: PersonalityType | null;
  notificationsEnabled: boolean;
  savedEventIds: string[];
  dismissedEventIds: string[];
  createdEventIds: string[];
}

export interface FriendAttendee {
  name: string;
  avatar: string;
}

export type EventSource = "eventbrite" | "luma" | "meetup" | "songkick" | "gather";

export interface GatherEvent {
  id: string;
  title: string;
  description: string;
  category: EventCategory;
  startAt: string;
  endAt: string;
  venue: string;
  address: string;
  city: string;
  lat: number;
  lng: number;
  imageUrl: string;
  price: number;
  currency?: "EUR" | "USD";
  priceLabel?: string;
  capacity: number;
  attendeeCount: number;
  hostName: string;
  hostAvatar: string;
  tags: string[];
  vibe: VibePreference;
  soloFriendly: boolean;
  friendsGoing: FriendAttendee[];
  featured?: boolean;
  source?: EventSource;
  sourceUrl?: string;
}

export interface CreatedEventInput {
  title: string;
  description: string;
  category: EventCategory;
  startAt: string;
  venue: string;
  city: string;
  price: number;
}

export interface AppNotification {
  id: string;
  title: string;
  body: string;
  eventId?: string;
  read: boolean;
  createdAt: string;
}

export const DEFAULT_PREFERENCES: UserPreferences = {
  onboardingComplete: false,
  skippedOnboarding: false,
  displayName: "",
  location: {
    lat: 41.9028,
    lng: 12.4964,
    city: "Rome",
    label: "Rome, Italy",
  },
  radiusKm: 25,
  interests: ["professional", "learning", "social"],
  availability: ["weekends", "weekday-evenings", "late-night"],
  budget: "free",
  vibe: "balanced",
  groupSize: "solo",
  personality: "knowledge-hunter",
  notificationsEnabled: false,
  savedEventIds: [],
  dismissedEventIds: [],
  createdEventIds: [],
};

export const CATEGORY_META: Record<
  EventCategory,
  { label: string; emoji: string; description: string; imageUrl: string }
> = {
  social: {
    label: "Social",
    emoji: "🥂",
    description: "Meetups, parties & networking",
    imageUrl:
      "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80",
  },
  culture: {
    label: "Culture",
    emoji: "🎭",
    description: "Art, music, theater & museums",
    imageUrl:
      "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&q=80",
  },
  active: {
    label: "Active",
    emoji: "🏃",
    description: "Sports, fitness & outdoors",
    imageUrl:
      "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=800&q=80",
  },
  learning: {
    label: "Learning",
    emoji: "📚",
    description: "Workshops, talks & classes",
    imageUrl:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80",
  },
  food: {
    label: "Food & Drink",
    emoji: "🍷",
    description: "Tastings, markets & pop-ups",
    imageUrl:
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80",
  },
  professional: {
    label: "Professional",
    emoji: "💼",
    description: "Conferences & career events",
    imageUrl:
      "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&q=80",
  },
};

export const PERSONALITY_META: Record<
  PersonalityType,
  { title: string; subtitle: string; traits: string[] }
> = {
  "culture-curator": {
    title: "Culture Curator",
    subtitle: "You seek beauty, depth, and unforgettable experiences.",
    traits: ["Gallery openings", "Live music", "Independent cinema"],
  },
  "social-butterfly": {
    title: "Social Butterfly",
    subtitle: "You're energized by people, conversation, and new connections.",
    traits: ["Rooftop mixers", "Community dinners", "Dance nights"],
  },
  "adventure-seeker": {
    title: "Adventure Seeker",
    subtitle: "You chase movement, fresh air, and a little adrenaline.",
    traits: ["Trail runs", "Climbing sessions", "Urban explorations"],
  },
  "knowledge-hunter": {
    title: "Knowledge Hunter",
    subtitle: "You're always learning — and love sharing what you discover.",
    traits: ["Tech talks", "Book clubs", "Skill workshops"],
  },
  "foodie-explorer": {
    title: "Foodie Explorer",
    subtitle: "Every great evening starts with something delicious.",
    traits: ["Wine tastings", "Chef pop-ups", "Night markets"],
  },
  "network-builder": {
    title: "Network Builder",
    subtitle: "You turn rooms into opportunities and ideas into action.",
    traits: ["Founder meetups", "Industry panels", "Career fairs"],
  },
};
