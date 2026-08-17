# KOPI SENJA · Buku Tunai / Ledger — design candidate

Draft design direction (world baru, ganti Warm Coffee). Dipilih melalui
impeccable concept-seed (safer register, seed 9e10abf6) selepas reroll.

## Design Read

Dashboard operasi F&B sebagai buku tunai kedai - jujur, familiar, tidak
menjerit. Setiap angka adalah entri ledger yang boleh dipercayai. Satu-satunya
"glow" ialah stamp status (Baru/Diproses/Siap/Batal).

## Dials

- VARIANCE: sederhana (paper ledger bukan SaaS standard; struktur lajur yang
  familiar untuk F&B)
- MOTION: minimal (hover, stamp; tiada animasi menjerit)
- DENSITY: sederhana (sheet yang luas, entri yang jelas)

## Own World

- Kertas ledger off-white (#f6f2e9) + dot grid halus (kertas)
- Ink hijau tua (banker's green #1e3a2d) sebagai warna utama
- Ruled lines (#d8d2c4) sebagai pemisah - bukan shadow
- Stamp merah (#a32f24) untuk status; accent tembaga (#b07a2e)
- Font: Fraunces (serif masthead/angka besar) + Space Mono (entri/label)

## Screens

1. Login - emel + role select (owner/manager/staff)
2. Paparan Utama - Buku Harian: Jumlah Hari Ini (4 entri), Order Queue
   (lajur berjalan + stamp), Stok rendah, Buku Cabang A/B/C
3. Stok - Buku Inventori (edge-table, sticky first col)
4. Cawangan - Buku Cabang
5. Laporan - Rekod 7 Hari + Teratas Produk

## Pre-flight Notes

- UI Bahasa Melayu; 0 em-dash (verified)
- Print view A4 putih (client documents)
- Mobile: bottom nav, ledger 2-col, order row stack, stok sticky table
- Verified: desktop + mobile 390px + flow login/nav (browser)
