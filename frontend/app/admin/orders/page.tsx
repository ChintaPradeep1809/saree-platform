'use client';

import { useEffect, useState } from 'react';
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

const ALL_STATUSES = ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

export default function AdminOrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const fetchOrders = () => {
    fetch(`${BASE}/orders/admin/all`, {
      headers: { Authorization: `Bearer ${user?.token}` },
    })
      .then(r => r.json())
      .then(setOrders)
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchOrders(); }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  const updateStatus = async (orderId: number, status: string) => {
    setUpdatingId(orderId);
    await fetch(`${BASE}/orders/admin/${orderId}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user?.token}` },
      body: JSON.stringify({ status }),
    });
    setUpdatingId(null);
    fetchOrders();
  };

  return (
    <div>
      <h1 className="text-2xl font-light tracking-wide mb-6">All Orders</h1>

      {loading ? (
        <p className="text-foreground/40 text-sm">Loading orders...</p>
      ) : orders.length === 0 ? (
        <p className="text-foreground/30 text-sm py-12 text-center">No orders yet</p>
      ) : (
        <div className="bg-white border border-primary/10 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-primary/5 border-b border-primary/10">
              <tr>
                <th className="text-left px-4 py-3 text-xs tracking-wide text-foreground/50 font-normal">Order</th>
                <th className="text-left px-4 py-3 text-xs tracking-wide text-foreground/50 font-normal">Customer</th>
                <th className="text-left px-4 py-3 text-xs tracking-wide text-foreground/50 font-normal">Items</th>
                <th className="text-left px-4 py-3 text-xs tracking-wide text-foreground/50 font-normal">Amount</th>
                <th className="text-left px-4 py-3 text-xs tracking-wide text-foreground/50 font-normal">Date</th>
                <th className="text-left px-4 py-3 text-xs tracking-wide text-foreground/50 font-normal">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-primary/5">
              {orders.map(order => (
                <tr key={order.id} className="hover:bg-primary/2 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs text-foreground/50">#{order.id}</td>
                  <td className="px-4 py-3">
                    <p className="font-medium">{order.shippingName}</p>
                    <p className="text-xs text-foreground/40">{order.shippingPhone}</p>
                    <p className="text-xs text-foreground/40">{order.shippingCity}, {order.shippingState}</p>
                  </td>
                  <td className="px-4 py-3">
                    <div className="space-y-0.5">
                      {order.items.map((item, i) => (
                        <p key={i} className="text-xs text-foreground/70">
                          {item.productName} <span className="text-foreground/40">×{item.quantity}</span>
                        </p>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 font-semibold text-primary">
                    ₹{order.totalAmount.toLocaleString('en-IN')}
                  </td>
                  <td className="px-4 py-3 text-xs text-foreground/50">
                    {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={order.status}
                      disabled={updatingId === order.id}
                      onChange={e => updateStatus(order.id, e.target.value)}
                      className={`text-[11px] px-2 py-1 border-0 rounded-none cursor-pointer focus:outline-none disabled:opacity-50 ${STATUS_COLORS[order.status] ?? 'bg-gray-100 text-gray-600'}`}
                    >
                      {ALL_STATUSES.map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
