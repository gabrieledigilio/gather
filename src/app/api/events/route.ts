import { fetchRomeEventsToday } from "@/lib/events/fetch-rome-events";
import { NextResponse } from "next/server";

export const revalidate = 3600;

export async function GET() {
  try {
    const result = await fetchRomeEventsToday();
    return NextResponse.json(result);
  } catch (error) {
    console.error("Failed to fetch Rome events:", error);
    return NextResponse.json(
      { error: "Failed to load events", events: [], fetchedAt: new Date().toISOString() },
      { status: 500 },
    );
  }
}
