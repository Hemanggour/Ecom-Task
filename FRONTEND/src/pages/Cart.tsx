import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

interface CartItem {
  id: string;
  product_id: string;
  name: string;
  price: number;
  quantity: number;
  image_url: string;
}

const Cart: React.FC = () => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchCart = async () => {
    try {
      const res = await api.get('/cart');
      setItems(res.data);
    } catch (err) {
      console.error('Failed to fetch cart', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const updateQuantity = async (id: string, newQty: number) => {
    if (newQty < 1) return;
    try {
      await api.put(`/cart/${id}`, { quantity: newQty });
      setItems(items.map(item => item.id === id ? { ...item, quantity: newQty } : item));
    } catch (err) {
      alert('Failed to update quantity');
    }
  };

  const removeItem = async (id: string) => {
    try {
      await api.delete(`/cart/${id}`);
      setItems(items.filter(item => item.id !== id));
    } catch (err) {
      alert('Failed to remove item');
    }
  };

  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  if (loading) {
    return (
      <div className="container py-20 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container py-20 text-center">
        <div className="flex justify-center mb-6 text-muted">
          <ShoppingBag size={64} />
        </div>
        <h2 className="text-3xl font-bold mb-4">Your cart is empty</h2>
        <p className="text-muted mb-8">Looks like you haven't added anything to your cart yet.</p>
        <Link to="/" className="btn btn-primary py-3 px-8">Start Shopping</Link>
      </div>
    );
  }

  return (
    <div className="container py-10">
      <h1 className="text-4xl font-bold mb-10">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item.id} className="card flex items-center gap-6">
              <div className="h-24 w-24 rounded-lg overflow-hidden bg-slate-800 flex-shrink-0">
                {item.image_url ? (
                  <img src={`http://localhost:5000${item.image_url}`} alt={item.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted"><ShoppingBag size={20} /></div>
                )}
              </div>
              
              <div className="flex-grow">
                <h3 className="font-bold text-lg">{item.name}</h3>
                <p className="text-primary font-bold">${Number(item.price).toFixed(2)}</p>
              </div>

              <div className="flex items-center gap-3 bg-slate-800 rounded-lg p-1">
                <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-1 hover:bg-slate-700 rounded transition"><Minus size={16} /></button>
                <span className="w-8 text-center font-bold">{item.quantity}</span>
                <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-1 hover:bg-slate-700 rounded transition"><Plus size={16} /></button>
              </div>

              <button onClick={() => removeItem(item.id)} className="p-2 text-muted hover:text-danger transition">
                <Trash2 size={20} />
              </button>
            </div>
          ))}
        </div>

        <div className="space-y-6">
          <div className="card">
            <h3 className="text-xl font-bold mb-6">Order Summary</h3>
            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-muted">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-muted">
                <span>Shipping</span>
                <span className="text-success">Free</span>
              </div>
              <div className="pt-4 border-t border-border flex justify-between text-xl font-bold">
                <span>Total</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
            </div>
            <button 
              onClick={() => navigate('/checkout')}
              className="btn btn-primary w-full py-4 justify-center gap-2"
            >
              Checkout <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
