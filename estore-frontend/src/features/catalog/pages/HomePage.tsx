import { Link } from 'react-router-dom';
import { ShoppingCart, ChevronRight } from 'lucide-react';
import { ProductCard } from '@/shared/components';
import { CatalogService, CartService } from '@/core/services';
import { Category, Product } from '@/shared/types';
import { useState, useEffect } from 'react';
import { AuthService } from '@/core/services/auth.service';

export const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsData, categoriesData] = await Promise.all([
          CatalogService.getProducts(0, 8),
          CatalogService.getCategories(),
        ]);
        setFeaturedProducts(productsData.content);
        setCategories(categoriesData);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleAddToCart = async (product: Product) => {
    const user = AuthService.getCurrentUser();
    if (user?.id) {
      try {
        await CartService.addToCart(user.id, product, 1);
        alert('Added to cart!');
      } catch (error) {
        alert('Failed to add to cart');
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#2c3e50] to-[#3498db] text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold font-[Poppins] mb-4">
            Welcome to E-Store
          </h1>
          <p className="text-xl text-gray-200 mb-8">
            Discover amazing products at unbeatable prices
          </p>
          <Link
            to="/products"
            className="inline-block bg-white text-[#2c3e50] px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Shop Now
          </Link>
        </div>
      </section>

      {/* Categories Section */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold font-[Poppins] text-[#2c3e50] mb-8">
          Shop by Category
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/products?category=${category.id}`}
              className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-xl transition-shadow"
            >
              <h3 className="text-lg font-semibold text-[#2c3e50]">{category.name}</h3>
              <p className="text-sm text-gray-500 mt-2 line-clamp-2">{category.description}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold font-[Poppins] text-[#2c3e50]">
            Featured Products
          </h2>
          <Link
            to="/products"
            className="flex items-center text-[#3498db] hover:underline font-medium"
          >
            View All <ChevronRight className="w-5 h-5" />
          </Link>
        </div>
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block w-8 h-8 border-4 border-[#3498db] border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-600">Loading products...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} />
            ))}
          </div>
        )}
      </section>

      {/* Features */}
      <section className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-6">
              <div className="w-16 h-16 bg-[#3498db] rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingCart className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-[#2c3e50] mb-2">Easy Shopping</h3>
              <p className="text-gray-600">Browse and purchase products with ease</p>
            </div>
            <div className="p-6">
              <div className="w-16 h-16 bg-[#27ae60] rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-[#2c3e50] mb-2">Secure Payments</h3>
              <p className="text-gray-600">Your transactions are always secure</p>
            </div>
            <div className="p-6">
              <div className="w-16 h-16 bg-[#e74c3c] rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-[#2c3e50] mb-2">Fast Delivery</h3>
              <p className="text-gray-600">Get your orders delivered quickly</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
