import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import api from '../../api/axios';
import { Upload, ArrowLeft, Save, Info, Package, DollarSign, Layers } from 'lucide-react';

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
            setImagePreview(p.image_url);
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
    <div className="container py-12 animate-fade-in">
      <Link to="/admin" className="flex items-center gap-2 text-muted hover:text-primary transition mb-8 font-medium">
        <ArrowLeft size={20} /> Back to Inventory
      </Link>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-16">
        <div>
          <h1 className="text-4xl font-black tracking-tight">{isEdit ? 'Edit Product' : 'Create Product'}</h1>
          <p className="text-muted font-medium mt-2">Provide the necessary details to {isEdit ? 'update' : 'publish'} your product</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
        <div className="lg:col-span-2">
          <form id="product-form" onSubmit={handleSubmit} className="space-y-12">
            {/* General Info Card */}
            <div className="card p-8 space-y-8" style={{ marginBottom: '5vh' }}>
              <div className="flex items-center gap-2 text-primary border-b border-border pb-4 mb-8">
                <Info size={20} />
                <h3 className="font-bold uppercase tracking-widest text-xs">General Information</h3>
              </div>
              
              <div className="space-y-8">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-muted ml-1">Product Name</label>
                  <div className="relative">
                    <input 
                      name="name"
                      type="text" 
                      required 
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full bg-main border border-border px-4 py-3 rounded-xl focus:border-primary transition pl-12"
                      placeholder="e.g. Ultra-High Performance Headphones"
                    />
                    <Package size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-muted ml-1">Full Description</label>
                  <textarea 
                    name="description"
                    required 
                    rows={8}
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full bg-main border border-border px-4 py-3 rounded-xl focus:border-primary transition resize-none"
                    placeholder="Describe the product's key features, specifications, and benefits..."
                  />
                </div>
              </div>
            </div>

            {/* Pricing & Stock Card */}
            <div className="card p-8 space-y-8" style={{ marginBottom: '5vh' }}>
              <div className="flex items-center gap-2 text-primary border-b border-border pb-4 mb-8">
                <DollarSign size={20} />
                <h3 className="font-bold uppercase tracking-widest text-xs">Pricing & Inventory</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-muted ml-1">Base Price ($)</label>
                  <div className="relative">
                    <input 
                      name="price"
                      type="number" 
                      step="0.01"
                      required 
                      value={formData.price}
                      onChange={handleChange}
                      className="w-full bg-main border border-border px-4 py-3 rounded-xl focus:border-primary transition pl-12"
                      placeholder="0.00"
                    />
                    <DollarSign size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-muted ml-1">Stock Quantity</label>
                  <div className="relative">
                    <input 
                      name="stock"
                      type="number" 
                      required 
                      value={formData.stock}
                      onChange={handleChange}
                      className="w-full bg-main border border-border px-4 py-3 rounded-xl focus:border-primary transition pl-12"
                      placeholder="0"
                    />
                    <Layers size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
                  </div>
                </div>
              </div>
            </div>

            {/* Classification Card */}
            <div className="card p-8 space-y-8" style={{ marginBottom: '5vh' }}>
              <div className="flex items-center gap-2 text-primary border-b border-border pb-4 mb-8">
                <Info size={20} />
                <h3 className="font-bold uppercase tracking-widest text-xs">Classification</h3>
              </div>
              
              <div className="space-y-6">
                <label className="text-sm font-bold text-muted ml-1">Category</label>
                <select 
                  name="category_id"
                  required 
                  value={formData.category_id}
                  onChange={handleChange}
                  className="w-full bg-main border border-border px-4 py-3 rounded-xl focus:border-primary transition appearance-none"
                >
                  <option value="">Select a category</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </form>
        </div>

        {/* Sidebar Controls */}
        <div className="space-y-12">
          <div className="card p-8 space-y-8" style={{ marginLeft: '2vw' }}>
            <h3 className="font-bold uppercase tracking-widest text-xs text-primary border-b border-border pb-4 mb-8">Product Visuals</h3>
            <div 
              className="border-2 border-dashed border-border rounded-2xl aspect-square flex flex-col items-center justify-center relative overflow-hidden group hover:border-primary transition-all cursor-pointer bg-main/50"
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
                <div className="flex flex-col items-center text-center p-6">
                  <div className="p-4 bg-primary-light text-primary rounded-full mb-4">
                    <Upload size={32} />
                  </div>
                  <p className="text-muted text-sm font-bold">Upload Product Image</p>
                  <p className="text-muted text-[10px] mt-1">High resolution PNG or JPG recommended</p>
                </div>
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

          <div className="space-y-4 flex flex-col items-center">
            <button 
              form="product-form"
              type="submit" 
              disabled={loading}
              className="btn btn-primary py-3 text-lg font-black gap-2 shadow-lg shadow-primary/20"
              style={{ width: '15vw', marginTop: '5vh' }}
            >
              <Save size={20} />
              {loading ? 'Processing...' : isEdit ? 'Update Listing' : 'Publish Product'}
            </button>
            <Link 
              to="/admin"
              className="btn btn-outline py-2 text-muted hover:text-danger hover:border-danger transition"
              style={{ width: '15vw' }}
            >
              Cancel Changes
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
