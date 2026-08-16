import { TrendUp, TrendDown, Warning, Package, Receipt } from "@phosphor-icons/react/dist/ssr";
import { getSummary } from "@/server/services/summary.service";

function rm(n: number) {
  return `RM ${n.toLocaleString("en-MY", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function pageDate() {
  return new Date().toLocaleDateString("ms-MY", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function DashboardPage() {
  const summary = await getSummary();
  const { kpi, chart, alerts, outletSales } = summary;
  const maxChart = Math.max(...chart.map((c) => c.amount), 1);
  const maxOutlet = Math.max(...outletSales.map((o) => o.amount), 1);

  return (
    <>
      <header className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Ringkasan</h1>
        <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.1em] text-taupe-faint">
          {pageDate()}
        </p>
      </header>

      {/* KPI strip */}
      <section className="mb-5 grid grid-cols-2 overflow-hidden rounded-panel border border-line bg-surface shadow-soft md:grid-cols-4">
        <div className="border-b border-line p-4 md:border-b-0 md:border-r md:p-5">
          <p className="kpi-label">Jualan Hari Ini</p>
          <p className="mt-2 text-2xl font-bold tracking-tight tabular-nums">{rm(kpi.todaySales)}</p>
          <p className="mt-1.5 flex items-center gap-1 font-mono text-[11px] text-ok">
            <TrendUp size={13} weight="bold" /> hari ini
          </p>
        </div>
        <div className="border-b border-line p-4 md:border-b-0 md:border-r md:p-5">
          <p className="kpi-label">Jualan Minggu Ini</p>
          <p className="mt-2 text-2xl font-bold tracking-tight tabular-nums">{rm(kpi.weekSales)}</p>
          <p className="mt-1.5 flex items-center gap-1 font-mono text-[11px] text-taupe-faint">
            <Receipt size={13} /> 7 hari
          </p>
        </div>
        <div className="border-r border-line p-4 md:p-5">
          <p className="kpi-label">Item Dijual Hari Ini</p>
          <p className="mt-2 text-2xl font-bold tracking-tight tabular-nums">{kpi.todayOrders}</p>
          <p className="mt-1.5 flex items-center gap-1 font-mono text-[11px] text-taupe-faint">
            <Receipt size={13} /> pesanan
          </p>
        </div>
        <div className="p-4 md:p-5">
          <p className="kpi-label">Stok Rendah</p>
          <p className={`mt-2 text-2xl font-bold tracking-tight tabular-nums ${kpi.lowStockCount > 0 ? "text-bad" : ""}`}>
            {kpi.lowStockCount}
          </p>
          <p className="mt-1.5 flex items-center gap-1 font-mono text-[11px] text-taupe-faint">
            {kpi.lowStockCount > 0 ? (
              <>
                <Warning size={13} weight="fill" className="text-bad" /> perlu tindakan
              </>
            ) : (
              "semua sihat"
            )}
          </p>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.6fr_1fr]">
        {/* Chart */}
        <section className="panel p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-[15px] font-semibold">Jualan 7 Hari Terakhir</h2>
            <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-taupe-faint">
              RM ribu
            </span>
          </div>
          <div className="flex h-[170px] items-end gap-2.5 pt-2">
            {chart.map((point) => {
              const pct = Math.max(Math.round((point.amount / maxChart) * 100), 8);
              const hot = point.amount === maxChart;
              return (
                <div key={point.label} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
                  <span className="font-mono text-[10px] text-taupe-faint">
                    RM {(point.amount / 1000).toFixed(1)}k
                  </span>
                  <div
                    className={`w-full max-w-[42px] rounded-t-md transition-colors ${hot ? "bg-accent" : "bg-accent-soft"}`}
                    style={{ height: `${pct}%`, minHeight: 6 }}
                  />
                  <span className="font-mono text-[10px] text-taupe-faint">{point.label}</span>
                </div>
              );
            })}
          </div>
        </section>

        {/* Alerts */}
        <section className="panel p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-[15px] font-semibold">Perlu Tindakan</h2>
            <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-taupe-faint">
              {alerts.length} item
            </span>
          </div>
          {alerts.length === 0 ? (
            <p className="py-6 text-center text-sm text-taupe">Tiada stok rendah. Semua sihat.</p>
          ) : (
            <div className="flex flex-col gap-2.5">
              {alerts.map((a) => {
                const bad = a.status === "HABIS";
                return (
                  <div
                    key={`${a.outletName}-${a.productName}`}
                    className={`flex items-center gap-3 rounded-xl border p-3 ${bad ? "border-bad-bg bg-bad-bg" : "border-warn-bg bg-warn-bg"}`}
                  >
                    <div
                      className={`grid h-8 w-8 shrink-0 place-items-center rounded-[10px] ${bad ? "bg-surface text-bad" : "bg-surface text-warn"}`}
                    >
                      <Package size={17} weight="fill" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[13.5px] font-semibold">{a.productName}</p>
                      <p className="text-xs text-taupe">{a.outletName}</p>
                    </div>
                    <span className={`badge ${bad ? "badge-bad" : "badge-warn"}`}>
                      {bad ? "HABIS" : `${a.quantity} unit`}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Outlet sales */}
        <section className="panel p-5 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-[15px] font-semibold">Jualan per Cawangan - Hari Ini</h2>
            <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-taupe-faint">
              Semua cawangan
            </span>
          </div>
          <div className="flex flex-col gap-3.5">
            {outletSales.map((o) => {
              const pct = Math.round((o.amount / maxOutlet) * 100);
              return (
                <div key={o.outletId} className="flex items-center gap-3">
                  <span className="w-[92px] shrink-0 text-[13px] font-semibold">{o.outletName}</span>
                  <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-surface-2">
                    <div className="h-full rounded-full bg-accent" style={{ width: `${Math.max(pct, 4)}%`, opacity: pct === 100 ? 1 : 0.55 }} />
                  </div>
                  <span className="w-[88px] shrink-0 text-right font-mono text-xs font-semibold tabular-nums">
                    {rm(o.amount)}
                  </span>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </>
  );
}
