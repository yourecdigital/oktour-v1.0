import 'dotenv/config';
import dotenvExpand from 'dotenv-expand';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import mysql from 'mysql2/promise';
import pMap from 'p-map';
import cliProgress from 'cli-progress';
import { randomUUID } from 'node:crypto';

dotenvExpand.expand({ parsed: process.env as any });

async function main() {
  const mariaUrl = process.env.DATABASE_URL as string;
  if (!mariaUrl) throw new Error('DATABASE_URL is required');

  // Open both SQLite DBs
  const sqliteMain = await open({ filename: './database.sqlite', driver: sqlite3.Database });
  const sqliteServer = await open({ filename: './server/database.sqlite', driver: sqlite3.Database });

  // Connect MariaDB
  const maria = await mysql.createConnection(mariaUrl);

  // Helper to migrate a table
  async function migrateTable<T = any>(name: string, rows: T[], insertSql: string, mapRow: (r: T) => any[]) {
    if (!rows.length) return;
    const bar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
    bar.start(rows.length, 0);
    await pMap(rows, async (row) => {
      await maria.execute(insertSql, mapRow(row));
      bar.increment();
    }, { concurrency: 10 });
    bar.stop();
  }

  // Users
  const users = await sqliteServer.all<any[]>('SELECT * FROM users');
  await migrateTable('users', users,
    'INSERT INTO User (uuid, email, passwordHash, name, phone, bonusPoints, role, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    (u: any) => [randomUUID(), u.email, u.password, u.name, u.phone ?? null, u.bonus_points ?? 0, 'CUSTOMER', new Date(u.created_at ?? Date.now())]
  );

  // Tours
  const tours = await sqliteServer.all<any[]>('SELECT * FROM tours');
  await migrateTable('tours', tours,
    'INSERT INTO Tour (uuid, locale, slug, name, description, descriptionI18n, price, duration, destination, city, category, tour_type, image_url, available, meta) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    (t: any) => [
      randomUUID(), 'ru', slugify(t.name), t.name, t.description ?? null, null,
      toDecimal(t.price), t.duration ?? null, t.destination ?? null, t.city ?? null,
      t.category ?? 'Общие туры', t.tour_type ?? null, t.image_url ?? null, toBool(t.available), null
    ]
  );

  // Hotels
  const hotels = await sqliteServer.all<any[]>('SELECT * FROM hotels');
  await migrateTable('hotels', hotels,
    'INSERT INTO Hotel (uuid, name, description, price, location, stars, category, city, image_url, available, meta) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    (h: any) => [
      randomUUID(), h.name, h.description ?? null, toDecimal(h.price), h.location ?? null, h.stars ?? null,
      h.category ?? 'Общие отели', h.city ?? null, h.image_url ?? null, toBool(h.available), null
    ]
  );

  // Foreign Tours
  const foreignTours = await sqliteServer.all<any[]>('SELECT * FROM foreign_tours');
  await migrateTable('foreign_tours', foreignTours,
    'INSERT INTO ForeignTour (uuid, name, description, price, country, duration, highlights, tour_type, category, image_url, available, meta) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    (f: any) => [
      randomUUID(), f.name, f.description ?? null, toDecimal(f.price), f.country ?? null, f.duration ?? null,
      tryJson(f.highlights), f.tour_type ?? null, f.category ?? 'Общие зарубежные туры', f.image_url ?? null, toBool(f.available), null
    ]
  );

  // Cruises
  const cruises = await sqliteServer.all<any[]>('SELECT * FROM cruises');
  await migrateTable('cruises', cruises,
    'INSERT INTO Cruise (uuid, name, description, price, departure, duration, destination, category, image_url, available, meta) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    (c: any) => [
      randomUUID(), c.name, c.description ?? null, toDecimal(c.price), c.departure ?? null, c.duration ?? null,
      c.destination ?? null, c.category ?? 'Общие круизы', c.image_url ?? null, toBool(c.available), null
    ]
  );

  // Services
  const services = await sqliteServer.all<any[]>('SELECT * FROM services');
  await migrateTable('services', services,
    'INSERT INTO Service (uuid, name, description, price, category, image_url, available, meta) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    (s: any) => [
      randomUUID(), s.name, s.description ?? null, toDecimal(s.price), s.category ?? 'Общие услуги', s.image_url ?? null, toBool(s.available), null
    ]
  );

  // Promotions
  const promotions = await sqliteServer.all<any[]>('SELECT * FROM promotions');
  await migrateTable('promotions', promotions,
    'INSERT INTO Promotion (uuid, title, description, discount_percent, valid_until, category, image_url, active) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    (p: any) => [
      randomUUID(), p.title, p.description ?? null, p.discount_percent ?? null, toDate(p.valid_until), p.category ?? 'Общие акции', p.image_url ?? null, toBool(p.active)
    ]
  );

  // Hero backgrounds
  const backgrounds = await sqliteServer.all<any[]>('SELECT * FROM hero_backgrounds');
  await migrateTable('hero_backgrounds', backgrounds,
    'INSERT INTO HeroBackground (page_name, background_image_url, background_type, fallback_image_url, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)',
    (b: any) => [b.page_name, b.background_image_url ?? null, b.background_type ?? 'image', b.fallback_image_url ?? null, toDate(b.created_at), toDate(b.updated_at)]
  );

  // Orders and related
  const orders = await sqliteServer.all<any[]>('SELECT * FROM orders');
  await migrateTable('orders', orders,
    'INSERT INTO `Order` (userId, total_amount, status, created_at) VALUES (?, ?, ?, ?)',
    (o: any) => [o.user_id, toDecimal(o.total_amount), o.status ?? 'pending', toDate(o.created_at)]
  );

  const orderItems = await sqliteServer.all<any[]>('SELECT * FROM order_items');
  await migrateTable('order_items', orderItems,
    'INSERT INTO OrderItem (orderId, itemId, itemType, quantity, price) VALUES (?, ?, ?, ?, ?)',
    (oi: any) => [oi.order_id, oi.item_id, oi.item_type, oi.quantity, toDecimal(oi.price)]
  );

  // Cart
  const cart = await sqliteServer.all<any[]>('SELECT * FROM cart');
  await migrateTable('cart', cart,
    'INSERT INTO CartItem (userId, itemId, itemType, name, description, price, quantity, added_at, duration, destination, capacity, features, country, highlights, departure, category) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    (ci: any) => [
      ci.user_id, ci.item_id, ci.item_type, ci.name, ci.description ?? null, toDecimal(ci.price), ci.quantity ?? 1,
      toDate(ci.added_at), ci.duration ?? null, ci.destination ?? null, ci.capacity ?? null, tryJson(ci.features),
      ci.country ?? null, tryJson(ci.highlights), ci.departure ?? null, ci.category ?? null
    ]
  );

  // Bonus history
  const bonus = await sqliteServer.all<any[]>('SELECT * FROM bonus_history');
  await migrateTable('bonus_history', bonus,
    'INSERT INTO BonusHistory (userId, points, type, reason, created_at) VALUES (?, ?, ?, ?, ?)',
    (bh: any) => [bh.user_id, bh.points, bh.type, bh.reason ?? null, toDate(bh.created_at)]
  );

  // TODO: add other tables: tours, hotels, foreign_tours, cruises, services, promotions, bonus_history, hero_backgrounds, cart, orders, order_items

  await maria.end();
  await sqliteMain.close();
  await sqliteServer.close();
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});

function toDecimal(n: any) {
  if (n == null) return null;
  return Number(n);
}

function toBool(v: any) {
  if (v == null) return true;
  return v === 1 || v === true;
}

function toDate(v: any) {
  if (!v) return null;
  const d = new Date(v);
  return isNaN(d.getTime()) ? null : d;
}

function tryJson(v: any) {
  if (!v) return null;
  try { return JSON.parse(v); } catch { return null; }
}

function slugify(s: string) {
  return (s || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}


