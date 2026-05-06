import { create } from 'zustand';
import { Cart, CartItem, Product } from '@/shared/types';
import { CartService } from '@/core/services/cart.service';

interface CartState {
  cart: Cart | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchCart: (userId: number) => Promise<void>;
  addItem: (userId: number, product: Product, quantity: number) => Promise<void>;
  updateQuantity: (userId: number, itemId: number, quantity: number) => Promise<void>;
  removeItem: (userId: number, itemId: number) => Promise<void>;
  clearLocalCart: () => void;
}

export const useCartStore = create<CartState>((set, get) => ({
  cart: null,
  isLoading: false,
  error: null,

  fetchCart: async (userId) => {
    set({ isLoading: true });
    try {
      const cartData = await CartService.getCart(userId);
      set({ cart: cartData, isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  addItem: async (userId, product, quantity) => {
    try {
      await CartService.addToCart(userId, product, quantity);
      await get().fetchCart(userId);
    } catch (err: any) {
      set({ error: err.message });
      throw err;
    }
  },

  updateQuantity: async (userId, itemId, quantity) => {
    try {
      await CartService.updateItemQuantity(userId, itemId, quantity);
      await get().fetchCart(userId);
    } catch (err: any) {
      set({ error: err.message });
    }
  },

  removeItem: async (userId, itemId) => {
    try {
      await CartService.removeItem(userId, itemId);
      await get().fetchCart(userId);
    } catch (err: any) {
      set({ error: err.message });
    }
  },

  clearLocalCart: () => set({ cart: null })
}));
