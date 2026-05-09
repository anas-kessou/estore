import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminService, ProductsCsvImportSummary } from '@/core/services/admin.service';
import { CatalogService } from '@/core/services/catalog.service';
import { Category, Product } from '@/shared/types';
import { 
  Package, 
  Tags, 
  Upload, 
  Plus, 
  Trash2, 
  Edit2, 
  CheckCircle2, 
  AlertCircle,
  X,
  ChevronRight,
  TrendingUp,
  Layers,
  Image as ImageIcon
} from 'lucide-react';
import { toast } from 'sonner';

type Tab = 'categories' | 'products' | 'import';

export const AdminCatalogPage = () => {
  const [activeTab, setActiveTab] = useState<Tab>('products');
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Category State
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    description: '',
    imageUrl: '',
    displayOrder: 0,
    active: true
  });

  // Product State
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState({
    externalId: '',
    name: '',
    brandDesc: '',
    sellPrice: '',
    categoryName: '',
    imageUrl: '',
    active: true,
    featured: false,
    stockQuantity: '0'
  });

  // Import State
  const [file, setFile] = useState<File | null>(null);
  const [importLoading, setImportLoading] = useState(false);
  const [importSummary, setImportSummary] = useState<ProductsCsvImportSummary | null>(null);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [cats, prods] = await Promise.all([
        CatalogService.getCategories(),
        CatalogService.getProducts(0, 100).then(res => res.content)
      ]);
      setCategories(cats);
      setProducts(prods);
    } catch (error) {
      toast.error('Failed to load catalog data');
    } finally {
      setLoading(false);
    }
  };

  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await AdminService.updateCategory(editingCategory.id, categoryForm);
        toast.success('Category updated');
      } else {
        await AdminService.createCategory(categoryForm);
        toast.success('Category created');
      }
      setIsCategoryModalOpen(false);
      setEditingCategory(null);
      fetchData();
    } catch (error) {
      toast.error('Save failed');
    }
  };

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...productForm,
        sellPrice: Number(productForm.sellPrice),
        stockQuantity: Number(productForm.stockQuantity)
      };
      await AdminService.upsertProduct(payload);
      toast.success(productForm.externalId ? 'Product updated' : 'Product created');
      setIsProductModalOpen(false);
      setEditingProduct(null);
      fetchData();
    } catch (error) {
      toast.error('Save failed');
    }
  };

  const handleDeleteProduct = async (id: number) => {
    if (!confirm('Are you sure? This will delete the product and ALL its reviews.')) return;
    try {
      await AdminService.deleteProductById(id);
      toast.success('Product deleted');
      fetchData();
    } catch (error) {
      toast.error('Delete failed');
    }
  };

  const handleImportCsv = async () => {
    if (!file) return;
    setImportLoading(true);
    try {
      const res = await AdminService.importProductsCsv(file);
      setImportSummary(res);
      toast.success('Import complete');
      fetchData();
    } catch (error) {
      toast.error('Import failed');
    } finally {
      setImportLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      <div className="bg-white border-b border-slate-200 sticky top-20 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between py-6 gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <Layers className="w-6 h-6 text-indigo-600" />
                Catalog Management
              </h1>
              <p className="text-slate-500 text-sm mt-1">Manage your store's categories, products and inventory.</p>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  if (activeTab === 'categories') {
                    setEditingCategory(null);
                    setCategoryForm({ name: '', description: '', imageUrl: '', displayOrder: categories.length + 1, active: true });
                    setIsCategoryModalOpen(true);
                  } else if (activeTab === 'products') {
                    setEditingProduct(null);
                    setProductForm({
                      externalId: '', name: '', brandDesc: '', sellPrice: '', categoryName: categories[0]?.name || '',
                      imageUrl: '', active: true, featured: false, stockQuantity: '0'
                    });
                    setIsProductModalOpen(true);
                  }
                }}
                className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2.5 rounded-xl font-semibold hover:bg-indigo-700 transition-all shadow-sm hover:shadow-indigo-200"
              >
                <Plus className="w-5 h-5" />
                Add New {activeTab === 'categories' ? 'Category' : 'Product'}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-8 -mb-px">
            {[
              { id: 'products', label: 'Products', icon: Package },
              { id: 'categories', label: 'Categories', icon: Tags },
              { id: 'import', label: 'Bulk Import', icon: Upload },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as Tab)}
                className={`flex items-center gap-2 py-4 text-sm font-bold border-b-2 transition-all ${
                  activeTab === tab.id 
                    ? 'border-indigo-600 text-indigo-600' 
                    : 'border-transparent text-slate-500 hover:text-slate-700'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading && products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {activeTab === 'categories' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.map((cat) => (
                  <div key={cat.id} className="bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-md transition-all group">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-indigo-600 overflow-hidden">
                          {cat.imageUrl ? (
                            <img src={cat.imageUrl} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <Tags className="w-6 h-6" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-900">{cat.name}</h3>
                          <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{cat.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => {
                            setEditingCategory(cat);
                            setCategoryForm({
                              name: cat.name,
                              description: cat.description || '',
                              imageUrl: cat.imageUrl || '',
                              displayOrder: cat.displayOrder,
                              active: cat.active
                            });
                            setIsCategoryModalOpen(true);
                          }}
                          className="p-2 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-indigo-600"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={async () => {
                            if (confirm('Delete category?')) {
                              await AdminService.deleteCategory(cat.id);
                              toast.success('Category deleted');
                              fetchData();
                            }
                          }}
                          className="p-2 hover:bg-rose-50 rounded-lg text-slate-400 hover:text-rose-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'products' && (
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Product</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Category</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Price</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Stock</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-right"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {products.map((prod) => (
                      <tr key={prod.id} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center overflow-hidden">
                              <img src={prod.imageUrl} alt="" className="w-full h-full object-cover" />
                            </div>
                            <div>
                              <div className="text-sm font-bold text-slate-900">{prod.name}</div>
                              <div className="text-xs text-slate-400 font-mono">{prod.id}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2 py-1 rounded-md bg-indigo-50 text-indigo-700 text-xs font-bold">
                            {prod.categoryName}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-900">
                          ${prod.price.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className={`text-sm font-bold ${prod.availableStock < 5 ? 'text-rose-600' : 'text-slate-600'}`}>
                            {prod.availableStock}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {prod.active ? (
                            <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Published
                            </span>
                          ) : (
                            <span className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                              <X className="w-3.5 h-3.5" /> Draft
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                              onClick={() => {
                                setEditingProduct(prod);
                                setProductForm({
                                  externalId: String(prod.id),
                                  name: prod.name,
                                  brandDesc: prod.description || '',
                                  sellPrice: String(prod.price),
                                  categoryName: prod.categoryName || '',
                                  imageUrl: prod.imageUrl || '',
                                  active: prod.active,
                                  featured: prod.featured || false,
                                  stockQuantity: String(prod.availableStock)
                                });
                                setIsProductModalOpen(true);
                              }}
                              className="p-2 hover:bg-white rounded-lg text-slate-400 hover:text-indigo-600 shadow-sm border border-transparent hover:border-slate-200"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleDeleteProduct(prod.id!)}
                              className="p-2 hover:bg-white rounded-lg text-slate-400 hover:text-rose-600 shadow-sm border border-transparent hover:border-slate-200"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'import' && (
              <div className="max-w-2xl mx-auto">
                <div className="bg-white rounded-3xl border-2 border-dashed border-slate-200 p-12 text-center">
                  <div className="w-20 h-20 bg-indigo-50 rounded-3xl flex items-center justify-center text-indigo-600 mx-auto mb-6">
                    <Upload className="w-10 h-10" />
                  </div>
                  <h2 className="text-xl font-bold text-slate-900 mb-2">Upload Inventory CSV</h2>
                  <p className="text-slate-500 mb-8 px-8">
                    Quickly add or update thousands of products at once. Uses the internal ID column for synchronization.
                  </p>
                  
                  <input
                    type="file"
                    id="csv-upload"
                    className="hidden"
                    onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                  />
                  <label 
                    htmlFor="csv-upload"
                    className="inline-flex items-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold hover:bg-slate-800 transition-all cursor-pointer"
                  >
                    {file ? file.name : 'Select CSV File'}
                  </label>

                  {file && (
                    <button
                      onClick={handleImportCsv}
                      disabled={importLoading}
                      className="block mx-auto mt-6 text-indigo-600 font-bold hover:underline disabled:opacity-50"
                    >
                      {importLoading ? 'Importing...' : 'Start Import Now'}
                    </button>
                  )}
                </div>

                {importSummary && (
                   <div className="mt-8 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm animate-in zoom-in-95 duration-300">
                    <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                       <TrendingUp className="w-5 h-5 text-emerald-600" />
                       Import Results
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {[
                        { label: 'Total Rows', val: importSummary.totalRows, color: 'slate' },
                        { label: 'Created', val: importSummary.created, color: 'emerald' },
                        { label: 'Updated', val: importSummary.updated, color: 'indigo' },
                        { label: 'Failed', val: importSummary.failed, color: 'rose' },
                      ].map(stat => (
                        <div key={stat.label} className={`p-4 rounded-xl border border-${stat.color}-100 bg-${stat.color}-50/30`}>
                          <div className={`text-xs font-bold uppercase text-${stat.color}-600/70 tracking-wider mb-1`}>{stat.label}</div>
                          <div className={`text-2xl font-black text-slate-900`}>{stat.val}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Category Modal */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsCategoryModalOpen(false)}></div>
          <div className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-6 font-['Plus_Jakarta_Sans']">
                {editingCategory ? 'Edit Category' : 'Create New Category'}
              </h2>
              <form onSubmit={handleCategorySubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Category Name</label>
                  <input
                    required
                    value={categoryForm.name}
                    onChange={e => setCategoryForm({...categoryForm, name: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium"
                    placeholder="e.g. Modern Furniture"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Description</label>
                  <textarea
                    rows={3}
                    value={categoryForm.description}
                    onChange={e => setCategoryForm({...categoryForm, description: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium"
                    placeholder="Tell us about this collection..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Image URL</label>
                  <div className="flex gap-2">
                    <input
                      value={categoryForm.imageUrl}
                      onChange={e => setCategoryForm({...categoryForm, imageUrl: e.target.value})}
                      className="flex-1 px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium"
                      placeholder="https://images.unsplash.com/..."
                    />
                    <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 overflow-hidden border border-slate-200">
                      {categoryForm.imageUrl ? <img src={categoryForm.imageUrl} className="w-full h-full object-cover" /> : <ImageIcon className="w-5 h-5" />}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4 py-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={categoryForm.active}
                      onChange={e => setCategoryForm({...categoryForm, active: e.target.checked})}
                      className="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-sm font-bold text-slate-700">Category is Active</span>
                  </label>
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsCategoryModalOpen(false)}
                    className="flex-1 px-6 py-3.5 rounded-2xl font-bold text-slate-600 hover:bg-slate-100 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3.5 rounded-2xl font-bold bg-indigo-600 text-white shadow-lg shadow-indigo-100 hover:bg-indigo-700 hover:shadow-indigo-200 transition-all"
                  >
                    {editingCategory ? 'Save Changes' : 'Create Category'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Product Modal */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsProductModalOpen(false)}></div>
          <div className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-6 font-['Plus_Jakarta_Sans']">
                {editingProduct ? 'Edit Product' : 'Create Product'}
              </h2>
              <form onSubmit={handleProductSubmit} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Internal ID</label>
                    <input
                      required
                      value={productForm.externalId}
                      onChange={e => setProductForm({...productForm, externalId: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 outline-none transition-all font-mono text-sm"
                      placeholder="e.g. PRD-001"
                      disabled={!!editingProduct}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Category</label>
                    <select
                      required
                      value={productForm.categoryName}
                      onChange={e => setProductForm({...productForm, categoryName: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 outline-none transition-all font-bold text-sm"
                    >
                      <option value="">Select Category</option>
                      {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                   <label className="block text-sm font-bold text-slate-700 mb-2">Product Name</label>
                   <input
                    required
                    value={productForm.name}
                    onChange={e => setProductForm({...productForm, name: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 outline-none transition-all font-bold"
                    placeholder="e.g. Ergonomic Office Chair"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Price ($)</label>
                    <input
                      required
                      type="number"
                      step="0.01"
                      value={productForm.sellPrice}
                      onChange={e => setProductForm({...productForm, sellPrice: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 outline-none transition-all font-bold"
                      placeholder="99.99"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Initial Stock</label>
                    <input
                      required
                      type="number"
                      value={productForm.stockQuantity}
                      onChange={e => setProductForm({...productForm, stockQuantity: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 outline-none transition-all font-bold"
                      placeholder="100"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Image URL</label>
                  <input
                    value={productForm.imageUrl}
                    onChange={e => setProductForm({...productForm, imageUrl: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 outline-none transition-all font-medium text-sm"
                    placeholder="https://..."
                  />
                </div>

                <div className="flex items-center gap-6 py-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={productForm.active}
                      onChange={e => setProductForm({...productForm, active: e.target.checked})}
                      className="w-5 h-5 rounded border-slate-300 text-indigo-600"
                    />
                    <span className="text-sm font-bold text-slate-700">Active</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={productForm.featured}
                      onChange={e => setProductForm({...productForm, featured: e.target.checked})}
                      className="w-5 h-5 rounded border-slate-300 text-amber-500"
                    />
                    <span className="text-sm font-bold text-slate-700">Featured</span>
                  </label>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsProductModalOpen(false)}
                    className="flex-1 px-6 py-3.5 rounded-2xl font-bold text-slate-600 hover:bg-slate-100 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3.5 rounded-2xl font-bold bg-indigo-600 text-white shadow-lg shadow-indigo-100 hover:bg-indigo-700 hover:shadow-indigo-200 transition-all font-['Plus_Jakarta_Sans']"
                  >
                    {editingProduct ? 'Update Product' : 'Create Product'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
