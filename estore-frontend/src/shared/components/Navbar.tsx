import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, LogOut, Package } from 'lucide-react';
import { AuthService, AUTH_CHANGED_EVENT } from '@/core/services/auth.service';
import { useState, useEffect } from 'react';

export const Navbar = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(AuthService.isAuthenticated());
  const [user, setUser] = useState(AuthService.getCurrentUser());

  useEffect(() => {
    const handleStorageChange = () => {
      setIsAuthenticated(AuthService.isAuthenticated());
      setUser(AuthService.getCurrentUser());
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener(AUTH_CHANGED_EVENT, handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener(AUTH_CHANGED_EVENT, handleStorageChange);
    };
  }, []);

  const handleLogout = () => {
    AuthService.logout();
    setIsAuthenticated(false);
    setUser(null);
    navigate('/login');
  };

  return (
    <nav className="bg-[#2c3e50] text-white sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-2xl font-bold font-[Poppins] text-white hover:text-[#3498db] transition-colors">
            E-Store
          </Link>

          <div className="flex items-center space-x-6">
            <Link to="/" className="hover:text-[#3498db] transition-colors font-medium">
              Home
            </Link>
            <Link to="/products" className="hover:text-[#3498db] transition-colors font-medium">
              Products
            </Link>

            {isAuthenticated ? (
              <>
                <Link to="/cart" className="relative hover:text-[#e74c3c] transition-colors">
                  <ShoppingCart className="w-6 h-6" />
                </Link>
                <Link to="/orders" className="hover:text-[#3498db] transition-colors">
                  <Package className="w-6 h-6" />
                </Link>
                <Link to="/profile" className="hover:text-[#3498db] transition-colors">
                  <User className="w-6 h-6" />
                </Link>
                <button onClick={handleLogout} className="hover:text-[#e74c3c] transition-colors">
                  <LogOut className="w-6 h-6" />
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-[#3498db] transition-colors font-medium">
                  Login
                </Link>
                <Link to="/register" className="bg-[#3498db] px-4 py-2 rounded hover:bg-[#2980b9] transition-colors font-medium">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
