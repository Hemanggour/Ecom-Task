import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import { Plus, Trash2, FolderPlus, ArrowLeft, Tag, Layers, Info, Edit2, X } from 'lucide-react';
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
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [updating, setUpdating] = useState(false);

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

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setEditName(category.name);
    setEditDescription(category.description);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory) return;
    setUpdating(true);
    try {
      const res = await api.put(`/categories/${editingCategory.id}`, { 
        name: editName, 
        description: editDescription 
      });
      setCategories(categories.map(c => c.id === editingCategory.id ? res.data : c));
      setEditingCategory(null);
      setEditName('');
      setEditDescription('');
    } catch (err) {
      alert('Failed to update category');
    } finally {
      setUpdating(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingCategory(null);
    setEditName('');
    setEditDescription('');
  };

  return (
    <div className="container py-12 animate-fade-in">
      <Link to="/admin" className="flex items-center gap-2 text-muted hover:text-primary transition mb-8 font-medium">
        <ArrowLeft size={20} /> Back to Inventory
      </Link>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-16">
        <div>
          <h1 className="text-4xl font-black tracking-tight mb-2">Category Taxonomy</h1>
          <p className="text-muted font-medium">Organize your product hierarchy and navigation</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
        {/* Creation Form */}
        <div className="lg:col-span-1">
          <div className="card p-8 border-2 border-primary-10 shadow-xl sticky top-32">
            <div className="flex items-center gap-3 text-primary mb-8 border-b border-border pb-4">
              <FolderPlus size={24} />
              <h2 className="text-xl font-black tracking-tight">New Category</h2>
            </div>
            
            <form onSubmit={handleAddCategory} className="space-y-8">
              <div className="space-y-4">
                <label className="text-sm font-bold text-muted ml-1 uppercase tracking-widest text-xs">Name</label>
                <div className="relative">
                  <input 
                    type="text" 
                    required 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="input"
                    placeholder="e.g. Smart Home"
                  />
                  <Tag size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted z-10" />
                </div>
              </div>
              
              <div className="space-y-4">
                <label className="text-sm font-bold text-muted ml-1 uppercase tracking-widest text-xs">Description</label>
                <textarea 
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-card border-2 border-border px-4 py-3 rounded-xl focus:border-primary transition resize-none"
                  placeholder="Categorize products for better discovery..."
                />
              </div>

              <button 
                type="submit" 
                disabled={adding}
                className="btn btn-primary w-full py-4 text-lg font-black gap-3 shadow-lg shadow-primary-20 mt-8"
              >
                {adding ? 'Processing...' : 'Create Category'} <Plus size={20} />
              </button>
            </form>
          </div>
        </div>

        {/* Categories Table */}
        <div className="lg:col-span-2">
          <div className="card p-0 overflow-hidden border-border shadow-xl mt-12" style={{ marginLeft: '2vw' }}>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-main opacity-50 border-b border-border">
                  <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-muted">Category</th>
                  <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-muted">Description</th>
                  <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-muted text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {loading ? (
                  [1, 2, 3].map(i => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan={3} className="px-8 py-10 h-16 bg-main opacity-20"></td>
                    </tr>
                  ))
                ) : categories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-primary-light opacity-30 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-lg bg-primary-light flex items-center justify-center text-primary group-hover-scale-110 transition-transform">
                          <Layers size={20} />
                        </div>
                        <span className="font-bold text-lg">{cat.name}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <p className="text-muted text-sm line-clamp-2 max-w-md">
                        {cat.description || <span className="italic opacity-50">No description provided</span>}
                      </p>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex justify-end gap-3">
                        <button 
                          onClick={() => handleEdit(cat)}
                          className="p-3 bg-main border border-border rounded-xl text-primary hover:bg-primary hover:text-white hover:border-primary transition-all shadow-sm"
                          title="Edit Category"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button 
                          onClick={() => handleDelete(cat.id)} 
                          className="p-3 bg-main border border-border rounded-xl text-danger hover:bg-danger hover:text-white hover:border-danger transition-all shadow-sm"
                          title="Delete Category"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {!loading && categories.length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-8 py-32 text-center">
                      <div className="flex flex-col items-center gap-8 text-muted">
                        <Info size={64} strokeWidth={1} />
                        <div className="space-y-2">
                          <p className="text-xl font-bold text-main">No categories found</p>
                          <p className="text-sm">Start by creating your first category to organize products.</p>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {editingCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="card p-8 max-w-md w-full mx-4 shadow-2xl">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-black">Edit Category</h2>
              <button 
                onClick={handleCancelEdit}
                className="p-2 hover:bg-main rounded-lg transition"
              >
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleUpdate} className="space-y-8">
              <div className="space-y-4">
                <label className="text-sm font-bold text-muted ml-1 uppercase tracking-widest text-xs">Name</label>
                <input 
                  type="text" 
                  required 
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="input"
                  placeholder="Category name"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-bold text-muted ml-1 uppercase tracking-widest text-xs">Description</label>
                <textarea 
                  rows={4}
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full bg-card border-2 border-border px-4 py-3 rounded-xl focus:border-primary transition resize-none"
                  placeholder="Category description..."
                />
              </div>

              <div className="flex gap-4 pt-8">
                <button 
                  type="button"
                  onClick={handleCancelEdit}
                  className="btn btn-outline flex-1"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={updating}
                  className="btn btn-primary flex-1"
                >
                  {updating ? 'Updating...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoriesManagement;
