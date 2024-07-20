import db from "@/db/drizzle";
import { ProductForm } from "./components/product-form";
import { products, categories, colors, sizes, images } from "@/db/schema";
import { eq } from "drizzle-orm";

const ProductPage = async ({ params }: { params: { productId: string } }) => {
    let product = null;

    if (params.productId !== "new") {
        const productData = await db
            .select({
                product: products,
                category: categories,
                color: colors,
                size: sizes,
                image: images
            })
            .from(products)
            .leftJoin(categories, eq(products.categoryId, categories.id))
            .leftJoin(colors, eq(products.colorId, colors.id))
            .leftJoin(sizes, eq(products.sizeId, sizes.id))
            .leftJoin(images, eq(products.id, images.productId))
            .where(eq(products.id, params.productId))
            .then(result => result[0]);

        if (productData) {
            product = {
                id: productData.product.id,
                name: productData.product.name,
                price: parseFloat(productData.product.price.toString()),
                categoryId: productData.product.categoryId,
                colorId: productData.product.colorId,
                sizeId: productData.product.sizeId,
                isFeatured: productData.product.isFeatured ?? false,
                isArchived: productData.product.isArchived ?? false,
                images: productData.image ? [{ url: productData.image.url }] : []
            };
        } else {
            console.error(`Product with id ${params.productId} not found.`);
        }
    }

    const categoriesData = await db.select().from(categories);
    const colorsData = await db.select().from(colors);
    const sizesData = await db.select().from(sizes);

    return (
        <div className="flex-col">
            <div className="flex-1 p-8 pt-6 space-y-4">
                <ProductForm
                    initialData={product}
                    categories={categoriesData}
                    colors={colorsData}
                    sizes={sizesData}
                />
            </div>
        </div>
    );
}

export default ProductPage;