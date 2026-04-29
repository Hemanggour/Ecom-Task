import React from 'react';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import Button from '../components/UI/Button';
import Card from '../components/UI/Card';
import Input from '../components/UI/Input';

const Cart: React.FC = () => {
  const { items, loading, updateQuantity, removeItem, subtotal, cartCount } = useCart();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="container py-20 flex justify-center items-center min-h-400">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container py-16 md:py-24 text-center animate-fade-in">
        <div className="flex justify-center mb-6 md:mb-8">
          <div className="p-6 md:p-8 bg-primary-10 text-primary rounded-full">
            <ShoppingBag size={64} className="md:size-80" strokeWidth={1.5} />
          </div>
        </div>
        <h2 className="text-2xl md:text-4xl font-black mb-3 md:mb-4">Your cart is empty</h2>
        <p className="text-muted mb-8 md:mb-10 max-w-md mx-auto text-base md:text-lg">
          Looks like you haven't added anything to your cart yet. Let's find something special for you!
        </p>
        <Link to="/">
          <Button variant="primary" size="lg">
            Explore Products
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-8 md:py-12 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8 md:mb-12">
        <h1 className="text-2xl md:text-4xl font-black tracking-tight">
          Shopping Bag 
          <span className="text-primary text-lg md:text-xl font-medium ml-2">({cartCount} items)</span>
        </h1>
        <Link to="/" className="text-muted hover:text-primary transition flex items-center gap-2 font-medium text-sm md:text-base">
          <ArrowLeft size={20} /> Continue Shopping
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4 md:space-y-6">
          {items.map((item) => (
            <Card key={item.id} className="p-4 md:p-6 flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6">
              {/* Product Image */}
              <div className="h-24 md:h-32 w-24 md:w-32 rounded-lg md:rounded-2xl overflow-hidden bg-slate-100 flex-shrink-0 border border-border">
                {item.image_url ? (
                  <img 
                    src={`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'}${item.image_url}`} 
                    alt={item.name} 
                    className="w-full h-full object-cover" 
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted">
                    <ShoppingBag size={24} />
                  </div>
                )}
              </div>
              
              {/* Product Info */}
              <div className="flex-grow min-w-0">
                <h3 className="font-bold text-lg md:text-xl mb-1 line-clamp-2">{item.name}</h3>
                <p className="text-primary font-black text-lg md:text-2xl">
                  ${Number(item.price).toFixed(2)}
                </p>
              </div>

              {/* Quantity Controls */}
              <div className="flex items-center gap-2 md:gap-4 bg-main rounded-lg p-1 border border-border flex-shrink-0">
                <button 
                  onClick={() => updateQuantity(item.id, item.quantity - 1)} 
                  className="p-1-5 md:p-2 hover:bg-primary-10 rounded-md transition text-muted hover:text-primary"
                  aria-label="Decrease quantity"
                  title="Decrease quantity"
                >
                  <Minus size={18} />
                </button>
                <span className="w-8 md:w-10 text-center font-black text-base md:text-lg">{item.quantity}</span>
                <button 
                  onClick={() => updateQuantity(item.id, item.quantity + 1)} 
                  className="p-1-5 md:p-2 hover:bg-primary-10 rounded-md transition text-muted hover:text-primary"
                  aria-label="Increase quantity"
                  title="Increase quantity"
                >
                  <Plus size={18} />
                </button>
              </div>

              {/* Price & Delete */}
              <div className="flex items-center gap-4 w-full md:w-auto justify-between md:flex-col md:justify-start">
                <span className="font-black text-lg md:text-xl">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
                <button 
                  onClick={() => removeItem(item.id)} 
                  className="p-2-5 text-muted hover:text-danger hover:bg-danger-10 rounded-full transition flex-shrink-0"
                  aria-label="Remove item"
                  title="Remove from cart"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </Card>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="p-6 md:p-8 bg-card border-2 border-primary-10 shadow-xl sticky top-24 md:top-32 lg:top-20">
            <h3 className="text-xl md:text-2xl font-black mb-6 md:mb-8 border-b border-border pb-4">
              Order Summary
            </h3>

            {/* Summary Lines */}
            <div className="space-y-3 md:space-y-4 mb-6 md:mb-8">
              <div className="flex justify-between text-muted font-medium text-sm sm:text-base">
                <span>Subtotal</span>
                <span className="text-main font-bold">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-muted font-medium text-sm sm:text-base">
                <span>Estimated Shipping</span>
                <span className="text-success font-bold">FREE</span>
              </div>
              <div className="flex justify-between text-muted font-medium text-sm sm:text-base">
                <span>Tax</span>
                <span className="text-main font-bold">$0.00</span>
              </div>

              {/* Total */}
              <div className="pt-4 md:pt-6 border-t border-border flex justify-between items-center">
                <span className="text-lg md:text-xl font-black">Total</span>
                <span className="text-2xl md:text-3xl font-black text-primary">
                  ${subtotal.toFixed(2)}
                </span>
              </div>
            </div>
            
            {/* Checkout Button */}
            <Button 
              variant="primary"
              size="lg"
              onClick={() => navigate('/checkout')}
                            className="w-full gap-2 shadow-lg shadow-primary-20 py-4 md:py-5"
            >
              Checkout Now <ArrowRight size={20} />
            </Button>

            <p className="text-[10px] sm:text-xs text-muted text-center uppercase tracking-widest font-bold mt-4">
              Secure SSL Encrypted Checkout
            </p>

            {/* Promo Code Section */}
            <div className="mt-8 sm:mt-10 pt-6 sm:pt-8 border-t border-border">
              <p className="text-xs sm:text-sm font-bold mb-3">Have a promo code?</p>
              <div className="flex gap-2">
                <Input 
                  type="text" 
                  placeholder="Enter code" 
                  className="text-sm flex-grow"
                />
                <Button variant="outline" size="sm" className="px-3 sm:px-4 font-bold text-xs flex-shrink-0">
                  Apply
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Cart;
