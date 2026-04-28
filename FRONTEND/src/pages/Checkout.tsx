import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { CreditCard, Truck, MapPin, CheckCircle, ArrowLeft, Lock } from 'lucide-react';
import { useCart } from '../context/CartContext';
import Button from '../components/UI/Button';

const Checkout: React.FC = () => {
  const { items, subtotal, clearCart } = useCart();
  const [formData, setFormData] = useState({
    address: '',
    city: '',
    zip: '',
    card_number: '',
    expiry: '',
    cvv: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/orders', { 
        shipping_address: `${formData.address}, ${formData.city}, ${formData.zip}` 
      });
      setSuccess(true);
      clearCart();
    } catch (err) {
      alert('Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="container py-16 md:py-24 text-center animate-fade-in">
        <div className="flex justify-center mb-6 md:mb-8">
          <div className="p-6 md:p-8 bg-success-10 text-success rounded-full animate-bounce">
            <CheckCircle size={64} className="md:size-80" strokeWidth={1.5} />
          </div>
        </div>
        <h2 className="text-2xl md:text-4xl font-black mb-3 md:mb-4">Order Successful!</h2>
        <p className="text-muted mb-8 md:mb-10 max-w-md mx-auto text-base md:text-lg">
          Thank you for your purchase. We've received your order and are processing it right now. You'll receive a confirmation email shortly.
        </p>
        <Button variant="primary" size="lg" onClick={() => navigate('/')}>
          Back to Shopping
        </Button>
      </div>
    );
  }

  return (
    <div className="container py-8 md:py-12 animate-fade-in">
      <div className="flex items-center gap-3 md:gap-4 mb-8 md:mb-12">
        <button onClick={() => navigate('/cart')} className="p-2 rounded-full hover:bg-primary-10 text-muted transition">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-2xl md:text-4xl font-black tracking-tight">Checkout</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16">
        {/* Checkout Form */}
        <form onSubmit={handlePlaceOrder} className="space-y-12">
          {/* Shipping Section */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 text-primary">
              <MapPin size={24} />
              <h3 className="text-2xl font-bold">Shipping Details</h3>
            </div>
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-muted ml-1">Street Address</label>
                <input 
                  type="text" name="address" required 
                  onChange={handleInputChange}
                  className="bg-card border border-border px-4 py-3 rounded-xl w-full focus:border-primary transition"
                  placeholder="123 Luxury Ave"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-muted ml-1">City</label>
                  <input 
                    type="text" name="city" required 
                    onChange={handleInputChange}
                    className="bg-card border border-border px-4 py-3 rounded-xl w-full focus:border-primary transition"
                    placeholder="New York"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-muted ml-1">ZIP Code</label>
                  <input 
                    type="text" name="zip" required 
                    onChange={handleInputChange}
                    className="bg-card border border-border px-4 py-3 rounded-xl w-full focus:border-primary transition"
                    placeholder="10001"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Payment Section */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 text-primary">
              <CreditCard size={24} />
              <h3 className="text-2xl font-bold">Payment Method</h3>
            </div>
            <div className="card bg-main opacity-50 border-2 border-primary-20 p-6 space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-muted ml-1">Card Number</label>
                <div className="relative">
                  <input 
                    type="text" name="card_number" required 
                    onChange={handleInputChange}
                    className="bg-card border border-border px-4 py-3 rounded-xl w-full focus:border-primary transition pl-12"
                    placeholder="**** **** **** 1234"
                  />
                  <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-muted ml-1">Expiry Date</label>
                  <input 
                    type="text" name="expiry" required 
                    onChange={handleInputChange}
                    className="bg-card border border-border px-4 py-3 rounded-xl w-full focus:border-primary transition"
                    placeholder="MM/YY"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-muted ml-1">CVV</label>
                  <input 
                    type="text" name="cvv" required 
                    onChange={handleInputChange}
                    className="bg-card border border-border px-4 py-3 rounded-xl w-full focus:border-primary transition"
                    placeholder="123"
                  />
                </div>
              </div>
            </div>
          </section>

          <button 
            type="submit" 
            disabled={loading}
            className="btn btn-primary w-full py-5 text-xl font-black gap-3 shadow-xl shadow-primary-20 mt-12"
          >
            {loading ? 'Processing...' : `Pay $${subtotal.toFixed(2)}`}
          </button>
        </form>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-1">
          <div className="card p-8 bg-card border-border shadow-sm">
            <h3 className="text-2xl font-black mb-8 border-b border-border pb-4">Order Summary</h3>
            <div className="max-h-400 overflow-y-auto pr-2 space-y-4 mb-8 custom-scrollbar">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between items-center gap-4">
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 rounded-xl bg-main border border-border overflow-hidden flex-shrink-0">
                      <img src={`http://localhost:5000${item.image_url}`} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <p className="font-bold text-sm line-clamp-1">{item.name}</p>
                      <p className="text-xs text-muted">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <span className="font-bold text-sm">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            
            <div className="space-y-3 pt-6 border-t border-border">
              <div className="flex justify-between text-muted text-sm font-medium">
                <span>Subtotal</span>
                <span className="text-main font-bold">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-muted text-sm font-medium">
                <span>Shipping</span>
                <span className="text-success font-bold">FREE</span>
              </div>
              <div className="pt-4 flex justify-between items-center">
                <span className="text-lg font-black">Total</span>
                <span className="text-2xl font-black text-primary">${subtotal.toFixed(2)}</span>
              </div>
            </div>

            <div className="mt-8 p-4 bg-primary-light opacity-30 rounded-xl flex items-center gap-3">
              <Truck size={20} className="text-primary" />
              <p className="text-xs font-bold text-primary italic">Estimated arrival: 3-5 Business Days</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
