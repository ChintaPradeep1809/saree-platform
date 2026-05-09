'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import type { Product } from '@/types';

const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080/api';

export default function AdminProductsPage() {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const fetchProducts = () => {
    fetch(`${BASE}/products?size=100`, {
      headers: { Authorization: `Bearer ${user?.token}` },
    })
      .then(r => r.json())
      .then(d => setProducts(d.content ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchProducts(); }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    setDeletingId(id);
    await fetch(`${BASE}/products/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${user?.token}` },
    });
    setDeletingId(null);
    fetchProducts();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-light tracking-wide">Products</h1>
        <Link href="/admin/products/new"
          className="bg-primary text-white px-5 py-2 text-xs tracking-[0.15em] uppercase hover:bg-primary/90 transition-colors">
          + Add Product
        </Link>
      </div>

      {loading ? (
        <p className="text-foreground/40 text-sm">Loading products...</p>
      ) : products.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-foreground/30 text-sm mb-4">No products yet</p>
          <Link href="/admin/products/new" className="text-primary text-sm hover:underline">Add your first product →</Link>
        </div>
      ) : (
        <div className="bg-white border border-primary/10 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-primary/5 border-b border-primary/10">
              <tr>
                <th className="text-left px-4 py-3 text-xs tracking-wide text-foreground/50 font-normal">Product</th>
                <th className="text-left px-4 py-3 text-xs tracking-wide text-foreground/50 font-normal">Category</th>
                <th className="text-left px-4 py-3 text-xs tracking-wide text-foreground/50 font-normal">Price</th>
                <th className="text-left px-4 py-3 text-xs tracking-wide text-foreground/50 font-normal">Stock</th>
                <th className="text-left px-4 py-3 text-xs tracking-wide text-foreground/50 font-normal">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-primary/5">
              {products.map(product => (
                <tr key={product.id} className="hover:bg-primary/2 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-cream-dark flex-shrink-0 overflow-hidden relative">
                        {product.imageUrls.length > 0 ? (
                          <Image src={product.imageUrls[0]} alt={product.name} fill className="object-cover" sizes="40px" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-primary/20 text-lg">✦</div>
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{product.name}</p>
                        {product.sku && <p className="text-xs text-foreground/40">{product.sku}</p>}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-foreground/60">{product.categoryName}</td>
                  <td className="px-4 py-3">
                    <span className="font-medium text-primary">₹{product.price.toLocaleString('en-IN')}</span>
                    {product.originalPrice && product.originalPrice > product.price && (
                      <span className="text-xs text-foreground/30 line-through ml-2">₹{product.originalPrice.toLocaleString('en-IN')}</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 ${product.stockQuantity === 0 ? 'bg-red-100 text-red-600' : product.stockQuantity <= 5 ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}`}>
                      {product.stockQuantity === 0 ? 'Out of stock' : `${product.stockQuantity} left`}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Link href={`/admin/products/${product.id}/edit`} className="text-xs text-primary hover:underline">Edit</Link>
                      <button
                        onClick={() => handleDelete(product.id, product.name)}
                        disabled={deletingId === product.id}
                        className="text-xs text-red-500 hover:underline disabled:opacity-40"
                      >
                        {deletingId === product.id ? 'Deleting...' : 'Delete'}
                      </button>
                    </div>
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
