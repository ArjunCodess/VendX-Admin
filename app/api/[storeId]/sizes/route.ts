import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import db from "@/db/drizzle";
import { sizes, stores } from "@/db/schema";
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

        const [size] = await db.insert(sizes).values({
            name,
            value,
            storeId: params.storeId,
        }).returning();

        return NextResponse.json(size);
    }
    
    catch (err) {
        console.log(`Error :: Sizes : POST ${err}`);
        return new NextResponse(`Internal error`, { status: 500 });
    }
}

export async function GET(req: Request, { params }: { params: { storeId: string } }) {
    try {
        if (!params.storeId) return new NextResponse("Store Id is required", { status: 400 });

        const sizeList = await db
            .select()
            .from(sizes)
            .where(eq(sizes.storeId, params.storeId));

        return NextResponse.json(sizeList);
    }
    
    catch (err) {
        console.log(`Error :: Sizes : GET ${err}`);
        return new NextResponse(`Internal error`, { status: 500 });
    }
}