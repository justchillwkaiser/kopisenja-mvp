"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import {
  ChartLineUp,
  Package,
  Storefront,
  FileText,
  List,
  SignOut,
} from "@phosphor-icons/react";
import { BrandMark } from "@/components/brand-mark";
import { authClient } from "@/lib/auth-client";
import type { CurrentUser } from "@/lib/auth-guards";

const NAV = [
  { href: "/", label: "Ringkasan", icon: ChartLineUp },
  { href: "/stok", label: "Stok", icon: Package },
  { href: "/cawangan", label: "Cawangan", icon: Storefront },
  { href: "/laporan", label: "Laporan", icon: FileText },
];

const ROLE_CLASS: Record<string, string> = {
  OWNER: "role-owner",
  MANAGER: "role-manager",
  STAFF: "role-staff",
};

export function AppShell({
  user,
  lowStockCount,
  children,
}: {
  user: CurrentUser;
  lowStockCount: number;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  const initials =
    user.name
      .split(" ")
      .map((p) => p[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "KS";

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  }

  async function logout() {
    setBusy(true);
    await authClient.signOut();
    router.push("/log-masuk");
    router.refresh();
  }

  return (
    <>
      {/* Sidebar desktop */}
      <aside className="sidebar z-30">
        <div className="border-b border-line pb-4">
          <BrandMark />
        </div>
        <nav className="mt-4 flex flex-1 flex-col gap-1">
          {NAV.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2.5 rounded-[10px] px-3 py-2.5 text-sm font-medium transition-colors ${
                  active
                    ? "bg-accent-soft text-accent font-semibold"
                    : "text-taupe hover:bg-surface-2 hover:text-espresso"
                }`}
              >
                <Icon size={19} />
                {item.label}
                {item.href === "/stok" && lowStockCount > 0 && (
                  <span className="ml-auto rounded-full bg-bad-bg px-2 py-0.5 font-mono text-[10px] text-bad">
                    {lowStockCount}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-line pt-3.5">
          <div className="flex items-center gap-2.5">
            <div className="grid h-9 w-9 place-items-center rounded-full bg-espresso text-sm font-bold text-surface">
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-[13.5px] font-semibold">{user.name}</div>
              <span className={`role-chip ${ROLE_CLASS[user.role] ?? "role-staff"}`}>
                {user.role}
              </span>
            </div>
            <button
              onClick={logout}
              disabled={busy}
              aria-label="Log keluar"
              className="grid h-9 w-9 place-items-center rounded-full border border-line text-taupe transition-colors hover:bg-surface-2 hover:text-espresso disabled:opacity-50"
            >
              <SignOut size={17} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="mx-auto max-w-[1180px] px-4 pb-24 pt-6 md:ml-[276px] md:px-7 md:pb-16">
        {children}
      </main>

      {/* Mobile FAB */}
      <button
        onClick={() => setSheetOpen(true)}
        aria-label="Menu"
        className="fixed bottom-5 right-5 z-40 grid h-14 w-14 place-items-center rounded-full bg-espresso text-surface shadow-soft md:hidden"
      >
        <List size={26} />
      </button>

      {/* Backdrop + sheet mobile */}
      <div
        className={`sheet-backdrop ${sheetOpen ? "show" : ""}`}
        onClick={() => setSheetOpen(false)}
      />
      <div className={`sheet ${sheetOpen ? "show" : ""}`}>
        <div className="mx-auto mb-2.5 h-1 w-10 rounded-full bg-line" />
        <nav className="flex flex-col gap-0.5">
          {NAV.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSheetOpen(false)}
                className={`flex items-center gap-3 rounded-xl px-3 py-3 text-[15px] font-medium ${
                  active ? "bg-accent-soft text-accent" : "text-espresso"
                }`}
              >
                <Icon size={20} />
                {item.label}
                {item.href === "/stok" && lowStockCount > 0 && (
                  <span className="ml-auto rounded-full bg-bad-bg px-2 py-0.5 font-mono text-[10px] text-bad">
                    {lowStockCount}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
        <div className="mt-2.5 flex items-center gap-2.5 border-t border-line px-2 pt-3.5">
          <div className="grid h-9 w-9 place-items-center rounded-full bg-espresso text-sm font-bold text-surface">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate text-[13.5px] font-semibold">{user.name}</div>
            <span className={`role-chip ${ROLE_CLASS[user.role] ?? "role-staff"}`}>
              {user.role}
            </span>
          </div>
          <button
            onClick={logout}
            disabled={busy}
            aria-label="Log keluar"
            className="grid h-9 w-9 place-items-center rounded-full border border-line text-taupe"
          >
            <SignOut size={17} />
          </button>
        </div>
      </div>
    </>
  );
}
