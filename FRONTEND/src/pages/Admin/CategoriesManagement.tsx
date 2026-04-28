import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import { Plus, Trash2, FolderPlus, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Category {
  id: string;
  name: string;
  description: string;
}

const CategoriesManagement: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [adding, setAdding] = useState(false);

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories');
      setCategories(res.data);
    } catch (err) {
      console.error('Failed to fetch categories', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdding(true);
    try {
      const res = await api.post('/categories', { name, description });
      setCategories([...categories, res.data]);
      setName('');
      setDescription('');
    } catch (err) {
      alert('Failed to add category');
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure? This will affect products in this category.')) {
      try {
        await api.delete(`/categories/${id}`);
        setCategories(categories.filter(c => c.id !== id));
      } catch (err) {
        alert('Failed to delete category');
      }
    }
  };

  return (
    <div className="container py-10">
      <Link to="/admin" className="flex items-center gap-2 text-muted hover:text-primary transition mb-6">
        <ArrowLeft size={18} /> Back to Dashboard
      </Link>

      <div className="mb-10">
        <h1 className="text-4xl font-bold mb-2">Category Management</h1>
        <p className="text-muted text-lg">Create and organize product categories</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-1">
          <div className="card glass">
            <div className="flex items-center gap-3 mb-6">
              <FolderPlus className="text-primary" size={24} />
              <h2 className="text-xl font-bold">Add Category</h2>
            </div>
            <form onSubmit={handleAddCategory} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Category Name</label>
                <input 
                  type="text" 
                  required 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-800 border border-border rounded-lg p-3 outline-none focus:border-primary transition"
                  placeholder="e.g. Electronics"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea 
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-800 border border-border rounded-lg p-3 outline-none focus:border-primary transition resize-none"
                  placeholder="Short description..."
                />
              </div>
              <button 
                type="submit" 
                disabled={adding}
                className="btn btn-primary w-full py-3 justify-center"
              >
                {adding ? 'Adding...' : 'Create Category'}
              </button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="card p-0 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-slate-800 text-muted uppercase text-xs font-semibold">
                <tr>
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Description</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {categories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-slate-800/50 transition">
                    <td className="px-6 py-4 font-bold">{cat.name}</td>
                    <td className="px-6 py-4 text-muted text-sm">{cat.description || '-'}</td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => handleDelete(cat.id)} className="p-2 hover:bg-danger/10 text-danger rounded-lg transition">
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
                {categories.length === 0 && !loading && (
                  <tr>
                    <td colSpan={3} className="px-6 py-10 text-center text-muted">
                      No categories yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoriesManagement;
