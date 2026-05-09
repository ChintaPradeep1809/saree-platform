'use client';
import { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';

export default function CartPage() {
  const { isAuthenticated } = useAuth();
  const { cart, loading, fetchCart, updateQuantity, removeFromCart } = useCart();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) { router.push('/login?redirect=/cart'); return; }
    fetchCart();
  }, [isAuthenticated]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!isAuthenticated) return null;

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <p className="text-foreground/40 text-sm">Loading cart...</p>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <p className="text-foreground/30 text-lg mb-2">Your cart is empty</p>
        <p className="text-xs text-foreground/30 mb-8">Add some beautiful sarees to get started</p>
        <Link href="/collections" className="inline-block bg-primary text-white px-8 py-3 text-xs tracking-[0.2em] uppercase hover:bg-primary-dark transition-colors">
          Browse Collections
        </Link>
      </div>
    );
  }

  const shipping = cart.totalAmount >= 2000 ? 0 : 99;
  const grandTotal = cart.totalAmount + shipping;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-light tracking-wide mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {cart.items.map((item) => (
            <div key={item.productId} className="flex gap-4 border border-primary/10 p-4">
              {item.productImageUrl ? (
                <div className="relative w-20 h-24 shrink-0">
                  <Image src={item.productImageUrl} alt={item.productName} fill className="object-cover" sizes="80px" />
                </div>
              ) : (
                <div className="w-20 h-24 shrink-0 bg-primary/5 flex items-center justify-center">
                  <span className="text-primary/20 text-2xl">✦</span>
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{item.productName}</p>
                <p className="text-primary font-semibold mt-1 text-sm">₹{item.price.toLocaleString('en-IN')}</p>
                <div className="flex items-center gap-2 mt-3">
                  <button
                    onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                    className="w-7 h-7 border border-primary/20 flex items-center justify-center text-sm disabled:opacity-30 hover:border-primary transition-colors"
                  >−</button>
                  <span className="text-sm w-6 text-center">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                    className="w-7 h-7 border border-primary/20 flex items-center justify-center text-sm hover:border-primary transition-colors"
                  >+</button>
                  <button
                    onClick={() => removeFromCart(item.productId)}
                    className="ml-3 text-xs text-foreground/30 hover:text-red-500 transition-colors"
                  >Remove</button>
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className="text-sm font-semibold text-primary">₹{item.subtotal.toLocaleString('en-IN')}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-cream-dark p-6 h-fit">
          <h2 className="text-xs font-medium tracking-[0.2em] uppercase mb-4">Order Summary</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-foreground/60">{cart.totalItems} item{cart.totalItems !== 1 ? 's' : ''}</span>
              <span>₹{cart.totalAmount.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-foreground/60">Shipping</span>
              <span className={shipping === 0 ? 'text-green-600' : ''}>{shipping === 0 ? 'Free' : `₹${shipping}`}</span>
            </div>
          </div>
          <div className="border-t border-primary/10 mt-4 pt-4 flex justify-between font-semibold text-sm">
            <span>Total</span>
            <span className="text-primary">₹{grandTotal.toLocaleString('en-IN')}</span>
          </div>
          {shipping > 0 && (
            <p className="text-[10px] text-foreground/40 mt-2">Add ₹{(2000 - cart.totalAmount).toLocaleString('en-IN')} more for free shipping</p>
          )}
          <Link
            href="/checkout"
            className="mt-6 block w-full bg-primary text-white text-center py-3.5 text-xs tracking-[0.2em] uppercase hover:bg-primary-dark transition-colors"
          >
            Proceed to Checkout
          </Link>
          <Link href="/collections" className="mt-3 block text-center text-xs text-foreground/40 hover:text-primary transition-colors">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
