"use client";

import { format } from "date-fns";
import {
  Bookmark,
  Calendar,
  ChevronLeft,
  Download,
  Share2,
  ThumbsDown,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { buildCalendarUrl, downloadIcsFile } from "@/lib/calendar";
import { formatEventPrice } from "@/lib/events/format-price";
import { dismissEvent, toggleSavedEvent } from "@/lib/storage";
import { CATEGORY_META, type GatherEvent } from "@/lib/types";

interface EventDetailClientProps {
  event: GatherEvent;
  saved: boolean;
}

export function EventDetailClient({ event, saved: initialSaved }: EventDetailClientProps) {
  const router = useRouter();
  const category = CATEGORY_META[event.category];
  const [saved, setSaved] = useState(initialSaved);

  const handleSave = () => {
    const next = toggleSavedEvent(event.id);
    setSaved(next);
    toast.success(next ? "Event saved" : "Removed from saved");
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({ title: event.title, text: event.description, url });
    } else {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard");
    }
  };

  const handleDismiss = () => {
    dismissEvent(event.id);
    toast.message("We'll show you fewer events like this");
    router.push("/discover");
  };

  const spotsLeft = event.capacity - event.attendeeCount;
  const fillPercent = Math.round((event.attendeeCount / event.capacity) * 100);

  return (
    <div className="pb-8">
      <div className="relative -mx-4 -mt-6 aspect-[16/10] overflow-hidden rounded-b-3xl sm:-mx-6">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${event.imageUrl})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-black/20" />
        <Button variant="glass" size="icon" className="absolute left-4 top-4 rounded-full" asChild>
          <Link href="/discover">
            <ChevronLeft className="size-5" />
          </Link>
        </Button>
      </div>

      <div className="relative -mt-6 space-y-6 px-1 pt-4">
        <div className="flex flex-wrap gap-2">
          <Badge className="badge-glass">{category.emoji} {category.label}</Badge>
          <Badge className="badge-glass">{formatEventPrice(event)}</Badge>
          {event.source && (
            <Badge className="badge-glass capitalize">{event.source}</Badge>
          )}
          {event.soloFriendly && <Badge className="badge-glass">Solo-friendly</Badge>}
        </div>

        <div>
          <h1 className="font-heading text-3xl leading-tight tracking-tight">{event.title}</h1>
          <p className="mt-2 text-muted-foreground">
            {format(new Date(event.startAt), "EEEE, MMMM d · h:mm a")} –{" "}
            {format(new Date(event.endAt), "h:mm a")}
          </p>
        </div>

        {event.friendsGoing.length > 0 && (
          <div className="glass-card-lg bg-rainbow-soft p-4">
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                {event.friendsGoing.map((f) => (
                  <Avatar key={f.name} className="size-9 border-2 border-background">
                    <AvatarImage src={f.avatar} alt={f.name} />
                    <AvatarFallback>{f.name[0]}</AvatarFallback>
                  </Avatar>
                ))}
              </div>
              <div>
                <p className="text-sm font-medium">
                  {event.friendsGoing.map((f) => f.name).join(", ")} going
                </p>
                <p className="text-xs text-muted-foreground">Friends from your network</p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <Button className="btn-rainbow h-12 rounded-full" onClick={handleSave}>
            <Bookmark className={saved ? "mr-2 size-4 fill-current" : "mr-2 size-4"} />
            {saved ? "Saved" : "Save event"}
          </Button>
          <Button variant="glass" className="h-12 rounded-full" onClick={handleShare}>
            <Share2 className="mr-2 size-4" />
            Share
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Button variant="glass" className="h-11 rounded-full" asChild>
            <a href={buildCalendarUrl(event)} target="_blank" rel="noreferrer">
              <Calendar className="mr-2 size-4" />
              Google Cal
            </a>
          </Button>
          <Button
            variant="glass"
            className="h-11 rounded-full"
            onClick={() => {
              downloadIcsFile(event);
              toast.success("Calendar file downloaded");
            }}
          >
            <Download className="mr-2 size-4" />
            .ics file
          </Button>
        </div>

        <Separator className="bg-border/40" />

        <section>
          <h2 className="font-heading text-lg">About</h2>
          <p className="mt-2 text-muted-foreground leading-relaxed">{event.description}</p>
          {event.sourceUrl && (
            <Button variant="link" className="mt-2 h-auto p-0" asChild>
              <a href={event.sourceUrl} target="_blank" rel="noreferrer">
                View on {event.source ?? "source"} →
              </a>
            </Button>
          )}
        </section>

        <section className="glass-card p-4">
          <h3 className="font-medium">{event.venue}</h3>
          <p className="text-sm text-muted-foreground">
            {event.address}, {event.city}
          </p>
        </section>

        <section className="glass-card p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={event.hostAvatar} alt={event.hostName} />
                <AvatarFallback>{event.hostName[0]}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">Hosted by {event.hostName}</p>
                <p className="text-xs text-muted-foreground">Verified organizer</p>
              </div>
            </div>
            <div className="text-right">
              <p className="flex items-center gap-1 text-sm font-medium">
                <Users className="size-4" />
                {event.attendeeCount}
              </p>
              <p className="text-xs text-muted-foreground">{spotsLeft} spots left</p>
            </div>
          </div>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full progress-track">
            <div
              className="progress-rainbow h-full rounded-full transition-all"
              style={{ width: `${fillPercent}%` }}
            />
          </div>
        </section>

        <div className="flex flex-wrap gap-2">
          {event.tags.map((tag) => (
            <Badge key={tag} className="badge-glass">
              #{tag}
            </Badge>
          ))}
        </div>

        <Button variant="ghost" className="w-full text-muted-foreground" onClick={handleDismiss}>
          <ThumbsDown className="mr-2 size-4" />
          Not interested
        </Button>
      </div>
    </div>
  );
}
