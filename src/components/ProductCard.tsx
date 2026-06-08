import React, { useState } from 'react';
import { Product } from '../types';
import { useApp } from '../context/AppContext';
import { Star, ShoppingCart, Check } from 'lucide-react';
import { motion } from 'motion/react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useApp();
  const [added, setAdded] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs p-3.5 transition-all hover:shadow-sm hover:border-slate-300"
    >
      {/* Product Image Frame */}
      <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-slate-50 mb-3.5 border border-slate-100">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="h-full w-full object-cover object-center transition-transform duration-500 will-change-transform group-hover:scale-103"
          loading="lazy"
          referrerPolicy="no-referrer"
        />
        
        {/* Category Badge */}
        <span className="absolute left-2.5 top-2.5 rounded-full bg-white/95 backdrop-blur-xs px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-slate-600 shadow-xs border border-slate-100">
          {product.category}
        </span>

        {/* Stock warning badging */}
        {isOutOfStock ? (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs">
            <span className="rounded-lg bg-slate-950 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-white shadow-lg">
              Sold Out
            </span>
          </div>
        ) : isLowStock ? (
          <span className="absolute right-2.5 top-2.5 rounded-md bg-amber-500 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white shadow-xs">
            Only {product.stock} left
          </span>
        ) : null}
      </div>

      {/* Product Metadata */}
      <div className="flex flex-1 flex-col font-sans">
        {/* Rating Stars row */}
        <div className="flex items-center gap-1.5 mb-1.5">
          <div className="flex items-center text-amber-500">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-3 w-3 ${
                  i < Math.floor(product.rating) 
                    ? 'fill-current' 
                    : 'text-slate-200 fill-none'
                }`}
              />
            ))}
          </div>
          <span className="font-mono text-[10px] text-slate-400 font-bold">
            ({product.numReviews})
          </span>
        </div>

        {/* Product Title */}
        <h3 className="text-xs sm:text-sm font-bold tracking-tight text-slate-900 mb-1.5 line-clamp-1 group-hover:text-blue-650 transition-colors">
          {product.name}
        </h3>

        {/* Product Description */}
        <p className="text-[11px] sm:text-xs text-slate-500 line-clamp-2 mb-3.5 leading-relaxed">
          {product.description}
        </p>

        {/* Price and Cart Actions Row */}
        <div className="mt-auto flex items-center justify-between gap-2 pt-2.5 border-t border-slate-100">
          <div>
            <span className="block text-[8px] font-mono uppercase tracking-widest text-slate-400 font-bold">Price</span>
            <span className="text-sm sm:text-base font-bold text-slate-950 font-mono">
              ${product.price.toFixed(2)}
            </span>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`flex h-8 items-center justify-center gap-1.5 px-3 rounded-lg text-[11px] font-bold tracking-tight transition-all cursor-pointer ${
              isOutOfStock
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : added
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-slate-900 text-white hover:bg-blue-600'
            }`}
          >
            {added ? (
              <>
                <Check className="h-3.5 w-3.5" />
                <span>Added</span>
              </>
            ) : (
              <>
                <ShoppingCart className="h-3 w-3" />
                <span>Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
};
