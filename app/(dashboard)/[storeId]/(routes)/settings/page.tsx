import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { SettingsForm } from "./components/settings-form";
import { stores } from "@/db/schema";
import db from "@/db/drizzle";
import { and, eq } from "drizzle-orm";

interface SettingsPageProps {
    params: {
        storeId: string;
    }
};

const page: React.FC<SettingsPageProps> = async ({ params }) => {
    const { userId } = auth();

    if(!userId) redirect('/sign-in');

    const store = await db.select().from(stores).where(and(eq(stores.id, params.storeId), eq(stores.userId, userId))).limit(1);

    if (!store || store.length === 0) redirect('/');

    const [storeData] = store;

    if (!store) redirect('/');

    return (
        <div className="flex-col">
            <div className="flex-1 p-8 pt-6 space-y-4">
                <SettingsForm initialData={storeData} />
            </div>
        </div>
    )
}

export default page;