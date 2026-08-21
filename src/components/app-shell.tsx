"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import {
  ChartLineUp,
  Package,
  Storefront,
  FileText,
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
      <a href="#kandungan" className="skip-link">
        Langkau ke kandungan utama
      </a>

      {/* Top navigation (Kedai Kaca) */}
      <header className="topbar">
        <div className="mx-auto flex h-[60px] max-w-[1180px] items-center justify-between gap-4 px-4 md:px-7">
          <Link href="/" aria-label="KOPI SENJA - Ringkasan" className="shrink-0">
            <BrandMark compact />
          </Link>

          <nav aria-label="Utama" className="hidden items-center gap-1 md:flex">
            {NAV.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="nav-pill"
                  data-active={active}
                  aria-current={active ? "page" : undefined}
                >
                  <Icon size={15} weight={active ? "fill" : "regular"} aria-hidden="true" />
                  {item.label}
                  {item.href === "/stok" && lowStockCount > 0 && (
                    <span
                      className="rounded-full bg-bad-bg px-1.5 py-0.5 font-mono text-[9px] text-bad"
                      aria-label={`${lowStockCount} item stok rendah`}
                    >
                      <span aria-hidden="true">{lowStockCount}</span>
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2.5">
            <div className="hidden text-right sm:block">
              <div className="truncate text-[13px] font-semibold leading-tight">{user.name}</div>
              <span className={`role-chip ${ROLE_CLASS[user.role] ?? "role-staff"}`}>
                {user.role}
              </span>
            </div>
            <div
              className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-surface-2 text-[12px] font-bold text-accent ring-1 ring-line"
              aria-hidden="true"
            >
              {initials}
            </div>
            <button
              onClick={logout}
              disabled={busy}
              aria-label="Log keluar"
              className="grid h-9 w-9 place-items-center rounded-full border border-line text-taupe transition-colors hover:bg-surface-2 hover:text-espresso disabled:opacity-50"
            >
              <SignOut size={16} aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Mobile: nav tabs mendatar di bawah top bar */}
        <div className="nav-scroll md:hidden">
          <nav
            aria-label="Utama (mudah alih)"
            className="flex gap-1 overflow-x-auto border-t border-line-soft px-4 py-2"
            style={{ overscrollBehaviorX: "contain" }}
          >
          {NAV.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={`m-${item.href}`}
                href={item.href}
                className="nav-pill"
                data-active={active}
                aria-current={active ? "page" : undefined}
              >
                <Icon size={15} weight={active ? "fill" : "regular"} aria-hidden="true" />
                {item.label}
                {item.href === "/stok" && lowStockCount > 0 && (
                  <span
                    className="rounded-full bg-bad-bg px-1.5 py-0.5 font-mono text-[9px] text-bad"
                    aria-label={`${lowStockCount} item stok rendah`}
                  >
                    <span aria-hidden="true">{lowStockCount}</span>
                  </span>
                )}
              </Link>
            );
          })}
          </nav>
        </div>
      </header>

      {/* Main */}
      <main
        id="kandungan"
        className="mx-auto max-w-[1180px] px-4 pb-24 pt-6 md:px-7 md:pb-16"
      >
        {children}
      </main>
    </>
  );
}
