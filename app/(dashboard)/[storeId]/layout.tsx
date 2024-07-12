import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import db from '@/db/drizzle';
import { stores } from '@/db/schema/stores';
import { and, eq } from "drizzle-orm";

interface DashboardType {
    children: React.ReactNode;
    params: { storeId: string }
}

export default async function DashboardLayout({ children, params }: DashboardType) {
    const { userId } = auth();

    const storeId = params.storeId;

    if (!userId) redirect('/sign-in')

    const store = await db.select().from(stores).where(and(eq(stores.id, storeId), eq(stores.userId, userId))).limit(1).execute();

    if (!store) redirect('/');

    return (
        <>
            <Navbar />
            {children}
        </>
    )
}