'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import type { Order } from '@/types';
import { Suspense } from 'react';

const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080/api';

const STATUS_COLORS: Record<string, string> = {
  PENDING: 'bg-amber-100 text-amber-700',
  CONFIRMED: 'bg-blue-100 text-blue-700',
  SHIPPED: 'bg-purple-100 text-purple-700',
  DELIVERED: 'bg-green-100 text-green-700',
  CANCELLED: 'bg-red-100 text-red-600',
};

function OrderDetail() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const isNew = searchParams.get('new') === '1';
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) { router.push('/login'); return; }
    fetch(`${BASE}/orders/${params.id}`, {
      headers: { Authorization: `Bearer ${user!.token}` },
    })
      .then(r => r.json())
      .then(setOrder)
      .catch(() => setOrder(null))
      .finally(() => setLoading(false));
  }, [isAuthenticated]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!isAuthenticated) return null;

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <p className="text-foreground/40 text-sm">Loading order...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <p className="text-foreground/30 text-sm">Order not found.</p>
        <Link href="/orders" className="text-primary text-xs mt-4 inline-block hover:underline">← My Orders</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {isNew && (
        <div className="bg-green-50 border border-green-200 text-green-800 text-sm px-5 py-4 mb-8">
          <p className="font-medium">Order placed successfully!</p>
          <p className="text-xs mt-1 text-green-600">Thank you for your order. We will confirm it shortly.</p>
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-xs text-foreground/40 tracking-wide">Order #{order.id}</p>
          <h1 className="text-xl font-light tracking-wide mt-1">Order Details</h1>
        </div>
        <span className={`text-[10px] px-3 py-1.5 tracking-wider uppercase ${STATUS_COLORS[order.status] ?? 'bg-gray-100 text-gray-600'}`}>
          {order.status}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="border border-primary/10 p-5">
          <h2 className="text-xs tracking-[0.2em] uppercase text-foreground/50 mb-3">Items Ordered</h2>
          <div className="space-y-3">
            {order.items.map((item, i) => (
              <div key={i} className="flex justify-between text-sm">
                <span className="text-foreground/70">{item.productName} <span className="text-foreground/40">×{item.quantity}</span></span>
                <span>₹{item.subtotal.toLocaleString('en-IN')}</span>
              </div>
            ))}
            <div className="border-t border-primary/10 pt-3 flex justify-between font-semibold text-sm">
              <span>Total</span>
              <span className="text-primary">₹{order.totalAmount.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>

        <div className="border border-primary/10 p-5">
          <h2 className="text-xs tracking-[0.2em] uppercase text-foreground/50 mb-3">Shipping To</h2>
          <div className="text-sm text-foreground/70 space-y-1">
            <p className="font-medium text-foreground">{order.shippingName}</p>
            <p>{order.shippingPhone}</p>
            <p>{order.shippingAddressLine1}</p>
            {order.shippingAddressLine2 && <p>{order.shippingAddressLine2}</p>}
            <p>{order.shippingCity}, {order.shippingState} - {order.shippingPincode}</p>
          </div>
          {order.notes && (
            <div className="mt-3 pt-3 border-t border-primary/10">
              <p className="text-xs text-foreground/40">Notes: {order.notes}</p>
            </div>
          )}
        </div>
      </div>

      <p className="text-xs text-foreground/30 mb-6">
        Ordered on {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
      </p>

      <div className="flex gap-4">
        <Link href="/orders" className="text-xs text-primary hover:underline">← My Orders</Link>
        <Link href="/collections" className="text-xs text-foreground/40 hover:text-primary transition-colors">Continue Shopping →</Link>
      </div>
    </div>
  );
}

export default function OrderDetailPage() {
  return (
    <Suspense>
      <OrderDetail />
    </Suspense>
  );
}
