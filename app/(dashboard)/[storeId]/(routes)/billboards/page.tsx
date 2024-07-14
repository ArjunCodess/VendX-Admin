import { format } from 'date-fns';
import db from '@/db/drizzle';
import { billboards } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { BillboardClient } from './components/client';
import { BillboardColumn } from './components/columns';

const BillboardsPage = async ({ params }: { params: { storeId: string } }) => {
    const fetchedBillboards = await db
        .select()
        .from(billboards)
        .where(eq(billboards.storeId, params.storeId))
        .orderBy(desc(billboards.createdAt));

    const formattedBillboards: BillboardColumn[] = fetchedBillboards.map(item => ({
        id: item.id,
        label: item.label,
        createdAt: item.createdAt ? format(new Date(item.createdAt), "dd/MM/yyyy") : "",
    }));

    return (
        <div className="flex-col">
            <div className="flex-1 p-8 pt-6 space-y-4">
                <BillboardClient data={formattedBillboards} />
            </div>
        </div>
    );
}

export default BillboardsPage;