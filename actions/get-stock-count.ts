import db from "@/db/drizzle";
import { products } from "@/db/schema";
import { eq, and, sql } from "drizzle-orm";

export const getStockCount = async (storeId: string): Promise<number> => {
    const [{ count }] = await db
        .select({ count: sql<number>`count(*)` })
        .from(products)
        .where(
            and(
                eq(products.storeId, storeId),
            )
        )
        .execute();

    return count;
}