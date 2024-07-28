import db from "@/db/drizzle";
import { orders } from "@/db/schema";
import { eq, sql } from "drizzle-orm";

export const getSalesCount = async (storeId: string): Promise<number> => {
    const [{ count }] = await db
        .select({ count: sql<number>`count(*)` })
        .from(orders)
        .where(eq(orders.storeId, storeId))
        .execute();

    return count;
}