import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-foreground text-white py-14 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <p className="text-gold text-base font-semibold tracking-[0.2em]">SILK & GRACE</p>
            <p className="text-white/50 text-sm mt-3 leading-relaxed max-w-xs">
              Premium handcrafted sarees from the finest weavers across India. Timeless elegance,
              delivered to your door.
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-5">Shop</p>
            <ul className="space-y-3 text-sm text-white/60">
              <li>
                <Link href="/collections" className="hover:text-gold transition-colors">
                  All Collections
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:text-gold transition-colors">
                  New Arrivals
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-5">Help</p>
            <ul className="space-y-3 text-sm text-white/60">
              <li>
                <Link href="/contact" className="hover:text-gold transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="hover:text-gold transition-colors">
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link href="/returns" className="hover:text-gold transition-colors">
                  Returns & Exchanges
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-6 border-t border-white/10 text-center text-xs text-white/25">
          © {new Date().getFullYear()} Silk & Grace. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
