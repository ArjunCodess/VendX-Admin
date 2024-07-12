import { pgTable, text, uuid, timestamp } from 'drizzle-orm/pg-core';

export const stores = pgTable('stores', {
    id: uuid('id').primaryKey().defaultRandom(),
    name: text('name').notNull(),
    userId: text('userId').notNull(),
    createdAt: timestamp('createdAt').defaultNow(),
});