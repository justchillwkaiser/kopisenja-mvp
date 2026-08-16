export type StockStatus = "OK" | "RENDAH" | "HABIS";

export function stockStatus(quantity: number, reorderLevel: number): StockStatus {
  if (quantity <= 0) return "HABIS";
  if (quantity < reorderLevel) return "RENDAH";
  return "OK";
}
