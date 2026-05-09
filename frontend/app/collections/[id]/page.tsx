import { notFound } from 'next/navigation';
import { getCategories, getProductsByCategory } from '@/lib/api';
import ProductCard from '@/components/ProductCard';

export default async function CollectionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [categories, { content: products }] = await Promise.all([
    getCategories(),
    getProductsByCategory(id),
  ]);

  const category = categories.find((c) => c.id === parseInt(id));
  if (!category) notFound();

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="mb-10">
        <p className="text-xs text-primary/50 tracking-widest uppercase mb-2">Collections</p>
        <h1 className="text-2xl font-light tracking-[0.12em] uppercase">{category.name}</h1>
        {category.description && (
          <p className="text-sm text-foreground/50 mt-2 max-w-xl">{category.description}</p>
        )}
      </div>

      {products.length === 0 ? (
        <div className="text-center py-24">
          <p className="text-foreground/30 text-sm">No products in this collection yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
