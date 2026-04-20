import { Link } from 'react-router-dom';
import { ShoppingCart, Star } from 'lucide-react';
import { Product } from '@/shared/types';

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
}

export const ProductCard = ({ product, onAddToCart }: ProductCardProps) => {
  const inStock = product.inventory?.quantity ?? 0 > 0;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <Link to={`/products/${product.id}`}>
        <div className="relative h-48 overflow-hidden bg-gray-100">
          <img
            src={product.imageUrl || 'https://via.placeholder.com/300x200'}
            alt={product.name}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
          {!inStock && (
            <div className="absolute top-2 right-2 bg-[#e74c3c] text-white text-xs px-2 py-1 rounded">
              Out of Stock
            </div>
          )}
        </div>
      </Link>
      <div className="p-4">
        <Link to={`/products/${product.id}`}>
          <h3 className="text-lg font-semibold text-[#2c3e50] hover:text-[#3498db] transition-colors truncate">
            {product.name}
          </h3>
        </Link>
        {product.category && (
          <p className="text-sm text-gray-500 mt-1">{product.category.name}</p>
        )}
        <div className="flex items-center mt-2">
          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
          <span className="text-sm text-gray-600 ml-1">4.5</span>
        </div>
        <div className="flex items-center justify-between mt-3">
          <span className="text-xl font-bold text-[#2c3e50]">${product.price.toFixed(2)}</span>
          {onAddToCart && inStock && (
            <button
              onClick={(e) => {
                e.preventDefault();
                onAddToCart(product);
              }}
              className="bg-[#27ae60] text-white px-3 py-2 rounded hover:bg-[#219a52] transition-colors flex items-center"
            >
              <ShoppingCart className="w-4 h-4 mr-1" />
              Add
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
