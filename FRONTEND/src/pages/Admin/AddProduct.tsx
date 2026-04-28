import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api/axios';
import { Upload, ArrowLeft, Save } from 'lucide-react';
import { Link } from 'react-router-dom';

const AddProduct: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category_id: ''
  });
  const [categories, setCategories] = useState<any[]>([]);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const catRes = await api.get('/categories');
        setCategories(catRes.data);

        if (isEdit) {
          const prodRes = await api.get(`/products/${id}`);
          const p = prodRes.data;
          setFormData({
            name: p.name,
            description: p.description,
            price: p.price,
            stock: p.stock,
            category_id: p.category_id
          });
          if (p.image_url) {
            setImagePreview(`http://localhost:5000${p.image_url}`);
          }
        }
      } catch (err) {
        console.error('Failed to fetch data', err);
      }
    };
    fetchData();
  }, [id, isEdit]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    data.append('name', formData.name);
    data.append('description', formData.description);
    data.append('price', formData.price);
    data.append('stock', formData.stock);
    data.append('category_id', formData.category_id);
    if (image) {
      data.append('image', image);
    }

    try {
      if (isEdit) {
        await api.put(`/products/${id}`, data);
      } else {
        await api.post('/products', data);
      }
      navigate('/admin');
    } catch (err) {
      alert('Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-10">
      <Link to="/admin" className="flex items-center gap-2 text-muted hover:text-primary transition mb-6">
        <ArrowLeft size={18} /> Back to Dashboard
      </Link>

      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-4xl font-bold">{isEdit ? 'Edit Product' : 'Add New Product'}</h1>
          <p className="text-muted mt-2">Fill in the details for your product listing</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
          <form id="product-form" onSubmit={handleSubmit} className="card space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">Product Name</label>
                <input 
                  name="name"
                  type="text" 
                  required 
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-slate-800 border border-border rounded-lg p-3 outline-none focus:border-primary transition"
                  placeholder="e.g. Wireless Noise Cancelling Headphones"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Price ($)</label>
                <input 
                  name="price"
                  type="number" 
                  step="0.01"
                  required 
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full bg-slate-800 border border-border rounded-lg p-3 outline-none focus:border-primary transition"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Stock Quantity</label>
                <input 
                  name="stock"
                  type="number" 
                  required 
                  value={formData.stock}
                  onChange={handleChange}
                  className="w-full bg-slate-800 border border-border rounded-lg p-3 outline-none focus:border-primary transition"
                  placeholder="0"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">Category</label>
                <select 
                  name="category_id"
                  required 
                  value={formData.category_id}
                  onChange={handleChange}
                  className="w-full bg-slate-800 border border-border rounded-lg p-3 outline-none focus:border-primary transition appearance-none"
                >
                  <option value="">Select a category</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea 
                  name="description"
                  required 
                  rows={6}
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full bg-slate-800 border border-border rounded-lg p-3 outline-none focus:border-primary transition resize-none"
                  placeholder="Write a detailed description of the product..."
                />
              </div>
            </div>
          </form>
        </div>

        <div className="space-y-6">
          <div className="card">
            <h3 className="text-lg font-bold mb-4">Product Image</h3>
            <div 
              className="border-2 border-dashed border-border rounded-xl aspect-square flex flex-col items-center justify-center relative overflow-hidden group hover:border-primary transition cursor-pointer"
              onClick={() => document.getElementById('image-upload')?.click()}
            >
              {imagePreview ? (
                <>
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                    <Upload className="text-white" size={32} />
                  </div>
                </>
              ) : (
                <>
                  <Upload className="text-muted mb-4" size={48} />
                  <p className="text-muted text-sm font-medium">Click to upload image</p>
                  <p className="text-muted text-xs mt-1">PNG, JPG, GIF up to 10MB</p>
                </>
              )}
              <input 
                id="image-upload" 
                type="file" 
                className="hidden" 
                accept="image/*"
                onChange={handleImageChange}
              />
            </div>
          </div>

          <button 
            form="product-form"
            type="submit" 
            disabled={loading}
            className="btn btn-primary w-full py-4 text-lg justify-center shadow-lg shadow-primary/20"
          >
            <Save size={20} />
            {loading ? 'Saving Product...' : isEdit ? 'Update Product' : 'Publish Product'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
