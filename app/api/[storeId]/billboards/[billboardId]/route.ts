import db from "@/db/drizzle";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { billboards, stores } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function GET(req: Request, { params }: { params: { billboardId: string } }) {
    try {
        if (!params.billboardId) return new NextResponse("Billboard id is required", { status: 400 });

        const billboard = await db
            .select()
            .from(billboards)
            .where(eq(billboards.id, params.billboardId))
            .limit(1)
            .then(result => result[0]);

        return NextResponse.json(billboard);
    }
    
    catch (err) {
        console.log('Error :: Billboard : GET', err);
        return new NextResponse('Internal error', { status: 500 });
    }
}

export async function PATCH(req: Request, { params }: { params: { storeId: string, billboardId: string } }) {
    try {
        const { userId } = auth();
        const body = await req.json();

        const { label, imageUrl } = body;

        if (!userId) return new NextResponse("Unauthenticated", { status: 401 });

        if (!label) return new NextResponse("Label is required", { status: 400 });

        if (!imageUrl) return new NextResponse("Image URL is required", { status: 400 });

        if (!params.billboardId) return new NextResponse("Billboard id is required", { status: 400 });

        const storeByUserId = await db
            .select()
            .from(stores)
            .where(and(eq(stores.id, params.storeId), eq(stores.userId, userId)))
            .limit(1)
            .then(result => result[0]);

        if (!storeByUserId) return new NextResponse("Unauthorized", { status: 403 });

        const [billboard] = await db
            .update(billboards)
            .set({
                label,
                imageUrl,
            })
            .where(eq(billboards.id, params.billboardId))
            .returning();

        return NextResponse.json(billboard);
    }
    
    catch (err) {
        console.log('Error :: Billboard : PATCH', err);
        return new NextResponse('Internal error', { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: { storeId: string, billboardId: string } }) {
    try {
        const { userId } = auth();

        if (!userId) return new NextResponse("Unauthenticated", { status: 401 });

        if (!params.billboardId) return new NextResponse("Billboard id is required", { status: 400 });

        const storeByUserId = await db
            .select()
            .from(stores)
            .where(and(eq(stores.id, params.storeId), eq(stores.userId, userId)))
            .limit(1)
            .then(result => result[0]);

        if (!storeByUserId) return new NextResponse("Unauthorized", { status: 403 });

        const [billboard] = await db
            .delete(billboards)
            .where(eq(billboards.id, params.billboardId))
            .returning();

        return NextResponse.json(billboard);
    }
    
    catch (err) {
        console.log('Error :: Billboard : DELETE', err);
        return new NextResponse('Internal error', { status: 500 });
    }
}