# KOPI SENJA Design System

## Arah diluluskan

**Kedai Kaca** (revamp 18 Ogos 2026). Dashboard berkelakuan seperti kaca kedai yang bersih: near-white, border halus, satu aksen kopi, data monospaced yang tepat. Grounded pada design system `linear-app` dari katalog (adaptasi light + aksen kopi, bukan indigo).

## Product mode

**Operate.** Pengguna sampai untuk menyelesaikan tugas atau buat keputusan. Scanability, konsistensi, dan data sebenar mengatasi ekspresi dekoratif. Brand hidup dalam detail presisi.

## Color

| Token | Value | Guna |
|---|---|---|
| Page ground | `#fcfcfd` | Latar utama, near-white sejuk-neutral |
| Surface | `#ffffff` | Panel/kad terangkat |
| Surface 2 | `#f4f5f8` | Kumpulan senyap, latar nav aktif, bar trek |
| Espresso | `#16171a` | Teks utama dan aksi utama (near-black neutral) |
| Taupe | `#5c5f66` | Teks sekunder boleh baca |
| Muted | `#8a8d94` | Label kecil, metadata |
| Border | `rgba(20,22,26,0.09)` | Border standard (halus, bukan garis keras) |
| Border soft | `rgba(20,22,26,0.055)` | Pembahagi dalam panel |
| Accent | `#7a5c3a` | Aksen kopi — CTA, aktif, penekanan |
| Accent soft | `#f3ede5` | Keadaan aktif lembut, latar bar carta |
| OK | `#3a8a5c` / bg `#e9f2ec` | Keadaan positif |
| Warn | `#9a6b2f` / bg `#f5ecdd` | Stok rendah |
| Bad | `#b0503f` / bg `#f6e7e2` | Kehabisan stok |

Nota: nilai lama Warm Coffee (cream `#f7f2ec` dsb.) diganti sepenuhnya — ini revamp, bukan penjelasan (refinement).

## Typography

- **Outfit** (kekal): paparan, navigasi, UI utama. Tracking ketat pada saiz paparan.
- **IBM Plex Mono** (kekal): wang, tarikh, kiraan, ID, label status.
- `tabular-nums` wajib pada semua lajur nombor dan KPI.
- Label mono kecil kekal uppercase + tracking 0.1em+.

## Shape, spacing, depth

- Radius panel: `12px`; kawalan: `8px`; tag: `999px` (pill).
- Shadow: berlapis lembut `0 1px 2px rgba(20,22,26,0.05), 0 4px 12px rgba(20,22,26,0.05)` — bukan bayangan beratWarm Coffee.
- Border halus + shadow bersama (Linear pattern), bukan border tebal `#e7ddd1`.
- KPI dalam jalur linear dengan pembahagi, bukan 4 kad terpisah — kekal dari struktur sedia ada.

## Shell

### Desktop

- **Navigasi atas** menggantikan sidebar terapung. Kiri: BrandMark. Tengah: nav pill segmented. Kanan: pengguna + role chip + log keluar.
- Nav aktif: latar Surface 2, teks Espresso, berat 550-600. Hover: latar Surface 2.
- Kandungan `max-w-[1180px]` berpusat, padding atas untuk nav melekit.

### Mobile

- **Nav atas kekal** (brand + avatar ringkas) — lebih ringkas daripada FAB + bottom sheet.
- Nav utama: bar tab mendatar boleh tatal di bawah top bar.
- Log keluar kekal boleh dicapai dari shell (FR-6).
- Bottom sheet lama dibuang; `overscroll-behavior` tidak lagi diperlukan untuk sheet tetapi kekal sebagai amalan baik pada scroller.

## States & interaction

- `:focus-visible` ring pada semua interaktif (a11y fix dari audit).
- `touch-action: manipulation` pada butang/tab.
- Penukaran penapis stok: `aria-live="polite"` pada kawasan keputusan.
- Pergerakan: transform/opacity sahaja, hormat `prefers-reduced-motion`.
- Butang log masuk: `Memproses…` (elipsis betul) semasa sibuk.

## Yang dikekalkan (bukan visual)

Auth Better Auth, laluan `/`, `/stok`, `/cawangan`, `/laporan`, `/log-masuk`, perkhidmatan + fallback data, Better Auth guard, label BM, Phosphor icons, tiada dependensi baharu.
