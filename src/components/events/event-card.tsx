"use client";

import { format } from "date-fns";
import { Bookmark, MapPin, Users } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CATEGORY_META, type GatherEvent } from "@/lib/types";
import { formatEventPrice } from "@/lib/events/format-price";
import { cn } from "@/lib/utils";

interface EventCardProps {
  event: GatherEvent;
  saved?: boolean;
  onToggleSave?: (id: string) => void;
  variant?: "feed" | "list" | "compact";
}

export function EventCard({
  event,
  saved = false,
  onToggleSave,
  variant = "feed",
}: EventCardProps) {
  const category = CATEGORY_META[event.category];
  const dateLabel = format(new Date(event.startAt), "EEE, MMM d · h:mm a");
  const priceLabel = formatEventPrice(event);

  if (variant === "list") {
    return (
      <Link
        href={`/events/${event.id}`}
        className="glass-card group flex gap-4 p-3 transition-all hover:glass-selected"
      >
        <div
          className="size-20 shrink-0 rounded-xl bg-cover bg-center shadow-sm"
          style={{ backgroundImage: `url(${event.imageUrl})` }}
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-xs text-muted-foreground">{dateLabel}</p>
              <h3 className="font-medium leading-snug group-hover:text-rainbow">{event.title}</h3>
            </div>
            {onToggleSave && (
              <Button
                variant="ghost"
                size="icon"
                className="size-8 shrink-0 rounded-full"
                onClick={(e) => {
                  e.preventDefault();
                  onToggleSave(event.id);
                }}
              >
                <Bookmark
                  className={cn(
                    "size-4",
                    saved && "fill-[url(#rainbow-gradient)] text-[#9B5DE5]"
                  )}
                />
              </Button>
            )}
          </div>
          <p className="mt-1 truncate text-sm text-muted-foreground">{event.venue}</p>
          <div className="mt-2 flex items-center gap-2">
            <Badge variant="secondary" className="badge-glass text-xs">
              {priceLabel}
            </Badge>
            {event.friendsGoing.length > 0 && (
              <span className="text-xs text-muted-foreground">
                {event.friendsGoing.length} friends going
              </span>
            )}
          </div>
        </div>
      </Link>
    );
  }

  return (
    <article className="glass-card-lg group overflow-hidden transition-all hover:scale-[1.01] hover:shadow-[0_24px_64px_rgb(0_0_0/0.1)]">
      <Link href={`/events/${event.id}`} className="block">
        <div className="relative aspect-[16/10] overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
            style={{ backgroundImage: `url(${event.imageUrl})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-white/10" />
          <div className="absolute bottom-3 left-3 flex gap-2">
            <Badge className="badge-glass text-foreground">
              {category.emoji} {category.label}
            </Badge>
            {event.featured && <Badge className="badge-rainbow">Featured</Badge>}
          </div>
          {onToggleSave && (
            <Button
              variant="glass"
              size="icon"
              className="absolute right-3 top-3 size-9 rounded-full"
              onClick={(e) => {
                e.preventDefault();
                onToggleSave(event.id);
              }}
            >
              <Bookmark
                className={cn(
                  "size-4",
                  saved && "fill-[url(#rainbow-gradient)] text-[#9B5DE5]"
                )}
              />
            </Button>
          )}
        </div>
        <div className="p-5">
          <p className="text-sm text-muted-foreground">{dateLabel}</p>
          <h3 className="mt-1 font-heading text-xl leading-snug group-hover:text-rainbow">
            {event.title}
          </h3>
          <div className="mt-3 flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <MapPin className="size-3.5" />
              {event.venue}
            </span>
            <span className="font-medium text-foreground">{priceLabel}</span>
          </div>
          {(event.friendsGoing.length > 0 || event.attendeeCount > 0) && (
            <div className="mt-4 flex items-center justify-between border-t border-border/40 pt-4">
              {event.friendsGoing.length > 0 ? (
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {event.friendsGoing.slice(0, 3).map((f) => (
                      <Avatar key={f.name} className="size-7 border-2 border-background">
                        <AvatarImage src={f.avatar} alt={f.name} />
                        <AvatarFallback>{f.name[0]}</AvatarFallback>
                      </Avatar>
                    ))}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {event.friendsGoing.map((f) => f.name).join(", ")} going
                  </span>
                </div>
              ) : (
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Users className="size-3.5" />
                  {event.attendeeCount} attending
                </span>
              )}
            </div>
          )}
        </div>
      </Link>
    </article>
  );
}
