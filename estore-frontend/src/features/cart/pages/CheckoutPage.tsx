import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartService, AuthService, OrderService } from '@/core/services';
import { CartItem, User } from '@/shared/types';
import { ShoppingBag, CreditCard, ChevronRight, MapPin, Phone, Mail, User as UserIcon, Lock } from 'lucide-react';
import { toast } from 'sonner';

export const CheckoutPage = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkingOut, setCheckingOut] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'CASH_ON_DELIVERY' | 'CREDIT_CARD' | 'PAYPAL'>('CASH_ON_DELIVERY');

  const [formData, setFormData] = useState({
    shippingAddress: '',
    shippingCity: '',
    shippingCountry: '',
    shippingPostalCode: '',
    shippingPhone: '',
    notes: ''
  });

  useEffect(() => {
    const init = async () => {
      const currentUser = AuthService.getCurrentUser();
      if (!currentUser?.id) {
        navigate('/login');
        return;
      }

      try {
        const [cart, profile] = await Promise.all([
          CartService.getCart(currentUser.id),
          AuthService.getProfile(currentUser.id)
        ]);

        if (!cart.items || cart.items.length === 0) {
          toast.error('Your cart is empty');
          navigate('/cart');
          return;
        }

        setCartItems(cart.items);
        setUser(profile);
        setFormData({
          shippingAddress: profile.profile?.address || '',
          shippingCity: profile.profile?.city || '',
          shippingCountry: profile.profile?.country || '',
          shippingPostalCode: profile.profile?.postalCode || '',
          shippingPhone: profile.profile?.phone || '',
          notes: ''
        });
      } catch (error) {
        toast.error('Failed to load checkout information');
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [navigate]);

  const subtotal = cartItems.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const shipping = 0; // Free shipping for now
  const total = subtotal + shipping;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;

    setCheckingOut(true);
    try {
      await OrderService.createOrder(user.id, {
        ...formData,
        paymentMethod: paymentMethod
      });
      await CartService.clearCart(user.id);
      toast.success('Order placed successfully!');
      navigate('/orders');
    } catch (error) {
      toast.error('Checkout failed. Please try again.');
    } finally {
      setCheckingOut(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 text-sm text-slate-500 mb-8">
          <span>Cart</span>
          <ChevronRight className="w-4 h-4" />
          <span className="text-slate-900 font-bold">Checkout</span>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Shipping Info */}
          <div className="lg:col-span-2 space-y-8">
            <section className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2 underline decoration-indigo-200 decoration-4 underline-offset-4">
                <MapPin className="w-5 h-5 text-indigo-600" />
                Shipping Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-slate-700 mb-2">Full Name</label>
                  <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100 text-slate-500 italic">
                    <UserIcon className="w-5 h-5 text-slate-400" />
                    {user?.firstName} {user?.lastName}
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-slate-700 mb-2">Street Address</label>
                  <input
                    required
                    name="shippingAddress"
                    value={formData.shippingAddress}
                    onChange={handleInputChange}
                    className="w-full p-4 bg-white rounded-2xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium"
                    placeholder="123 Luxury Street"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">City</label>
                  <input
                    required
                    name="shippingCity"
                    value={formData.shippingCity}
                    onChange={handleInputChange}
                    className="w-full p-4 bg-white rounded-2xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium"
                    placeholder="Casablanca"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Postal Code</label>
                  <input
                    required
                    name="shippingPostalCode"
                    value={formData.shippingPostalCode}
                    onChange={handleInputChange}
                    className="w-full p-4 bg-white rounded-2xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium"
                    placeholder="20000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Country</label>
                  <input
                    required
                    name="shippingCountry"
                    value={formData.shippingCountry}
                    onChange={handleInputChange}
                    className="w-full p-4 bg-white rounded-2xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium"
                    placeholder="Morocco"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      required
                      name="shippingPhone"
                      value={formData.shippingPhone}
                      onChange={handleInputChange}
                      className="w-full p-4 pl-12 bg-white rounded-2xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium"
                      placeholder="0612345678"
                    />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-slate-700 mb-2">Order Notes (Optional)</label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full p-4 bg-white rounded-2xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium"
                    placeholder="e.g. Leave at the front desk"
                  />
                </div>
              </div>
            </section>

            <section className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2 underline decoration-emerald-200 decoration-4 underline-offset-4">
                <CreditCard className="w-5 h-5 text-emerald-600" />
                Payment Method
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Cash on Delivery */}
                <div 
                  onClick={() => setPaymentMethod('CASH_ON_DELIVERY')}
                  className={`p-4 border-2 cursor-pointer rounded-2xl transition-all ${
                    paymentMethod === 'CASH_ON_DELIVERY' 
                    ? 'border-indigo-600 bg-indigo-50/50' 
                    : 'border-slate-100 hover:border-slate-200 bg-white'
                  }`}
                >
                  <div className="flex flex-col items-center gap-3 text-center">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                      paymentMethod === 'CASH_ON_DELIVERY' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'
                    }`}>
                      <ShoppingBag className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">Cash</p>
                      <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-wider">On Delivery</p>
                    </div>
                  </div>
                </div>

                {/* Credit Card */}
                <div 
                  onClick={() => setPaymentMethod('CREDIT_CARD')}
                  className={`p-4 border-2 cursor-pointer rounded-2xl transition-all ${
                    paymentMethod === 'CREDIT_CARD' 
                    ? 'border-indigo-600 bg-indigo-50/50' 
                    : 'border-slate-100 hover:border-slate-200 bg-white'
                  }`}
                >
                  <div className="flex flex-col items-center gap-3 text-center">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                      paymentMethod === 'CREDIT_CARD' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'
                    }`}>
                      <CreditCard className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">Card</p>
                      <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-wider">Debit/Credit</p>
                    </div>
                  </div>
                </div>

                {/* PayPal */}
                <div 
                  onClick={() => setPaymentMethod('PAYPAL')}
                  className={`p-4 border-2 cursor-pointer rounded-2xl transition-all ${
                    paymentMethod === 'PAYPAL' 
                    ? 'border-indigo-600 bg-indigo-50/50' 
                    : 'border-slate-100 hover:border-slate-200 bg-white'
                  }`}
                >
                  <div className="flex flex-col items-center gap-3 text-center">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                      paymentMethod === 'PAYPAL' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'
                    }`}>
                      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20.067 8.478c.492.88.556 2.014.307 3.292-.572 2.934-2.456 4.945-5.283 4.945h-1.25c-.394 0-.719.273-.79.626l-.85 4.22c-.035.176-.188.302-.366.302h-2.1c-.25 0-.425-.234-.378-.453l2.126-10.15c.036-.176.189-.302.367-.302h4.52c.706 0 1.294.07 1.764.212.47.143.864.316 1.183.518.318.203.568.455.75.757.182.302.298.647.35 1.033zm-4.434 2.8c.45-.07.828-.246 1.114-.522.285-.276.428-.655.428-1.12 0-.306-.062-.574-.186-.793-.124-.22-.315-.39-.572-.49-.257-.101-.587-.156-.99-.156h-2.14l-.74 3.49h1.76c.55 0 1.058-.07 1.326-.41z"/>
                      </svg>
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">PayPal</p>
                      <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-wider">Fast & Secure</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Conditional Card Details Form (Mockup) */}
              {paymentMethod === 'CREDIT_CARD' && (
                <div className="mt-8 pt-8 border-t border-slate-100 animate-in fade-in slide-in-from-top-4 duration-500">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-bold text-slate-700 mb-2">Card Number</label>
                      <input
                        className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-200 outline-none font-mono"
                        placeholder="0000 0000 0000 0000"
                        maxLength={19}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Expiry Date</label>
                      <input
                        className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-200 outline-none"
                        placeholder="MM / YY"
                        maxLength={5}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">CVC</label>
                      <input
                        className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-200 outline-none"
                        placeholder="000"
                        maxLength={3}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Conditional PayPal Message */}
              {paymentMethod === 'PAYPAL' && (
                <div className="mt-8 p-4 bg-sky-50 rounded-2xl border border-sky-100 flex items-center gap-3 text-sky-700 animate-in fade-in slide-in-from-top-4 duration-500">
                  <div className="w-8 h-8 bg-sky-600 rounded-lg flex items-center justify-center text-white shrink-0">
                     <Lock className="w-4 h-4" />
                  </div>
                  <p className="text-sm font-medium">You will be redirected to PayPal to complete your purchase securely.</p>
                </div>
              )}
            </section>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-slate-900 text-white rounded-[2.5rem] p-8 sticky top-32 shadow-2xl shadow-indigo-100">
              <h2 className="text-xl font-bold mb-8">Order Summary</h2>
              
              <div className="space-y-6 mb-8 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-16 h-16 bg-white/10 rounded-2xl overflow-hidden shrink-0">
                      <img src={item.product.imageUrl} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm line-clamp-1">{item.product.name}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{item.quantity} x ${item.unitPrice.toFixed(2)}</p>
                    </div>
                    <div className="font-bold text-sm">
                      ${(item.unitPrice * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-white/10 pt-6 space-y-4">
                <div className="flex justify-between text-sm text-slate-400">
                  <span>Subtotal</span>
                  <span className="text-white">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-slate-400">
                  <span>Shipping Cost</span>
                  <span className="text-emerald-400 font-bold">FREE</span>
                </div>
                <div className="flex justify-between text-xl font-bold pt-4 border-t border-white/20">
                  <span>Total</span>
                  <span className="text-indigo-400">${total.toFixed(2)}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={checkingOut}
                className="w-full mt-8 bg-indigo-500 text-white py-4 rounded-2xl font-black text-lg hover:bg-indigo-400 transition-all flex items-center justify-center gap-2 group active:scale-[0.98]"
              >
                {checkingOut ? (
                   <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    Confirm Order
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>

              <div className="mt-6 flex items-center gap-2 justify-center text-[10px] text-slate-500 uppercase tracking-widest font-bold">
                <Lock className="w-3 h-3" />
                Secure Checkout Process
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
