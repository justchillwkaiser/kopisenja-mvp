# Kopi Senja - Warm Coffee Candidate (Mockup)

Design layout mockup untuk **KOPI SENJA Ops Dashboard** (F&B coffee chain, 3 cawangan, role-based).

## Design Read

> Reading this as: F&B operations dashboard for a Malaysian coffee chain owner/manager/staff,
> with a warm soft-luxury language (cream + taupe + espresso), leaning toward custom utility
> styling + warm neutrals + restrained motion.

Palet dipilih oleh Haris (stance B) dan sesuai untuk brand kopi: cream hangat, taupe, espresso.
Bukan default beige+brass AI-slop - accent sengaja di-desaturate ke arah "roasted coffee" (#7a4a2b),
bukan brass/ochre terang. Status guna sage (ok), amber (rendah), terracotta (habis) dengan text gelap
pada pastel bg (bukan warna sahaja).

## Dials

- `DESIGN_VARIANCE: 5` - struktur jelas, sidebar floating, KPI strip (bukan 4 kad sama)
- `MOTION_INTENSITY: 3` - hover/active/toast sahaja, tiada animasi berat (dashboard = fokus data)
- `VISUAL_DENSITY: 5` - daily app density, selesa dibaca

## Screens

1. **Login** - brand mark + form + demo role (Owner/Manager/Staff) + error state
2. **Ringkasan** - KPI strip (jualan hari/minggu, pesanan, stok rendah), bar chart 7 hari, alert list, jualan per cawangan
3. **Stok** - table + filter tabs (Semua/Rendah/Habis) + stock bar + badge status + empty state
4. **Cawangan** - 3 outlet cards (Ipoh/Taiping/Sitiawan - lokasi Perak)
5. **Laporan** - placeholder preview (mock)

## Layout Decisions

- **Floating sidebar** (desktop) - konsisten dengan soft-flow yang disahkan (Biz Dashboard)
- **Bottom sheet nav** (mobile) - sama pattern soft-flow
- **KPI strip** dengan hairline dividers, bukan 4 kad sama rata
- **Shape system**: panel 16px, controls 10px, badge pill (didokumen)
- **Fonts**: Outfit (display+body, bukan Inter) + IBM Plex Mono (label/metadata)
- **Icons**: Phosphor (satu famili)
- **Bahasa**: BM (konsisten dengan konvensyen project Haris)
- **Mock data**: nama/barang/cawangan Malaysia (Perak: Ipoh, Taiping, Sitiawan)

## Pre-flight Notes

- ZERO em-dash (guna hyphen)
- Button contrast: primary = espresso #2b211a + cream text (~11:1, lulus AA)
- Status = text + warna, bukan warna sahaja
- Mock labels jelas (login error, toast, empty state)
- Print view: tak relevan untuk dashboard ops (skip)
- Mobile: KPI 2x2, table scroll-x, bottom sheet nav

## Verification

- [ ] Static: em-dash 0, JS syntax, ID/handler consistency
- [ ] Browser: desktop render + mobile render + flow (login -> dashboard -> stok -> filter)
