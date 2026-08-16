import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { hashPassword } from "better-auth/crypto";
import {
  FALLBACK_OUTLETS,
  FALLBACK_PRODUCTS,
  FALLBACK_STOCKS,
  FALLBACK_SALES,
} from "../src/lib/fallback-data";

const connectionString = process.env.DATABASE_URL!;
const db = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });

async function main() {
  // Idempotent: delete ikut urutan FK
  await db.saleItem.deleteMany();
  await db.sale.deleteMany();
  await db.stock.deleteMany();
  await db.product.deleteMany();
  await db.outlet.deleteMany();
  await db.session.deleteMany();
  await db.account.deleteMany();
  await db.user.deleteMany();
  await db.verification.deleteMany();

  // Users dengan role
  const users = [
    { name: "Aiman Mukhriz", email: "owner@kopisenja.my", role: "OWNER", password: "Demo123!" },
    { name: "Nadia Rahimi", email: "manager@kopisenja.my", role: "MANAGER", password: "Demo123!" },
    { name: "Faizal Omar", email: "staff@kopisenja.my", role: "STAFF", password: "Demo123!" },
  ];

  for (const u of users) {
    const hash = await hashPassword(u.password);
    const user = await db.user.create({
      data: { name: u.name, email: u.email, role: u.role },
    });
    await db.account.create({
      data: { userId: user.id, accountId: user.id, providerId: "credential", password: hash },
    });
    console.log(`user: ${u.email} (${u.role})`);
  }

  // Outlets
  const outletIds = new Map<string, string>();
  for (const o of FALLBACK_OUTLETS) {
    const created = await db.outlet.create({
      data: { name: o.name, slug: o.slug, address: o.address, city: o.city },
    });
    outletIds.set(o.id, created.id);
  }

  // Products
  const productIds = new Map<string, string>();
  for (const p of FALLBACK_PRODUCTS) {
    const created = await db.product.create({
      data: { name: p.name, sku: p.sku, unit: p.unit, reorderLevel: p.reorderLevel },
    });
    productIds.set(p.id, created.id);
  }

  // Stocks
  for (const s of FALLBACK_STOCKS) {
    await db.stock.create({
      data: {
        outletId: outletIds.get(s.outletId)!,
        productId: productIds.get(s.productId)!,
        quantity: s.quantity,
      },
    });
  }

  // Sales 7 hari (dari fallback)
  for (const s of FALLBACK_SALES) {
    await db.sale.create({
      data: {
        outletId: outletIds.get(s.outletId)!,
        totalAmount: s.totalAmount,
        itemCount: s.itemCount,
        soldAt: new Date(`${s.date}T10:00:00.000Z`),
      },
    });
  }

  console.log(
    `seed selesai: ${users.length} users, ${FALLBACK_OUTLETS.length} outlets, ${FALLBACK_PRODUCTS.length} products, ${FALLBACK_STOCKS.length} stocks, ${FALLBACK_SALES.length} sales`
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
