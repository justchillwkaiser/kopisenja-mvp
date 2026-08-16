import { describe, it, expect } from "vitest";
import { stockStatus } from "../../src/lib/stock-status";

describe("stockStatus", () => {
  it("returns HABIS when quantity is 0 or below", () => {
    expect(stockStatus(0, 10)).toBe("HABIS");
    expect(stockStatus(-2, 10)).toBe("HABIS");
  });

  it("returns RENDAH when quantity is below reorder level", () => {
    expect(stockStatus(4, 10)).toBe("RENDAH");
    expect(stockStatus(9, 10)).toBe("RENDAH");
  });

  it("returns OK when quantity meets or exceeds reorder level", () => {
    expect(stockStatus(10, 10)).toBe("OK");
    expect(stockStatus(48, 15)).toBe("OK");
  });
});
