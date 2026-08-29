import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { nanoid } from "nanoid";

/**
 * Data access layer.
 *
 * The store is an abstraction over persistence. By default it uses a
 * JSON-file-backed store that works locally and in serverless preview.
 * To move to Postgres in production, swap the implementation behind
 * this same interface (a `prisma/schema.prisma` file describes the
 * full relational model and `lib/db/pg.ts` is a drop-in adapter).
 */

export const DATA_DIR =
  process.env.DATA_DIR ?? (process.env.NODE_ENV === "production" ? "/tmp" : ".data");

let dbCache: Database | null = null;

export interface Database {
  version: 1;
  users: Record<string, unknown>;
  startups: unknown[];
  profiles: unknown[];
  blueprints: unknown[];
  personas: unknown[];
  competitors: unknown[];
  market: unknown[];
  features: unknown[];
  userStories: unknown[];
  mvps: unknown[];
  businessModels: unknown[];
  productVisions: unknown[];
  technical: unknown[];
  roadmaps: unknown[];
  marketing: unknown[];
  launches: unknown[];
  assessments: unknown[];
  conversations: unknown[];
  generations: unknown[];
  documents: unknown[];
  subscriptions: unknown[];
  collections: Record<string, unknown[]>;
}

function emptyDb(): Database {
  return {
    version: 1,
    users: {},
    startups: [],
    profiles: [],
    blueprints: [],
    personas: [],
    competitors: [],
    market: [],
    features: [],
    userStories: [],
    mvps: [],
    businessModels: [],
    productVisions: [],
    technical: [],
    roadmaps: [],
    marketing: [],
    launches: [],
    assessments: [],
    conversations: [],
    generations: [],
    documents: [],
    subscriptions: [],
    collections: {
      users: [],
      startups: [],
      profiles: [],
      blueprints: [],
      personas: [],
      competitors: [],
      market: [],
      features: [],
      userStories: [],
      mvps: [],
      businessModels: [],
      productVisions: [],
      technical: [],
      roadmaps: [],
      marketing: [],
      launches: [],
      assessments: [],
      conversations: [],
      generations: [],
      documents: [],
      subscriptions: [],
    },
  };
}

export async function loadDb(): Promise<Database> {
  if (dbCache) return dbCache;
  const file = path.join(DATA_DIR, "forgeai.json");
  try {
    const raw = await readFile(file, "utf-8");
    const parsed = JSON.parse(raw) as Database;
    dbCache = { ...emptyDb(), ...parsed };
  } catch {
    dbCache = emptyDb();
    await persistDb(dbCache);
  }
  return dbCache;
}

export async function persistDb(db: Database): Promise<void> {
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(
    path.join(DATA_DIR, "forgeai.json"),
    JSON.stringify(db, null, 2),
    "utf-8"
  );
}

export async function resetDbCache(): Promise<void> {
  dbCache = null;
}

export function newId(prefix?: string): string {
  const id = nanoid(14);
  return prefix ? `${prefix}_${id}` : id;
}

export function now(): string {
  return new Date().toISOString();
}

/**
 * Generic id-keyed collection helper over the JSON store.
 *
 * The `WithId` widening lets records whose domain type has no `id`
 * (per-startup singletons like profile / blueprint / mvp) still flow
 * through the shared helpers; the store injects a synthetic id at write time.
 */
export type WithId<T> = T & { id: string };

export async function collectionOf<T>(key: string): Promise<WithId<T>[]> {
  const db = await loadDb();
  return (db.collections[key] as WithId<T>[]) ?? [];
}

export async function insertOne<T>(key: string, item: T): Promise<T> {
  const db = await loadDb();
  const col = (db.collections[key] as T[]) ?? (db.collections[key] = []);
  col.push(item);
  await persistDb(db);
  return item;
}

export async function updateOne<T>(
  key: string,
  id: string,
  patch: Partial<T>
): Promise<T | null> {
  const db = await loadDb();
  const col = (db.collections[key] as WithId<T>[]) ?? [];
  const idx = col.findIndex((it) => it.id === id);
  if (idx === -1) return null;
  col[idx] = { ...col[idx], ...patch } as WithId<T>;
  await persistDb(db);
  return col[idx] as T;
}

export async function deleteOne(key: string, id: string): Promise<boolean> {
  const db = await loadDb();
  const col = (db.collections[key] as { id: string }[]) ?? [];
  const before = col.length;
  db.collections[key] = col.filter((it) => it.id !== id);
  await persistDb(db);
  return col.length < before;
}

export async function replaceCollection<T>(
  key: string,
  items: T[]
): Promise<void> {
  const db = await loadDb();
  db.collections[key] = items;
  await persistDb(db);
}

export async function upsertOne<T>(
  key: string,
  item: T & { id: string }
): Promise<T> {
  const existing = await updateOne<T>(key, item.id, item);
  if (existing) return existing;
  return insertOne(key, item);
}