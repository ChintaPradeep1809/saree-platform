import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getProduct } from '@/lib/api';
import AddToCartButton from '@/components/AddToCartButton';

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) notFound();

  const discount =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round((1 - product.price / product.originalPrice) * 100)
      : null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <nav className="text-xs text-foreground/40 mb-8 tracking-wide">
        <Link href="/" className="hover:text-primary transition-colors">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/collections" className="hover:text-primary transition-colors">Collections</Link>
        <span className="mx-2">/</span>
        <Link href={`/collections/${product.categoryId}`} className="hover:text-primary transition-colors">
          {product.categoryName}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-foreground/70">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Image */}
        <div className="relative aspect-[3/4] bg-cream-dark overflow-hidden">
          {product.imageUrls.length > 0 ? (
            <Image
              src={product.imageUrls[0]}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-primary/15 text-7xl font-thin">✦</span>
            </div>
          )}
          {discount && (
            <span className="absolute top-4 left-4 bg-primary text-white text-xs px-3 py-1 tracking-wider">
              -{discount}% OFF
            </span>
          )}
        </div>

        {/* Details */}
        <div className="flex flex-col justify-start pt-2">
          <p className="text-[10px] uppercase tracking-[0.3em] text-primary/50">{product.categoryName}</p>
          <h1 className="text-2xl md:text-3xl font-light tracking-wide text-foreground mt-3">
            {product.name}
          </h1>

          <div className="flex items-baseline gap-3 mt-5">
            <span className="text-2xl font-semibold text-primary">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-base text-foreground/30 line-through">
                ₹{product.originalPrice.toLocaleString('en-IN')}
              </span>
            )}
          </div>

          {product.description && (
            <p className="text-sm text-foreground/60 mt-6 leading-relaxed">{product.description}</p>
          )}

          {(product.fabric || product.color || product.occasion || product.sku) && (
            <div className="mt-6 space-y-2.5 text-sm border-t border-primary/10 pt-6">
              {product.fabric && (
                <div className="flex gap-4">
                  <span className="text-foreground/40 w-20 shrink-0">Fabric</span>
                  <span className="text-foreground">{product.fabric}</span>
                </div>
              )}
              {product.color && (
                <div className="flex gap-4">
                  <span className="text-foreground/40 w-20 shrink-0">Color</span>
                  <span className="text-foreground">{product.color}</span>
                </div>
              )}
              {product.occasion && (
                <div className="flex gap-4">
                  <span className="text-foreground/40 w-20 shrink-0">Occasion</span>
                  <span className="text-foreground">{product.occasion}</span>
                </div>
              )}
              {product.sku && (
                <div className="flex gap-4">
                  <span className="text-foreground/40 w-20 shrink-0">SKU</span>
                  <span className="text-foreground/60">{product.sku}</span>
                </div>
              )}
            </div>
          )}

          <AddToCartButton productId={product.id} outOfStock={product.stockQuantity === 0} />

          {product.stockQuantity > 0 && product.stockQuantity <= 5 && (
            <p className="text-xs text-amber-600 mt-2.5">
              Only {product.stockQuantity} left in stock
            </p>
          )}

          <div className="mt-8 pt-6 border-t border-primary/10 space-y-2 text-xs text-foreground/40 tracking-wide">
            <p>✓ Free shipping on orders above ₹2,000</p>
            <p>✓ Cash on delivery available</p>
            <p>✓ 7-day easy returns</p>
          </div>
        </div>
      </div>
    </div>
  );
}
