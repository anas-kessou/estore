import { Link } from 'react-router-dom';
import { ShoppingCart, ChevronRight, ArrowRight, ShieldCheck, Truck, Zap } from 'lucide-react';
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
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="relative bg-white overflow-hidden py-16 sm:py-24 lg:py-32">
        <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
          <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-indigo-300 to-purple-400 opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-slate-900 border-b border-slate-100 pb-12">
          <span className="text-indigo-600 font-semibold tracking-wider uppercase text-sm mb-4 block">New Collection 2026</span>
          <h1 className="text-5xl sm:text-7xl font-extrabold font-['Plus_Jakarta_Sans'] tracking-tight mb-6">
            Elevate Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Style.</span>
          </h1>
          <p className="text-lg sm:text-xl text-slate-500 mb-10 max-w-2xl mx-auto">
            Discover our meticulously curated collection of premium products. Quality meets modern aesthetics in every piece.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/products"
              className="inline-flex justify-center items-center gap-2 bg-indigo-600 text-white px-8 py-3.5 rounded-full font-semibold hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-200 transition-all hover:-translate-y-0.5"
            >
              Shop Now <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/products?category=all"
              className="inline-flex justify-center items-center gap-2 bg-white text-slate-700 ring-1 ring-slate-200 px-8 py-3.5 rounded-full font-semibold hover:bg-slate-50 transition-colors"
            >
              View Categories
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="flex flex-col lg:flex-row justify-between items-end mb-10 gap-4">
          <div>
            <h2 className="text-3xl font-bold font-['Plus_Jakarta_Sans'] text-slate-900">
              Shop by Category
            </h2>
            <p className="text-slate-500 mt-2">Find exactly what you're looking for</p>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/products?category=${category.id}`}
              className="group relative bg-white rounded-2xl shadow-sm border border-slate-100 p-8 text-center hover:shadow-xl hover:border-indigo-100 transition-all duration-300 hover:-translate-y-1 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <h3 className="text-lg font-bold text-slate-800 relative z-10 group-hover:text-indigo-600 transition-colors">{category.name}</h3>
              <p className="text-sm text-slate-500 mt-2 line-clamp-2 relative z-10">{category.description}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="flex items-center justify-between mb-10 bg-slate-50">
          <div>
            <h2 className="text-3xl font-bold font-['Plus_Jakarta_Sans'] text-slate-900">
              Trending Now
            </h2>
            <p className="text-slate-500 mt-2">Our most popular styles this week</p>
          </div>
          <Link
            to="/products"
            className="hidden sm:flex items-center text-indigo-600 hover:text-indigo-700 font-semibold gap-1 group"
          >
            View All <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="inline-block w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
            <p className="mt-4 text-slate-500 font-medium">Curating products...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} />
            ))}
          </div>
        )}
        <div className="mt-8 sm:hidden text-center">
          <Link to="/products" className="inline-flex items-center text-indigo-600 font-semibold gap-1">
             View All Products <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="bg-white py-20 mt-12 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
            <div className="flex flex-col items-center p-6">
              <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center shadow-inner mb-6 text-indigo-600">
                <Zap className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-3">Lightning Fast</h3>
              <p className="text-slate-500 text-sm leading-relaxed">Experience a seamless shopping flow. Browse, select, and checkout in seconds.</p>
            </div>
            <div className="flex flex-col items-center p-6">
              <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center shadow-inner mb-6 text-emerald-600">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-3">Secure Checkout</h3>
              <p className="text-slate-500 text-sm leading-relaxed">Your data is safe with us. We use bank-level encryption for all transactions.</p>
            </div>
            <div className="flex flex-col items-center p-6">
              <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center shadow-inner mb-6 text-amber-500">
                <Truck className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-3">Express Delivery</h3>
              <p className="text-slate-500 text-sm leading-relaxed">Get your orders delivered to your doorstep within 2-3 business days anywhere.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
