import { boolean, decimal, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { stores } from "./stores";
import { categories } from "./categories";
import { sizes } from "./sizes";
import { colors } from "./colors";

export const products = pgTable('products', {
    id: uuid('id').primaryKey().defaultRandom(),
    storeId: uuid('storeId').references(() => stores.id).notNull(),
    categoryId: uuid('categoryId').references(() => categories.id).notNull(),
    name: text('name').notNull(),
    price: decimal('price').notNull(),
    isFeatured: boolean('isFeatured').default(false),
    isArchived: boolean('isArchived').default(false),
    sizeId: uuid('sizeId').references(() => sizes.id).notNull(),
    colorId: uuid('colorId').references(() => colors.id).notNull(),
    createdAt: timestamp('createdAt').defaultNow(),
});