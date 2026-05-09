import Link from 'next/link';
import Image from 'next/image';
import type { Product } from '@/types';

export default function ProductCard({ product }: { product: Product }) {
  const hasImage = product.imageUrls && product.imageUrls.length > 0;
  const discount =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round((1 - product.price / product.originalPrice) * 100)
      : null;

  return (
    <Link href={`/products/${product.id}`} className="group block">
      <div className="relative aspect-[3/4] bg-cream-dark overflow-hidden">
        {hasImage ? (
          <Image
            src={product.imageUrls[0]}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-primary/5">
            <span className="text-primary/20 text-5xl font-thin">✦</span>
          </div>
        )}
        {discount && (
          <span className="absolute top-2 left-2 bg-primary text-white text-[10px] px-2 py-0.5 tracking-wide">
            -{discount}%
          </span>
        )}
      </div>
      <div className="mt-3">
        <p className="text-[10px] uppercase tracking-widest text-primary/50">{product.categoryName}</p>
        <h3 className="text-sm text-foreground mt-1 line-clamp-1 group-hover:text-primary transition-colors">
          {product.name}
        </h3>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-sm font-semibold text-primary">
            ₹{product.price.toLocaleString('en-IN')}
          </span>
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="text-xs text-foreground/30 line-through">
              ₹{product.originalPrice.toLocaleString('en-IN')}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
