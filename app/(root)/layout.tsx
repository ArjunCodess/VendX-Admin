import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import db from "@/db/drizzle";
import { stores } from "@/db/schema/stores";
import { eq } from 'drizzle-orm';

interface DashboardType {
    children: React.ReactNode;
    params: { storeId: string };
}

export default async function SetupLayout({ children }: DashboardType) {
    const { userId } = auth();

    if (!userId) redirect('/sign-in');

    const store = await db.select().from(stores).where(eq(stores.userId, userId))

    if (store[0] && store[0].id) redirect(`/${store[0].id}`);

    return <>{children}</>;
}