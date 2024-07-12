import { pgTable, uuid } from "drizzle-orm/pg-core";
import { orders } from "./orders";
import { products } from "./products";

export const orderItems = pgTable('order_items', {
    id: uuid('id').primaryKey().defaultRandom(),
    orderId: uuid('orderId').references(() => orders.id).notNull(),
    productId: uuid('productId').references(() => products.id).notNull(),
});