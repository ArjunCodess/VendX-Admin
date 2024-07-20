import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import db from "@/db/drizzle";
import { categories, colors, images, products, sizes, stores } from "@/db/schema";
import { and, desc, eq } from "drizzle-orm";

export async function POST(req: Request, { params }: { params: { storeId: string } }) {
    try {
        const { userId } = auth();
        const body = await req.json();

        const { name, price, categoryId, colorId, sizeId, images: imageList, isFeatured = false, isArchived = false } = body;

        if (!userId) return new NextResponse("Unauthenticated", { status: 401 });

        if (!name) return new NextResponse("Name is required", { status: 400 });

        if (price == null) return new NextResponse("Price is required", { status: 400 });

        if (!categoryId) return new NextResponse("Category is required", { status: 400 });

        if (!sizeId) return new NextResponse("Size is required", { status: 400 });

        if (!colorId) return new NextResponse("Color is required", { status: 400 });
        
        if (!imageList || !imageList.length) return new NextResponse("At least one image is required", { status: 400 });
        
        if (!params.storeId) return new NextResponse("Store Id is required", { status: 400 });

        const storeByUserId = await db
            .select()
            .from(stores)
            .where(and(eq(stores.id, params.storeId), eq(stores.userId, userId)))
            .limit(1)
            .then(result => result[0]);

        if (!storeByUserId) return new NextResponse("Unauthorized", { status: 403 });

        const [product] = await db.insert(products).values({
            name,
            price,
            categoryId,
            colorId,
            sizeId,
            isArchived,
            isFeatured,
            storeId: params.storeId,
        }).returning();

        await db.insert(images).values(
            imageList.map((image: { url: string }) => ({
                url: image.url,
                productId: product.id,
            }))
        );

        return NextResponse.json(product);
    }
    
    catch (err) {
        console.error(`Error :: Products : POST ${err}`);
        return new NextResponse("Internal error", { status: 500 });
    }
}

export async function GET(req: Request, { params }: { params: { storeId: string } }) {
    try {
        const { searchParams } = new URL(req.url);
        const categoryId = searchParams.get('categoryId') || undefined;
        const sizeId = searchParams.get('sizeId') || undefined;
        const colorId = searchParams.get('colorId') || undefined;
        const isFeatured = searchParams.get('isFeatured');

        if (!params.storeId) return new NextResponse("Store Id is required", { status: 400 });

        const conditions = and(
            eq(products.storeId, params.storeId),
            eq(products.isArchived, false),
            categoryId ? eq(products.categoryId, categoryId) : undefined,
            sizeId ? eq(products.sizeId, sizeId) : undefined,
            colorId ? eq(products.colorId, colorId) : undefined,
            isFeatured ? eq(products.isFeatured, true) : undefined,
        );

        const productList = await db
            .select({
                products,
                images,
                category: categories,
                color: colors,
                size: sizes,
            })
            .from(products)
            .leftJoin(images, eq(products.id, images.productId))
            .leftJoin(categories, eq(products.categoryId, categories.id))
            .leftJoin(colors, eq(products.colorId, colors.id))
            .leftJoin(sizes, eq(products.sizeId, sizes.id))
            .where(conditions)
            .orderBy(desc(products.createdAt));

        return NextResponse.json(productList);
    }

    catch (err) {
        console.log(`Error :: Product : GET ${err}`);
        return new NextResponse(`Internal error`, { status: 500 });
    }
}