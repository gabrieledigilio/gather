import type { GatherEvent } from "@/lib/types";

export function formatEventPrice(event: GatherEvent): string {
  if (event.priceLabel) return event.priceLabel;
  if (event.price === 0) return "Free";
  const symbol = event.currency === "EUR" ? "€" : "$";
  return `${symbol}${event.price}`;
}
