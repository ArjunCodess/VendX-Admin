import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import db from "@/db/drizzle";
import { billboards, stores } from "@/db/schema";
import { and, eq } from "drizzle-orm";

export async function POST(req: Request, { params }: { params: { storeId: string } }) {
    try {
        const { userId } = auth();
        const body = await req.json();

        const { label, imageUrl } = body; 

        if (!userId) return new NextResponse("Unauthenticated", { status: 401 });

        if (!label) return new NextResponse("Label is required", { status: 400 });

        if (!imageUrl) return new NextResponse("Image Url is required", { status: 400 });

        if (!params.storeId) return new NextResponse("Store Id is required", { status: 400 });

        const storeByUserId = await db
            .select()
            .from(stores)
            .where(and(eq(stores.id, params.storeId), eq(stores.userId, userId)))
            .limit(1)
            .then(result => result[0]);

        if (!storeByUserId) return new NextResponse("Unauthorized", { status: 403 });

        const [billboard] = await db.insert(billboards).values({
            label,
            imageUrl,
            storeId: params.storeId,
        }).returning();

        return NextResponse.json(billboard);
    }
    
    catch (err) {
        console.log(`Error :: Billboards : POST ${err}`);
        return new NextResponse(`Internal error`, { status: 500 });
    }
}

export async function GET(req: Request, { params }: { params: { storeId: string } }) {
    try {
        if (!params.storeId) return new NextResponse("Store Id is required", { status: 400 });

        const billboardList = await db
            .select()
            .from(billboards)
            .where(eq(billboards.storeId, params.storeId));

        return NextResponse.json(billboardList);
    }
    
    catch (err) {
        console.log(`Error :: Billboards : GET ${err}`);
        return new NextResponse(`Internal error`, { status: 500 });
    }
}