"use client";

import { format } from "date-fns";
import {
  motion,
  useMotionValue,
  useTransform,
  type PanInfo,
} from "framer-motion";
import { Bookmark, MapPin, ThumbsDown } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { CATEGORY_META, type GatherEvent } from "@/lib/types";
import { formatEventPrice } from "@/lib/events/format-price";
import { cn } from "@/lib/utils";

const SOURCE_LABELS: Record<NonNullable<GatherEvent["source"]>, string> = {
  eventbrite: "Eventbrite",
  luma: "Luma",
  meetup: "Meetup",
  songkick: "Songkick",
  gather: "Gather",
};

const SWIPE_THRESHOLD = 90;

interface MatchCardProps {
  event: GatherEvent;
  matchPercent: number;
  isTop?: boolean;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
}

export function MatchCard({
  event,
  matchPercent,
  isTop = true,
  onSwipeLeft,
  onSwipeRight,
}: MatchCardProps) {
  const category = CATEGORY_META[event.category];
  const dateLabel = format(new Date(event.startAt), "EEE, MMM d · h:mm a");
  const priceLabel = formatEventPrice(event);

  const x = useMotionValue(0);
  const rotate = useTransform(x, [-220, 220], [-10, 10]);
  const likeOpacity = useTransform(x, [20, 100], [0, 1]);
  const passOpacity = useTransform(x, [-100, -20], [1, 0]);

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    if (!isTop) return;
    if (info.offset.x > SWIPE_THRESHOLD) onSwipeRight();
    else if (info.offset.x < -SWIPE_THRESHOLD) onSwipeLeft();
  };

  return (
    <motion.article
      drag={isTop ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.9}
      style={{ x, rotate, zIndex: isTop ? 10 : 0 }}
      onDragEnd={handleDragEnd}
      whileDrag={{ cursor: "grabbing" }}
      className={cn(
        "absolute inset-0 touch-none select-none",
        !isTop && "pointer-events-none scale-[0.96] opacity-60"
      )}
    >
      <div className="glass-card-lg flex h-full flex-col overflow-hidden">
        <div className="relative min-h-[52%] flex-1 overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${event.imageUrl})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/20" />

          <motion.div
            style={{ opacity: likeOpacity }}
            className="absolute left-5 top-5 rotate-[-12deg] rounded-xl border-2 border-emerald-400 px-4 py-2 text-lg font-bold uppercase tracking-wide text-emerald-400"
          >
            Save
          </motion.div>
          <motion.div
            style={{ opacity: passOpacity }}
            className="absolute right-5 top-5 rotate-[12deg] rounded-xl border-2 border-red-400 px-4 py-2 text-lg font-bold uppercase tracking-wide text-red-400"
          >
            Pass
          </motion.div>

          <div className="absolute right-4 top-4 flex flex-col items-center">
            <div className="relative flex size-16 items-center justify-center sm:size-[4.25rem]">
              <svg className="absolute inset-0 -rotate-90" viewBox="0 0 64 64">
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  fill="none"
                  stroke="rgb(255 255 255 / 0.2)"
                  strokeWidth="4"
                />
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  fill="none"
                  stroke="url(#match-ring)"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray={`${(matchPercent / 100) * 175.9} 175.9`}
                />
                <defs>
                  <linearGradient id="match-ring" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#8ECAE6" />
                    <stop offset="50%" stopColor="#F15BB5" />
                    <stop offset="100%" stopColor="#FEAE57" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="text-center">
                <p className="text-lg font-bold leading-none text-white sm:text-xl">{matchPercent}%</p>
                <p className="text-[9px] font-medium uppercase tracking-wider text-white/80">
                  match
                </p>
              </div>
            </div>
          </div>

          <div className="absolute bottom-4 left-4 flex flex-wrap gap-2">
            <Badge className="badge-glass">{category.emoji} {category.label}</Badge>
            {event.source && (
              <Badge className="badge-glass">{SOURCE_LABELS[event.source]}</Badge>
            )}
            {event.featured && <Badge className="badge-rainbow">Featured</Badge>}
          </div>
        </div>

        <div className="flex flex-col gap-3 p-5">
          <div>
            <p className="text-sm text-muted-foreground">{dateLabel}</p>
            <Link href={`/events/${event.id}`} className="block">
              <h2 className="font-heading text-2xl leading-tight tracking-tight hover:text-rainbow">
                {event.title}
              </h2>
            </Link>
          </div>

          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <MapPin className="size-3.5 shrink-0" />
              {event.venue}
            </span>
            <span className="font-medium text-foreground">{priceLabel}</span>
          </div>

          {event.friendsGoing.length > 0 && (
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
          )}

          <Link
            href={`/events/${event.id}`}
            className="text-center text-sm font-medium text-muted-foreground transition-colors hover:text-rainbow"
          >
            View full details
          </Link>
        </div>
      </div>
    </motion.article>
  );
}

interface MatchPassButtonProps {
  onPass: () => void;
  className?: string;
}

export function MatchPassButton({ onPass, className }: MatchPassButtonProps) {
  return (
    <button
      type="button"
      onClick={onPass}
      className={cn(
        "glass-card flex size-12 shrink-0 items-center justify-center rounded-full transition-transform hover:scale-105 active:scale-95 sm:size-14",
        className,
      )}
      aria-label="Pass"
    >
      <ThumbsDown className="size-5 text-red-400 sm:size-6" />
    </button>
  );
}

interface MatchSaveButtonProps {
  onSave: () => void;
  saved: boolean;
  className?: string;
}

export function MatchSaveButton({ onSave, saved, className }: MatchSaveButtonProps) {
  return (
    <button
      type="button"
      onClick={onSave}
      className={cn(
        "flex size-14 shrink-0 items-center justify-center rounded-full transition-transform hover:scale-105 active:scale-95 sm:size-16",
        saved ? "btn-rainbow" : "glass-card-lg",
        className,
      )}
      aria-label={saved ? "Saved" : "Save event"}
    >
      <Bookmark className={cn("size-6 sm:size-7", saved && "fill-white text-white")} />
    </button>
  );
}
