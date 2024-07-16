import { format } from 'date-fns'
import { CategoryClient } from './components/client'
import { CategoryColumn } from './components/columns'
import db from '@/db/drizzle'
import { billboards, categories } from '@/db/schema'
import { desc, eq } from 'drizzle-orm'

const CategoriesPage = async ({ params }: { params: { storeId: string } }) => {
    const fetchedCategories = await db
        .select({
            id: categories.id,
            name: categories.name,
            billboardLabel: billboards.label,
            createdAt: categories.createdAt
        })
        .from(categories)
        .leftJoin(billboards, eq(categories.billboardId, billboards.id))
        .where(eq(categories.storeId, params.storeId))
        .orderBy(desc(categories.createdAt));

    const formattedCategories: CategoryColumn[] = fetchedCategories.map(item => ({
        id: item.id,
        name: item.name,
        billboardLabel: item.billboardLabel || '',
        createdAt: format(item.createdAt!, "MMMM do, yyyy"),
    }));

    return (
        <div className="flex-col">
            <div className="flex-1 p-8 pt-6 space-y-4">
                <CategoryClient data={formattedCategories} />
            </div>
        </div>
    )
}

export default CategoriesPage;