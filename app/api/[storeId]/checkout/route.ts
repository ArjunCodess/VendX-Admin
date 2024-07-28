import { NextResponse } from "next/server";
import db from "@/db/drizzle";
import { products, orders, orderItems } from "@/db/schema";
import { inArray } from "drizzle-orm";

// Define CORS headers
const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

// Handle OPTIONS request for CORS preflight
export async function OPTIONS() {
    return NextResponse.json({}, { headers: corsHeaders });
}

// Handle POST request for creating an order
export async function POST(req: Request, { params }: { params: { storeId: string } }) {
    try {
        // Parse the incoming request to get product IDs
        const { productIds } = await req.json();

        // Check if product IDs are provided
        if (!productIds || productIds.length === 0) {
            return new NextResponse("Product ids are required", { status: 400 });
        }

        // Fetch the products from the database using Drizzle ORM
        const selectedProducts = await db.select()
            .from(products)
            .where(inArray(products.id, productIds))
            .execute();

        // Check if all products exist
        if (selectedProducts.length !== productIds.length) {
            return new NextResponse("Some product ids are invalid", { status: 400 });
        }

        // Create the order in the database using Drizzle ORM
        const [order] = await db.insert(orders).values({
            storeId: params.storeId,
            isPaid: false,
        }).returning().execute();

        // Map the product IDs to create order items
        const orderItemsData = selectedProducts.map((product) => ({
            orderId: order.id,
            productId: product.id,
            quantity: 1,
        }));

        // Insert order items into the database using Drizzle ORM
        await db.insert(orderItems).values(orderItemsData).execute();

        // Return a response indicating the order was successfully created
        return NextResponse.json(
            { message: "Order created successfully", orderId: order.id },
            { headers: corsHeaders }
        );

    } catch (error: any) {
        // Handle any errors that occur during the order creation process
        console.error("Error creating order:", error);
        return new NextResponse("Internal Server Error :: " + error.message ,
            { status: 500, headers: corsHeaders }
        );
    }
}