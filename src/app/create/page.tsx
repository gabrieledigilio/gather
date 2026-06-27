import { AppShell } from "@/components/layout/app-shell";
import { CreateEventForm } from "@/components/create/create-event-form";

export default function CreatePage() {
  return (
    <AppShell>
      <div className="space-y-6">
        <header>
          <h1 className="font-heading text-3xl tracking-tight">
            Create an <span className="text-rainbow">event</span>
          </h1>
          <p className="mt-1 text-muted-foreground">
            Host something. Your community will find it.
          </p>
        </header>
        <CreateEventForm />
      </div>
    </AppShell>
  );
}
