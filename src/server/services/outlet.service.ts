import { db } from "@/lib/db";
import {
  FALLBACK_OUTLETS,
  FALLBACK_PRODUCTS,
  FALLBACK_SALES,
  FALLBACK_STOCKS,
} from "@/lib/fallback-data";

export interface OutletSummary {
  id: string;
  name: string;
  address: string;
  city: string;
  todaySales: number;
  todayOrders: number;
  trend: number; // % vs semalam, positive = naik
  lowStockCount: number;
  lowStockProducts: string[];
}

const DAY_MS = 24 * 60 * 60 * 1000;

function startOfDay(d: Date): Date {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

export function fallbackOutlets(now = new Date()): OutletSummary[] {
  const today = startOfDay(now);
  const todayIso = today.toISOString().slice(0, 10);
  const yesterdayIso = new Date(today.getTime() - DAY_MS).toISOString().slice(0, 10);
  const productById = new Map(FALLBACK_PRODUCTS.map((p) => [p.id, p]));

  return FALLBACK_OUTLETS.map((o) => {
    const todaySales = FALLBACK_SALES.filter(
      (s) => s.date === todayIso && s.outletId === o.id
    ).reduce((a, s) => a + s.totalAmount, 0);
    const yesterdaySales = FALLBACK_SALES.filter(
      (s) => s.date === yesterdayIso && s.outletId === o.id
    ).reduce((a, s) => a + s.totalAmount, 0);
    const todayOrders = FALLBACK_SALES.filter(
      (s) => s.date === todayIso && s.outletId === o.id
    ).reduce((a, s) => a + s.itemCount, 0);
    const trend =
      yesterdaySales > 0 ? Math.round(((todaySales - yesterdaySales) / yesterdaySales) * 1000) / 10 : 0;

    const lowStocks = FALLBACK_STOCKS.filter((s) => {
      if (s.outletId !== o.id) return false;
      const p = productById.get(s.productId);
      return p ? s.quantity < p.reorderLevel : false;
    });

    return {
      id: o.id,
      name: o.name,
      address: o.address,
      city: o.city,
      todaySales: Math.round(todaySales * 100) / 100,
      todayOrders,
      trend,
      lowStockCount: lowStocks.length,
      lowStockProducts: lowStocks.map(
        (s) => `${productById.get(s.productId)?.name ?? "Produk"} (${s.quantity})`
      ),
    };
  });
}

export async function listOutlets(): Promise<OutletSummary[]> {
  try {
    const now = new Date();
    const today = startOfDay(now);
    const yesterday = new Date(today.getTime() - DAY_MS);

    const [outlets, stocks] = await Promise.all([
      db.outlet.findMany({
        where: { isActive: true },
        include: { sales: { where: { soldAt: { gte: yesterday } } } },
        orderBy: { name: "asc" },
      }),
      db.stock.findMany({ include: { product: true } }),
    ]);

    return outlets.map((o) => {
      const todaySales = o.sales
        .filter((s) => s.soldAt >= today)
        .reduce((a, s) => a + Number(s.totalAmount), 0);
      const yesterdaySales = o.sales
        .filter((s) => s.soldAt < today)
        .reduce((a, s) => a + Number(s.totalAmount), 0);
      const todayOrders = o.sales
        .filter((s) => s.soldAt >= today)
        .reduce((a, s) => a + s.itemCount, 0);
      const trend =
        yesterdaySales > 0
          ? Math.round(((todaySales - yesterdaySales) / yesterdaySales) * 1000) / 10
          : 0;
      const lowStocks = stocks.filter(
        (s) => s.outletId === o.id && s.quantity < s.product.reorderLevel
      );

      return {
        id: o.id,
        name: o.name,
        address: o.address,
        city: o.city,
        todaySales: Math.round(todaySales * 100) / 100,
        todayOrders,
        trend,
        lowStockCount: lowStocks.length,
        lowStockProducts: lowStocks.map((s) => `${s.product.name} (${s.quantity})`),
      };
    });
  } catch {
    return fallbackOutlets();
  }
}
