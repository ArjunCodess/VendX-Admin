import db from "@/db/drizzle";
import { SizeForm } from "./components/size-form";
import { sizes } from "@/db/schema";
import { eq } from "drizzle-orm";

const SizePage = async ({ params }: { params: { sizeId: string } }) => {
    let size = null;

    if (params.sizeId !== "new") {
        const sizeData = await db
            .select()
            .from(sizes)
            .where(eq(sizes.id, params.sizeId))
            .limit(1)
            .then(result => result[0]);

        if (sizeData) {
            size = {
                ...sizeData,
                createdAt: sizeData.createdAt ? sizeData.createdAt.toISOString() : "",
            };
        } else {
            console.error(`Size with id ${params.sizeId} not found.`);
        }
    }

    return (
        <div className="flex-col">
            <div className="flex-1 p-8 pt-6 space-y-4">
                <SizeForm initialData={size} />
            </div>
        </div>
    );
}

export default SizePage;