import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="bg-[#2c3e50] text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold font-[Poppins] mb-4">E-Store</h3>
            <p className="text-gray-300">
              Your one-stop shop for all your needs. Quality products, great prices, excellent service.
            </p>
          </div>
          <div>
            <h4 className="text-lg font-semibold font-[Poppins] mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/products" className="text-gray-300 hover:text-[#3498db] transition-colors">
                  Products
                </Link>
              </li>
              <li>
                <Link to="/cart" className="text-gray-300 hover:text-[#3498db] transition-colors">
                  Shopping Cart
                </Link>
              </li>
              <li>
                <Link to="/orders" className="text-gray-300 hover:text-[#3498db] transition-colors">
                  Order History
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold font-[Poppins] mb-4">Contact</h4>
            <p className="text-gray-300">Université Hassan II de Casablanca</p>
            <p className="text-gray-300">Full Stack Module Project</p>
          </div>
        </div>
        <div className="border-t border-gray-600 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 E-Store. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
