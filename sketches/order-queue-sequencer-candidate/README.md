# KOPI SENJA · Order Queue Sequencer — design candidate

Draft design direction (world baru, ganti Warm Coffee). Dipilih melalui
impeccable concept-seed (Operate mode, seed 9e10abf6) dengan fusion
drum-machine step row -> order queue rail.

## Design Read

Dashboard operasi F&B yang berdegup seperti mesin rhythm. Status order tidak
perlu dibaca - boleh dilihat dari jauh (peripheral glance). Menolak default
dashboard SaaS generic (cards-in-cards, Inter, purple/blue gradient).

## Dials

- VARIANCE: tinggi (bukan susunan dashboard standard; sequencer rail sebagai
  elemen utama, bukan grid 4-equal-stat-cards)
- MOTION: chase light scan merentas rail + LED blink (satu-satunya glow)
- DENSITY: sederhana-tinggi (panel padat tapi berskala)

## Own World

- Charcoal panel ground (#191c21 / #21252b / #2a2f37)
- Step keys warna status: hijau BARU, amber DIPROSES, putih SIAP, merah BATAL
- Lit LED sebagai satu-satunya glow; silkscreen white mono labels
- Font: Space Mono (labels/angka) + Space Grotesk (body)
- Tempo readout 7-seg style untuk KPI (jualan, order, masa, stok)

## Screens

1. Login - emel + role select (owner/manager/staff)
2. Paparan Utama - KPI tempo strip, Order Queue Rail 16 (chase light),
   Stok rendah + Cawangan pattern banks
3. Stok - edge-table (sticky first col, horizontal scroll) + tabs
4. Cawangan - pattern banks A/B/C
5. Laporan - bar chart 7 hari + top products

## Pre-flight Notes

- UI Bahasa Melayu; 0 em-dash (verified)
- Print view A4 white (client documents) - app shell dark, print putih
- Mobile: bottom nav, KPI 2-col, rail horizontal scroll, stok sticky table
- Verified: desktop + mobile 390px + flow login/nav (browser)
