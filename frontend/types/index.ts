export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  originalPrice: number | null;
  stockQuantity: number;
  sku: string | null;
  fabric: string | null;
  color: string | null;
  occasion: string | null;
  active: boolean;
  categoryId: number;
  categoryName: string;
  imageUrls: string[];
  createdAt: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  active: boolean;
  createdAt: string;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export interface AuthUser {
  name: string;
  email: string;
  role: string;
  token: string;
}

export interface CartItem {
  productId: number;
  productName: string;
  productImageUrl: string | null;
  price: number;
  quantity: number;
  subtotal: number;
}

export interface Cart {
  id: number;
  items: CartItem[];
  totalItems: number;
  totalAmount: number;
}

export interface OrderItem {
  productId: number;
  productName: string;
  productImageUrl: string | null;
  priceAtOrder: number;
  quantity: number;
  subtotal: number;
}

export interface Order {
  id: number;
  status: string;
  items: OrderItem[];
  totalAmount: number;
  shippingName: string;
  shippingPhone: string;
  shippingAddressLine1: string;
  shippingAddressLine2: string | null;
  shippingCity: string;
  shippingState: string;
  shippingPincode: string;
  notes: string | null;
  createdAt: string;
}
