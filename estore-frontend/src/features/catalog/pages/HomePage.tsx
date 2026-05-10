import { Link } from 'react-router-dom';
import { ShoppingCart, ChevronRight, ArrowRight, ShieldCheck, Truck, Zap, Star } from 'lucide-react';
import { ProductCard } from '@/shared/components';
import { CatalogService, CartService } from '@/core/services';
import { Category, Product } from '@/shared/types';
import { useState, useEffect } from 'react';
import { AuthService } from '@/core/services/auth.service';
import { toast } from 'sonner';
import { motion, Variants } from 'framer-motion';

const PREF_COOKIE = 'pref_cats';

const getPreferredCategories = (): number[] => {
  const match = document.cookie.match(new RegExp('(^| )' + PREF_COOKIE + '=([^;]+)'));
  if (match) return match[2].split(',').map(Number).filter(n => !isNaN(n));
  return [];
};

const preferCategory = (id: number) => {
  const prefs = getPreferredCategories();
  const newPrefs = [id, ...prefs.filter(pid => pid !== id)].slice(0, 5);
  document.cookie = `${PREF_COOKIE}=${newPrefs.join(',')}; path=/; max-age=31536000`;
};

interface GroupedCategory {
  category: Category;
  products: Product[];
}

export const HomePage = () => {
  const [trendingProducts, setTrendingProducts] = useState<Product[]>([]);
  const [groupedCategories, setGroupedCategories] = useState<GroupedCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [trending, allProductsData, categoriesData] = await Promise.all([
          CatalogService.getFeaturedProducts(4),
          CatalogService.getProducts(0, 100),
          CatalogService.getCategories(),
        ]);
        
        setTrendingProducts(trending);

        const allProducts = allProductsData.content;
        let groups = categoriesData.map(cat => ({
          category: cat,
          products: allProducts.filter(p => p.categoryId === cat.id).slice(0, 4)
        })).filter(g => g.products.length > 0);

        const prefs = getPreferredCategories();
        // Sort groups: if category is in prefs, it gets priority (lower index in prefs = higher priority)
        // If not in prefs, fallback to displayOrder
        groups = groups.sort((a, b) => {
          const aIdx = prefs.indexOf(a.category.id);
          const bIdx = prefs.indexOf(b.category.id);
          if (aIdx !== -1 && bIdx !== -1) return aIdx - bIdx;
          if (aIdx !== -1) return -1;
          if (bIdx !== -1) return 1;
          return a.category.displayOrder - b.category.displayOrder;
        });

        setGroupedCategories(groups);

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
        if (product.categoryId) preferCategory(product.categoryId);
      } catch (error) {
        toast.error('Failed to add to cart');
      }
    }
  };

  const handleProductClick = (product: Product) => {
    if (product.categoryId) preferCategory(product.categoryId);
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
      {/* Premium Hero Section */}
      <section className="relative bg-[#fafafa] overflow-hidden min-h-[90vh] flex items-center">
        <div className="absolute inset-0 z-0">
            <div className="absolute top-0 right-0 w-[50%] h-[100%] bg-gradient-to-l from-indigo-50/50 to-transparent"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center pt-20 pb-10">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <span className="text-indigo-600 font-extrabold tracking-widest uppercase text-[10px] mb-6 block py-2 px-4 bg-indigo-50/80 backdrop-blur border border-indigo-100/50 w-fit rounded-xl shadow-sm">
                Curated Excellence 2026
              </span>
              <h1 className="text-6xl sm:text-7xl lg:text-[5.5rem] font-black font-['Plus_Jakarta_Sans'] tracking-tight mb-8 leading-[1.05] text-slate-900">
                Design <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-br from-indigo-500 via-indigo-700 to-purple-800">
                  Refined.
                </span>
              </h1>
              <p className="text-lg sm:text-xl text-slate-500 mb-10 max-w-lg leading-relaxed font-medium">
                Experience products crafted for the modern aesthetic. Clean lines, premium materials, and unparalleled utility combined in perfect harmony.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/products"
                  className="group inline-flex justify-center items-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-indigo-600 transition-all shadow-xl shadow-slate-900/20 active:scale-95"
                >
                  Discover Collection
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <a href="#trending" className="inline-flex justify-center items-center gap-2 text-slate-600 font-bold hover:text-indigo-600 transition-colors px-6">
                  View Trending Categories
                </a>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
              className="relative flex justify-center lg:justify-end"
            >
              <div className="relative w-full max-w-lg lg:max-w-none lg:w-[120%] lg:-mr-[10%] group">
                <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 rounded-[3rem] blur-[80px] transform -translate-x-5 translate-y-5 group-hover:blur-[100px] transition-all duration-700"></div>
                <img 
                  src="/hero.png" 
                  alt="Premium Collection" 
                  className="relative z-10 w-full h-[600px] object-cover object-center rounded-[3rem] shadow-2xl ring-1 ring-slate-900/5 group-hover:scale-[1.02] transition-transform duration-700"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Grouped Product Sections */}
      <div id="trending" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 space-y-32">
        {loading ? (
          <div className="flex justify-center items-center py-40">
            <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="space-y-32">
            
            {/* 1. Trending Products (First Group) */}
            {trendingProducts.length > 0 && (
              <section>
                <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center shadow-sm border border-amber-200/50">
                        <Star className="w-5 h-5 fill-amber-500" />
                      </div>
                      <h2 className="text-4xl sm:text-5xl font-black font-['Plus_Jakarta_Sans'] text-slate-900">
                        Trending Now
                      </h2>
                    </div>
                    <p className="text-slate-500 text-lg font-medium max-w-xl leading-relaxed">The most loved and best-selling items this week, curated just for you.</p>
                  </motion.div>
                  <Link
                    to="/products"
                    className="group inline-flex items-center gap-2 bg-white ring-1 ring-slate-200 text-slate-700 px-6 py-3 rounded-2xl font-bold hover:bg-slate-50 hover:ring-slate-300 transition-all shadow-sm"
                  >
                    View Top Sellers <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>

                <motion.div 
                  className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-8"
                  variants={container}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true }}
                >
                  {trendingProducts.map((product) => (
                    <motion.div key={product.id} variants={item} onClick={() => handleProductClick(product)} className="h-full">
                      <ProductCard product={product} onAddToCart={handleAddToCart} />
                    </motion.div>
                  ))}
                </motion.div>
              </section>
            )}

            {/* 2. Categories Rows */}
            {groupedCategories.map(({ category, products }, idx) => (
              <section key={category.id} className="relative">
                {idx === 0 && (
                  <div className="absolute -left-6 sm:-left-12 top-0 bottom-0 w-1.5 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-full hidden md:block opacity-50 blur-[1px]"></div>
                )}
                <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="flex flex-col gap-2 mb-2">
                      {idx === 0 && (
                         <span className="bg-indigo-100 text-indigo-700 text-[10px] font-black px-3 py-1.5 rounded-lg uppercase tracking-widest block w-fit shadow-sm border border-indigo-200/50">
                           Based on Your Interests
                         </span>
                      )}
                    </div>
                    <h2 className="text-4xl sm:text-5xl font-black font-['Plus_Jakarta_Sans'] text-slate-900 group-hover:text-indigo-600 transition-colors">
                      {category.name}
                    </h2>
                    <p className="text-slate-500 text-lg mt-3 font-medium max-w-2xl leading-relaxed">{category.description}</p>
                  </motion.div>
                  <Link
                    to={`/products?category=${category.id}`}
                    onClick={() => preferCategory(category.id)}
                    className="group inline-flex items-center gap-2 bg-white ring-1 ring-slate-200 text-slate-700 px-6 py-3 rounded-2xl font-bold hover:bg-slate-50 hover:ring-slate-300 transition-all shadow-sm"
                  >
                    Explore {category.name} <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>

                <motion.div 
                  className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-8"
                  variants={container}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true }}
                >
                  {products.map((product) => (
                    <motion.div key={product.id} variants={item} onClick={() => handleProductClick(product)} className="h-full">
                      <ProductCard product={product} onAddToCart={handleAddToCart} />
                    </motion.div>
                  ))}
                </motion.div>
              </section>
            ))}

          </div>
        )}
      </div>

      {/* Features - Minimalist */}
      <section className="bg-white py-24 border-t border-slate-100 mt-12 rounded-t-[4rem] shadow-[0_-10px_40px_rgba(0,0,0,0.03)] mx-4 sm:mx-6 lg:mx-8 mb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            {[
              { icon: Zap, title: "Next-Gen Experience", desc: "Experience 0.3s navigation and ultra-fast checkout flows.", color: "indigo" },
              { icon: ShieldCheck, title: "Vault-Grade Security", desc: "Your data is encrypted by industry-leading protocols.", color: "emerald" },
              { icon: Truck, title: "Global Fulfillment", desc: "Express delivery across 45 countries in under 72 hours.", color: "amber" },
            ].map((f, i) => (
              <motion.div 
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2, duration: 0.6 }}
                className="group flex flex-col items-center text-center"
              >
                <div className={`w-20 h-20 bg-${f.color}-50 rounded-[2rem] flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500 shadow-sm border border-${f.color}-100`}>
                  <f.icon className={`w-8 h-8 text-${f.color}-600`} />
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-4">{f.title}</h3>
                <p className="text-slate-500 font-medium leading-relaxed max-w-sm">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
