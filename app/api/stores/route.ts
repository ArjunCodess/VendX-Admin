import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import db from '@/db/drizzle';
import { stores } from '@/db/schema';

export async function POST(req: Request) {
    try {
        const { userId } = auth();
        const body = await req.json();

        const { name } = body;

        if (!userId) return new NextResponse("Unauthorized", { status: 401 });

        if (!name) return new NextResponse("Name is required", { status: 400 });

        const result = await db.insert(stores).values({
            name,
            userId,
        }).returning();

        const store = result[0];

        return NextResponse.json(store);

    } catch (err) {
        console.log(`[STORES_POST] ${err}`);
        return new NextResponse(`Internal error`, { status: 500 })
    }
}