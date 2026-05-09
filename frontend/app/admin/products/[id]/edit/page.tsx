'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import ProductForm from '@/components/admin/ProductForm';
import type { CategoryResponse, Product } from '@/types';

const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080/api';

export default function EditProductPage() {
  const { user } = useAuth();
  const params = useParams();
  const id = Number(params.id);

  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`${BASE}/categories`, { headers: { Authorization: `Bearer ${user?.token}` } }).then(r => r.json()),
      fetch(`${BASE}/products/${id}`, { headers: { Authorization: `Bearer ${user?.token}` } }).then(r => r.json()),
    ])
      .then(([cats, prod]) => {
        setCategories(cats);
        setProduct(prod);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user, id]);

  if (loading) return <p className="text-foreground/40 text-sm">Loading...</p>;
  if (!product) return <p className="text-foreground/40 text-sm">Product not found.</p>;

  return (
    <div>
      <h1 className="text-2xl font-light tracking-wide mb-8">Edit Product</h1>
      <ProductForm categories={categories} initial={product} productId={id} />
    </div>
  );
}
