import { useState, useEffect } from 'react';
import { OrderService, AuthService } from '@/core/services';
import { Order } from '@/shared/types';
import { Package, Clock, CheckCircle2, XCircle, ChevronRight, ShoppingBag } from 'lucide-react';
import { toast } from 'sonner';


export const OrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState<number | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      const user = AuthService.getCurrentUser();
      if (!user?.id) {
        setLoading(false);
        return;
      }
      try {
        const data = await OrderService.getUserOrders(user.id);
        setOrders(data);
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const isCancellable = (status: string) => {
    const s = status.toLowerCase();
    return s === 'pending' || s === 'processing';
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
      case 'delivered':
        return 'bg-[#27ae60] text-white';
      case 'processing':
      case 'shipped':
        return 'bg-[#3498db] text-white';
      case 'pending':
        return 'bg-yellow-500 text-white';
      case 'cancelled':
        return 'bg-[#e74c3c] text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };


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
          Order History
        </h1>

        {orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <Package className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h2 className="text-2xl font-semibold text-gray-600 mb-4">No orders yet</h2>
            <p className="text-gray-500">Start shopping to see your orders here</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order, index) => (
              <div key={order.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div
                  onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                  className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  <div>
                    <div className="flex items-center gap-4">
                      <span className="font-semibold text-[#2c3e50]">
                        {order.orderNumber.startsWith('#') 
                          ? `Order ${order.orderNumber.split('-')[1] ? '#' + order.orderNumber.split('-')[1] : order.orderNumber}`
                          : `Order #${order.orderNumber}`}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      {new Date(order.orderDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <span className="text-xl font-bold text-[#27ae60] mr-4">
                      ${order.totalAmount.toFixed(2)}
                    </span>
                    <ChevronRight
                      className={`w-5 h-5 text-gray-400 transition-transform ${
                        expandedOrder === order.id ? 'rotate-90' : ''
                      }`}
                    />
                  </div>
                </div>

                {expandedOrder === order.id && (
                  <div className="border-t border-gray-200">
                    <div className="p-4 bg-gray-50">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-semibold text-[#2c3e50]">Order Items</h4>
                        {isCancellable(order.status) && (
                          <button
                            onClick={async (e) => {
                              e.stopPropagation();
                              if (!confirm('Cancel this order?')) return;
                              try {
                                await OrderService.cancelOrder(order.id as number);
                                toast.success('Order cancelled successfully');
                                setOrders(orders.map(o => o.id === order.id ? { ...o, status: 'CANCELLED' } : o));
                              } catch (error) {
                                toast.error('Failed to cancel order');
                              }
                            }}
                            className="flex items-center gap-2 px-3 py-2 rounded-lg text-[#e74c3c] hover:bg-red-50 disabled:opacity-50"
                            aria-label="Cancel order"
                          >
                            <XCircle className="w-5 h-5" />
                            <span className="font-semibold">Cancel</span>
                          </button>
                        )}
                      </div>

                      <div className="space-y-3">
                        {order.items.map((item, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <div className="flex items-center">
                              <img
                                src={item.product.imageUrl || '/product.png'}
                                alt={item.product.name}
                                className="w-12 h-12 object-cover rounded"
                              />
                              <div className="ml-3">
                                <p className="font-medium text-[#2c3e50]">{item.product.name}</p>
                                <p className="text-sm text-gray-500">
                                  ${item.unitPrice.toFixed(2)} x {item.quantity}
                                </p>
                              </div>
                            </div>
                            <span className="font-semibold text-[#2c3e50]">
                              ${(item.unitPrice * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
