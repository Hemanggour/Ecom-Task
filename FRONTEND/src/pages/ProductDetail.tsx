import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { ShoppingCart, ArrowLeft, Star, ShieldCheck, Truck, RotateCcw, Plus, Minus } from 'lucide-react';
import { useCart } from '../context/CartContext';
import Button from '../components/UI/Button';
import Card from '../components/UI/Card';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category_name: string;
}

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/products/${id}`);
        setProduct(res.data);
      } catch (err) {
        console.error('Failed to fetch product', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (product) {
      try {
        await addToCart(product.id, quantity);
        // Success feedback could go here
      } catch (err) {
        console.error(err);
      }
    }
  };

  if (loading) {
    return (
      <div className="container py-20 flex justify-center items-center min-h-400">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container py-20 text-center">
        <h2 className="text-2xl font-bold mb-4">Product not found</h2>
        <Button variant="primary" onClick={() => navigate('/')}>Go Home</Button>
      </div>
    );
  }

  return (
    <div className="container py-8 md:py-12 animate-fade-in">
      {/* Back Button */}
      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center gap-2 text-muted hover:text-primary transition mb-6 md:mb-8 font-medium"
      >
        <ArrowLeft size={20} /> Back to Products
      </button>

      {/* Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16">
        {/* Product Image */}
        <div className="relative group">
          <div className="aspect-square rounded-2xl md:rounded-3xl overflow-hidden bg-slate-100 border border-border shadow-lg">
            {product.image_url ? (
              <img 
                src={`http://localhost:5000${product.image_url}`} 
                alt={product.name} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover-scale-105" 
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted">
                No Image Available
              </div>
            )}
          </div>
          
          {/* Category Badge */}
          <div className="absolute top-4 md:top-6 left-4 md:left-6 bg-primary text-white px-3 md:px-4 py-1-5 rounded-full text-xs md:text-xs font-bold uppercase tracking-widest shadow-lg">
            {product.category_name}
          </div>
        </div>

        {/* Product Info */}
        <div className="flex flex-col">
          {/* Header Section */}
          <div className="mb-6 md:mb-8">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black mb-3 md:mb-4 tracking-tight">
              {product.name}
            </h1>

            {/* Rating & Status */}
            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-4 md:mb-6">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} size={18} className="fill-warning text-warning flex-shrink-0" />
                ))}
              </div>
              <span className="text-muted font-medium text-sm">4.8 (120+ Reviews)</span>
              <span className="hidden md:block h-4 w-1 bg-border"></span>
              <span className="text-success font-bold text-sm">In Stock</span>
            </div>

            {/* Price */}
            <p className="text-3xl md:text-4xl font-black text-primary">
              ${Number(product.price).toFixed(2)}
            </p>
          </div>

          {/* Description */}
          <div className="space-y-3 md:space-y-4 mb-8 md:mb-10">
            <h3 className="font-bold text-base md:text-lg border-b border-border pb-2">Description</h3>
            <p className="text-muted leading-relaxed text-base md:text-lg">
              {product.description}
            </p>
          </div>

          {/* Add to Cart Section */}
          <Card className="p-4 md:p-6 mb-8 md:mb-10 bg-card border-border">
            {/* Quantity Selector */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4 md:gap-0">
              <span className="font-bold text-base md:text-lg">Select Quantity</span>
              <div className="flex items-center gap-2 md:gap-4 bg-main rounded-lg p-1 border border-border w-fit">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 hover:bg-primary-10 rounded-md transition text-muted hover:text-primary"
                  title="Decrease quantity"
                >
                  <Minus size={20} />
                </button>
                <span className="w-8 text-center font-black text-lg">{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 hover:bg-primary-10 rounded-md transition text-muted hover:text-primary"
                  title="Increase quantity"
                >
                  <Plus size={20} />
                </button>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-col gap-3">
              <Button 
                variant="primary"
                size="lg"
                onClick={handleAddToCart}
                className="w-full gap-2 py-4 md:py-5"
              >
                <ShoppingCart size={20} /> Add to Cart
              </Button>
              <Button 
                variant="outline"
                size="lg"
                className="w-full py-4 md:py-5"
              >
                Buy It Now
              </Button>
            </div>
          </Card>

          {/* Features */}
          <div className="grid grid-cols-3 gap-4 md:gap-6 pt-6 md:pt-8 border-t border-border">
            <div className="flex flex-col items-center text-center gap-2">
              <div className="p-3 bg-primary-10 text-primary rounded-full">
                <Truck size={20} />
              </div>
              <span className="text-xs font-bold uppercase tracking-tight leading-tight">Fast Delivery</span>
            </div>
            <div className="flex flex-col items-center text-center gap-2">
              <div className="p-3 bg-primary-10 text-primary rounded-full">
                <ShieldCheck size={20} />
              </div>
              <span className="text-xs font-bold uppercase tracking-tight leading-tight">Secure Payment</span>
            </div>
            <div className="flex flex-col items-center text-center gap-2">
              <div className="p-3 bg-primary-10 text-primary rounded-full">
                <RotateCcw size={20} />
              </div>
              <span className="text-xs font-bold uppercase tracking-tight leading-tight">Free Returns</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
