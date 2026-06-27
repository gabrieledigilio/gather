"use client";

import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getNotifications } from "@/lib/storage";
import type { AppNotification } from "@/lib/types";

const DEFAULT_NOTIFICATIONS: AppNotification[] = [
  {
    id: "n1",
    title: "96% match: Ship It Hackathon this weekend",
    body: "Priya and Kai are going. Free entry, AI track, $25k in prizes — SF Pier 27.",
    read: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: "n2",
    title: "Alex saved LLM Hack Night",
    body: "Hands-on prompts, RAG, and debugging with ML engineers at GitHub HQ.",
    eventId: "evt-4",
    read: false,
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: "n3",
    title: "New free workshop nearby",
    body: "Next.js 16 deep dive — Server Components & Vercel deploy. Spots filling fast.",
    eventId: "evt-5",
    read: true,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
];

export function NotificationsClient() {
  const [items, setItems] = useState<AppNotification[]>([]);

  useEffect(() => {
    const stored = getNotifications();
    setItems(stored.length > 0 ? stored : DEFAULT_NOTIFICATIONS);
  }, []);

  const unread = items.filter((n) => !n.read).length;

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-heading text-3xl tracking-tight">
          <span className="text-rainbow">Notifications</span>
        </h1>
        <p className="mt-1 text-muted-foreground">
          {unread > 0 ? `${unread} unread` : "You're all caught up"}
        </p>
      </header>

      <div className="space-y-3">
        {items.map((n) => (
          <div
            key={n.id}
            className={`rounded-2xl p-4 transition-colors ${
              n.read ? "glass-card opacity-70" : "glass-card-lg glass-selected border-rainbow"
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-medium">{n.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">{n.body}</p>
                <p className="mt-2 text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                </p>
              </div>
              {!n.read && <Badge className="badge-rainbow shrink-0">New</Badge>}
            </div>
            {n.eventId && (
              <Button variant="link" className="mt-2 h-auto p-0 text-rainbow" asChild>
                <Link href={`/events/${n.eventId}`}>View event</Link>
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
