import { db } from "@/lib/db";
import {
  FALLBACK_OUTLETS,
  FALLBACK_PRODUCTS,
  FALLBACK_SALES,
  FALLBACK_STOCKS,
} from "@/lib/fallback-data";
import { stockStatus, type StockStatus } from "@/lib/stock-status";

const DAY_MS = 24 * 60 * 60 * 1000;

export interface SummaryKpi {
  todaySales: number;
  weekSales: number;
  todayOrders: number;
  lowStockCount: number;
}

export interface SummaryChartPoint {
  label: string;
  amount: number;
}

export interface SummaryOutletSale {
  outletId: string;
  outletName: string;
  amount: number;
}

export interface SummaryAlert {
  productName: string;
  outletName: string;
  quantity: number;
  status: StockStatus;
}

export interface SummaryData {
  kpi: SummaryKpi;
  chart: SummaryChartPoint[];
  alerts: SummaryAlert[];
  outletSales: SummaryOutletSale[];
}

function startOfDay(d: Date): Date {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function dayLabel(d: Date): string {
  return d.toLocaleDateString("ms-MY", { weekday: "short" });
}

// Guna tengah hari (12:00 local) sebelum toISOString supaya tarikh local tidak
// tersasar ke hari sebelumnya dalam UTC (isoDay pattern sama seperti fallback-data).
function isoOf(d: Date): string {
  const x = new Date(d);
  x.setHours(12, 0, 0, 0);
  return x.toISOString().slice(0, 10);
}

export function fallbackSummary(now = new Date()): SummaryData {
  const today = startOfDay(now);
  const todayIso = isoOf(today);
  const weekIso = isoOf(new Date(today.getTime() - 6 * DAY_MS));

  const todaySales = FALLBACK_SALES.filter((s) => s.date === todayIso).reduce(
    (a, s) => a + s.totalAmount,
    0
  );
  const weekSales = FALLBACK_SALES.filter((s) => s.date >= weekIso).reduce(
    (a, s) => a + s.totalAmount,
    0
  );
  const todayOrders = FALLBACK_SALES.filter((s) => s.date === todayIso).reduce(
    (a, s) => a + s.itemCount,
    0
  );

  const productById = new Map(FALLBACK_PRODUCTS.map((p) => [p.id, p]));
  const outletById = new Map(FALLBACK_OUTLETS.map((o) => [o.id, o]));
  const lowStocks = FALLBACK_STOCKS.filter((s) => {
    const p = productById.get(s.productId);
    return p ? s.quantity < p.reorderLevel : false;
  });

  const chart: SummaryChartPoint[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today.getTime() - i * DAY_MS);
    const iso = isoOf(d);
    const amount = FALLBACK_SALES.filter((s) => s.date === iso).reduce(
      (a, s) => a + s.totalAmount,
      0
    );
    chart.push({ label: dayLabel(d), amount: Math.round(amount) });
  }

  const alerts: SummaryAlert[] = lowStocks
    .map((s) => ({
      productName: productById.get(s.productId)?.name ?? "Produk",
      outletName: outletById.get(s.outletId)?.name ?? "Cawangan",
      quantity: s.quantity,
      status: stockStatus(s.quantity, productById.get(s.productId)?.reorderLevel ?? 10),
    }))
    .sort((a, b) => a.quantity - b.quantity)
    .slice(0, 5);

  const outletSales: SummaryOutletSale[] = FALLBACK_OUTLETS.map((o) => ({
    outletId: o.id,
    outletName: o.name,
    amount: FALLBACK_SALES.filter((s) => s.date === todayIso && s.outletId === o.id).reduce(
      (a, s) => a + s.totalAmount,
      0
    ),
  })).sort((a, b) => b.amount - a.amount);

  return {
    kpi: {
      todaySales: Math.round(todaySales * 100) / 100,
      weekSales: Math.round(weekSales * 100) / 100,
      todayOrders,
      lowStockCount: lowStocks.length,
    },
    chart,
    alerts,
    outletSales,
  };
}

export async function getSummary(): Promise<SummaryData> {
  try {
    const now = new Date();
    const today = startOfDay(now);
    const weekStart = new Date(today.getTime() - 6 * DAY_MS);

    const [sales, stocks] = await Promise.all([
      db.sale.findMany({
        where: { soldAt: { gte: weekStart } },
        include: { outlet: true },
        orderBy: { soldAt: "asc" },
      }),
      db.stock.findMany({ include: { product: true, outlet: true } }),
    ]);

    const todaySales = sales
      .filter((s) => s.soldAt >= today)
      .reduce((a, s) => a + Number(s.totalAmount), 0);
    const weekSales = sales.reduce((a, s) => a + Number(s.totalAmount), 0);
    const todayOrders = sales
      .filter((s) => s.soldAt >= today)
      .reduce((a, s) => a + s.itemCount, 0);
    const lowStocks = stocks.filter((s) => s.quantity < s.product.reorderLevel);

    const chart: SummaryChartPoint[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today.getTime() - i * DAY_MS);
      const next = new Date(d.getTime() + DAY_MS);
      const amount = sales
        .filter((s) => s.soldAt >= d && s.soldAt < next)
        .reduce((a, s) => a + Number(s.totalAmount), 0);
      chart.push({ label: dayLabel(d), amount: Math.round(amount) });
    }

    const alerts: SummaryAlert[] = lowStocks
      .map((s) => ({
        productName: s.product.name,
        outletName: s.outlet.name,
        quantity: s.quantity,
        status: stockStatus(s.quantity, s.product.reorderLevel),
      }))
      .sort((a, b) => a.quantity - b.quantity)
      .slice(0, 5);

    const salesByOutlet = sales
      .filter((s) => s.soldAt >= today)
      .reduce<Record<string, number>>((acc, s) => {
        acc[s.outletId] = (acc[s.outletId] ?? 0) + Number(s.totalAmount);
        return acc;
      }, {});
    const outletRows: SummaryOutletSale[] = Object.entries(salesByOutlet)
      .map(([outletId, amount]) => {
        const o = sales.find((s) => s.outletId === outletId)?.outlet;
        return { outletId, outletName: o?.name ?? "Cawangan", amount };
      })
      .sort((a, b) => b.amount - a.amount);

    return {
      kpi: {
        todaySales: Math.round(todaySales * 100) / 100,
        weekSales: Math.round(weekSales * 100) / 100,
        todayOrders,
        lowStockCount: lowStocks.length,
      },
      chart,
      alerts,
      outletSales: outletRows,
    };
  } catch {
    return fallbackSummary();
  }
}
