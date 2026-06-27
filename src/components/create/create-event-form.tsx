"use client";

import { addDays } from "date-fns";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { addCreatedEvent } from "@/lib/storage";
import { CATEGORY_META, type EventCategory, type GatherEvent } from "@/lib/types";

const CATEGORIES = Object.keys(CATEGORY_META) as EventCategory[];

export function CreateEventForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<EventCategory>("professional");
  const [venue, setVenue] = useState("");
  const [city, setCity] = useState("San Francisco");
  const [price, setPrice] = useState("0");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !venue.trim() || !city.trim()) {
      toast.error("Please fill in the required fields");
      return;
    }

    const startAt = addDays(new Date(), 7).toISOString();
    const endAt = addDays(new Date(), 7).toISOString();

    const event: GatherEvent = {
      id: `user-${Date.now()}`,
      title: title.trim(),
      description: description.trim() || "A new event on Gather.",
      category,
      startAt,
      endAt,
      venue: venue.trim(),
      address: venue.trim(),
      city: city.trim(),
      lat: 37.77 + Math.random() * 0.05,
      lng: -122.42 + Math.random() * 0.05,
      imageUrl:
        "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&q=80",
      price: Number(price) || 0,
      capacity: 50,
      attendeeCount: 1,
      hostName: "You",
      hostAvatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=You",
      tags: ["community", "hackathon"],
      vibe: "balanced",
      soloFriendly: true,
      friendsGoing: [],
    };

    addCreatedEvent(event);
    toast.success("Event created!");
    router.push(`/events/${event.id}`);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label htmlFor="title">Event title *</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="48hr AI Hackathon — Ship It Weekend"
          className="mt-2 h-11 rounded-xl"
        />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="What will attendees build or learn?"
          rows={4}
          className="mt-2 w-full rounded-xl border border-input bg-transparent px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
        />
      </div>

      <div>
        <Label>Category</Label>
        <div className="mt-2 grid grid-cols-2 gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
              className={`rounded-xl border px-3 py-2.5 text-left text-sm transition-all ${
                category === cat
                  ? "glass-selected border-rainbow"
                  : "glass-card hover:bg-white/60"
              }`}
            >
              {CATEGORY_META[cat].emoji} {CATEGORY_META[cat].label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="venue">Venue *</Label>
          <Input
            id="venue"
            value={venue}
            onChange={(e) => setVenue(e.target.value)}
            placeholder="Pier 27 / GitHub HQ"
            className="mt-2 h-11 rounded-xl"
          />
        </div>
        <div>
          <Label htmlFor="city">City *</Label>
          <Input
            id="city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Toronto"
            className="mt-2 h-11 rounded-xl"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="price">Ticket price (USD)</Label>
        <Input
          id="price"
          type="number"
          min={0}
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="mt-2 h-11 rounded-xl"
        />
      </div>

      <Button
        type="submit"
        className="btn-rainbow h-12 w-full rounded-full"
      >
        Publish event
      </Button>
    </form>
  );
}
