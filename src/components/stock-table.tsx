"use client";

import { useState } from "react";
import { Package } from "@phosphor-icons/react";
import type { StockItem, StockFilter } from "@/server/services/stock.service";

const TABS: { key: StockFilter; label: string }[] = [
  { key: "all", label: "Semua" },
  { key: "warn", label: "Stok Rendah" },
  { key: "bad", label: "Habis" },
];

export function StockTable({ items }: { items: StockItem[] }) {
  const [filter, setFilter] = useState<StockFilter>("all");

  const counts = {
    all: items.length,
    warn: items.filter((i) => i.status === "RENDAH").length,
    bad: items.filter((i) => i.status === "HABIS").length,
  };

  const visible = filter === "all" ? items : items.filter((i) => i.status === (filter === "bad" ? "HABIS" : "RENDAH"));

  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-2">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`rounded-full border px-3.5 py-1.5 text-[13px] font-medium transition-colors ${
              filter === tab.key
                ? "border-espresso bg-espresso text-surface"
                : "border-line bg-surface text-taupe hover:text-espresso"
            }`}
          >
            {tab.label}
            <span className="ml-1.5 font-mono text-[10px] opacity-70">
              {counts[tab.key]}
            </span>
          </button>
        ))}
      </div>
      <p className="sr-only" aria-live="polite">
        {visible.length} item ditunjuk
      </p>

      <div className="table-wrap overflow-x-auto" aria-live="polite">
        <table className="min-w-[680px]">
          <thead>
            <tr>
              <th className="sticky-col">Produk</th>
              <th>Cawangan</th>
              <th>Tahap Stok</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((item) => {
              const pct = item.quantity > 0 ? Math.min(Math.round((item.quantity / item.reorderLevel) * 100), 100) : 0;
              const fillClass =
                item.status === "OK" ? "bg-ok" : item.status === "RENDAH" ? "bg-warn" : "bg-bad";
              return (
                <tr key={item.id}>
                  <td className="sticky-col whitespace-nowrap">
                    <div className="flex items-center gap-2.5">
                      <div className="grid h-8 w-8 shrink-0 place-items-center rounded-[10px] bg-surface-2 text-taupe">
                        <Package size={15} />
                      </div>
                      <div>
                        <p className="font-semibold">{item.productName}</p>
                        <p className="font-mono text-[10.5px] text-taupe-faint">{item.sku}</p>
                      </div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap">{item.outletName}</td>
                  <td className="whitespace-nowrap">
                    <div className="flex items-center gap-2.5">
                      <div className="h-2 w-[110px] overflow-hidden rounded-full bg-surface-2">
                        <div className={`h-full rounded-full ${fillClass}`} style={{ width: `${Math.max(pct, 4)}%` }} />
                      </div>
                      <span className="font-mono text-xs font-semibold tabular-nums">
                        {item.quantity} {item.unit}
                      </span>
                    </div>
                  </td>
                  <td className="whitespace-nowrap">
                    <span className={`badge ${item.status === "OK" ? "badge-ok" : item.status === "RENDAH" ? "badge-warn" : "badge-bad"}`}>
                      {item.status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {visible.length === 0 && (
        <p className="panel mt-4 p-6 text-center text-sm text-taupe">
          Tiada item untuk penapis ini. Semua stok sihat.
        </p>
      )}
    </div>
  );
}
