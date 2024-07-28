import db from "@/db/drizzle";
import { NextResponse } from "next/server";
import { orders, orderItems, products, colors, sizes } from "@/db/schema";
import { inArray, eq } from "drizzle-orm";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
    return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(req: Request, { params }: { params: { storeId: string } }) {
    try {
        const { productIds, phone, address } = await req.json();

        if (!productIds || productIds.length === 0) return new NextResponse("Product ids are required", { status: 400 });

        const productRecords = await db
            .select({
                productId: products.id,
                productName: products.name,
                colorName: colors.name,
                sizeName: sizes.name,
            })
            .from(products)
            .leftJoin(colors, eq(products.colorId, colors.id))
            .leftJoin(sizes, eq(products.sizeId, sizes.id))
            .where(inArray(products.id, productIds))
            .execute();

        if (productRecords.length === 0) return new NextResponse("No products found with the provided IDs", { status: 404 });

        const [newOrder] = await db
            .insert(orders)
            .values({
                storeId: params.storeId,
                isPaid: false,
                phone: phone || '',
                address: address || '',
            })
            .returning()
            .execute();

        const orderItemsData = productRecords.map((product) => ({
            orderId: newOrder.id,
            productId: product.productId,
            productName: `${product.productName}(${product.colorName}, ${product.sizeName})`, // Format ProductName(Color, Size)
        }));

        await db.insert(orderItems).values(orderItemsData).execute();

        return NextResponse.json({ orderId: newOrder.id }, { headers: corsHeaders });
    }
    
    catch (error: any) {
        console.error("Error processing order:", error);
        return new NextResponse("An error occurred while processing the order", {
            status: 500,
            headers: corsHeaders,
        });
    }
}