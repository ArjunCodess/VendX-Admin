import db from "@/db/drizzle";
import { BillboardForm } from "./components/billboard-form";
import { billboards } from "@/db/schema";
import { eq } from "drizzle-orm";

const BillboardPage = async ({ params }: { params: { billboardId: string } }) => {
    let billboard = null;

    if (params.billboardId !== "new") {
        const billboardData = await db
            .select()
            .from(billboards)
            .where(eq(billboards.id, params.billboardId))
            .limit(1)
            .then(result => result[0]);

        if (billboardData) {
            billboard = {
                ...billboardData,
                createdAt: billboardData.createdAt ? billboardData.createdAt.toISOString() : "",
            };
        } else {
            console.error(`Billboard with id ${params.billboardId} not found.`);
        }
    }

    return (
        <div className="flex-col">
            <div className="flex-1 p-8 pt-6 space-y-4">
                <BillboardForm initialData={billboard} />
            </div>
        </div>
    );
}

export default BillboardPage;