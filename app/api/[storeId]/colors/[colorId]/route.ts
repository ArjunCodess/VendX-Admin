import db from "@/db/drizzle";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { colors, stores } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function GET(req: Request, { params }: { params: { colorId: string } }) {
    try {
        if (!params.colorId) return new NextResponse("Color ID is required", { status: 400 });

        const color = await db
            .select()
            .from(colors)
            .where(eq(colors.id, params.colorId))
            .limit(1)
            .then(result => result[0]);

        return NextResponse.json(color);
    }
    
    catch (err) {
        console.log('Error :: Color : GET', err);
        return new NextResponse('Internal error', { status: 500 });
    }
}

export async function PATCH(req: Request, { params }: { params: { storeId: string, colorId: string } }) {
    try {
        const { userId } = auth();
        const body = await req.json();

        const { name, value } = body;

        if (!userId) return new NextResponse("Unauthenticated", { status: 401 });

        if (!name) return new NextResponse("Name is required", { status: 400 });

        if (!value) return new NextResponse("Value is required", { status: 400 });

        if (!params.colorId) return new NextResponse("Color ID is required", { status: 400 });

        const storeByUserId = await db
            .select()
            .from(stores)
            .where(and(eq(stores.id, params.storeId), eq(stores.userId, userId)))
            .limit(1)
            .then(result => result[0]);

        if (!storeByUserId) return new NextResponse("Unauthorized", { status: 403 });

        const [color] = await db
            .update(colors)
            .set({
                name,
                value,
            })
            .where(eq(colors.id, params.colorId))
            .returning();

        return NextResponse.json(color);
    }
    
    catch (err) {
        console.log('Error :: Color : PATCH', err);
        return new NextResponse('Internal error', { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: { storeId: string, colorId: string } }) {
    try {
        const { userId } = auth();

        if (!userId) return new NextResponse("Unauthenticated", { status: 401 });

        if (!params.colorId) return new NextResponse("Color id is required", { status: 400 });

        const storeByUserId = await db
            .select()
            .from(stores)
            .where(and(eq(stores.id, params.storeId), eq(stores.userId, userId)))
            .limit(1)
            .then(result => result[0]);

        if (!storeByUserId) return new NextResponse("Unauthorized", { status: 403 });

        const [color] = await db
            .delete(colors)
            .where(eq(colors.id, params.colorId))
            .returning();

        return NextResponse.json(color);
    }
    
    catch (err) {
        console.log('Error :: Color : DELETE', err);
        return new NextResponse('Internal error', { status: 500 });
    }
}