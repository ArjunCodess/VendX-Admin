import db from '@/db/drizzle';
import { stores } from '@/db/schema';
import { eq } from 'drizzle-orm';
import React from 'react'

interface DashboardPageProps {
    params: { storeId: string }
}

const page: React.FC<DashboardPageProps> = async ({ params }) => {
    const storeList = await db.select().from(stores).where(eq(stores.id, params.storeId)).execute();
    const store = storeList[0];

    return (
        <div className='p-4'>
            {store?.name}
        </div>
    )
}

export default page; 