'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';

const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080/api';

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Delhi', 'Jammu & Kashmir', 'Ladakh', 'Puducherry',
];

export default function CheckoutPage() {
  const { user, isAuthenticated } = useAuth();
  const { cart, fetchCart } = useCart();
  const router = useRouter();

  const [form, setForm] = useState({
    name: '', phone: '', addressLine1: '', addressLine2: '',
    city: '', state: '', pincode: '', notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated) { router.push('/login?redirect=/checkout'); return; }
    fetchCart();
    if (user) setForm(f => ({ ...f, name: user.name }));
  }, [isAuthenticated]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!isAuthenticated) return null;

  if (!cart || cart.items.length === 0) {
    router.replace('/cart');
    return null;
  }

  const shipping = cart.totalAmount >= 2000 ? 0 : 99;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`${BASE}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user!.token}`,
        },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error((err as { message?: string }).message || 'Failed to place order');
      }
      const order = await res.json();
      router.push(`/orders/${order.id}?new=1`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  const inputCls = 'w-full border border-primary/20 px-4 py-3 text-sm text-foreground bg-transparent focus:outline-none focus:border-primary transition-colors';
  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [field]: e.target.value }));

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-light tracking-wide mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-4">
          <h2 className="text-xs tracking-[0.2em] uppercase text-foreground/50 mb-2">Shipping Address</h2>

          {error && <p className="text-xs text-red-500">{error}</p>}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input type="text" placeholder="Full name" required value={form.name} onChange={set('name')} className={inputCls} />
            <input type="tel" placeholder="Phone number" required pattern="^[6-9]\d{9}$" title="Enter a valid 10-digit Indian mobile number" value={form.phone} onChange={set('phone')} className={inputCls} />
          </div>
          <input type="text" placeholder="Address line 1" required value={form.addressLine1} onChange={set('addressLine1')} className={inputCls} />
          <input type="text" placeholder="Address line 2 (optional)" value={form.addressLine2} onChange={set('addressLine2')} className={inputCls} />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <input type="text" placeholder="City" required value={form.city} onChange={set('city')} className={inputCls} />
            <select required value={form.state} onChange={set('state')} className={inputCls}>
              <option value="">State</option>
              {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <input type="text" placeholder="Pincode" required pattern="^[1-9][0-9]{5}$" title="Enter a valid 6-digit pincode" value={form.pincode} onChange={set('pincode')} className={inputCls} />
          </div>
          <textarea placeholder="Order notes (optional)" value={form.notes} onChange={set('notes')} rows={3} className={inputCls + ' resize-none'} />

          <div className="pt-2">
            <p className="text-xs text-foreground/40 mb-4">Payment: Cash on Delivery</p>
            <button
              type="submit" disabled={loading}
              className="w-full bg-primary text-white py-4 text-xs tracking-[0.25em] uppercase hover:bg-primary-dark transition-colors disabled:opacity-40"
            >
              {loading ? 'Placing Order...' : 'Place Order'}
            </button>
          </div>
        </form>

        <div className="bg-cream-dark p-6 h-fit">
          <h2 className="text-xs tracking-[0.2em] uppercase mb-4">Order Summary</h2>
          <div className="space-y-2 text-sm mb-4">
            {cart.items.map(item => (
              <div key={item.productId} className="flex justify-between text-sm">
                <span className="text-foreground/70 truncate mr-2">{item.productName} ×{item.quantity}</span>
                <span className="shrink-0">₹{item.subtotal.toLocaleString('en-IN')}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-primary/10 pt-3 space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-foreground/60">Shipping</span>
              <span className={shipping === 0 ? 'text-green-600' : ''}>{shipping === 0 ? 'Free' : `₹${shipping}`}</span>
            </div>
            <div className="flex justify-between font-semibold mt-2">
              <span>Total</span>
              <span className="text-primary">₹{(cart.totalAmount + shipping).toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
