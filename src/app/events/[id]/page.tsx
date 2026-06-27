import { AppShell } from "@/components/layout/app-shell";
import { EventDetailLoader } from "@/components/events/event-detail-loader";

export default async function EventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <AppShell>
      <EventDetailLoader id={id} />
    </AppShell>
  );
}
