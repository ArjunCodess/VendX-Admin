import { format } from 'date-fns';
import { ProductClient } from './components/client';
import { ProductColumn } from './components/columns';
import { formatter } from '@/lib/utils';
import db from '@/db/drizzle';
import { categories, colors, products, sizes } from '@/db/schema';
import { desc, eq } from 'drizzle-orm';

const ProductsPage = async ({ params }: { params: { storeId: string } }) => {
    const productData = await db
        .select()
        .from(products)
        .where(eq(products.storeId, params.storeId))
        .leftJoin(categories, eq(products.categoryId, categories.id))
        .leftJoin(sizes, eq(products.sizeId, sizes.id))
        .leftJoin(colors, eq(products.colorId, colors.id))
        .orderBy(desc(products.createdAt));

    const formattedProducts: ProductColumn[] = productData.map((item) => ({
        id: item.products.id,
        name: item.products.name,
        isFeatured: item.products.isFeatured ?? false,
        isArchived: item.products.isArchived ?? false,
        price: formatter.format(Number(item.products.price)),
        category: item.categories?.name ?? '',
        size: item.sizes?.name ?? '',
        color: item.colors?.value ?? '',
        createdAt: format(item.products.createdAt!, 'MMMM do, yyyy'),
    }));

    return (
        <div className="flex-col">
            <div className="flex-1 p-8 pt-6 space-y-4">
                <ProductClient data={formattedProducts} />
            </div>
        </div>
    );
};

export default ProductsPage;