import db from "@/db/drizzle";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { categories, stores } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function GET(req: Request, { params }: { params: { categoryId: string } }) {
    try {
        if (!params.categoryId) return new NextResponse("Category ID is required", { status: 400 });

        const category = await db
            .select()
            .from(categories)
            .where(eq(categories.id, params.categoryId))
            .limit(1)
            .then(result => result[0]);

        return NextResponse.json(category);
    }
    
    catch (err) {
        console.log('Error :: Category : GET', err);
        return new NextResponse('Internal error', { status: 500 });
    }
}

export async function PATCH(req: Request, { params }: { params: { storeId: string, categoryId: string } }) {
    try {
        const { userId } = auth();
        const body = await req.json();

        const { name, billboardId } = body;

        if (!userId) return new NextResponse("Unauthenticated", { status: 401 });

        if (!name) return new NextResponse("Name is required", { status: 400 });

        if (!billboardId) return new NextResponse("Billboard ID is required", { status: 400 });

        if (!params.categoryId) return new NextResponse("Category ID is required", { status: 400 });

        const storeByUserId = await db
            .select()
            .from(stores)
            .where(and(eq(stores.id, params.storeId), eq(stores.userId, userId)))
            .limit(1)
            .then(result => result[0]);

        if (!storeByUserId) return new NextResponse("Unauthorized", { status: 403 });

        const [category] = await db
            .update(categories)
            .set({
                name,
                billboardId,
            })
            .where(eq(categories.id, params.categoryId))
            .returning();

        return NextResponse.json(category);
    }
    
    catch (err) {
        console.log('Error :: Category : PATCH', err);
        return new NextResponse('Internal error', { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: { storeId: string, categoryId: string } }) {
    try {
        const { userId } = auth();

        if (!userId) return new NextResponse("Unauthenticated", { status: 401 });

        if (!params.categoryId) return new NextResponse("Category ID is required", { status: 400 });

        const storeByUserId = await db
            .select()
            .from(stores)
            .where(and(eq(stores.id, params.storeId), eq(stores.userId, userId)))
            .limit(1)
            .then(result => result[0]);

        if (!storeByUserId) return new NextResponse("Unauthorized", { status: 403 });

        const [category] = await db
            .delete(categories)
            .where(eq(categories.id, params.categoryId))
            .returning();

        return NextResponse.json(category);
    }
    
    catch (err) {
        console.log('Error :: Category : DELETE', err);
        return new NextResponse('Internal error', { status: 500 });
    }
}