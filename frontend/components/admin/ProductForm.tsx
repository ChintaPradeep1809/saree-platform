'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import type { CategoryResponse, Product } from '@/types';

const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080/api';

interface Props {
  categories: CategoryResponse[];
  initial?: Partial<Product>;
  productId?: number;
}

export default function ProductForm({ categories, initial, productId }: Props) {
  const { user } = useAuth();
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    name: initial?.name ?? '',
    description: initial?.description ?? '',
    price: initial?.price?.toString() ?? '',
    originalPrice: initial?.originalPrice?.toString() ?? '',
    stockQuantity: initial?.stockQuantity?.toString() ?? '0',
    sku: initial?.sku ?? '',
    fabric: initial?.fabric ?? '',
    color: initial?.color ?? '',
    occasion: initial?.occasion ?? '',
    categoryId: initial?.categoryId?.toString() ?? '',
  });
  const [imageUrls, setImageUrls] = useState<string[]>(initial?.imageUrls ?? []);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [key]: e.target.value }));

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        const fd = new FormData();
        fd.append('file', file);
        const res = await fetch(`${BASE}/admin/upload`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${user?.token}` },
          body: fd,
        });
        const data = await res.json();
        if (data.url) setImageUrls(prev => [...prev, data.url]);
      }
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const removeImage = (url: string) => setImageUrls(prev => prev.filter(u => u !== url));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      const body = {
        name: form.name,
        description: form.description || null,
        price: parseFloat(form.price),
        originalPrice: form.originalPrice ? parseFloat(form.originalPrice) : null,
        stockQuantity: parseInt(form.stockQuantity) || 0,
        sku: form.sku || null,
        fabric: form.fabric || null,
        color: form.color || null,
        occasion: form.occasion || null,
        categoryId: parseInt(form.categoryId),
        imageUrls,
      };

      const res = await fetch(productId ? `${BASE}/products/${productId}` : `${BASE}/products`, {
        method: productId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user?.token}` },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.message ?? 'Failed to save product');
        return;
      }
      router.push('/admin/products');
    } catch {
      setError('Network error, please try again');
    } finally {
      setSaving(false);
    }
  };

  const inputClass = 'w-full border border-primary/20 px-3 py-2 text-sm bg-white focus:outline-none focus:border-primary/50 transition-colors';
  const labelClass = 'block text-xs text-foreground/50 tracking-wide mb-1';

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3">{error}</div>
      )}

      {/* Images */}
      <div>
        <p className={labelClass}>Product Images</p>
        <div className="flex flex-wrap gap-3 mb-3">
          {imageUrls.map((url, i) => (
            <div key={url} className="relative w-24 h-24 bg-cream-dark overflow-hidden group">
              <Image src={url} alt={`Image ${i + 1}`} fill className="object-cover" sizes="96px" />
              {i === 0 && (
                <span className="absolute top-1 left-1 bg-primary text-white text-[9px] px-1.5 py-0.5">Primary</span>
              )}
              <button
                type="button"
                onClick={() => removeImage(url)}
                className="absolute top-1 right-1 bg-red-500 text-white text-[10px] w-5 h-5 items-center justify-center hidden group-hover:flex"
              >
                ✕
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="w-24 h-24 border-2 border-dashed border-primary/20 flex flex-col items-center justify-center gap-1 hover:border-primary/40 transition-colors text-foreground/30 hover:text-foreground/50 disabled:opacity-50"
          >
            <span className="text-2xl leading-none">+</span>
            <span className="text-[10px]">{uploading ? 'Uploading...' : 'Add Image'}</span>
          </button>
        </div>
        <input ref={fileRef} type="file" accept="image/*" multiple onChange={handleUpload} className="hidden" />
        <p className="text-[10px] text-foreground/30">First image is shown as primary. Max 10 MB per file.</p>
      </div>

      {/* Name + SKU */}
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2 md:col-span-1">
          <label className={labelClass}>Product Name *</label>
          <input required value={form.name} onChange={set('name')} className={inputClass} placeholder="e.g. Kanchipuram Pure Silk Saree" />
        </div>
        <div>
          <label className={labelClass}>SKU</label>
          <input value={form.sku} onChange={set('sku')} className={inputClass} placeholder="e.g. SILK-001" />
        </div>
      </div>

      {/* Description */}
      <div>
        <label className={labelClass}>Description</label>
        <textarea value={form.description} onChange={set('description')} rows={3}
          className={inputClass + ' resize-none'} placeholder="Brief description of the saree..." />
      </div>

      {/* Price */}
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className={labelClass}>Selling Price (₹) *</label>
          <input required type="number" min="1" step="0.01" value={form.price} onChange={set('price')} className={inputClass} placeholder="8500" />
        </div>
        <div>
          <label className={labelClass}>Original Price (₹)</label>
          <input type="number" min="1" step="0.01" value={form.originalPrice} onChange={set('originalPrice')} className={inputClass} placeholder="10000" />
        </div>
        <div>
          <label className={labelClass}>Stock Quantity</label>
          <input type="number" min="0" value={form.stockQuantity} onChange={set('stockQuantity')} className={inputClass} placeholder="0" />
        </div>
      </div>

      {/* Category + Fabric + Color + Occasion */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Category *</label>
          <select required value={form.categoryId} onChange={set('categoryId')} className={inputClass}>
            <option value="">Select category</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass}>Fabric</label>
          <input value={form.fabric} onChange={set('fabric')} className={inputClass} placeholder="e.g. Pure Silk" />
        </div>
        <div>
          <label className={labelClass}>Color</label>
          <input value={form.color} onChange={set('color')} className={inputClass} placeholder="e.g. Deep Red" />
        </div>
        <div>
          <label className={labelClass}>Occasion</label>
          <input value={form.occasion} onChange={set('occasion')} className={inputClass} placeholder="e.g. Wedding, Festival" />
        </div>
      </div>

      <div className="flex gap-4 pt-2">
        <button type="submit" disabled={saving}
          className="bg-primary text-white px-8 py-2.5 text-xs tracking-[0.15em] uppercase hover:bg-primary/90 transition-colors disabled:opacity-50">
          {saving ? 'Saving...' : productId ? 'Update Product' : 'Create Product'}
        </button>
        <button type="button" onClick={() => router.push('/admin/products')}
          className="px-6 py-2.5 text-xs tracking-wide text-foreground/50 border border-primary/15 hover:border-primary/30 transition-colors">
          Cancel
        </button>
      </div>
    </form>
  );
}
