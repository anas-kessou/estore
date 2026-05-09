import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminService, ProductsCsvImportSummary } from '@/core/services/admin.service';

import { RoleProtectedRoute } from '@/core/guards/RoleProtectedRoute';

export const ImportProductsPage = () => {
  const [file, setFile] = useState<File | null>(null);
  const [loadingCsv, setLoadingCsv] = useState(false);
  const [summary, setSummary] = useState<ProductsCsvImportSummary | null>(null);
  const [csvError, setCsvError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Manual upsert
  const [upsertLoading, setUpsertLoading] = useState(false);
  const [upsertError, setUpsertError] = useState<string | null>(null);
  const [upsertResult, setUpsertResult] = useState<{
    productId: number;
    updated: boolean;
  } | null>(null);

  const [externalId, setExternalId] = useState('');
  const [name, setName] = useState('');
  const [brandDesc, setBrandDesc] = useState('');
  const [sellPrice, setSellPrice] = useState<string>('');
  const [categoryName, setCategoryName] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [active, setActive] = useState(true);
  const [featured, setFeatured] = useState(false);
  const [stockQuantity, setStockQuantity] = useState<string>('0');

  // Delete
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deleteResult, setDeleteResult] = useState<{ externalId: string } | null>(null);
  const [deleteExternalId, setDeleteExternalId] = useState('');

  const onSubmitCsv = async () => {
    if (!file) {
      setCsvError('Choose a CSV file first.');
      return;
    }

    setLoadingCsv(true);
    setCsvError(null);
    setSummary(null);

    try {
      const res = await AdminService.importProductsCsv(file);
      setSummary(res);
    } catch (e) {
      setCsvError(e instanceof Error ? e.message : 'Import failed');
    } finally {
      setLoadingCsv(false);
    }
  };

  const onUpsertProduct = async () => {
    setUpsertLoading(true);
    setUpsertError(null);
    setUpsertResult(null);

    try {
      const payload = {
        externalId: externalId.trim(),
        name: name.trim(),
        brandDesc: brandDesc.trim() || undefined,
        sellPrice: Number(sellPrice),
        categoryName: categoryName.trim(),
        imageUrl: imageUrl.trim() || undefined,
        active,
        featured,
        stockQuantity: stockQuantity.trim() === '' ? undefined : Number(stockQuantity),
      };

      const res = await AdminService.upsertProduct(payload);
      setUpsertResult({ productId: res.productId, updated: res.updated });

      // keep externalId; clear others (optional)
      setName('');
      setBrandDesc('');
      setSellPrice('');
      setCategoryName('');
      setImageUrl('');
      setFeatured(false);
      setActive(true);
      setStockQuantity('0');
    } catch (e) {
      setUpsertError(e instanceof Error ? e.message : 'Upsert failed');
    } finally {
      setUpsertLoading(false);
    }
  };

  const onDeleteProduct = async () => {
    if (!deleteExternalId.trim()) {
      setDeleteError('Enter externalId to delete');
      return;
    }

    const confirmed = window.confirm(
      `Delete product '${deleteExternalId.trim()}' from MySQL AND delete its reviews from MongoDB?`
    );
    if (!confirmed) return;

    setDeleteLoading(true);
    setDeleteError(null);
    setDeleteResult(null);

    try {
      const res = await AdminService.deleteProductByExternalId(deleteExternalId.trim());
      setDeleteResult({ externalId: res.externalId });
      setDeleteExternalId('');
    } catch (e) {
      setDeleteError(e instanceof Error ? e.message : 'Delete failed');
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-2xl font-bold text-slate-900">Admin: Import + Manage Products</h1>
        <button
          onClick={() => navigate('/products')}
          className="text-sm font-semibold text-indigo-600 hover:text-indigo-500"
        >
          Back to products
        </button>
      </div>

      {/* CSV IMPORT */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
        <div className="mb-4">
          <label className="block text-sm font-semibold text-slate-700 mb-2">Products.csv</label>
          <input
            type="file"
            accept=".csv,text/csv"
            className="block w-full text-sm text-slate-600"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            disabled={loadingCsv}
          />
          <p className="text-xs text-slate-500 mt-2">
            Uses the CSV <span className="font-mono">Product ID</span> column as a stable unique key.
          </p>
        </div>

        <button
          onClick={onSubmitCsv}
          disabled={loadingCsv || !file}
          className="w-full px-4 py-2 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 disabled:opacity-50"
        >
          {loadingCsv ? 'Importing...' : 'Import CSV'}
        </button>

        {csvError && <div className="mt-4 text-rose-600 text-sm font-semibold">{csvError}</div>}

        {summary && (
          <div className="mt-6">
            <h2 className="text-lg font-bold text-slate-900 mb-3">Import summary</h2>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                <div className="text-slate-500">Total rows</div>
                <div className="font-bold">{summary.totalRows}</div>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                <div className="text-slate-500">Failed</div>
                <div className="font-bold">{summary.failed}</div>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                <div className="text-slate-500">Created</div>
                <div className="font-bold">{summary.created}</div>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                <div className="text-slate-500">Updated</div>
                <div className="font-bold">{summary.updated}</div>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 col-span-2">
                <div className="text-slate-500">Skipped</div>
                <div className="font-bold">{summary.skipped}</div>
              </div>
            </div>

            {summary.errors.length > 0 && (
              <div className="mt-4">
                <div className="text-slate-700 font-semibold mb-2">First errors:</div>
                <ul className="list-disc pl-5 text-sm text-rose-600">
                  {summary.errors.map((err, i) => (
                    <li key={i}>{err}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      {/* MANUAL UPSERT */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900 mb-4">Add / Update product (single)</h2>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Product ID (externalId)</label>
            <input
              value={externalId}
              onChange={(e) => setExternalId(e.target.value)}
              className="w-full p-2 border border-slate-300 rounded-lg"
              placeholder="e.g. FR001"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Category name</label>
            <input
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              className="w-full p-2 border border-slate-300 rounded-lg"
              placeholder="e.g. Westernwear-Women"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Product name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border border-slate-300 rounded-lg"
              placeholder="Product name"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Sell price</label>
            <input
              value={sellPrice}
              onChange={(e) => setSellPrice(e.target.value)}
              className="w-full p-2 border border-slate-300 rounded-lg"
              placeholder="e.g. 3120"
              type="number"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-slate-700 mb-2">Brand Desc (Product description)</label>
            <textarea
              value={brandDesc}
              onChange={(e) => setBrandDesc(e.target.value)}
              className="w-full p-2 border border-slate-300 rounded-lg"
              placeholder="description"
              rows={3}
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-slate-700 mb-2">Image URL (optional)</label>
            <input
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full p-2 border border-slate-300 rounded-lg"
              placeholder="https://..."
            />
          </div>
        </div>

        <div className="mt-4 grid md:grid-cols-3 gap-4">
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
            <input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} />
            Active
          </label>
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
            <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} />
            Featured
          </label>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Stock quantity</label>
            <input
              value={stockQuantity}
              onChange={(e) => setStockQuantity(e.target.value)}
              className="w-full p-2 border border-slate-300 rounded-lg"
              placeholder="0"
              type="number"
            />
          </div>
        </div>

        <button
          onClick={onUpsertProduct}
          disabled={upsertLoading}
          className="mt-5 w-full px-4 py-2 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 disabled:opacity-50"
        >
          {upsertLoading ? 'Saving...' : 'Add/Update product'}
        </button>

        {upsertError && <div className="mt-4 text-rose-600 text-sm font-semibold">{upsertError}</div>}
        {upsertResult && (
          <div className="mt-4 text-emerald-700 text-sm font-semibold bg-emerald-50 border border-emerald-200 rounded-lg p-3">
            Saved productId: {upsertResult.productId} ({upsertResult.updated ? 'updated' : 'created'})
          </div>
        )}
      </div>

      {/* DELETE */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900 mb-4">Delete product (MySQL + Mongo reviews)</h2>

        <div className="grid md:grid-cols-2 gap-4 items-end">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Product ID (externalId)</label>
            <input
              value={deleteExternalId}
              onChange={(e) => setDeleteExternalId(e.target.value)}
              className="w-full p-2 border border-slate-300 rounded-lg"
              placeholder="e.g. FR001"
            />
          </div>
          <button
            onClick={onDeleteProduct}
            disabled={deleteLoading}
            className="w-full px-4 py-2 rounded-lg bg-rose-600 text-white font-semibold hover:bg-rose-700 disabled:opacity-50"
          >
            {deleteLoading ? 'Deleting...' : 'Delete'}
          </button>
        </div>

        {deleteError && <div className="mt-4 text-rose-600 text-sm font-semibold">{deleteError}</div>}
        {deleteResult && (
          <div className="mt-4 text-emerald-700 text-sm font-semibold bg-emerald-50 border border-emerald-200 rounded-lg p-3">
            Deleted: {deleteResult.externalId}
          </div>
        )}
      </div>
    </div>
  );
};


// Admin-only wrapper for route usage
export const ImportProductsPageAdmin = () => (
  <RoleProtectedRoute roles={['ROLE_ADMIN', 'ADMIN']}>
    <ImportProductsPage />
  </RoleProtectedRoute>
);
