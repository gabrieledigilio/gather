"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { usePreferences } from "@/hooks/use-preferences";
import { PERSONALITY_META } from "@/lib/types";

export function ProfileClient() {
  const { prefs } = usePreferences();

  if (!prefs) return null;

  const personality = prefs.personality ? PERSONALITY_META[prefs.personality] : null;

  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-heading text-3xl tracking-tight">
          Your <span className="text-rainbow">profile</span>
        </h1>
        <p className="mt-1 text-muted-foreground">Sign in later with Supabase</p>
      </header>

      <div className="glass-card-lg p-6">
        <p className="text-sm text-muted-foreground">Demo profile</p>
        <p className="mt-1 font-heading text-2xl text-rainbow">{prefs.displayName || "Roxy"}</p>
        <p className="mt-1 text-sm text-muted-foreground">Guest mode · preferences saved locally</p>
        <Button className="mt-4 rounded-full" variant="glass" disabled>
          Sign in with Supabase (coming soon)
        </Button>
      </div>

      {personality && (
        <div className="glass-card-lg p-6">
          <p className="text-sm text-muted-foreground">Your personality</p>
          <p className="mt-1 font-heading text-2xl text-rainbow">{personality.title}</p>
          <p className="mt-2 text-sm text-muted-foreground">{personality.subtitle}</p>
        </div>
      )}

      {prefs.location && (
        <div className="glass-card p-6">
          <p className="text-sm text-muted-foreground">Location</p>
          <p className="mt-1 font-medium">{prefs.location.label}</p>
          <p className="text-sm text-muted-foreground">{prefs.radiusKm} km radius</p>
        </div>
      )}

      <Button variant="glass" className="w-full rounded-full" asChild>
        <Link href="/onboarding">Retake onboarding</Link>
      </Button>
    </div>
  );
}
