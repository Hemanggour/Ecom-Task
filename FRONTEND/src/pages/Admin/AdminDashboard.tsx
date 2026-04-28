import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import { Plus, Edit, Trash2, Package, Tag, DollarSign, Box, LayoutGrid, ShoppingBag } from 'lucide-react';
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
    <div className="container py-12 animate-fade-in">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-black tracking-tight mb-2">Inventory Management</h1>
          <p className="text-muted font-medium">Control your catalog, stock levels, and product details</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <Link to="/admin/categories" className="inline-flex items-center gap-2 px-4 py-2.5 bg-main border border-border rounded-xl text-muted hover:border-primary hover:text-primary hover:bg-primary/10 transition-all font-medium text-sm">
            <LayoutGrid size={16} /> Categories
          </Link>
          <Link to="/admin/orders" className="inline-flex items-center gap-2 px-4 py-2.5 bg-main border border-border rounded-xl text-muted hover:border-primary hover:text-primary hover:bg-primary/10 transition-all font-medium text-sm">
            <ShoppingBag size={16} /> Orders
          </Link>
          <Link to="/admin/add-product" className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-xl hover:bg-primary/90 transition-all font-medium text-sm shadow-lg shadow-primary-20">
            <Plus size={18} /> Add Product
          </Link>
        </div>
      </div>

      {/* Stats Quick View */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        <div className="card p-6 border-2 border-primary-10">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary-light text-primary rounded-xl"><Package size={24} /></div>
            <div>
              <p className="text-xs font-bold text-muted uppercase tracking-widest">Total Products</p>
              <h4 className="text-2xl font-black">{products.length}</h4>
            </div>
          </div>
        </div>
        <div className="card p-6 border-2 border-secondary-10">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-secondary-10 text-secondary rounded-xl"><Box size={24} /></div>
            <div>
              <p className="text-xs font-bold text-muted uppercase tracking-widest">Total Items</p>
              <h4 className="text-2xl font-black">{products.reduce((acc, curr) => acc + (curr.stock || 0), 0)}</h4>
            </div>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="card p-0 overflow-hidden border-border shadow-xl mt-8">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-main opacity-50 border-b border-border">
                <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-muted">Product Details</th>
                <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-muted">Category</th>
                <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-muted">Price</th>
                <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-muted">Inventory</th>
                <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-muted text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                [1, 2, 3].map(i => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={5} className="px-8 py-10 h-20 bg-main opacity-20"></td>
                  </tr>
                ))
              ) : products.map((product) => (
                <tr key={product.id} className="hover:bg-primary-light opacity-30 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-xl bg-primary-light flex items-center justify-center text-primary group-hover-scale-110 transition-transform">
                        <Package size={24} />
                      </div>
                      <div>
                        <p className="font-bold text-lg">{product.name}</p>
                        <p className="text-[10px] text-muted font-bold uppercase tracking-tighter">ID: {product.id.slice(0, 8)}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-main border border-border rounded-lg">
                      <Tag size={12} className="text-primary" />
                      <span className="text-xs font-bold text-muted">{product.category_name}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 font-black text-lg">
                    <div className="flex items-center gap-1">
                      <DollarSign size={16} className="text-muted" />
                      {Number(product.price).toFixed(2)}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col gap-1">
                      <span className={`text-sm font-black ${product.stock > 10 ? 'text-success' : product.stock > 0 ? 'text-warning' : 'text-danger'}`}>
                        {product.stock} Units
                      </span>
                      <div className="w-24 h-1.5 bg-main rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${product.stock > 10 ? 'bg-success' : product.stock > 0 ? 'bg-warning' : 'bg-danger'}`} 
                          style={{ width: `${Math.min(product.stock * 2, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end gap-3">
                      <Link 
                        to={`/admin/edit-product/${product.id}`} 
                        className="p-3 bg-main border border-border rounded-xl text-primary hover:bg-primary hover:text-white hover:border-primary transition-all shadow-sm"
                        title="Edit Product"
                      >
                        <Edit size={18} />
                      </Link>
                      <button 
                        onClick={() => handleDelete(product.id)} 
                        className="p-3 bg-main border border-border rounded-xl text-danger hover:bg-danger hover:text-white hover:border-danger transition-all shadow-sm"
                        title="Delete Product"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!loading && products.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-8 py-32 text-center">
                    <div className="space-y-8">
                <Package size={64} strokeWidth={1} />
                <div className="space-y-2">
                        <p className="text-xl font-bold text-main">No products found</p>
                        <p className="text-sm">Ready to stock your shelves? Add your first product now!</p>
                      </div>
                      <Link to="/admin/add-product" className="btn btn-primary mt-6 py-3 px-8">
                        Add New Product
                      </Link>
                    </div>
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
