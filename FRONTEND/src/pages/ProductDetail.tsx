import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { ShoppingCart, ArrowLeft, ShieldCheck, Truck, RotateCcw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  image_url: string;
  category_name: string;
}

const ProductDetail: React.FC = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const { user } = useAuth();
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

  const addToCart = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    setAdding(true);
    try {
      await api.post('/cart', { product_id: id, quantity: 1 });
      alert('Product added to cart!');
    } catch (err) {
      alert('Failed to add to cart');
    } finally {
      setAdding(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-20 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container py-20 text-center">
        <h2 className="text-3xl font-bold mb-4">Product not found</h2>
        <Link to="/" className="btn btn-primary">Back to Home</Link>
      </div>
    );
  }

  return (
    <div className="container py-10">
      <Link to="/" className="flex items-center gap-2 text-muted hover:text-primary transition mb-10">
        <ArrowLeft size={18} /> Back to Catalog
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        <div className="card p-0 overflow-hidden bg-slate-800 aspect-square">
          {product.image_url ? (
            <img 
              src={`http://localhost:5000${product.image_url}`} 
              alt={product.name} 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted">No Image</div>
          )}
        </div>

        <div className="flex flex-col">
          <div className="mb-8">
            <span className="text-primary font-bold uppercase tracking-widest text-sm mb-2 block">
              {product.category_name}
            </span>
            <h1 className="text-5xl font-bold mb-4">{product.name}</h1>
            <div className="flex items-center gap-4">
              <span className="text-4xl font-bold">${Number(product.price).toFixed(2)}</span>
              <span className={`px-3 py-1 rounded-full text-sm font-bold ${product.stock > 0 ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'}`}>
                {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
              </span>
            </div>
          </div>

          <div className="prose prose-invert max-w-none mb-10">
            <h3 className="text-xl font-bold mb-4 text-white">Product Description</h3>
            <p className="text-muted leading-relaxed text-lg">
              {product.description}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-10">
            <div className="flex flex-col items-center gap-2 p-4 rounded-xl bg-slate-800/50 border border-border">
              <Truck size={24} className="text-primary" />
              <span className="text-xs font-medium text-center">Free Delivery</span>
            </div>
            <div className="flex flex-col items-center gap-2 p-4 rounded-xl bg-slate-800/50 border border-border">
              <ShieldCheck size={24} className="text-primary" />
              <span className="text-xs font-medium text-center">2 Year Warranty</span>
            </div>
            <div className="flex flex-col items-center gap-2 p-4 rounded-xl bg-slate-800/50 border border-border">
              <RotateCcw size={24} className="text-primary" />
              <span className="text-xs font-medium text-center">30 Day Return</span>
            </div>
          </div>

          <div className="mt-auto">
            <button 
              onClick={addToCart}
              disabled={adding || product.stock <= 0}
              className="btn btn-primary w-full py-5 text-xl justify-center gap-3 shadow-xl shadow-primary/20 disabled:opacity-50"
            >
              <ShoppingCart size={24} />
              {adding ? 'Adding...' : product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
