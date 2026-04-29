import React from 'react';
import { ShoppingCart, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import Button from './UI/Button';
import Card from './UI/Card';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category_name: string;
}

interface RelatedProductsProps {
  products: Product[];
  currentProductId: string;
  categoryName: string;
}

const RelatedProducts: React.FC<RelatedProductsProps> = ({ 
  products, 
  currentProductId, 
  categoryName 
}) => {
  const { addToCart } = useCart();
  const navigate = useNavigate();

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

  // Filter out the current product
  const relatedProducts = products.filter(product => product.id !== currentProductId);

  if (relatedProducts.length === 0) {
    return null;
  }

  return (
    <section className="container py-16 sm:py-20 md:py-24">
      {/* Section Header */}
      <div className="text-center mb-12 md:mb-16">
        <h2 className="text-xs font-black text-primary uppercase tracking-[0.3em] mb-4">
          Related Products
        </h2>
        <h3 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight uppercase">
          More from {categoryName}
        </h3>
        <div className="w-24 h-1 bg-primary mx-auto mt-6 rounded-full"></div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
        {relatedProducts.slice(0, 8).map((product) => (
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
        ))}
      </div>
    </section>
  );
};

export default RelatedProducts;
