import React, { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import api from '../api/axios';
import { useToast } from './ToastContext';

interface CartItem {
  id: string;
  product_id: string;
  name: string;
  price: number;
  quantity: number;
  image_url: string;
}

interface CartContextType {
  items: CartItem[];
  loading: boolean;
  addToCart: (productId: string, quantity: number) => Promise<void>;
  updateQuantity: (id: string, newQty: number) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  clearCart: () => void;
  subtotal: number;
  cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const fetchCart = useCallback(async () => {
    try {
      const res = await api.get('/cart');
      setItems(res.data);
    } catch (err) {
      console.error('Failed to fetch cart', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = async (productId: string, quantity: number) => {
    try {
      await api.post('/cart', { product_id: productId, quantity });
      await fetchCart();
      showToast('Item added to cart!', 'success');
    } catch (err) {
      showToast('Failed to add item to cart', 'error');
    }
  };

  const updateQuantity = async (id: string, newQty: number) => {
    if (newQty < 1) return;
    try {
      await api.put(`/cart/${id}`, { quantity: newQty });
      setItems((prev) => prev.map(item => item.id === id ? { ...item, quantity: newQty } : item));
    } catch (err) {
      showToast('Failed to update quantity', 'error');
    }
  };

  const removeItem = async (id: string) => {
    try {
      await api.delete(`/cart/${id}`);
      setItems((prev) => prev.filter(item => item.id !== id));
      showToast('Item removed from cart', 'info');
    } catch (err) {
      showToast('Failed to remove item', 'error');
    }
  };

  const clearCart = () => setItems([]);

  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{
      items,
      loading,
      addToCart,
      updateQuantity,
      removeItem,
      clearCart,
      subtotal,
      cartCount
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
