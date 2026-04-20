import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartService, AuthService, OrderService } from '@/core/services';
import { CartItem } from '@/shared/types';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';

export const CartPage = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<number | null>(null);

  const fetchCart = async () => {
    const user = AuthService.getCurrentUser();
    if (!user?.id) {
      setLoading(false);
      return;
    }
    try {
      const cart = await CartService.getCart(user.id);
      setCartItems(cart.items || []);
    } catch (error) {
      console.error('Failed to fetch cart:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleUpdateQuantity = async (itemId: number | undefined, newQuantity: number) => {
    if (!itemId || newQuantity < 1) return;
    setUpdating(itemId);
    try {
      await CartService.updateCartItem(itemId, newQuantity);
      await fetchCart();
    } catch (error) {
      alert('Failed to update quantity');
    } finally {
      setUpdating(null);
    }
  };

  const handleRemoveItem = async (itemId: number | undefined) => {
    if (!itemId) return;
    if (!confirm('Remove this item from cart?')) return;
    setUpdating(itemId);
    try {
      await CartService.removeFromCart(itemId);
      await fetchCart();
    } catch (error) {
      alert('Failed to remove item');
    } finally {
      setUpdating(null);
    }
  };

  const handleCheckout = async () => {
    const user = AuthService.getCurrentUser();
    if (!user?.id) {
      alert('Please login to checkout');
      return;
    }
    if (cartItems.length === 0) {
      alert('Your cart is empty');
      return;
    }
    try {
      await OrderService.createOrder(user.id);
      alert('Order placed successfully!');
      await CartService.clearCart(user.id);
      setCartItems([]);
      navigate('/orders');
    } catch (error) {
      alert('Failed to place order. Please try again.');
    }
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center">
        <div className="inline-block w-8 h-8 border-4 border-[#3498db] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold font-[Poppins] text-[#2c3e50] mb-8">
          Shopping Cart
        </h1>

        {cartItems.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <ShoppingBag className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h2 className="text-2xl font-semibold text-gray-600 mb-4">Your cart is empty</h2>
            <button
              onClick={() => navigate('/products')}
              className="bg-[#3498db] text-white px-6 py-3 rounded-lg hover:bg-[#2980b9] transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow-md p-4 flex items-center">
                <img
                  src={item.product.imageUrl || 'https://via.placeholder.com/100x100'}
                  alt={item.product.name}
                  className="w-24 h-24 object-cover rounded-lg"
                />
                <div className="flex-1 ml-4">
                  <h3 className="text-lg font-semibold text-[#2c3e50]">{item.product.name}</h3>
                  <p className="text-[#27ae60] font-semibold">${item.unitPrice.toFixed(2)}</p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                    disabled={updating === item.id}
                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center font-semibold">{item.quantity}</span>
                  <button
                    onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                    disabled={updating === item.id}
                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <div className="ml-6 text-lg font-semibold text-[#2c3e50] min-w-[100px] text-right">
                  ${(item.unitPrice * item.quantity).toFixed(2)}
                </div>
                <button
                  onClick={() => handleRemoveItem(item.id)}
                  disabled={updating === item.id}
                  className="ml-4 p-2 text-[#e74c3c] hover:bg-red-50 rounded-lg disabled:opacity-50"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}

            <div className="bg-white rounded-lg shadow-md p-6 mt-6">
              <div className="flex justify-between items-center mb-6">
                <span className="text-xl font-semibold text-[#2c3e50]">Subtotal</span>
                <span className="text-2xl font-bold text-[#27ae60]">${subtotal.toFixed(2)}</span>
              </div>
              <button
                onClick={handleCheckout}
                className="w-full bg-[#e74c3c] text-white py-4 rounded-lg font-semibold hover:bg-[#c0392b] transition-colors"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
