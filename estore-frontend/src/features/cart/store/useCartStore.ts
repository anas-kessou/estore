import { create } from 'zustand';
import { Cart, CartItem, Product } from '@/shared/types';
import { CartService } from '@/core/services/cart.service';

interface CartState {
  cart: Cart | null;
  isLoading: boolean;
  error: string | null;
  fetchCart: (userId: number) => Promise<void>;
  addToCart: (userId: number, product: Product, quantity: number) => Promise<void>;
  clearCart: (userId: number) => Promise<void>;
}

export const useCartStore = create<CartState>((set, get) => ({
  cart: null,
  isLoading: false,
  error: null,

  fetchCart: async (userId: number) => {
    set({ isLoading: true, error: null });
    try {
      const cart = await CartService.getCart(userId);
      set({ cart, isLoading: false });
    } catch (error: any) {
      set({ error: error.message || 'Failed to fetch cart', isLoading: false });
    }
  },

  addToCart: async (userId: number, product: Product, quantity: number) => {
    set({ isLoading: true, error: null });
    try {
      const cart = await CartService.addToCart(userId, product, quantity);
      set({ cart, isLoading: false });
    } catch (error: any) {
      set({ error: error.message || 'Failed to add item to cart', isLoading: false });
    }
  },

  clearCart: async (userId: number) => {
    set({ isLoading: true, error: null });
    try {
      await CartService.clearCart(userId);
      set({ cart: null, isLoading: false });
    } catch (error: any) {
      set({ error: error.message || 'Failed to clear cart', isLoading: false });
    }
  }
}));
