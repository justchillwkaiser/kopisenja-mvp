"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "@phosphor-icons/react";
import { BrandMark } from "@/components/brand-mark";
import { authClient } from "@/lib/auth-client";

const DEMO = {
  owner: { email: "owner@kopisenja.my", label: "Owner" },
  manager: { email: "manager@kopisenja.my", label: "Manager" },
  staff: { email: "staff@kopisenja.my", label: "Staff" },
} as const;

const PASSWORD = "Demo123!";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("owner@kopisenja.my");
  const [password, setPassword] = useState(PASSWORD);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function doSignIn(em: string, pw: string) {
    setBusy(true);
    setError(null);
    const { error: signInError } = await authClient.signIn.email({ email: em, password: pw });
    if (signInError) {
      setError("Kata laluan tidak tepat atau akaun tidak dijumpai.");
      setBusy(false);
      return;
    }
    router.push("/");
    router.refresh();
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    void doSignIn(email, password);
  }

  function demo(role: keyof typeof DEMO) {
    void doSignIn(DEMO[role].email, PASSWORD);
  }

  return (
    <main className="grid min-h-dvh place-items-center p-6">
      <div className="w-full max-w-[420px] rounded-[20px] border border-line bg-surface p-8 shadow-soft sm:p-9">
        <div className="mb-7">
          <BrandMark />
        </div>
        <h1 className="text-[26px] font-semibold tracking-tight">Selamat kembali.</h1>
        <p className="mt-1.5 text-sm leading-relaxed text-taupe">
          Log masuk untuk lihat jualan, stok, dan laporan cawangan dalam satu tempat.
        </p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div className="field">
            <label htmlFor="email">Emel</label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              inputMode="email"
              spellCheck={false}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nama@kopisenja.my"
              required
            />
          </div>
          <div className="field">
            <label htmlFor="password">Kata laluan</label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Kata laluan"
              required
            />
            {error && (
              <p role="alert" className="text-[12.5px] text-bad">
                {error}
              </p>
            )}
          </div>
          <button type="submit" className="btn btn-primary btn-block" disabled={busy}>
            {busy ? "Memproses…" : "Log Masuk"}
            {!busy && <ArrowRight size={16} />}
          </button>
        </form>

        <div className="mt-6 border-t border-dashed border-line pt-5">
          <p className="mb-2.5 font-mono text-[10px] uppercase tracking-[0.12em] text-taupe-faint">
            Demo - masuk terus sebagai role
          </p>
          <div className="grid grid-cols-3 gap-2">
            {(Object.keys(DEMO) as (keyof typeof DEMO)[]).map((role) => (
              <button
                key={role}
                onClick={() => demo(role)}
                disabled={busy}
                className="btn btn-soft px-2 py-2.5 text-[12.5px] font-semibold disabled:opacity-50"
              >
                {DEMO[role].label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
