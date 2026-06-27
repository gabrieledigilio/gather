"use client";

import { useCallback, useEffect, useState } from "react";
import { getPreferences, savePreferences } from "@/lib/storage";
import type { UserPreferences } from "@/lib/types";

export function usePreferences() {
  const [prefs, setPrefs] = useState<UserPreferences | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setPrefs(getPreferences());
    setReady(true);
  }, []);

  const update = useCallback((partial: Partial<UserPreferences>) => {
    const next = savePreferences(partial);
    setPrefs(next);
    return next;
  }, []);

  return { prefs, ready, update };
}
