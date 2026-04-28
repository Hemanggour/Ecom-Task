import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { ShoppingCart, Star, ShieldCheck, Truck, RotateCcw, Plus, Minus } from 'lucide-react';
import { useCart } from '../context/CartContext';
import Button from '../components/UI/Button';
import Card from '../components/UI/Card';
import RelatedProducts from '../components/RelatedProducts';

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
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productRes, allProductsRes] = await Promise.all([
          api.get(`/products/${id}`),
          api.get('/products')
        ]);
        setProduct(productRes.data);
        
        // Filter related products by category
        const allProducts = allProductsRes.data;
        const related = allProducts.filter((p: Product) => 
          p.category_name === productRes.data.category_name && p.id !== productRes.data.id
        );
        setRelatedProducts(related);
      } catch (err) {
        console.error('Failed to fetch data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
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
      <div className="container py-20 flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container py-20 text-center">
        <h2 className="text-3xl md:text-4xl font-black mb-6">Product not found</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-md mx-auto">
          The product you're looking for doesn't exist or has been removed.
        </p>
        <Button variant="primary" onClick={() => navigate('/')} className="px-8">
          Go Home
        </Button>
      </div>
    );
  }

  return (
    <div className="animate-fade-in pb-20">
      {/* Breadcrumb Navigation */}
      <div className="container py-6 md:py-8">
        <nav className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
          <button 
            onClick={() => navigate('/')} 
            className="hover:text-primary transition-colors font-medium"
          >
            Home
          </button>
          <span>/</span>
          <button 
            onClick={() => navigate(-1)} 
            className="hover:text-primary transition-colors font-medium"
          >
            Products
          </button>
          <span>/</span>
          <span className="text-slate-900 dark:text-slate-100 font-medium truncate max-w-[200px]">
            {product.name}
          </span>
        </nav>
      </div>

      {/* Product Main Section */}
      <div className="container pb-16 md:pb-20">

        {/* Product Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 xl:gap-20">
          {/* Product Image */}
          <div className="relative group" style={{ marginRight: '3vw' }}>
            <div className="aspect-square  rounded-3xl overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 shadow-2xl">
              {product.image_url ? (
                <img 
                  src={`http://localhost:5000${product.image_url}`} 
                  alt={product.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-400">
                  <div className="text-center">
                    <ShoppingCart size={60} strokeWidth={1} className="mx-auto mb-4" />
                    <p className="text-slate-500">No Image Available</p>
                  </div>
                </div>
              )}
            </div>
            
            {/* Category Badge */}
            <div className="absolute top-6 left-6 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider text-primary shadow-lg border border-white/20">
              {product.category_name}
            </div>

            {/* Quick Actions - Hover Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-end justify-center p-8 rounded-3xl">
              <div className="flex gap-4">
                <Button 
                  variant="primary"
                  size="lg"
                  onClick={handleAddToCart}
                  className="gap-2 backdrop-blur-sm bg-white/90 text-slate-900 hover:bg-white shadow-xl"
                >
                  <ShoppingCart size={20} /> Add to Cart
                </Button>
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col justify-start">
            {/* Header Section */}
            <div className="mb-8 md:mb-10">
              {/* Category Name */}
              <div className="mb-4">
                <span className="text-xs font-black text-primary uppercase tracking-[0.3em]">
                  {product.category_name}
                </span>
              </div>
              
              {/* Product Name */}
              <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black mb-6 md:mb-8 tracking-tight leading-tight">
                {product.name}
              </h1>

              {/* Rating & Status */}
              <div className="flex flex-wrap items-center gap-4 md:gap-6 mb-6 md:mb-8">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} size={20} className="fill-warning text-warning flex-shrink-0" />
                    ))}
                  </div>
                  <span className="text-slate-600 dark:text-slate-400 font-medium text-sm">4.8 (120+ Reviews)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-green-600 dark:text-green-400 font-bold text-sm uppercase tracking-wider">In Stock</span>
                </div>
              </div>

              {/* Price Section */}
              <div className="flex items-baseline gap-4 mb-8">
                <p className="text-4xl md:text-5xl font-black text-primary leading-tight">
                  ${Number(product.price).toFixed(2)}
                </p>
                <p className="text-xl text-slate-500 dark:text-slate-400 line-through">
                  ${(Number(product.price) * 1.3).toFixed(2)}
                </p>
                <span className="px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs font-bold uppercase rounded-full">
                  Save 30%
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="mb-10 md:mb-12">
              <h3 className="text-xs font-black text-primary uppercase tracking-[0.3em] mb-4">Product Details</h3>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-lg">
                  {product.description}
                </p>
              </div>
            </div>

            {/* Add to Cart Section */}
            <Card className="p-6 md:p-8 mb-10 md:mb-12 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-lg">
              {/* Quantity Selector */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
                <div>
                  <h3 className="font-bold text-lg mb-2">Quantity</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Select the amount you need</p>
                </div>
                <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 rounded-xl p-1 border border-slate-200 dark:border-slate-700">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 hover:bg-white dark:hover:bg-slate-700 rounded-lg transition-all duration-200 text-slate-600 dark:text-slate-400 hover:text-primary"
                    title="Decrease quantity"
                  >
                    <Minus size={20} />
                  </button>
                  <span className="w-12 text-center font-black text-xl">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-3 hover:bg-white dark:hover:bg-slate-700 rounded-lg transition-all duration-200 text-slate-600 dark:text-slate-400 hover:text-primary"
                    title="Increase quantity"
                  >
                    <Plus size={20} />
                  </button>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="space-y-4">
                <Button 
                  variant="primary"
                  size="lg"
                  onClick={handleAddToCart}
                  className="w-full gap-3 py-4 md:py-5 text-lg font-bold shadow-lg hover:shadow-xl"
                >
                  <ShoppingCart size={24} /> Add to Cart
                </Button>
                <Button 
                  variant="outline"
                  size="lg"
                  className="w-full py-4 md:py-5 text-lg font-bold border-2 hover:bg-primary hover:text-white transition-all duration-300"
                >
                  Buy It Now
                </Button>
              </div>
            </Card>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8 pt-8 md:pt-12 border-t border-slate-200 dark:border-slate-700">
              <div className="flex flex-col items-center text-center gap-3 group">
                <div className="p-4 bg-primary/10 text-primary rounded-2xl group-hover:bg-primary group-hover:text-white transition-all duration-300">
                  <Truck size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-sm mb-1">Fast Delivery</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400">Free shipping on orders over $50</p>
                </div>
              </div>
              <div className="flex flex-col items-center text-center gap-3 group">
                <div className="p-4 bg-primary/10 text-primary rounded-2xl group-hover:bg-primary group-hover:text-white transition-all duration-300">
                  <ShieldCheck size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-sm mb-1">Secure Payment</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400">100% secure transactions</p>
                </div>
              </div>
              <div className="flex flex-col items-center text-center gap-3 group">
                <div className="p-4 bg-primary/10 text-primary rounded-2xl group-hover:bg-primary group-hover:text-white transition-all duration-300">
                  <RotateCcw size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-sm mb-1">Free Returns</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400">30-day return policy</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {product && (
        <RelatedProducts 
          products={relatedProducts}
          currentProductId={product.id}
          categoryName={product.category_name}
        />
      )}
    </div>
  );
};

export default ProductDetail;
