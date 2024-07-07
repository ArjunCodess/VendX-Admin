import { pgTable, text, uuid, timestamp, decimal, boolean } from 'drizzle-orm/pg-core';

export const stores = pgTable('stores', {
    id: uuid('id').primaryKey().defaultRandom(),
    name: text('name').notNull(),
    userId: text('userId').notNull(),
    createdAt: timestamp('createdAt').defaultNow(),
});

export const billboards = pgTable('billboards', {
    id: uuid('id').primaryKey().defaultRandom(),
    storeId: uuid('storeId').references(() => stores.id).notNull(),
    label: text('label').notNull(),
    imageUrl: text('imageUrl').notNull(),
    createdAt: timestamp('createdAt').defaultNow(),
});

export const categories = pgTable('categories', {
    id: uuid('id').primaryKey().defaultRandom(),
    storeId: uuid('storeId').references(() => stores.id).notNull(),
    billboardId: uuid('billboardId').references(() => billboards.id).notNull(),
    name: text('name').notNull(),
    createdAt: timestamp('createdAt').defaultNow(),
});

// export const products = pgTable('products', {
//     id: uuid('id').primaryKey().defaultRandom(),
//     storeId: uuid('storeId').references(() => stores.id).notNull(),
//     categoryId: uuid('categoryId').references(() => categories.id).notNull(),
//     name: text('name').notNull(),
//     price: decimal('price').notNull(),
//     isFeatured: boolean('isFeatured').default(false),
//     isArchived: boolean('isArchived').default(false),
//     sizeId: uuid('sizeId').references(() => sizes.id).notNull(),
//     colorId: uuid('colorId').references(() => colors.id).notNull(),
//     createdAt: timestamp('createdAt').defaultNow(),
// });

export const orders = pgTable('orders', {
    id: uuid('id').primaryKey().defaultRandom(),
    storeId: uuid('storeId').references(() => stores.id).notNull(),
    isPaid: boolean('isPaid').default(false),
    phone: text('phone').default(''),
    address: text('address').default(''),
    createdAt: timestamp('createdAt').defaultNow(),
});

export const orderItems = pgTable('order_items', {
    id: uuid('id').primaryKey().defaultRandom(),
    orderId: uuid('orderId').references(() => orders.id).notNull(),
    productId: uuid('productId').references(() => products.id).notNull(),
});

export const sizes = pgTable('sizes', {
    id: uuid('id').primaryKey().defaultRandom(),
    storeId: uuid('storeId').references(() => stores.id).notNull(),
    name: text('name').notNull(),
    value: text('value').notNull(),
    createdAt: timestamp('createdAt').defaultNow(),
});

export const colors = pgTable('colors', {
    id: uuid('id').primaryKey().defaultRandom(),
    storeId: uuid('storeId').references(() => stores.id).notNull(),
    name: text('name').notNull(),
    value: text('value').notNull(),
    createdAt: timestamp('createdAt').defaultNow(),
});

export const images = pgTable('images', {
    id: uuid('id').primaryKey().defaultRandom(),
    productId: uuid('productId').references(() => products.id).notNull(),
    url: text('url').notNull(),
    createdAt: timestamp('createdAt').defaultNow(),
});

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