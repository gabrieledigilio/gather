"use client";

import {
  DEFAULT_PREFERENCES,
  type AppNotification,
  type GatherEvent,
  type UserPreferences,
} from "./types";

const PREFERENCES_KEY = "gather:preferences";
const CREATED_EVENTS_KEY = "gather:created-events";
const NOTIFICATIONS_KEY = "gather:notifications";

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJson<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

export function getPreferences(): UserPreferences {
  return { ...DEFAULT_PREFERENCES, ...readJson(PREFERENCES_KEY, DEFAULT_PREFERENCES) };
}

export function savePreferences(partial: Partial<UserPreferences>) {
  const next = { ...getPreferences(), ...partial };
  writeJson(PREFERENCES_KEY, next);
  return next;
}

export function getCreatedEvents(): GatherEvent[] {
  return readJson<GatherEvent[]>(CREATED_EVENTS_KEY, []);
}

export function addCreatedEvent(event: GatherEvent) {
  const events = getCreatedEvents();
  writeJson(CREATED_EVENTS_KEY, [event, ...events]);
  savePreferences({
    createdEventIds: [event.id, ...getPreferences().createdEventIds],
  });
}

export function getNotifications(): AppNotification[] {
  return readJson<AppNotification[]>(NOTIFICATIONS_KEY, []);
}

export function saveNotifications(notifications: AppNotification[]) {
  writeJson(NOTIFICATIONS_KEY, notifications);
}

export function toggleSavedEvent(eventId: string): boolean {
  const prefs = getPreferences();
  const isSaved = prefs.savedEventIds.includes(eventId);
  const savedEventIds = isSaved
    ? prefs.savedEventIds.filter((id) => id !== eventId)
    : [...prefs.savedEventIds, eventId];
  savePreferences({ savedEventIds });
  return !isSaved;
}

export function dismissEvent(eventId: string) {
  const prefs = getPreferences();
  if (prefs.dismissedEventIds.includes(eventId)) return;
  savePreferences({
    dismissedEventIds: [...prefs.dismissedEventIds, eventId],
  });
}
