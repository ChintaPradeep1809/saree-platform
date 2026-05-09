'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080/api';

interface Stats {
  totalProducts: number;
  totalOrders: number;
  totalUsers: number;
  totalRevenue: number;
}

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetch(`${BASE}/admin/stats`, {
      headers: { Authorization: `Bearer ${user?.token}` },
    })
      .then(r => r.json())
      .then(setStats)
      .catch(() => {});
  }, [user]);

  const cards = stats
    ? [
        { label: 'Active Products', value: stats.totalProducts, href: '/admin/products', color: 'text-primary' },
        { label: 'Total Orders', value: stats.totalOrders, href: '/admin/orders', color: 'text-blue-600' },
        { label: 'Registered Users', value: stats.totalUsers, href: '#', color: 'text-purple-600' },
        {
          label: 'Total Revenue',
          value: `₹${Number(stats.totalRevenue).toLocaleString('en-IN')}`,
          href: '/admin/orders',
          color: 'text-green-600',
        },
      ]
    : [];

  return (
    <div>
      <h1 className="text-2xl font-light tracking-wide mb-8">Dashboard</h1>

      {!stats ? (
        <p className="text-foreground/40 text-sm">Loading stats...</p>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          {cards.map(card => (
            <Link key={card.label} href={card.href} className="bg-white border border-primary/10 p-6 hover:border-primary/30 transition-colors">
              <p className="text-xs text-foreground/40 tracking-wide uppercase mb-2">{card.label}</p>
              <p className={`text-3xl font-semibold ${card.color}`}>{card.value}</p>
            </Link>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link href="/admin/products/new"
          className="flex items-center gap-3 bg-primary text-white px-5 py-4 hover:bg-primary/90 transition-colors">
          <span className="text-xl font-light">+</span>
          <span className="text-sm tracking-wide">Add New Product</span>
        </Link>
        <Link href="/admin/categories"
          className="flex items-center gap-3 bg-white border border-primary/20 px-5 py-4 hover:border-primary/40 transition-colors">
          <span className="text-sm tracking-wide text-foreground/70">Manage Categories</span>
        </Link>
        <Link href="/admin/orders"
          className="flex items-center gap-3 bg-white border border-primary/20 px-5 py-4 hover:border-primary/40 transition-colors">
          <span className="text-sm tracking-wide text-foreground/70">View All Orders</span>
        </Link>
      </div>
    </div>
  );
}
