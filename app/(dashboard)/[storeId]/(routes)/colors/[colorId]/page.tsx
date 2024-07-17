import db from "@/db/drizzle";
import { ColorForm } from "./components/color-form";
import { colors } from "@/db/schema";
import { eq } from "drizzle-orm";

const ColorPage = async ({ params }: { params: { colorId: string } }) => {
    let color = null;

    if (params.colorId !== "new") {
        const colorData = await db
            .select()
            .from(colors)
            .where(eq(colors.id, params.colorId))
            .limit(1)
            .then(result => result[0]);

        if (colorData) {
            color = {
                ...colorData,
                createdAt: colorData.createdAt ? colorData.createdAt.toISOString() : "",
            };
        } else {
            console.error(`Color with ID ${params.colorId} not found.`);
        }
    }

    return (
        <div className="flex-col">
            <div className="flex-1 p-8 pt-6 space-y-4">
                <ColorForm initialData={color} />
            </div>
        </div>
    );
}

export default ColorPage;