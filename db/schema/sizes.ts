import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { stores } from "./stores";

export const sizes = pgTable('sizes', {
    id: uuid('id').primaryKey().defaultRandom(),
    storeId: uuid('storeId').references(() => stores.id).notNull(),
    name: text('name').notNull(),
    value: text('value').notNull(),
    createdAt: timestamp('createdAt').defaultNow(),
});