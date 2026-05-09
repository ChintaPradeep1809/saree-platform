import type { Product, Category, PageResponse } from '@/types';

const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080/api';

export async function getLatestProducts(): Promise<Product[]> {
  try {
    const res = await fetch(`${BASE}/products/latest`);
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export async function getCategories(): Promise<Category[]> {
  try {
    const res = await fetch(`${BASE}/categories`);
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export async function getProduct(id: string): Promise<Product | null> {
  try {
    const res = await fetch(`${BASE}/products/${id}`);
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function getProductsByCategory(categoryId: string): Promise<PageResponse<Product>> {
  const empty: PageResponse<Product> = { content: [], totalElements: 0, totalPages: 0, size: 12, number: 0 };
  try {
    const res = await fetch(`${BASE}/products/category/${categoryId}?page=0&size=12`);
    if (!res.ok) return empty;
    return res.json();
  } catch {
    return empty;
  }
}
