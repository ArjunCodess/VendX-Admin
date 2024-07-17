import { format } from 'date-fns';
import db from '@/db/drizzle';
import { sizes } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { SizeClient } from './components/client';
import { SizeColumn } from './components/columns';

const SizesPage = async ({ params }: { params: { storeId: string } }) => {
    const fetchedSizes = await db
        .select()
        .from(sizes)
        .where(eq(sizes.storeId, params.storeId))
        .orderBy(desc(sizes.createdAt));

    const formattedSizes: SizeColumn[] = fetchedSizes.map(item => ({
        id: item.id,
        name: item.name,
        value: item.value,
        createdAt: item.createdAt ? format(new Date(item.createdAt), "MMMM do, yyyy") : "",
    }));

    return (
        <div className="flex-col">
            <div className="flex-1 p-8 pt-6 space-y-4">
                <SizeClient data={formattedSizes} />
            </div>
        </div>
    );
}

export default SizesPage;