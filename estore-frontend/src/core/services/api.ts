import axios, { AxiosError, AxiosResponse } from 'axios';

const TOKEN_STORAGE_KEY = 'auth_token';
const fallbackBaseUrl = 'http://localhost:8080/api';

const normalizedBaseUrl = (import.meta.env.VITE_API_BASE_URL || fallbackBaseUrl).replace(/\/$/, '');
const API_BASE_URL = normalizedBaseUrl;

export const API_ENDPOINTS = {
  // Auth
  AUTH_REGISTER: '/auth/register',
  AUTH_LOGIN: '/auth/login',
  AUTH_PROFILE: (userId: number) => `/auth/profile/${userId}`,

  // Categories
  CATEGORIES: '/categories',

  // Products
  PRODUCTS: '/products',
  PRODUCT_DETAIL: (id: number) => `/products/${id}`,
  PRODUCT_SEARCH: '/products/search',

  // Inventory
  INVENTORY: (productId: number) => `/inventory/${productId}`,

  // Cart
  CART: (userId: number) => `/cart/${userId}`,
  CART_ADD: '/cart/add',
  CART_UPDATE: '/cart/update',
  CART_REMOVE: (itemId: number) => `/cart/remove/${itemId}`,
  CART_CLEAR: (userId: number) => `/cart/clear/${userId}`,

  // Orders
  ORDERS: '/orders',
  ORDERS_USER: (userId: number) => `/orders/user/${userId}`,
  ORDER_DETAIL: (orderId: number) => `/orders/${orderId}`,

  // Reviews
  REVIEWS: '/reviews',
  REVIEWS_PRODUCT: (productId: number) => `/reviews/product/${productId}`,
};

export interface BackendApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: number;
}

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_STORAGE_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const unwrapResponse = <T>(response: AxiosResponse<BackendApiResponse<T>>): T => {
  if (!response.data.success) {
    throw new Error(response.data.message || 'Request failed');
  }
  return response.data.data;
};

export const toApiError = (error: unknown, fallbackMessage: string): Error => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<BackendApiResponse<unknown>>;
    const message = axiosError.response?.data?.message;
    return new Error(message || fallbackMessage);
  }

  if (error instanceof Error) {
    return error;
  }

  return new Error(fallbackMessage);
};

export { API_BASE_URL };
