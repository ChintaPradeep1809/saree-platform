'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import ProductForm from '@/components/admin/ProductForm';
import type { CategoryResponse } from '@/types';

const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080/api';

export default function NewProductPage() {
  const { user } = useAuth();
  const [categories, setCategories] = useState<CategoryResponse[]>([]);

  useEffect(() => {
    fetch(`${BASE}/categories`, {
      headers: { Authorization: `Bearer ${user?.token}` },
    })
      .then(r => r.json())
      .then(setCategories)
      .catch(() => {});
  }, [user]);

  return (
    <div>
      <h1 className="text-2xl font-light tracking-wide mb-8">Add New Product</h1>
      <ProductForm categories={categories} />
    </div>
  );
}
