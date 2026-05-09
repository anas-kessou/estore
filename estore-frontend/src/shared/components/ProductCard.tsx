import { Link } from 'react-router-dom';
import { ShoppingCart, Star } from 'lucide-react';
import { Product } from '@/shared/types';

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
}

export const ProductCard = ({ product, onAddToCart }: ProductCardProps) => {
  const inStock = product.inStock ?? (product.inventory?.quantity ?? 0 > 0);
  const lowStock = product.lowStock && inStock;

  return (
    <div className="group bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 hover:border-indigo-100 transition-all duration-300 flex flex-col">
      <Link to={`/products/${product.id}`} className="block relative focus:outline-none">
        <div className="relative aspect-[4/3] sm:aspect-square overflow-hidden bg-slate-50 flex items-center justify-center p-4">
          <img
            src={product.imageUrl || 'https://via.placeholder.com/300x300?text=Product'}
            alt={product.name}
            className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
          />
          {!inStock && (
            <div className="absolute top-3 right-3 bg-red-500/90 backdrop-blur text-white text-xs font-bold px-2.5 py-1 rounded-full">
              Sold Out
            </div>
          )}
          {lowStock && (
            <div className="absolute top-3 right-3 bg-orange-500/90 backdrop-blur text-white text-xs font-bold px-2.5 py-1 rounded-full">
              Low Stock: {product.availableStock} left
            </div>
          )}
          {product.featured && inStock && !lowStock && (
            <div className="absolute top-3 left-3 bg-amber-400 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
              Featured
            </div>
          )}
        </div>
      </Link>
      
      <div className="p-5 flex flex-col flex-1">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            {product.category && (
              <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md">
                {product.category.name}
              </span>
            )}
            <div className="flex items-center gap-1 bg-slate-50 px-1.5 py-0.5 rounded-md">
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span className="text-xs font-medium text-slate-600">
                {product.averageRating ? product.averageRating.toFixed(1) : 'New'}
              </span>
              {product.reviewCount !== undefined && product.reviewCount > 0 && (
                <span className="text-[10px] text-slate-400 font-normal">({product.reviewCount})</span>
              )}
            </div>
          </div>
          
          <Link to={`/products/${product.id}`} className="focus:outline-none inline-block w-full">
            <h3 className="text-base font-bold text-slate-800 group-hover:text-indigo-600 transition-colors line-clamp-2 leading-snug">
              {product.name}
            </h3>
          </Link>
        </div>
        
        <div className="flex items-end justify-between mt-4 pt-4 border-t border-slate-100">
          <div>
            <p className="text-xs text-slate-500 mb-0.5">Price</p>
            <p className="text-xl font-extrabold text-slate-900 tracking-tight">
              ${product.price.toFixed(2)}
            </p>
          </div>
          
          {onAddToCart && inStock && (
            <button
              onClick={(e) => {
                e.preventDefault();
                onAddToCart(product);
              }}
              className="bg-indigo-600 text-white p-2.5 rounded-xl hover:bg-indigo-700 hover:shadow-md hover:shadow-indigo-200 transition-all active:scale-95 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              aria-label="Add to cart"
            >
              <ShoppingCart className="w-5 h-5" />
            </button>
          )}
          {onAddToCart && !inStock && (
            <button
              disabled
              className="bg-slate-100 text-slate-400 p-2.5 rounded-xl cursor-not-allowed"
              aria-label="Out of stock"
            >
              <ShoppingCart className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
