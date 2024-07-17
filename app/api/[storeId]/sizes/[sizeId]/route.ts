import db from "@/db/drizzle";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { sizes, stores } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function GET(req: Request, { params }: { params: { sizeId: string } }) {
    try {
        if (!params.sizeId) return new NextResponse("Size id is required", { status: 400 });

        const size = await db
            .select()
            .from(sizes)
            .where(eq(sizes.id, params.sizeId))
            .limit(1)
            .then(result => result[0]);

        return NextResponse.json(size);
    }
    
    catch (err) {
        console.log('Error :: Size : GET', err);
        return new NextResponse('Internal error', { status: 500 });
    }
}

export async function PATCH(req: Request, { params }: { params: { storeId: string, sizeId: string } }) {
    try {
        const { userId } = auth();
        const body = await req.json();

        const { name, value } = body;

        if (!userId) return new NextResponse("Unauthenticated", { status: 401 });

        if (!name) return new NextResponse("Name is required", { status: 400 });

        if (!value) return new NextResponse("Value is required", { status: 400 });

        if (!params.sizeId) return new NextResponse("Size ID is required", { status: 400 });

        const storeByUserId = await db
            .select()
            .from(stores)
            .where(and(eq(stores.id, params.storeId), eq(stores.userId, userId)))
            .limit(1)
            .then(result => result[0]);

        if (!storeByUserId) return new NextResponse("Unauthorized", { status: 403 });

        const [size] = await db
            .update(sizes)
            .set({
                name,
                value,
            })
            .where(eq(sizes.id, params.sizeId))
            .returning();

        return NextResponse.json(size);
    }
    
    catch (err) {
        console.log('Error :: Size : PATCH', err);
        return new NextResponse('Internal error', { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: { storeId: string, sizeId: string } }) {
    try {
        const { userId } = auth();

        if (!userId) return new NextResponse("Unauthenticated", { status: 401 });

        if (!params.sizeId) return new NextResponse("Size id is required", { status: 400 });

        const storeByUserId = await db
            .select()
            .from(stores)
            .where(and(eq(stores.id, params.storeId), eq(stores.userId, userId)))
            .limit(1)
            .then(result => result[0]);

        if (!storeByUserId) return new NextResponse("Unauthorized", { status: 403 });

        const [size] = await db
            .delete(sizes)
            .where(eq(sizes.id, params.sizeId))
            .returning();

        return NextResponse.json(size);
    }
    
    catch (err) {
        console.log('Error :: Size : DELETE', err);
        return new NextResponse('Internal error', { status: 500 });
    }
}