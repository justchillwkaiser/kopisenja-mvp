// Fallback data statik untuk development/build tanpa DB (konvensyen project).
// Data sama dengan prisma/seed.ts - bila DB ready, service guna DB, fallback hanya
// untuk bila DB offline / belum di-migrate.

export interface FallbackOutlet {
  id: string;
  name: string;
  slug: string;
  address: string;
  city: string;
}

export interface FallbackProduct {
  id: string;
  name: string;
  sku: string;
  unit: string;
  reorderLevel: number;
}

export interface FallbackStock {
  outletId: string;
  productId: string;
  quantity: number;
}

export interface FallbackSale {
  outletId: string;
  date: string; // YYYY-MM-DD
  totalAmount: number;
  itemCount: number;
}

export const FALLBACK_OUTLETS: FallbackOutlet[] = [
  { id: "out-ipoh", name: "Ipoh (Utama)", slug: "ipoh", address: "Jalan Panglima", city: "Ipoh" },
  { id: "out-taiping", name: "Taiping", slug: "taiping", address: "Jalan Kota", city: "Taiping" },
  { id: "out-sitiawan", name: "Sitiawan", slug: "sitiawan", address: "Jalan Lumut", city: "Sitiawan" },
];

export const FALLBACK_PRODUCTS: FallbackProduct[] = [
  { id: "prod-espresso", name: "Espresso Beans", sku: "KS-001", unit: "kg", reorderLevel: 15 },
  { id: "prod-matcha", name: "Matcha Powder", sku: "KS-003", unit: "kg", reorderLevel: 5 },
  { id: "prod-susu", name: "Susu Segar", sku: "KS-004", unit: "unit", reorderLevel: 10 },
  { id: "prod-gula", name: "Gula Melaka", sku: "KS-007", unit: "unit", reorderLevel: 10 },
  { id: "prod-croissant", name: "Croissant", sku: "KS-011", unit: "unit", reorderLevel: 15 },
  { id: "prod-cinnamon", name: "Cinnamon Roll", sku: "KS-012", unit: "unit", reorderLevel: 12 },
  { id: "prod-cup", name: "Paper Cup 12oz", sku: "KS-015", unit: "unit", reorderLevel: 20 },
];

export const FALLBACK_STOCKS: FallbackStock[] = [
  { outletId: "out-ipoh", productId: "prod-espresso", quantity: 48 },
  { outletId: "out-ipoh", productId: "prod-matcha", quantity: 8 },
  { outletId: "out-ipoh", productId: "prod-susu", quantity: 24 },
  { outletId: "out-ipoh", productId: "prod-gula", quantity: 0 },
  { outletId: "out-ipoh", productId: "prod-croissant", quantity: 32 },
  { outletId: "out-ipoh", productId: "prod-cinnamon", quantity: 18 },
  { outletId: "out-ipoh", productId: "prod-cup", quantity: 40 },
  { outletId: "out-taiping", productId: "prod-espresso", quantity: 30 },
  { outletId: "out-taiping", productId: "prod-matcha", quantity: 4 },
  { outletId: "out-taiping", productId: "prod-susu", quantity: 4 },
  { outletId: "out-taiping", productId: "prod-gula", quantity: 12 },
  { outletId: "out-taiping", productId: "prod-croissant", quantity: 15 },
  { outletId: "out-taiping", productId: "prod-cinnamon", quantity: 10 },
  { outletId: "out-taiping", productId: "prod-cup", quantity: 25 },
  { outletId: "out-sitiawan", productId: "prod-espresso", quantity: 22 },
  { outletId: "out-sitiawan", productId: "prod-matcha", quantity: 6 },
  { outletId: "out-sitiawan", productId: "prod-susu", quantity: 14 },
  { outletId: "out-sitiawan", productId: "prod-gula", quantity: 9 },
  { outletId: "out-sitiawan", productId: "prod-croissant", quantity: 8 },
  { outletId: "out-sitiawan", productId: "prod-cinnamon", quantity: 5 },
  { outletId: "out-sitiawan", productId: "prod-cup", quantity: 6 },
];

// Jualan 7 hari (termasuk hari ini) per outlet, dalam RM. Deterministik supaya
// fallback stabil untuk test/build.
const DAILY_SALES: Record<string, number[]> = {
  "out-ipoh": [612.4, 585.2, 501.8, 648.9, 555.4, 819.6, 745.3],
  "out-taiping": [379.8, 342.1, 318.5, 401.2, 366.9, 512.4, 468.7],
  "out-sitiawan": [256.3, 231.8, 209.4, 274.6, 248.1, 361.2, 329.5],
};

const DAY_OFFSET_MS = 24 * 60 * 60 * 1000;

function isoDay(offset: number): string {
  const d = new Date();
  d.setHours(12, 0, 0, 0);
  d.setTime(d.getTime() - offset * DAY_OFFSET_MS);
  return d.toISOString().slice(0, 10);
}

export const FALLBACK_SALES: FallbackSale[] = Object.entries(DAILY_SALES).flatMap(
  ([outletId, amounts]) =>
    amounts.map((totalAmount, i) => ({
      outletId,
      date: isoDay(6 - i),
      totalAmount,
      itemCount: Math.round(totalAmount / 9),
    }))
);
