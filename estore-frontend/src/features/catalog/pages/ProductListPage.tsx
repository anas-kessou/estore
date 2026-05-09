import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ProductCard } from '@/shared/components';
import { CatalogService, CartService, AuthService } from '@/core/services';
import { Product, Category, PageResponse } from '@/shared/types';
import { Search, Filter, SlidersHorizontal, ShoppingCart, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export const ProductListPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
  const [selectedCategory, setSelectedCategory] = useState<string>(searchParams.get('category') || '');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await CatalogService.getCategories();
        setCategories(data);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let data;
        if (searchTerm) {
          data = await CatalogService.searchProducts(searchTerm, currentPage, 12);
        } else if (selectedCategory) {
          data = await CatalogService.getProductsByCategory(parseInt(selectedCategory), currentPage, 12);
        } else {
          data = await CatalogService.getProducts(0, 12);
        }
        setProducts(data.content);
        setTotalPages(data.totalPages);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [searchTerm, selectedCategory, currentPage]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams({ q: searchTerm });
    setCurrentPage(0);
  };

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    if (categoryId) {
      setSearchParams({ category: categoryId });
    } else {
      setSearchParams({});
    }
    setCurrentPage(0);
  };

  const handleAddToCart = async (product: Product) => {
    const user = AuthService.getCurrentUser();
    if (user?.id) {
      try {
        await CartService.addToCart(user.id, product, 1);
        toast.success(`Added ${product.name} to cart`);
      } catch (error) {
        toast.error('Failed to add to cart');
      }
    } else {
      alert('Please login to add items to cart');
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold font-[Poppins] text-[#2c3e50] mb-8">
          Products
        </h1>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <form onSubmit={handleSearch} className="flex-1 flex">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search products..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-[#3498db] focus:border-transparent outline-none"
                />
              </div>
              <button
                type="submit"
                className="bg-[#3498db] text-white px-6 py-3 rounded-r-lg hover:bg-[#2980b9] transition-colors"
              >
                Search
              </button>
            </form>

            <div className="relative" style={{ minWidth: '200px' }}>
              <button
                type="button"
                onClick={() => {
                  const el = document.getElementById('category-dropdown');
                  if (el) el.classList.toggle('hidden');
                }}
                className="w-full bg-white flex items-center justify-between px-4 py-3 border border-gray-200 rounded-xl shadow-sm hover:border-[#3498db] hover:shadow-md transition-all outline-none focus:ring-2 focus:ring-[#3498db]/50 group text-[#2c3e50] font-medium"
              >
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-[#3498db]" />
                  <span>
                    {selectedCategory 
                      ? categories.find(c => String(c.id) === selectedCategory)?.name || 'All Categories'
                      : 'All Categories'}
                  </span>
                </div>
                <svg className="w-4 h-4 text-gray-400 group-hover:text-[#3498db] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </button>
              
              <div id="category-dropdown" className="hidden absolute z-50 mt-2 w-full bg-white border border-gray-100 rounded-xl shadow-xl overflow-hidden py-1 backdrop-blur-sm">
                <button
                  type="button"
                  onClick={() => {
                    handleCategoryChange('');
                    document.getElementById('category-dropdown')?.classList.add('hidden');
                  }}
                  className={`w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center gap-2 ${!selectedCategory ? 'bg-[#3498db]/10 text-[#3498db] font-bold' : 'text-gray-700 hover:bg-gray-50'}`}
                >
                  <div className={`w-1.5 h-1.5 rounded-full ${!selectedCategory ? 'bg-[#3498db]' : 'bg-transparent'}`}></div>
                  All Categories
                </button>
                {categories.map((category) => (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => {
                      handleCategoryChange(String(category.id));
                      document.getElementById('category-dropdown')?.classList.add('hidden');
                    }}
                    className={`w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center gap-2 ${selectedCategory === String(category.id) ? 'bg-[#3498db]/10 text-[#3498db] font-bold' : 'text-gray-700 hover:bg-gray-50'}`}
                  >
                    <div className={`w-1.5 h-1.5 rounded-full ${selectedCategory === String(category.id) ? 'bg-[#3498db]' : 'bg-transparent'}`}></div>
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block w-8 h-8 border-4 border-[#3498db] border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-600">Loading products...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No products found</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-8 gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
                  disabled={currentPage === 0}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="px-4 py-2">
                  Page {currentPage + 1} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages - 1, p + 1))}
                  disabled={currentPage >= totalPages - 1}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
