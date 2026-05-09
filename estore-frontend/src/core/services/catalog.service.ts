import { API_ENDPOINTS, apiClient, toApiError, unwrapResponse } from './api';
import { Product, Category, PageResponse } from '@/shared/types';

interface BackendProductDTO {
  id: number;
  name: string;
  price: number;
  description: string;
  imageUrl?: string;
  imageUrls?: string;
  stockQuantity?: number;
  availableStock?: number;
  inStock?: boolean;
  lowStock?: boolean;
  categoryId?: number;
  categoryName?: string;
  active?: boolean;
  featured?: boolean;
}

const mapProduct = (product: BackendProductDTO): Product => ({
  id: product.id,
  name: product.name,
  price: Number(product.price),
  description: product.description,
  imageUrl: product.imageUrl || '',
  category: product.categoryId
    ? {
        id: product.categoryId,
        name: product.categoryName || 'Uncategorized',
        description: '',
        displayOrder: 0,
        active: true,
      }
    : undefined,
  categoryName: product.categoryName,
  categoryId: product.categoryId,
  inventory: {
    id: product.id,
    quantity: product.availableStock ?? product.stockQuantity ?? 0,
  },
  active: product.active ?? true,
  featured: product.featured,
  inStock: product.inStock,
  lowStock: product.lowStock,
  availableStock: product.availableStock ?? 0,
});

const mapProductPage = (page: PageResponse<BackendProductDTO>): PageResponse<Product> => ({
  ...page,
  content: page.content.map(mapProduct),
  number: page.page,
});

export const CatalogService = {
  getCategories: async (): Promise<Category[]> => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.CATEGORIES);
      return unwrapResponse<Category[]>(response);
    } catch (error) {
      throw toApiError(error, 'Failed to fetch categories');
    }
  },

  getProducts: async (page = 0, size = 12): Promise<PageResponse<Product>> => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.PRODUCTS, {
        params: { page, size },
      });
      const data = unwrapResponse<PageResponse<BackendProductDTO>>(response);
      return mapProductPage(data);
    } catch (error) {
      throw toApiError(error, 'Failed to fetch products');
    }
  },

  getProductById: async (id: number): Promise<Product> => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.PRODUCT_DETAIL(id));
      const data = unwrapResponse<BackendProductDTO>(response);
      return mapProduct(data);
    } catch (error) {
      throw toApiError(error, 'Failed to fetch product');
    }
  },

  searchProducts: async (keyword: string, page = 0, size = 12): Promise<PageResponse<Product>> => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.PRODUCT_SEARCH, {
        params: { q: keyword, page, size },
      });
      const data = unwrapResponse<PageResponse<BackendProductDTO>>(response);
      return mapProductPage(data);
    } catch (error) {
      throw toApiError(error, 'Failed to search products');
    }
  },

  getProductsByCategory: async (categoryId: number, page = 0, size = 12): Promise<PageResponse<Product>> => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.PRODUCTS, {
        params: { categoryId, page, size },
      });
      const data = unwrapResponse<PageResponse<BackendProductDTO>>(response);
      return mapProductPage(data);
    } catch (error) {
      throw toApiError(error, 'Failed to fetch products');
    }
  },
};
