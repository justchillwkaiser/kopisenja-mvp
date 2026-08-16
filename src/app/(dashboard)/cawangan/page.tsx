import { Storefront, TrendUp, TrendDown, Warning } from "@phosphor-icons/react/dist/ssr";
import { listOutlets } from "@/server/services/outlet.service";

function rm(n: number) {
  return `RM ${n.toLocaleString("en-MY", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export default async function OutletsPage() {
  const outlets = await listOutlets();

  return (
    <>
      <header className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Cawangan</h1>
        <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.1em] text-taupe-faint">
          {outlets.length} cawangan
        </p>
      </header>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {outlets.map((o, i) => (
          <section key={o.id} className="panel p-5">
            <div className="mb-1 flex items-start justify-between">
              <div className="flex items-center gap-2">
                <Storefront size={20} className="text-accent" />
                <h2 className="text-[15px] font-semibold">{o.name}</h2>
              </div>
              <span className={`role-chip ${i === 0 ? "role-owner" : "role-staff"}`}>
                {i === 0 ? "FLAGSHIP" : "CAWANGAN"}
              </span>
            </div>
            <p className="mb-5 text-[13px] text-taupe">
              {o.address}, {o.city}
            </p>

            <p className="kpi-label">Jualan Hari Ini</p>
            <p className="mt-1.5 text-[22px] font-bold tracking-tight tabular-nums">{rm(o.todaySales)}</p>
            <p className={`mt-1 flex items-center gap-1 font-mono text-[11px] ${o.trend >= 0 ? "text-ok" : "text-bad"}`}>
              {o.trend >= 0 ? <TrendUp size={13} weight="bold" /> : <TrendDown size={13} weight="bold" />}
              {o.trend >= 0 ? "+" : ""}
              {o.trend.toFixed(1)}% vs semalam
            </p>

            <div className="mt-4 border-t border-line pt-3.5">
              <p className="kpi-label mb-1.5">Stok Rendah</p>
              {o.lowStockCount === 0 ? (
                <p className="text-[13px] text-ok">Tiada - semua sihat</p>
              ) : (
                <div className="flex flex-col gap-1.5">
                  {o.lowStockProducts.map((p) => (
                    <span key={p} className="inline-flex w-fit items-center gap-1.5 text-[12.5px] font-medium text-bad">
                      <Warning size={13} weight="fill" /> {p}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </section>
        ))}
      </div>
    </>
  );
}
