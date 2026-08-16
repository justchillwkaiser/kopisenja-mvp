import { AppShell } from "@/components/app-shell";
import { requireUser } from "@/lib/auth-guards";
import { getSummary } from "@/server/services/summary.service";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireUser();
  const summary = await getSummary();

  return (
    <AppShell user={user} lowStockCount={summary.kpi.lowStockCount}>
      {children}
    </AppShell>
  );
}
