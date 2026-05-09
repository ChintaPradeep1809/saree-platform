'use client';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { useRouter } from 'next/navigation';

export default function AddToCartButton({
  productId,
  outOfStock,
}: {
  productId: number;
  outOfStock: boolean;
}) {
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [added, setAdded] = useState(false);

  const handleClick = async () => {
    if (!isAuthenticated) {
      router.push('/login?redirect=/products/' + productId);
      return;
    }
    setLoading(true);
    try {
      await addToCart(productId, 1);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } catch {
      alert('Could not add to cart. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={outOfStock || loading}
      className="mt-8 bg-primary text-white py-4 px-10 text-xs tracking-[0.25em] uppercase hover:bg-primary-dark transition-colors disabled:opacity-40 disabled:cursor-not-allowed w-full md:w-auto"
    >
      {outOfStock ? 'Out of Stock' : loading ? 'Adding...' : added ? 'Added to Cart ✓' : 'Add to Cart'}
    </button>
  );
}
