import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { ShoppingCart, Eye, ArrowRight, Star, Zap, ShieldCheck, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import Skeleton from '../components/UI/Skeleton';
import Button from '../components/UI/Button';
import Card from '../components/UI/Card';

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
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const { addToCart } = useCart();

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
    if (selectedCategory === 'all') {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(products.filter(product => 
        product.category_name?.toLowerCase() === selectedCategory.toLowerCase()
      ));
    }
  }, [selectedCategory, products]);

  const handleCategoryFilter = (category: string) => {
    setSelectedCategory(category);
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
      <section className="container py-12 sm:py-16 md:py-24" id="products">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 sm:gap-6 mb-12 md:mb-16">
          <div>
            <h2 className="text-xs font-black text-primary uppercase tracking-[0.3em] mb-2 sm:mb-4">Curated Selection</h2>
            <h3 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight uppercase">Featured Drops</h3>
          </div>
          
          {/* Category Filters */}
          <div className="flex gap-2 flex-wrap sm:flex-nowrap overflow-x-auto pb-2 sm:pb-0">
            <Button 
              variant={selectedCategory === 'all' ? 'primary' : 'outline'} 
              size="sm" 
              onClick={() => handleCategoryFilter('all')}
              className="px-4 py-2 text-xs uppercase font-bold tracking-wider flex-shrink-0"
            >
              All
            </Button>
            {categories.map((category) => (
              <Button 
                key={category.id}
                variant={selectedCategory === category.name.toLowerCase() ? 'primary' : 'outline'} 
                size="sm" 
                onClick={() => handleCategoryFilter(category.name.toLowerCase())}
                className="px-4 py-2 text-xs uppercase font-bold tracking-wider flex-shrink-0"
              >
                {category.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {loading ? (
            [1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <Card key={i} className="p-0 flex flex-col h-full overflow-hidden">
                <Skeleton className="aspect-[4/5] w-full rounded-none" />
                <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
                  <Skeleton className="h-5 sm:h-6 w-3/4" />
                  <Skeleton className="h-3 sm:h-4 w-1/4" />
                  <div className="flex justify-between items-center pt-2">
                    <Skeleton className="h-9 sm:h-10 w-20 sm:w-24 rounded-lg" />
                    <Skeleton className="h-9 sm:h-10 w-9 sm:w-10 rounded-full" />
                  </div>
                </div>
              </Card>
            ))
          ) : (
            filteredProducts.map((product) => (
              <Card 
                key={product.id} 
                hoverable
                className="group p-0 flex flex-col h-full overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-primary/20"
              >
                {/* Product Image */}
                <div className="relative aspect-[4/5] overflow-hidden bg-slate-100 dark:bg-slate-800">
                  {product.image_url ? (
                    <img 
                      src={`http://localhost:5000${product.image_url}`} 
                      alt={product.name} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-text-muted">
                      <ShoppingCart size={40} strokeWidth={1} />
                    </div>
                  )}

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-4 sm:p-6">
                    <Link 
                      to={`/product/${product.id}`} 
                      className="w-full"
                    >
                      <Button variant="primary" size="md" className="w-full gap-2">
                        <Eye size={18} /> Quick View
                      </Button>
                    </Link>
                  </div>

                  {/* Category Badge */}
                  <div className="absolute top-3 sm:top-4 left-3 sm:left-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider text-primary shadow-sm">
                    {product.category_name}
                  </div>
                </div>
                
                {/* Product Info */}
                <div className="p-4 sm:p-6 flex-grow flex flex-col">
                  {/* Name */}
                  <h3 className="text-lg sm:text-xl font-bold line-clamp-1 group-hover:text-primary transition-colors mb-2 sm:mb-3">
                    {product.name}
                  </h3>

                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-3 sm:mb-4">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} size={14} className="fill-warning text-warning flex-shrink-0" />
                    ))}
                    <span className="text-[10px] font-black text-text-muted ml-1 sm:ml-2">4.8</span>
                  </div>

                  {/* Price & Add to Cart */}
                  <div className="mt-auto flex items-center justify-between gap-2">
                    <p className="text-xl sm:text-2xl font-black text-primary">
                      ${Number(product.price).toFixed(2)}
                    </p>
                    <button 
                      onClick={() => addToCart(product.id, 1)}
                      className="p-2.5 sm:p-3 bg-slate-100 dark:bg-slate-800 rounded-full hover:bg-primary hover:text-white hover:scale-110 hover:rotate-12 transition-all duration-300 group/btn flex-shrink-0 active:scale-95 active:rotate-0"
                      title="Add to cart"
                    >
                      <ShoppingCart size={20} className="group-hover/btn:animate-bounce transition-all duration-300" />
                    </button>
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
