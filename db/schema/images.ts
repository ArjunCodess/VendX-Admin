import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { products } from "./products";

export const images = pgTable('images', {
    id: uuid('id').primaryKey().defaultRandom(),
    productId: uuid('productId').references(() => products.id).notNull(),
    url: text('url').notNull(),
    createdAt: timestamp('createdAt').defaultNow(),
});