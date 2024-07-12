import { boolean, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { stores } from "./stores";

export const orders = pgTable('orders', {
    id: uuid('id').primaryKey().defaultRandom(),
    storeId: uuid('storeId').references(() => stores.id).notNull(),
    isPaid: boolean('isPaid').default(false),
    phone: text('phone').default(''),
    address: text('address').default(''),
    createdAt: timestamp('createdAt').defaultNow(),
});