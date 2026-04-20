import { API_ENDPOINTS, apiClient, toApiError, unwrapResponse } from './api';
import { Order, PageResponse } from '@/shared/types';

interface BackendOrderItemDTO {
  id: number;
  productId: number;
  productName: string;
  productImageUrl?: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

interface BackendOrderDTO {
  id: number;
  orderNumber: string;
  orderDate: string;
  totalAmount: number;
  status: string;
  userId: number;
  items: BackendOrderItemDTO[];
}

interface CreateOrderPayload {
  shippingAddress: string;
  shippingCity: string;
  shippingCountry: string;
  shippingPostalCode?: string;
  shippingPhone?: string;
  notes?: string;
}

const mapOrder = (order: BackendOrderDTO): Order => ({
  id: order.id,
  userId: order.userId,
  orderDate: order.orderDate,
  totalAmount: Number(order.totalAmount),
  status: order.status,
  items: (order.items || []).map((item) => ({
    id: item.id,
    quantity: item.quantity,
    unitPrice: Number(item.unitPrice),
    product: {
      id: item.productId,
      name: item.productName,
      imageUrl: item.productImageUrl || '',
      price: Number(item.unitPrice),
      description: '',
    },
  })),
});

const defaultOrderPayload = (overrides?: Partial<CreateOrderPayload>): CreateOrderPayload => ({
  shippingAddress: overrides?.shippingAddress || 'Default Address',
  shippingCity: overrides?.shippingCity || 'Default City',
  shippingCountry: overrides?.shippingCountry || 'Default Country',
  shippingPostalCode: overrides?.shippingPostalCode,
  shippingPhone: overrides?.shippingPhone,
  notes: overrides?.notes,
});

export const OrderService = {
  createOrder: async (_userId: number, payload?: Partial<CreateOrderPayload>): Promise<Order> => {
    try {
      const response = await apiClient.post(API_ENDPOINTS.ORDERS, defaultOrderPayload(payload));
      const data = unwrapResponse<BackendOrderDTO>(response);
      return mapOrder(data);
    } catch (error) {
      throw toApiError(error, 'Failed to create order');
    }
  },

  getUserOrders: async (userId: number): Promise<Order[]> => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.ORDERS_USER(userId));
      const data = unwrapResponse<PageResponse<BackendOrderDTO>>(response);
      return (data.content || []).map(mapOrder);
    } catch (error) {
      throw toApiError(error, 'Failed to fetch orders');
    }
  },

  getOrderById: async (orderId: number): Promise<Order> => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.ORDER_DETAIL(orderId));
      const data = unwrapResponse<BackendOrderDTO>(response);
      return mapOrder(data);
    } catch (error) {
      throw toApiError(error, 'Failed to fetch order');
    }
  },
};
