import { Link } from 'react-router-dom';
import { ShoppingCart, ChevronRight, ArrowRight, ShieldCheck, Truck, Zap } from 'lucide-react';
import { ProductCard } from '@/shared/components';
import { CatalogService, CartService } from '@/core/services';
import { Category, Product } from '@/shared/types';
import { useState, useEffect } from 'react';
import { AuthService } from '@/core/services/auth.service';
import { toast } from 'sonner';
import { motion, Variants } from 'framer-motion';

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
        toast.success('Added to cart!');
      } catch (error) {
        toast.error('Failed to add to cart');
      }
    }
  };

  const container: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  return (
    <div className="min-h-screen bg-slate-50 overflow-hidden">
      {/* Hero Section */}
      <section className="relative bg-white overflow-visible py-20 sm:py-28 lg:py-40">
        <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
          <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-indigo-300 to-purple-400 opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-slate-900 border-b border-slate-100 pb-20">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-indigo-600 font-bold tracking-widest uppercase text-xs mb-6 block py-1.5 px-4 bg-indigo-50 w-fit mx-auto rounded-full">
              New Collection 2026
            </span>
          </motion.div>
          
          <motion.h1 
            className="text-5xl sm:text-8xl font-black font-['Plus_Jakarta_Sans'] tracking-tight mb-8 leading-[0.9]"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            Elevate Your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-800">
              Style.
            </span>
          </motion.h1>

          <motion.p 
            className="text-lg sm:text-xl text-slate-500 mb-12 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            Discover our meticulously curated collection of premium products. 
            Quality meets modern aesthetics in every piece.
          </motion.p>

          <motion.div 
            className="flex flex-col sm:flex-row gap-5 justify-center mt-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <Link
              to="/products"
              className="group inline-flex justify-center items-center gap-2 bg-slate-900 text-white px-10 py-5 rounded-[2rem] font-bold text-lg hover:bg-slate-800 transition-all shadow-2xl shadow-slate-200 active:scale-95"
            >
              Shop All
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/products?category=all"
              className="inline-flex justify-center items-center gap-2 bg-white text-slate-900 ring-1 ring-slate-200 px-10 py-5 rounded-[2rem] font-bold text-lg hover:bg-slate-50 transition-all hover:ring-indigo-200 active:scale-95 shadow-sm"
            >
              The Collections
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <motion.div 
          className="flex flex-col mb-16"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl font-black font-['Plus_Jakarta_Sans'] text-slate-900">
            Collections.
          </h2>
          <p className="text-slate-500 mt-3 text-lg font-medium italic">Explore by the mood</p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
        >
          {categories.map((category) => (
            <motion.div key={category.id} variants={item}>
              <Link
                to={`/products?category=${category.id}`}
                className="group block relative aspect-[4/5] bg-white rounded-[2.5rem] p-10 overflow-hidden shadow-sm border border-slate-100 hover:shadow-2xl hover:shadow-indigo-100 hover:border-indigo-100 transition-all duration-500"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/80 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:scale-110"></div>
                
                <div className="relative z-10 h-full flex flex-col justify-end">
                  <div className="w-12 h-12 bg-white border border-slate-100 rounded-2xl flex items-center justify-center text-indigo-600 mb-6 shadow-sm group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500">
                    <ChevronRight className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 mb-3 leading-tight group-hover:text-indigo-600 transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-sm text-slate-500 font-medium line-clamp-2 leading-relaxed">
                    {category.description}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Featured Products */}
      <section className="bg-slate-900 py-32 rounded-[3.5rem] mx-4 sm:mx-6 lg:mx-8 mb-24 overflow-hidden shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-5xl font-black font-['Plus_Jakarta_Sans'] text-white">
                Trending.
              </h2>
              <p className="text-indigo-300 mt-4 text-lg font-bold tracking-wide uppercase opacity-70">Top picks of the month</p>
            </motion.div>
            
            <Link
              to="/products"
              className="bg-white/10 backdrop-blur-md text-white px-8 py-4 rounded-2xl font-bold hover:bg-white/20 transition-all flex items-center gap-2 group border border-white/10"
            >
              Explore Shop <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-white rounded-full animate-spin"></div>
            </div>
          ) : (
            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
            >
              {featuredProducts.map((product) => (
                <motion.div key={product.id} variants={item}>
                   <ProductCard product={product} onAddToCart={handleAddToCart} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* Features - Minimalist */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 border-t border-slate-100">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
          {[
            { icon: Zap, title: "Next-Gen Experience", desc: "Experience 0.3s navigation and ultra-fast checkout.", color: "indigo" },
            { icon: ShieldCheck, title: "Vault-Grade Security", desc: "Your data is encrypted by industry-leading protocols.", color: "emerald" },
            { icon: Truck, title: "Global Fulfillment", desc: "Express delivery across 45 countries in 72 hours.", color: "amber" },
          ].map((f, i) => (
            <motion.div 
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2, duration: 0.6 }}
              className="group"
            >
              <div className={`w-16 h-16 bg-${f.color}-500/10 rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500`}>
                <f.icon className={`w-8 h-8 text-${f.color}-600`} />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-4">{f.title}</h3>
              <p className="text-slate-500 font-medium leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

