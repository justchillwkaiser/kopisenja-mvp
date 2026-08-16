import { db } from "@/lib/db";
import {
  FALLBACK_OUTLETS,
  FALLBACK_PRODUCTS,
  FALLBACK_STOCKS,
} from "@/lib/fallback-data";
import { stockStatus, type StockStatus } from "@/lib/stock-status";

export type StockFilter = "all" | "warn" | "bad";

export interface StockItem {
  id: string;
  productName: string;
  sku: string;
  unit: string;
  outletId: string;
  outletName: string;
  quantity: number;
  reorderLevel: number;
  status: StockStatus;
}

function applyFilter(items: StockItem[], filter: StockFilter): StockItem[] {
  if (filter === "all") return items;
  if (filter === "bad") return items.filter((i) => i.status === "HABIS");
  return items.filter((i) => i.status === "RENDAH");
}

export function fallbackStocks(): StockItem[] {
  const productById = new Map(FALLBACK_PRODUCTS.map((p) => [p.id, p]));
  const outletById = new Map(FALLBACK_OUTLETS.map((o) => [o.id, o]));

  return FALLBACK_STOCKS.map((s) => {
    const p = productById.get(s.productId)!;
    const o = outletById.get(s.outletId)!;
    return {
      id: `${o.id}:${p.id}`,
      productName: p.name,
      sku: p.sku,
      unit: p.unit,
      outletId: o.id,
      outletName: o.name,
      quantity: s.quantity,
      reorderLevel: p.reorderLevel,
      status: stockStatus(s.quantity, p.reorderLevel),
    };
  }).sort((a, b) => {
    const order = { HABIS: 0, RENDAH: 1, OK: 2 } as const;
    return order[a.status] - order[b.status] || a.productName.localeCompare(b.productName);
  });
}

export async function listStocks(filter: StockFilter = "all"): Promise<StockItem[]> {
  try {
    const stocks = await db.stock.findMany({
      include: { product: true, outlet: true },
    });

    const items: StockItem[] = stocks.map((s) => ({
      id: s.id,
      productName: s.product.name,
      sku: s.product.sku,
      unit: s.product.unit,
      outletId: s.outletId,
      outletName: s.outlet.name,
      quantity: s.quantity,
      reorderLevel: s.product.reorderLevel,
      status: stockStatus(s.quantity, s.product.reorderLevel),
    }));

    return applyFilter(
      items.sort((a, b) => {
        const order = { HABIS: 0, RENDAH: 1, OK: 2 } as const;
        return order[a.status] - order[b.status] || a.productName.localeCompare(b.productName);
      }),
      filter
    );
  } catch {
    return applyFilter(fallbackStocks(), filter);
  }
}
