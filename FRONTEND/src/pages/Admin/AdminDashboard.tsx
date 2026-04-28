import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import { Plus, Edit, Trash2, Package } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  category_name: string;
}

const AdminDashboard: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await api.delete(`/products/${id}`);
        setProducts(products.filter(p => p.id !== id));
      } catch (err) {
        alert('Failed to delete product');
      }
    }
  };

  return (
    <div className="container py-10">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted text-lg">Manage your products and inventory</p>
        </div>
        <Link to="/admin/add-product" className="btn btn-primary py-3 px-6">
          <Plus size={20} /> Add New Product
        </Link>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-800 text-muted uppercase text-xs font-semibold">
              <tr>
                <th className="px-6 py-4">Product</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Stock</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-slate-800/50 transition">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-slate-700 rounded-lg">
                        <Package size={20} className="text-primary" />
                      </div>
                      <span className="font-medium">{product.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-muted">{product.category_name}</td>
                  <td className="px-6 py-4 font-bold">${Number(product.price).toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${product.stock > 0 ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'}`}>
                      {product.stock} in stock
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Link to={`/admin/edit-product/${product.id}`} className="p-2 hover:bg-primary/10 text-primary rounded-lg transition">
                        <Edit size={18} />
                      </Link>
                      <button onClick={() => handleDelete(product.id)} className="p-2 hover:bg-danger/10 text-danger rounded-lg transition">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {products.length === 0 && !loading && (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center text-muted">
                    No products found. Start by adding one!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
