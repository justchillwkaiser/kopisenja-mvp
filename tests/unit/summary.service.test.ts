import { describe, it, expect } from "vitest";
import { fallbackSummary } from "../../src/server/services/summary.service";

describe("fallbackSummary", () => {
  const summary = fallbackSummary();

  it("returns kpi with positive values", () => {
    expect(summary.kpi.todaySales).toBeGreaterThan(0);
    expect(summary.kpi.weekSales).toBeGreaterThan(summary.kpi.todaySales);
    expect(summary.kpi.todayOrders).toBeGreaterThan(0);
    expect(summary.kpi.lowStockCount).toBeGreaterThan(0);
  });

  it("returns exactly 7 chart points with labels", () => {
    expect(summary.chart).toHaveLength(7);
    for (const point of summary.chart) {
      expect(point.label).toBeTruthy();
      expect(point.amount).toBeGreaterThan(0);
    }
  });

  it("returns sorted low-stock alerts (HABIS first, then RENDAH)", () => {
    expect(summary.alerts.length).toBeGreaterThan(0);
    const first = summary.alerts[0];
    expect(first.status).toBe("HABIS");
    for (const a of summary.alerts) {
      expect(["OK", "RENDAH", "HABIS"]).toContain(a.status);
      expect(a.productName).toBeTruthy();
      expect(a.outletName).toBeTruthy();
    }
  });

  it("returns outlet sales for all outlets", () => {
    expect(summary.outletSales).toHaveLength(3);
    expect(summary.outletSales[0].amount).toBeGreaterThan(0);
    expect(summary.outletSales[0].outletName).toBeTruthy();
  });
});
