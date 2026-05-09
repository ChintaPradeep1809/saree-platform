'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isAdmin, user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isAuthenticated || !isAdmin) {
      router.push('/');
    }
  }, [isAuthenticated, isAdmin, router]);

  if (!isAuthenticated || !isAdmin) return null;

  const links = [
    { href: '/admin/dashboard', label: 'Dashboard' },
    { href: '/admin/products', label: 'Products' },
    { href: '/admin/categories', label: 'Categories' },
    { href: '/admin/orders', label: 'Orders' },
  ];

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      <aside className="w-52 bg-primary text-white flex-shrink-0">
        <div className="px-5 py-6 border-b border-white/10">
          <p className="text-[10px] uppercase tracking-[0.25em] text-white/50">Admin Panel</p>
          <p className="text-sm font-medium mt-1 text-gold truncate">{user?.name}</p>
        </div>
        <nav className="py-4">
          {links.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className={`block px-5 py-3 text-sm transition-colors ${
                pathname.startsWith(link.href)
                  ? 'bg-white/10 text-gold'
                  : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="px-5 py-4 border-t border-white/10 mt-auto">
          <Link href="/" className="text-xs text-white/40 hover:text-white transition-colors">
            ← Back to Store
          </Link>
        </div>
      </aside>
      <main className="flex-1 bg-cream p-8 overflow-auto">
        {children}
      </main>
    </div>
  );
}
