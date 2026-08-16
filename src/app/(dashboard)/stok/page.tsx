import { StockTable } from "@/components/stock-table";
import { listStocks } from "@/server/services/stock.service";

export default async function StockPage() {
  const items = await listStocks("all");

  return (
    <>
      <header className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Stok</h1>
        <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.1em] text-taupe-faint">
          {items.length} item merentas cawangan
        </p>
      </header>
      <StockTable items={items} />
    </>
  );
}
