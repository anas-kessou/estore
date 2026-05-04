import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, LogOut, Package, Menu, X } from 'lucide-react';
import { AuthService, AUTH_CHANGED_EVENT } from '@/core/services/auth.service';
import { useState, useEffect } from 'react';

export const Navbar = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(AuthService.isAuthenticated());
  const [user, setUser] = useState(AuthService.getCurrentUser());
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
    <nav className="bg-white/80 backdrop-blur-md border-b text-slate-800 sticky top-0 z-50 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 text-2xl font-extrabold tracking-tight text-indigo-600 hover:text-indigo-500 transition-colors">
            <span className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xl">E</span>
            Store
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-sm font-semibold hover:text-indigo-600 transition-colors">
              Home
            </Link>
            <Link to="/products" className="text-sm font-semibold hover:text-indigo-600 transition-colors">
              Products
            </Link>
          </div>

          {/* Actions */}
          <div className="hidden md:flex items-center space-x-6">
            {isAuthenticated ? (
              <>
                <Link to="/cart" className="relative p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-all">
                  <ShoppingCart className="w-5 h-5" />
                </Link>
                <Link to="/orders" className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-all">
                  <Package className="w-5 h-5" />
                </Link>
                <Link to="/profile" className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-all">
                  <User className="w-5 h-5" />
                </Link>
                <button onClick={handleLogout} className="p-2 text-slate-500 hover:text-rose-500 hover:bg-rose-50 rounded-full transition-all">
                  <LogOut className="w-5 h-5" />
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors">
                  Sign in
                </Link>
                <Link to="/register" className="text-sm font-semibold bg-indigo-600 text-white px-5 py-2.5 rounded-full hover:bg-indigo-700 shadow-md shadow-indigo-200 transition-all hover:-translate-y-0.5">
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-slate-600 hover:text-indigo-600 p-2">
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 px-4 py-4 space-y-4 shadow-lg absolute w-full">
          <Link to="/" onClick={() => setIsMenuOpen(false)} className="block text-base font-medium text-slate-800 hover:text-indigo-600 py-2">
            Home
          </Link>
          <Link to="/products" onClick={() => setIsMenuOpen(false)} className="block text-base font-medium text-slate-800 hover:text-indigo-600 py-2">
            Products
          </Link>
          <hr className="border-slate-100" />
          {isAuthenticated ? (
            <div className="flex justify-around py-2">
              <Link to="/cart" onClick={() => setIsMenuOpen(false)} className="text-slate-500 flex flex-col items-center gap-1 hover:text-indigo-600">
                <ShoppingCart className="w-6 h-6" />
                <span className="text-xs">Cart</span>
              </Link>
              <Link to="/orders" onClick={() => setIsMenuOpen(false)} className="text-slate-500 flex flex-col items-center gap-1 hover:text-indigo-600">
                <Package className="w-6 h-6" />
                <span className="text-xs">Orders</span>
              </Link>
              <Link to="/profile" onClick={() => setIsMenuOpen(false)} className="text-slate-500 flex flex-col items-center gap-1 hover:text-indigo-600">
                <User className="w-6 h-6" />
                <span className="text-xs">Profile</span>
              </Link>
              <button onClick={() => { handleLogout(); setIsMenuOpen(false); }} className="text-slate-500 flex flex-col items-center gap-1 hover:text-rose-500">
                <LogOut className="w-6 h-6" />
                <span className="text-xs">Logout</span>
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-3 py-2">
              <Link to="/login" onClick={() => setIsMenuOpen(false)} className="text-center text-sm font-semibold text-indigo-600 py-2 border border-indigo-600 rounded-full">
                Sign in
              </Link>
              <Link to="/register" onClick={() => setIsMenuOpen(false)} className="text-center text-sm font-semibold bg-indigo-600 text-white py-2 rounded-full">
                Get Started
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};
