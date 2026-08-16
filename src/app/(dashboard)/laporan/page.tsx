import { FileText } from "@phosphor-icons/react/dist/ssr";

export default function ReportsPage() {
  return (
    <>
      <header className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Laporan</h1>
        <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.1em] text-taupe-faint">
          Mingguan & bulanan
        </p>
      </header>

      <section className="panel p-6">
        <div className="mb-4 flex items-center gap-2.5">
          <div className="grid h-9 w-9 place-items-center rounded-[10px] bg-accent-soft text-accent">
            <FileText size={18} />
          </div>
          <div>
            <h2 className="text-[15px] font-semibold">Laporan Mingguan</h2>
            <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-taupe-faint">
              Dijana automatik
            </p>
          </div>
        </div>
        <p className="max-w-[60ch] text-sm leading-relaxed text-taupe">
          Laporan jualan mingguan dijana automatik setiap Isnin dan dihantar ke emel owner.
          Termasuk jualan per cawangan, produk terlaris, dan senarai stok perlu reorder.
        </p>
        <p className="mt-3 text-[13px] font-medium text-accent">
          Fasa seterusnya - modul laporan penuh dalam pembangunan.
        </p>
      </section>
    </>
  );
}
