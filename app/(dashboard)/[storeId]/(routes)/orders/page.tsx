import { format } from 'date-fns';
import { OrderClient } from './components/client';
import { OrderColumn } from './components/columns';
import { formatter } from '@/lib/utils';
import db from '@/db/drizzle';
import { desc, eq } from 'drizzle-orm';
import { orders, orderItems, products } from '@/db/schema';

const OrdersPage = async ({ params }: { params: { storeId: string } }) => {
    const fetchedOrders: any = await db
        .select()
        .from(orders)
        .where(eq(orders.storeId, params.storeId))
        .orderBy(desc(orders.createdAt));

    const formattedOrders: OrderColumn[] = fetchedOrders.map((item: any) => ({
        id: item.id,
        phone: item.phone,
        address: item.address,
        products: item.orderItems.map((orderItem: typeof orderItems) => orderItem.productId).join(', '),
        totalPrice: formatter.format(item.orderItems.reduce((total: any, item: any) => total + Number(item.product.price), 0)),
        isPaid: item.isPaid,
        createdAt: format(item.createdAt!, "MMMM do, yyyy"),
    }));

    return (
        <div className="flex-col">
            <div className="flex-1 p-8 pt-6 space-y-4">
                <OrderClient data={formattedOrders} />
            </div>
        </div>
    );
}

export default OrdersPage;