import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { ShoppingCart, Eye, ArrowRight, Star, Zap, ShieldCheck, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import Skeleton from '../components/UI/Skeleton';
import Button from '../components/UI/Button';
import Card from '../components/UI/Card';
import Input from '../components/UI/Input';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category_name: string;
}

interface Category {
  id: string;
  name: string;
  description: string;
}

const Home: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          api.get('/products'),
          api.get('/categories')
        ]);
        setProducts(productsRes.data);
        setCategories(categoriesRes.data);
      } catch (err) {
        console.error('Failed to fetch data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    let filtered = products;
    
    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => 
        product.category_name?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }
    
    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.category_name?.toLowerCase().includes(query)
      );
    }
    
    setFilteredProducts(filtered);
  }, [selectedCategory, searchQuery, products]);

  const handleCategoryFilter = (category: string) => {
    setSelectedCategory(category);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleProductClick = (productId: string) => {
    navigate(`/product/${productId}`);
  };

  const handleAddToCart = async (productId: string) => {
    try {
      await addToCart(productId, 1);
    } catch (err) {
      console.error('Failed to add to cart:', err);
    }
  };

  return (
    <div className="animate-fade-in pb-20">
      {/* Hero Section */}
      <section className="hero">
        <div className="absolute inset-0 z-0">
          <div className="hero-overlay"></div>
          <img 
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80" 
            alt="Hero Background" 
            className="hero-image"
          />
        </div>

        <div className="container relative z-20 text-white">
          <div className="max-w-3xl space-y-4 md:space-y-6 lg:space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 md:px-4 py-2 rounded-full bg-primary-20 border border-primary-30 text-primary-light backdrop-blur-12 animate-fade-in text-xs md:text-sm">
              <Zap size={16} className="shrink-0" />
              <span className="font-black uppercase tracking-widest">New Collection 2024</span>
            </div>

            {/* Heading */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-black tracking-tighter leading-tight md:leading-0-9">
              DEFINE YOUR <span className="text-gradient">FUTURE</span> STYLE
            </h1>

            {/* Description */}
            <p className="text-sm md:text-lg lg:text-xl xl:text-2xl text-slate-300 max-w-2xl leading-relaxed">
              Experience the pinnacle of modern design and premium quality. Our curated collection brings the future of fashion to your doorstep.
            </p>

            {/* Buttons */}
            <div className="flex flex-col md:flex-row gap-3 md:gap-6 pt-4">
              <Button 
                variant="primary" 
                size="lg"
                onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
                className="w-full md:w-auto group text-lg custom-button"
              >
                Shop Collection <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="w-full md:w-auto border-white text-white hover:bg-white hover:text-slate-900 text-lg custom-button"
              >
                Watch Lookbook
              </Button>
            </div>
          </div>
        </div>

        {/* Floating Badges */}
        <div className="absolute bottom-6 md:bottom-8 lg:bottom-12 right-4 md:right-6 lg:right-12 hidden md:flex gap-3 md:gap-8 animate-fade-in" style={{ animationDelay: '1s' }}>
          <Card glass className="p-4 md:p-6 flex flex-col items-center gap-2 border-white-10">
            <ShieldCheck size={24} className="text-primary md:size-8" />
            <span className="text-xs md:text-xs font-black uppercase text-white tracking-widest">Safe Checkout</span>
          </Card>
          <Card glass className="p-4 md:p-6 flex flex-col items-center gap-2 border-white-10">
            <TrendingUp size={24} className="text-secondary md:size-8" />
            <span className="text-xs md:text-xs font-black uppercase text-white tracking-widest">Trending Now</span>
          </Card>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="container py-16 sm:py-20 md:py-24" id="products">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-end gap-6 mb-16 md:mb-20">
          <div>
            <h2 className="text-xs font-black text-primary uppercase tracking-[0.3em] mb-2 sm:mb-4">Curated Selection</h2>
            <h3 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight uppercase">Featured Drops</h3>
          </div>
          
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
            {/* Search Input */}
            <div className="relative min-w-[200px] sm:min-w-[300px]">
              <Input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </div>
            
            {/* Category Filters */}
            <div className="relative">
              <select 
                value={selectedCategory}
                onChange={(e) => handleCategoryFilter(e.target.value)}
                className="appearance-none bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 pr-10 text-sm font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary cursor-pointer hover:border-primary transition-colors"
              >
                <option value="all">All Categories</option>
                {categories.map((category) => (
                  <option 
                    key={category.id} 
                    value={category.name.toLowerCase()}
                    className="text-slate-900 dark:text-slate-100"
                  >
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
          {loading ? (
            [1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <Card key={i} className="p-0 flex flex-col h-full overflow-hidden">
                <Skeleton className="aspect-[4/5] w-full rounded-none" />
                <div className="p-5 sm:p-6 space-y-3 sm:space-y-4 bg-white dark:bg-slate-900">
                  <Skeleton className="h-4 sm:h-5 w-3/4" />
                  <Skeleton className="h-3 sm:h-4 w-1/4" />
                  <div className="flex justify-between items-center pt-2">
                    <Skeleton className="h-8 sm:h-9 w-16 sm:w-20 rounded-lg" />
                    <Skeleton className="h-8 sm:h-9 w-8 sm:w-9 rounded-full" />
                  </div>
                </div>
              </Card>
            ))
          ) : (
            filteredProducts.map((product) => (
              <Card 
                key={product.id} 
                hoverable
                className="group p-0 flex flex-col h-full overflow-hidden shadow-md hover:shadow-2xl hover:shadow-primary/30 transition-all duration-300 cursor-pointer hover:cursor-pointer"
                onClick={() => handleProductClick(product.id)}
              >
                {/* Product Image */}
                <div className="relative aspect-[4/5] overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900">
                  {product.image_url ? (
                    <img 
                      src={product.image_url} 
                      alt={product.name} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                      <ShoppingCart size={40} strokeWidth={1} />
                    </div>
                  )}

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-slate-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-end justify-center p-6">
                    <div className="w-full space-y-3">
                      <Button 
                        variant="primary" 
                        size="md" 
                        className="w-full gap-2 backdrop-blur-sm bg-white/90 text-slate-900 hover:bg-white border border-white/20"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleProductClick(product.id);
                        }}
                      >
                        <Eye size={18} /> Quick View
                      </Button>
                    </div>
                  </div>

                  {/* Category Badge */}
                  <div className="absolute top-3 sm:top-4 left-3 sm:left-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider text-primary shadow-lg border border-white/20">
                    {product.category_name}
                  </div>

                  {/* Quick Add Button - Always visible on hover */}
                  <div className="absolute top-3 sm:top-4 right-3 sm:right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0">
                    <Button 
                      variant="primary"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(product.id);
                      }}
                      className="rounded-full p-2.5 bg-white/90 hover:bg-white text-primary shadow-lg border border-white/20"
                      title="Add to cart"
                    >
                      <ShoppingCart size={16} />
                    </Button>
                  </div>
                </div>
                
                {/* Product Info */}
                <div className="p-5 sm:p-6 flex-grow flex flex-col bg-white dark:bg-slate-900">
                  {/* Name */}
                  <h3 className="text-base sm:text-lg font-bold line-clamp-2 group-hover:text-primary transition-colors mb-3 leading-tight">
                    {product.name}
                  </h3>

                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-4">
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} size={12} className="fill-warning text-warning flex-shrink-0" />
                      ))}
                    </div>
                    <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 ml-1">4.8</span>
                  </div>

                  {/* Price & Add to Cart */}
                  <div className="mt-auto flex items-center justify-between gap-3">
                    <div>
                      <p className="text-lg sm:text-xl font-black text-primary leading-tight">
                        ${Number(product.price).toFixed(2)}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-through">${(Number(product.price) * 1.2).toFixed(2)}</p>
                    </div>
                    <Button 
                      variant="primary"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(product.id);
                      }}
                      className="gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider flex-shrink-0 shadow-md hover:shadow-lg"
                    >
                      <ShoppingCart size={14} /> Add
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
