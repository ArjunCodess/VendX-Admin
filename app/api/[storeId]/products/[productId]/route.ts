import db from "@/db/drizzle";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { categories, colors, images, products, sizes, stores } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function GET(req: Request, { params }: { params: { productId: string } }) {
    try {
        if (!params.productId) return new NextResponse("Product id is required", { status: 400 });

        const product = await db
            .select({
                id: products.id,
                name: products.name,
                price: products.price,
                categoryId: products.categoryId,
                sizeId: products.sizeId,
                colorId: products.colorId,
                isFeatured: products.isFeatured,
                isArchived: products.isArchived,
                createdAt: products.createdAt,
                images: images.url,
                category: categories.name,
                size: sizes.name,
                color: colors.name
            })
            .from(products)
            .leftJoin(images, eq(products.id, images.productId))
            .leftJoin(categories, eq(products.categoryId, categories.id))
            .leftJoin(colors, eq(products.colorId, colors.id))
            .leftJoin(sizes, eq(products.sizeId, sizes.id))
            .where(eq(products.id, params.productId))
            .limit(1)
            .then(result => result[0]);

        return NextResponse.json(product);
    }
    
    catch (err) {
        console.log('Error :: Product : GET', err);
        return new NextResponse('Internal error', { status: 500 });
    }
}

export async function PATCH(req: Request, { params }: { params: { storeId: string, productId: string } }) {
    try {
        const { userId } = auth();
        const body = await req.json();

        const { name, price, categoryId, colorId, sizeId, images: imageList, isFeatured, isArchived } = body;

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

        await db.update(products)
            .set({
                name,
                price,
                categoryId,
                colorId,
                sizeId,
                isFeatured,
                isArchived,
                storeId: params.storeId,
            })
            .where(eq(products.id, params.productId));

        await db.delete(images)
            .where(eq(images.productId, params.productId));

        await db.insert(images)
            .values(imageList.map((image: { url: string }) => ({
                productId: params.productId,
                url: image.url,
            })));

        const updatedProduct = await db
            .select()
            .from(products)
            .where(eq(products.id, params.productId))
            .limit(1)
            .then(result => result[0]);

        return NextResponse.json(updatedProduct);
    }
    
    catch (err) {
        console.log('Error :: Product : PATCH', err);
        return new NextResponse('Internal error', { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: { storeId: string, productId: string } }) {
    try {
        const { userId } = auth();

        if (!userId) return new NextResponse("Unauthenticated", { status: 401 });
        if (!params.productId) return new NextResponse("Product id is required", { status: 400 });

        const storeByUserId = await db
            .select()
            .from(stores)
            .where(and(eq(stores.id, params.storeId), eq(stores.userId, userId)))
            .limit(1)
            .then(result => result[0]);

        if (!storeByUserId) return new NextResponse("Unauthorized", { status: 403 });

        await db.delete(images)
            .where(eq(images.productId, params.productId));

        const deletedProduct = await db
            .delete(products)
            .where(eq(products.id, params.productId))
            .returning();

        return NextResponse.json(deletedProduct);
    }
    
    catch (err) {
        console.log('Error :: Product : DELETE', err);
        return new NextResponse('Internal error', { status: 500 });
    }
}