import Link from 'next/link';
import { getCategories } from '@/lib/api';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Collections — Silk & Grace',
};

export default async function CollectionsPage() {
  const categories = await getCategories();

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="mb-10">
        <p className="text-xs text-primary/50 tracking-widest uppercase mb-2">Browse</p>
        <h1 className="text-2xl font-light tracking-[0.12em] uppercase">Our Collections</h1>
      </div>

      {categories.length === 0 ? (
        <div className="text-center py-24">
          <p className="text-foreground/30 text-sm">No collections yet. Check back soon.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <Link key={cat.id} href={`/collections/${cat.id}`} className="group block">
              <div className="aspect-[4/3] bg-primary/5 flex items-center justify-center group-hover:bg-primary transition-all duration-300">
                <div className="text-center p-8">
                  <p className="text-xl font-light tracking-widest uppercase text-foreground group-hover:text-white transition-colors">
                    {cat.name}
                  </p>
                  {cat.description && (
                    <p className="text-xs text-foreground/40 group-hover:text-white/60 mt-3 transition-colors leading-relaxed">
                      {cat.description}
                    </p>
                  )}
                </div>
              </div>
              <div className="mt-3">
                <p className="text-sm font-light text-foreground group-hover:text-primary transition-colors">
                  {cat.name}
                </p>
                <p className="text-xs text-primary/50 tracking-wider mt-0.5">Shop Now →</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
