import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import db from "@/db/drizzle";
import { colors, stores } from "@/db/schema";
import { and, eq } from "drizzle-orm";

export async function POST(req: Request, { params }: { params: { storeId: string } }) {
    try {
        const { userId } = auth();
        const body = await req.json();

        const { name, value } = body; 

        if (!userId) return new NextResponse("Unauthenticated", { status: 401 });

        if (!name) return new NextResponse("Name is required", { status: 400 });

        if (!value) return new NextResponse("Value is required", { status: 400 });

        if (!params.storeId) return new NextResponse("Store Id is required", { status: 400 });

        const storeByUserId = await db
            .select()
            .from(stores)
            .where(and(eq(stores.id, params.storeId), eq(stores.userId, userId)))
            .limit(1)
            .then(result => result[0]);

        if (!storeByUserId) return new NextResponse("Unauthorized", { status: 403 });

        const [color] = await db.insert(colors).values({
            name,
            value,
            storeId: params.storeId,
        }).returning();

        return NextResponse.json(color);
    }
    
    catch (err) {
        console.log(`Error :: Colors : POST ${err}`);
        return new NextResponse(`Internal error`, { status: 500 });
    }
}

export async function GET(req: Request, { params }: { params: { storeId: string } }) {
    try {
        if (!params.storeId) return new NextResponse("Store Id is required", { status: 400 });

        const colorList = await db
            .select()
            .from(colors)
            .where(eq(colors.storeId, params.storeId));

        return NextResponse.json(colorList);
    }
    
    catch (err) {
        console.log(`Error :: Colors : GET ${err}`);
        return new NextResponse(`Internal error`, { status: 500 });
    }
}