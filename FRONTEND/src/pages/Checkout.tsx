import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { CreditCard, Truck, ArrowLeft, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const Checkout: React.FC = () => {
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post('/orders', { shipping_address: address });
      setSuccess(true);
      setTimeout(() => navigate('/orders'), 3000);
    } catch (err) {
      alert('Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="container py-20 flex flex-col items-center text-center">
        <div className="text-success mb-6">
          <CheckCircle size={80} />
        </div>
        <h2 className="text-4xl font-bold mb-4">Order Placed!</h2>
        <p className="text-muted text-lg mb-8">Thank you for your purchase. You'll be redirected to your orders in a moment.</p>
        <Link to="/orders" className="btn btn-primary py-3 px-8">View My Orders</Link>
      </div>
    );
  }

  return (
    <div className="container py-10">
      <Link to="/cart" className="flex items-center gap-2 text-muted hover:text-primary transition mb-8">
        <ArrowLeft size={18} /> Back to Cart
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div>
          <h1 className="text-4xl font-bold mb-8">Checkout</h1>
          
          <form id="checkout-form" onSubmit={handleSubmit} className="space-y-8">
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-primary/10 text-primary rounded-lg">
                  <Truck size={24} />
                </div>
                <h2 className="text-2xl font-bold">Shipping Information</h2>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Shipping Address</label>
                <textarea 
                  required 
                  rows={4}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-slate-800 border border-border rounded-lg p-3 outline-none focus:border-primary transition resize-none"
                  placeholder="Street address, City, State, ZIP code"
                />
              </div>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-primary/10 text-primary rounded-lg">
                  <CreditCard size={24} />
                </div>
                <h2 className="text-2xl font-bold">Payment Method</h2>
              </div>
              <div className="card border-primary bg-primary/5">
                <p className="font-medium">Cash on Delivery</p>
                <p className="text-muted text-sm mt-1">Pay when you receive your order.</p>
              </div>
            </section>
          </form>
        </div>

        <div className="lg:pt-20">
          <div className="card glass">
            <h3 className="text-xl font-bold mb-6">Complete Purchase</h3>
            <p className="text-muted mb-8">By placing this order, you agree to our Terms of Service and Privacy Policy.</p>
            <button 
              form="checkout-form"
              type="submit" 
              disabled={loading || !address}
              className="btn btn-primary w-full py-4 text-lg justify-center disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Place Order Now'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
