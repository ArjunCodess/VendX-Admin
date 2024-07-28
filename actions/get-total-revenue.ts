import db from "@/db/drizzle";
import { orders, orderItems, products } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export const getTotalRevenue = async (storeId: string) => {
    const paidOrders = await db
        .select({
            orderId: orders.id,
            productId: products.id,
            productPrice: products.price,
        })
        .from(orders)
        .leftJoin(orderItems, eq(orderItems.orderId, orders.id))
        .leftJoin(products, eq(orderItems.productId, products.id))
        .where(and(eq(orders.storeId, storeId)))
        .execute();

    const totalRevenue = paidOrders.reduce((total, order) => {
        return total + Number(order.productPrice);
    }, 0);

    return totalRevenue;
};