'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const { cartCount } = useCart();

  return (
    <header className="bg-primary text-white sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-lg font-semibold tracking-[0.2em] text-gold hover:opacity-90 transition-opacity">
            SILK & GRACE
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm tracking-wide">
            <Link href="/" className="hover:text-gold transition-colors">Home</Link>
            <Link href="/collections" className="hover:text-gold transition-colors">Collections</Link>
            {isAuthenticated && (
              <Link href="/orders" className="hover:text-gold transition-colors">My Orders</Link>
            )}
          </nav>

          <div className="flex items-center gap-5">
            <Link href="/cart" aria-label="Cart" className="relative hover:text-gold transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-gold text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </Link>

            {isAuthenticated ? (
              <div className="hidden md:flex items-center gap-4 text-sm">
                <span className="text-white/60 text-xs">{user!.name}</span>
                <button onClick={logout} className="hover:text-gold transition-colors text-sm">Logout</button>
              </div>
            ) : (
              <Link href="/login" className="hidden md:inline-block text-sm hover:text-gold transition-colors">
                Login
              </Link>
            )}

            <button className="md:hidden hover:text-gold transition-colors" onClick={() => setOpen(!open)} aria-label="Toggle menu">
              {open ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"
                  fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"
                  fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {open && (
          <div className="md:hidden border-t border-white/10 py-4 pb-5">
            <nav className="flex flex-col gap-4 text-sm tracking-wide">
              <Link href="/" onClick={() => setOpen(false)} className="hover:text-gold transition-colors">Home</Link>
              <Link href="/collections" onClick={() => setOpen(false)} className="hover:text-gold transition-colors">Collections</Link>
              {isAuthenticated ? (
                <>
                  <Link href="/orders" onClick={() => setOpen(false)} className="hover:text-gold transition-colors">My Orders</Link>
                  <button onClick={() => { logout(); setOpen(false); }} className="text-left hover:text-gold transition-colors">Logout</button>
                </>
              ) : (
                <Link href="/login" onClick={() => setOpen(false)} className="hover:text-gold transition-colors">Login</Link>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
