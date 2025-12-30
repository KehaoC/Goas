import { pgTable, uuid, varchar, text, timestamp, jsonb, integer, date } from "drizzle-orm/pg-core";

export const cards = pgTable("cards", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content").notNull(),
  sourceAgent: varchar("source_agent", { length: 100 }).notNull(),
  imageUrl: text("image_url"),
  metadata: jsonb("metadata").default({}),
  userId: uuid("user_id"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const hotspots = pgTable("hotspots", {
  id: uuid("id").primaryKey().defaultRandom(),
  category: varchar("category", { length: 50 }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  imageUrl: text("image_url"),
  sourceUrl: text("source_url"),
  heatScore: integer("heat_score").default(0),
  metadata: jsonb("metadata").default({}),
  date: date("date").defaultNow(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const threads = pgTable("threads", {
  id: uuid("id").primaryKey().defaultRandom(),
  agentId: varchar("agent_id", { length: 100 }).notNull(),
  title: varchar("title", { length: 255 }),
  contextKey: varchar("context_key", { length: 255 }).notNull(),
  userId: uuid("user_id"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export type Card = typeof cards.$inferSelect;
export type NewCard = typeof cards.$inferInsert;
export type Hotspot = typeof hotspots.$inferSelect;
export type Thread = typeof threads.$inferSelect;
