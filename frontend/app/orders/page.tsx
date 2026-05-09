'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import type { Order } from '@/types';

const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080/api';

const STATUS_COLORS: Record<string, string> = {
  PENDING: 'bg-amber-100 text-amber-700',
  CONFIRMED: 'bg-blue-100 text-blue-700',
  SHIPPED: 'bg-purple-100 text-purple-700',
  DELIVERED: 'bg-green-100 text-green-700',
  CANCELLED: 'bg-red-100 text-red-600',
};

export default function OrdersPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) { router.push('/login?redirect=/orders'); return; }
    fetch(`${BASE}/orders`, {
      headers: { Authorization: `Bearer ${user!.token}` },
    })
      .then(r => r.json())
      .then(setOrders)
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, [isAuthenticated]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!isAuthenticated) return null;

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <p className="text-foreground/40 text-sm">Loading orders...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-light tracking-wide mb-8">My Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-foreground/30 text-sm mb-6">No orders yet</p>
          <Link href="/collections" className="inline-block bg-primary text-white px-8 py-3 text-xs tracking-[0.2em] uppercase hover:bg-primary-dark transition-colors">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <Link key={order.id} href={`/orders/${order.id}`} className="block border border-primary/10 p-5 hover:border-primary/30 transition-colors">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs text-foreground/40 tracking-wide">Order #{order.id}</p>
                  <p className="text-sm font-medium mt-1">{order.items.length} item{order.items.length !== 1 ? 's' : ''}</p>
                  <p className="text-xs text-foreground/40 mt-1">
                    {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <span className={`text-[10px] px-2.5 py-1 tracking-wider uppercase ${STATUS_COLORS[order.status] ?? 'bg-gray-100 text-gray-600'}`}>
                    {order.status}
                  </span>
                  <p className="text-primary font-semibold mt-2 text-sm">₹{order.totalAmount.toLocaleString('en-IN')}</p>
                </div>
              </div>
              <p className="text-xs text-foreground/40 mt-3 truncate">
                {order.items.map(i => i.productName).join(', ')}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
