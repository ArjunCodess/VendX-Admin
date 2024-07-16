import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import db from "@/db/drizzle";
import { categories, stores } from "@/db/schema";
import { and, eq } from "drizzle-orm";

export async function POST(req: Request, { params }: { params: { storeId: string } }) {
    try {
        const { userId } = auth();
        const body = await req.json();

        const { name, billboardId } = body; 

        if (!userId) return new NextResponse("Unauthenticated", { status: 401 });

        if (!name) return new NextResponse("Name is required", { status: 400 });

        if (!billboardId) return new NextResponse("Billboard ID is required", { status: 400 });

        if (!params.storeId) return new NextResponse("Store Id is required", { status: 400 });

        const storeByUserId = await db
            .select()
            .from(stores)
            .where(and(eq(stores.id, params.storeId), eq(stores.userId, userId)))
            .limit(1)
            .then(result => result[0]);

        if (!storeByUserId) return new NextResponse("Unauthorized", { status: 403 });

        const [category] = await db.insert(categories).values({
            name,
            billboardId,
            storeId: params.storeId,
        }).returning();

        return NextResponse.json(category);
    }
    
    catch (err) {
        console.log(`Error :: Categories : POST ${err}`);
        return new NextResponse(`Internal error`, { status: 500 });
    }
}

export async function GET(req: Request, { params }: { params: { storeId: string } }) {
    try {
        if (!params.storeId) return new NextResponse("Store Id is required", { status: 400 });

        const categoryList = await db
            .select()
            .from(categories)
            .where(eq(categories.storeId, params.storeId));

        return NextResponse.json(categoryList);
    }
    
    catch (err) {
        console.log(`Error :: Categories : GET ${err}`);
        return new NextResponse(`Internal error`, { status: 500 });
    }
}