import { Coffee } from "@phosphor-icons/react/dist/ssr";

export function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <div
        className="grid place-items-center rounded-xl bg-accent text-surface"
        style={{ width: compact ? 34 : 40, height: compact ? 34 : 40 }}
      >
        <Coffee size={compact ? 18 : 22} weight="fill" />
      </div>
      <div>
        <div className="text-[17px] font-bold tracking-wide leading-none" style={compact ? { fontSize: 16 } : undefined}>
          KOPI SENJA
        </div>
        <div className="mt-1 font-mono text-[9px] uppercase tracking-[0.14em] text-taupe-faint">
          Ops Dashboard
        </div>
      </div>
    </div>
  );
}
