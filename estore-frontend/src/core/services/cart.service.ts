import { API_ENDPOINTS, apiClient, toApiError, unwrapResponse } from './api';
import { Cart, CartItem, Product } from '@/shared/types';

interface BackendCartItemDTO {
  id: number;
  productId: number;
  productName: string;
  productImageUrl?: string;
  quantity: number;
  availableStock?: number;
  unitPrice: number;
  subtotal: number;
}

interface BackendCartDTO {
  id: number;
  userId: number;
  items: BackendCartItemDTO[];
  totalItems: number;
  totalAmount: number;
  createdAt?: string;
  updatedAt?: string;
}

const mapCartItem = (item: BackendCartItemDTO): CartItem => ({
  id: item.id,
  quantity: item.quantity,
  availableStock: item.availableStock,
  unitPrice: Number(item.unitPrice),
  product: {
    id: item.productId,
    name: item.productName,
    imageUrl: item.productImageUrl || '',
    price: Number(item.unitPrice),
    description: '',
    active: true,
    availableStock: 0,
  },
});

const mapCart = (cart: BackendCartDTO): Cart => ({
  id: cart.id,
  userId: cart.userId,
  items: cart.items?.map(mapCartItem) || [],
  createdAt: cart.createdAt,
});

export const CartService = {
  getCart: async (userId: number): Promise<Cart> => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.CART(userId));
      const data = unwrapResponse<BackendCartDTO>(response);
      return mapCart(data);
    } catch (error) {
      throw toApiError(error, 'Failed to fetch cart');
    }
  },

  addToCart: async (userId: number, product: Product, quantity: number): Promise<Cart> => {
    try {
      const response = await apiClient.post(API_ENDPOINTS.CART_ADD, {
        userId,
        productId: product.id,
        quantity,
      });
      const data = unwrapResponse<BackendCartDTO>(response);
      return mapCart(data);
    } catch (error) {
      throw toApiError(error, 'Failed to add to cart');
    }
  },

  updateCartItem: async (itemId: number, quantity: number): Promise<Cart> => {
    try {
      const response = await apiClient.put(API_ENDPOINTS.CART_UPDATE, { itemId, quantity });
      const data = unwrapResponse<BackendCartDTO>(response);
      return mapCart(data);
    } catch (error) {
      throw toApiError(error, 'Failed to update cart');
    }
  },

  removeFromCart: async (itemId: number): Promise<void> => {
    try {
      await apiClient.delete(API_ENDPOINTS.CART_REMOVE(itemId));
    } catch (error) {
      throw toApiError(error, 'Failed to remove from cart');
    }
  },

  clearCart: async (userId: number): Promise<void> => {
    try {
      await apiClient.delete(API_ENDPOINTS.CART_CLEAR(userId));
    } catch (error) {
      throw toApiError(error, 'Failed to clear cart');
    }
  },
};
