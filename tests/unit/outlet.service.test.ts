import { describe, it, expect } from "vitest";
import { fallbackOutlets } from "../../src/server/services/outlet.service";

describe("fallbackOutlets", () => {
  const outlets = fallbackOutlets();

  it("returns 3 Perak outlets", () => {
    expect(outlets).toHaveLength(3);
    expect(outlets.map((o) => o.name)).toEqual([
      "Ipoh (Utama)",
      "Taiping",
      "Sitiawan",
    ]);
  });

  it("has today sales for every outlet", () => {
    for (const o of outlets) {
      expect(o.todaySales).toBeGreaterThan(0);
      expect(o.todayOrders).toBeGreaterThan(0);
    }
  });

  it("flags low stock products on the right outlet", () => {
    const ipoh = outlets.find((o) => o.name === "Ipoh (Utama)")!;
    expect(ipoh.lowStockCount).toBeGreaterThan(0);
    expect(ipoh.lowStockProducts.some((p) => p.includes("Gula Melaka"))).toBe(true);
  });
});
