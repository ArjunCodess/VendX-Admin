import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { stores } from "./stores";
import { billboards } from "./billboards";

export const categories = pgTable('categories', {
    id: uuid('id').primaryKey().defaultRandom(),
    storeId: uuid('storeId').references(() => stores.id).notNull(),
    billboardId: uuid('billboardId').references(() => billboards.id).notNull(),
    name: text('name').notNull(),
    createdAt: timestamp('createdAt').defaultNow(),
});