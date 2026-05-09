import Link from 'next/link';
import { getLatestProducts, getCategories } from '@/lib/api';
import ProductCard from '@/components/ProductCard';

export default async function HomePage() {
  const [products, categories] = await Promise.all([
    getLatestProducts(),
    getCategories(),
  ]);

  return (
    <div>
      {/* Hero */}
      <section className="bg-primary text-white py-28 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-gold text-xs tracking-[0.3em] uppercase mb-5">Premium Indian Sarees</p>
          <h1 className="text-4xl md:text-6xl font-light tracking-tight leading-tight mb-6">
            Drape Yourself in<br />Timeless Elegance
          </h1>
          <p className="text-white/60 text-base md:text-lg mb-10 max-w-lg mx-auto leading-relaxed">
            Handpicked silks, cottons and weaves from master weavers across India.
          </p>
          <Link
            href="/collections"
            className="inline-block border border-gold text-gold px-10 py-3.5 text-xs tracking-[0.25em] uppercase hover:bg-gold hover:text-white transition-all duration-300"
          >
            Explore Collections
          </Link>
        </div>
      </section>

      {/* Categories Strip */}
      {categories.length > 0 && (
        <section className="py-16 px-4 bg-cream-dark">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-lg font-light tracking-[0.15em] uppercase text-foreground">
                Shop by Category
              </h2>
              <Link
                href="/collections"
                className="text-xs text-primary tracking-widest uppercase hover:text-gold transition-colors"
              >
                View All →
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {categories.slice(0, 4).map((cat) => (
                <Link
                  key={cat.id}
                  href={`/collections/${cat.id}`}
                  className="group relative aspect-square bg-primary/5 overflow-hidden flex items-center justify-center hover:bg-primary transition-all duration-300"
                >
                  <div className="text-center p-4">
                    <p className="text-sm font-light tracking-widest uppercase text-foreground group-hover:text-white transition-colors">
                      {cat.name}
                    </p>
                    {cat.description && (
                      <p className="text-[10px] text-foreground/40 group-hover:text-white/60 mt-1 transition-colors line-clamp-2">
                        {cat.description}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* New Arrivals */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-lg font-light tracking-[0.15em] uppercase text-foreground mb-8">
            New Arrivals
          </h2>
          {products.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-foreground/30 text-sm tracking-wide">
                No products yet. Check back soon.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Trust Strip */}
      <section className="bg-cream-dark py-10 px-4 border-t border-primary/5">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {[
            { title: 'Free Shipping', desc: 'On all orders above ₹2,000' },
            { title: 'Easy Returns', desc: '7-day hassle-free returns' },
            { title: 'Cash on Delivery', desc: 'Pay when you receive' },
          ].map((item) => (
            <div key={item.title}>
              <p className="text-sm font-medium tracking-wide text-foreground">{item.title}</p>
              <p className="text-xs text-foreground/40 mt-1">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
