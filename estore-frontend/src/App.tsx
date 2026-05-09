import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar, Footer } from '@/shared/components';
import { ProtectedRoute } from '@/core/guards/ProtectedRoute';
import { RoleProtectedRoute } from '@/core/guards/RoleProtectedRoute';

// Admin
import { AdminCatalogPage } from '@/features/admin/pages/AdminCatalogPage';


// Auth Pages
import { LoginPage } from '@/features/auth/pages/LoginPage';
import { RegisterPage } from '@/features/auth/pages/RegisterPage';

// Catalog Pages
import { HomePage } from '@/features/catalog/pages/HomePage';
import { ProductListPage } from '@/features/catalog/pages/ProductListPage';
import { ProductDetailPage } from '@/features/catalog/pages/ProductDetailPage';

// Cart Pages
import { CartPage } from '@/features/cart/pages/CartPage';
import { CheckoutPage } from '@/features/cart/pages/CheckoutPage';

// Orders Pages
import { OrdersPage } from '@/features/orders/pages/OrdersPage';

// Profile Pages
import { ProfilePage } from '@/features/profile/pages/ProfilePage';

import './App.css';

function App() {


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

            <Route
              path="/cart"
              element={
                <ProtectedRoute>
                  <CartPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/checkout"
              element={
                <ProtectedRoute>
                  <CheckoutPage />
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
              path="/admin/catalog"
              element={
                <RoleProtectedRoute roles={['ROLE_ADMIN', 'ADMIN']}>
                  <AdminCatalogPage />
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
