import { describe, it, expect } from "vitest";
import { fallbackStocks, listStocks } from "../../src/server/services/stock.service";

describe("fallbackStocks", () => {
  it("returns one item per outlet-product pair", () => {
    const items = fallbackStocks();
    expect(items).toHaveLength(21); // 7 produk x 3 cawangan
  });

  it("sorts HABIS before RENDAH before OK", () => {
    const items = fallbackStocks();
    const order = { HABIS: 0, RENDAH: 1, OK: 2 } as const;
    for (let i = 1; i < items.length; i++) {
      expect(order[items[i - 1].status]).toBeLessThanOrEqual(order[items[i].status]);
    }
  });

  it("contains expected low stock entries from mock data", () => {
    const items = fallbackStocks();
    const gulaIpoh = items.find(
      (i) => i.productName === "Gula Melaka" && i.outletName.includes("Ipoh")
    );
    expect(gulaIpoh?.status).toBe("HABIS");
    const susuTaiping = items.find(
      (i) => i.productName === "Susu Segar" && i.outletName === "Taiping"
    );
    expect(susuTaiping?.status).toBe("RENDAH");
  });
});

describe("listStocks (fallback path - no DB)", () => {
  it("returns all items without filter", async () => {
    const items = await listStocks("all");
    expect(items.length).toBeGreaterThan(0);
  });

  it("filters bad (HABIS) correctly", async () => {
    const items = await listStocks("bad");
    expect(items.length).toBeGreaterThan(0);
    for (const i of items) expect(i.status).toBe("HABIS");
  });

  it("filters warn (RENDAH) correctly", async () => {
    const items = await listStocks("warn");
    expect(items.length).toBeGreaterThan(0);
    for (const i of items) expect(i.status).toBe("RENDAH");
  });
});
