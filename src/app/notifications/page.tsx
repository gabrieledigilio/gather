import { AppShell } from "@/components/layout/app-shell";
import { NotificationsClient } from "@/components/notifications/notifications-client";

export default function NotificationsPage() {
  return (
    <AppShell>
      <NotificationsClient />
    </AppShell>
  );
}
