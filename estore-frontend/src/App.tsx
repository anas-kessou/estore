import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar, Footer } from '@/shared/components';
import { ProtectedRoute } from '@/core/guards/ProtectedRoute';
import { RoleProtectedRoute } from '@/core/guards/RoleProtectedRoute';

// Admin
import { ImportProductsPageAdmin } from '@/features/admin/pages/ImportProductsPage';


// Auth Pages
import { LoginPage } from '@/features/auth/pages/LoginPage';
import { RegisterPage } from '@/features/auth/pages/RegisterPage';

// Catalog Pages
import { HomePage } from '@/features/catalog/pages/HomePage';
import { ProductListPage } from '@/features/catalog/pages/ProductListPage';
import { ProductDetailPage } from '@/features/catalog/pages/ProductDetailPage';

// Cart Pages
import { CartPage } from '@/features/cart/pages/CartPage';

// Orders Pages
import { OrdersPage } from '@/features/orders/pages/OrdersPage';

// Profile Pages
import { ProfilePage } from '@/features/profile/pages/ProfilePage';

import './App.css';

function App() {
  // #region agent log
  fetch('http://127.0.0.1:7763/ingest/dde67de3-8924-4544-a310-977ecb73aa4d', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': '29f1c7' },
    body: JSON.stringify({
      sessionId: '29f1c7',
      runId: 'blank-ui-1',
      hypothesisId: 'H3',
      location: 'src/App.tsx:render',
      message: 'App render',
      data: { path: window.location.pathname },
      timestamp: Date.now(),
    }),
  }).catch(() => {});
  // #endregion agent log

  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<ProductListPage />} />
            <Route path="/products/:id" element={<ProductDetailPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Protected Routes */}
            <Route
              path="/cart"
              element={
                <ProtectedRoute>
                  <CartPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/orders"
              element={
                <ProtectedRoute>
                  <OrdersPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />

            {/* Admin Routes */}
            <Route
              path="/admin/import/products"
              element={
                <RoleProtectedRoute roles={['ROLE_ADMIN', 'ADMIN']}>
                  <ImportProductsPageAdmin />
                </RoleProtectedRoute>
              }
            />

          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
