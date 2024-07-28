import { format } from 'date-fns';
import { OrderClient } from './components/client';
import { OrderColumn } from './components/columns';
import { formatter } from '@/lib/utils';
import db from '@/db/drizzle';
import { desc, eq } from 'drizzle-orm';
import { orders, orderItems, products, colors, sizes } from '@/db/schema';

const OrdersPage = async ({ params }: { params: { storeId: string } }) => {
    const fetchedOrders = await db
        .select({
            id: orders.id,
            phone: orders.phone,
            address: orders.address,
            createdAt: orders.createdAt,
            isPaid: orders.isPaid,
            productId: products.id,
            productName: products.name,
            productPrice: products.price,
            colorName: colors.name,
            sizeName: sizes.name,
        })
        .from(orders)
        .leftJoin(orderItems, eq(orderItems.orderId, orders.id))
        .leftJoin(products, eq(orderItems.productId, products.id))
        .leftJoin(colors, eq(products.colorId, colors.id))
        .leftJoin(sizes, eq(products.sizeId, sizes.id))
        .where(eq(orders.storeId, params.storeId))
        .orderBy(desc(orders.createdAt))
        .execute();

    const ordersGroupedById = fetchedOrders.reduce<Record<string, any>>((acc, item) => {
        if (!acc[item.id]) {
            acc[item.id] = {
                id: item.id,
                phone: item.phone,
                address: item.address,
                isPaid: item.isPaid,
                createdAt: item.createdAt,
                products: [],
            };
        }

        acc[item.id].products.push({
            productId: item.productId,
            productName: `${item.productName}(${item.colorName}, ${item.sizeName})`,
            productPrice: item.productPrice,
        });

        return acc;
    }, {});

    const formattedOrders: OrderColumn[] = Object.values(ordersGroupedById).map((order: any) => ({
        id: order.id,
        phone: order.phone,
        address: order.address,
        products: order.products.map((product: any) => product.productName).join(', '),
        totalPrice: formatter.format(
            order.products.reduce((total: number, product: any) => total + Number(product.productPrice), 0)
        ),
        isPaid: order.isPaid,
        createdAt: format(order.createdAt!, "MMMM do, yyyy"),
    }));

    return (
        <div className="flex-col">
            <div className="flex-1 p-8 pt-6 space-y-4">
                <OrderClient data={formattedOrders} />
            </div>
        </div>
    );
};

export default OrdersPage;