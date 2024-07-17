import { format } from 'date-fns';
import db from '@/db/drizzle';
import { colors } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { ColorClient } from './components/client';
import { ColorColumn } from './components/columns';

const ColorsPage = async ({ params }: { params: { storeId: string } }) => {
    const fetchedColors = await db
        .select()
        .from(colors)
        .where(eq(colors.storeId, params.storeId))
        .orderBy(desc(colors.createdAt));

    const formattedColors: ColorColumn[] = fetchedColors.map(item => ({
        id: item.id,
        name: item.name,
        value: item.value,
        createdAt: item.createdAt ? format(new Date(item.createdAt), "MMMM do, yyyy") : "",
    }));

    return (
        <div className="flex-col">
            <div className="flex-1 p-8 pt-6 space-y-4">
                <ColorClient data={formattedColors} />
            </div>
        </div>
    );
}

export default ColorsPage;