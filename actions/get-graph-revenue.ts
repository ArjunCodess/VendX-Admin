import db from "@/db/drizzle";
import { orders, orderItems, products } from "@/db/schema";
import { eq, and } from "drizzle-orm";

interface GraphData {
    name: string;
    total: number;
}

export const getGraphRevenue = async (storeId: string): Promise<GraphData[]> => {
    const paidOrders = await db
        .select({
            orderId: orders.id,
            productPrice: products.price,
            createdAt: orders.createdAt,
        })
        .from(orders)
        .leftJoin(orderItems, eq(orderItems.orderId, orders.id))
        .leftJoin(products, eq(orderItems.productId, products.id))
        .where(and(eq(orders.storeId, storeId)))
        .execute();

    const monthlyRevenue: { [key: number]: number } = Array(12).fill(0);

    for (const order of paidOrders) {
        const month = order.createdAt!.getMonth();
        monthlyRevenue[month] += parseFloat(order.productPrice as string);
    }

    const graphData: GraphData[] = [
        { name: 'Jan', total: monthlyRevenue[0] },
        { name: 'Feb', total: monthlyRevenue[1] },
        { name: 'Mar', total: monthlyRevenue[2] },
        { name: 'Apr', total: monthlyRevenue[3] },
        { name: 'May', total: monthlyRevenue[4] },
        { name: 'Jun', total: monthlyRevenue[5] },
        { name: 'Jul', total: monthlyRevenue[6] },
        { name: 'Aug', total: monthlyRevenue[7] },
        { name: 'Sep', total: monthlyRevenue[8] },
        { name: 'Oct', total: monthlyRevenue[9] },
        { name: 'Nov', total: monthlyRevenue[10] },
        { name: 'Dec', total: monthlyRevenue[11] }
    ];

    return graphData;
}