import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { stores } from "./stores";

export const billboards = pgTable('billboards', {
    id: uuid('id').primaryKey().defaultRandom(),
    storeId: uuid('storeId').references(() => stores.id).notNull(),
    label: text('label').notNull(),
    imageUrl: text('imageUrl').notNull(),
    createdAt: timestamp('createdAt').defaultNow(),
});