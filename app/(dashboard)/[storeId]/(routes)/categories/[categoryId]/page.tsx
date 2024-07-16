import db from "@/db/drizzle";
import { CategoryForm } from "./components/category-form";
import { billboards, categories } from "@/db/schema";
import { eq } from "drizzle-orm";

const CategoryPage = async ({ params }: { params: { categoryId: string, storeId: string; } }) => {
    let category = null;

    if (params.categoryId !== "new") {
        const categoryData = await db
            .select()
            .from(categories)
            .where(eq(categories.id, params.categoryId))
            .limit(1)
            .then(result => result[0]);

        if (categoryData) category = {
            name: categoryData.name,
            billboardId: categoryData.billboardId || '',
        };
        else console.error(`Category with id ${params.categoryId} not found.`);
    }

    const fetchedBillboards = await db
        .select()
        .from(billboards)
        .where(eq(billboards.storeId, params.storeId));

    return (
        <div className="flex-col">
            <div className="flex-1 p-8 pt-6 space-y-4">
                <CategoryForm initialData={category} billboards={fetchedBillboards} />
            </div>
        </div>
    );
}

export default CategoryPage;