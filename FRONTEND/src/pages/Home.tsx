import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { ShoppingCart, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category_name: string;
}

const Home: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get('/products');
        setProducts(res.data);
      } catch (err) {
        console.error('Failed to fetch products', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="container py-10">
      <h1 className="text-4xl font-bold mb-8">Featured Products</h1>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <div key={product.id} className="card group">
              <div className="relative h-64 mb-4 rounded-lg overflow-hidden bg-slate-800">
                {product.image_url ? (
                  <img 
                    src={`http://localhost:5000${product.image_url}`} 
                    alt={product.name}
                    className="w-full h-full object-cover transition duration-300 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted">
                    No Image
                  </div>
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-4">
                  <Link to={`/product/${product.id}`} className="p-3 bg-white text-black rounded-full hover:bg-primary hover:text-white transition">
                    <Eye size={20} />
                  </Link>
                </div>
              </div>
              
              <div className="text-xs text-primary font-semibold mb-1 uppercase tracking-wider">
                {product.category_name}
              </div>
              <h3 className="text-xl font-bold mb-2 truncate">{product.name}</h3>
              <p className="text-muted text-sm line-clamp-2 mb-4">{product.description}</p>
              
              <div className="flex justify-between items-center mt-auto">
                <span className="text-2xl font-bold">${Number(product.price).toFixed(2)}</span>
                <button className="btn btn-primary p-2">
                  <ShoppingCart size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
