import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminService, ProductsCsvImportSummary } from '@/core/services/admin.service';
import { RoleProtectedRoute } from '@/core/guards/RoleProtectedRoute';

export const ImportProductsPage = () => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState<ProductsCsvImportSummary | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const onSubmit = async () => {
    if (!file) {
      setError('Choose a CSV file first.');
      return;
    }

    setLoading(true);
    setError(null);
    setSummary(null);

    try {
      const res = await AdminService.importProductsCsv(file);
      setSummary(res);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Import failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-slate-900">Import Products CSV</h1>
        <button
          onClick={() => navigate('/products')}
          className="text-sm font-semibold text-indigo-600 hover:text-indigo-500"
        >
          Back to products
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
        <div className="mb-4">
          <label className="block text-sm font-semibold text-slate-700 mb-2">Products.csv</label>
          <input
            type="file"
            accept=".csv,text/csv"
            className="block w-full text-sm text-slate-600"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            disabled={loading}
          />
          <p className="text-xs text-slate-500 mt-2">
            Uses the CSV <span className="font-mono">Product ID</span> column as a stable unique key.
          </p>
        </div>

        <button
          onClick={onSubmit}
          disabled={loading || !file}
          className="w-full px-4 py-2 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 disabled:opacity-50"
        >
          {loading ? 'Importing...' : 'Import CSV'}
        </button>

        {error && <div className="mt-4 text-rose-600 text-sm font-semibold">{error}</div>}

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
    </div>
  );
};

// Admin-only wrapper for route usage
export const ImportProductsPageAdmin = () => (
  <RoleProtectedRoute roles={['ROLE_ADMIN', 'ADMIN']}>
    <ImportProductsPage />
  </RoleProtectedRoute>
);
