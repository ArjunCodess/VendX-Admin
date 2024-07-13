import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import db from '@/db/drizzle';
import { stores } from '@/db/schema';
import { and, eq } from "drizzle-orm";

export async function PATCH(req: Request, { params }: { params: { storeId: string } }) {
    try {
        const { userId } = auth();
        const body = await req.json();

        const { name } = body;

        if (!userId) return new NextResponse("Unauthenticated", { status: 401 })

        if (!name) return new NextResponse("Name is required", { status: 400 });

        if (!params.storeId) return new NextResponse("Store id is required", { status: 400 });

        const updatedStore = await db
            .update(stores)
            .set({ name })
            .where(and(eq(stores.id, params.storeId), eq(stores.userId, userId)))
            .returning();

        if (updatedStore.length === 0) return new NextResponse("Store not found or unauthorized", { status: 404 });

        return NextResponse.json(updatedStore);
    }
    
    catch (err) {
        console.log('Error : api/stores/[storeId] :: PATCH', err)
        return new NextResponse('Internal error', { status: 500 })
    }
}

export async function DELETE(req: Request, { params }: { params: { storeId: string } }) {
    try {
        const { userId } = auth();

        if (!userId) return new NextResponse("Unauthenticated", { status: 401 })

        if (!params.storeId) return new NextResponse("Store id is required", { status: 400 });

        const deletedStore = await db
            .delete(stores)
            .where(and(eq(stores.id, params.storeId), eq(stores.userId, userId)))
            .returning();

        if (deletedStore.length === 0) return new NextResponse("Store not found or unauthorized", { status: 404 });

        return NextResponse.json(deletedStore);
    }
    
    catch (err) {
        console.log('Error : api/stores/[storeId] :: DELETE', err)
        return new NextResponse('Internal error', { status: 500 })
    }
}