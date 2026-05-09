import { API_ENDPOINTS, apiClient, toApiError, unwrapResponse } from './api';

export interface ProductsCsvImportSummary {
  totalRows: number;
  created: number;
  updated: number;
  skipped: number;
  failed: number;
  errors: string[];
}

export interface AdminUpsertProductRequest {
  externalId: string;
  name: string;
  brandDesc?: string;
  sellPrice: number;
  categoryName: string;
  imageUrl?: string;
  active?: boolean;
  featured?: boolean;
  stockQuantity?: number;
}

export interface AdminUpsertProductResponse {
  productId: number;
  updated: boolean;
}

export interface AdminDeleteProductResponse {
  externalId: string;
  deleted: boolean;
}

export const AdminService = {
  importProductsCsv: async (file: File): Promise<ProductsCsvImportSummary> => {

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await apiClient.post(API_ENDPOINTS.ADMIN_IMPORT_PRODUCTS_CSV, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return unwrapResponse<ProductsCsvImportSummary>(response);
    } catch (error) {
      throw toApiError(error, 'CSV import failed');
    }
  },

  upsertProduct: async (payload: AdminUpsertProductRequest): Promise<AdminUpsertProductResponse> => {
    try {
      const response = await apiClient.post(API_ENDPOINTS.ADMIN_UPSERT_PRODUCT, payload);
      return unwrapResponse<AdminUpsertProductResponse>(response);
    } catch (error) {
      throw toApiError(error, 'Upsert product failed');
    }
  },

  deleteProductByExternalId: async (externalId: string): Promise<AdminDeleteProductResponse> => {
    try {
      const response = await apiClient.delete(
        API_ENDPOINTS.ADMIN_DELETE_PRODUCT_BY_EXTERNAL_ID(externalId)
      );
      return unwrapResponse<AdminDeleteProductResponse>(response);
    } catch (error) {
      throw toApiError(error, 'Delete product by external ID failed');
    }
  },

  deleteProductById: async (id: number): Promise<void> => {
    try {
      const response = await apiClient.delete(API_ENDPOINTS.ADMIN_DELETE_PRODUCT(id));
      unwrapResponse<void>(response);
    } catch (error) {
      throw toApiError(error, 'Delete product failed');
    }
  },

  // Categories
  getCategories: async (): Promise<any[]> => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.ADMIN_CATEGORIES);
      return unwrapResponse<any[]>(response);
    } catch (error) {
      throw toApiError(error, 'Fetch categories failed');
    }
  },

  createCategory: async (payload: any): Promise<any> => {
    try {
      const response = await apiClient.post(API_ENDPOINTS.ADMIN_CATEGORIES, payload);
      return unwrapResponse<any>(response);
    } catch (error) {
      throw toApiError(error, 'Create category failed');
    }
  },

  updateCategory: async (id: number, payload: any): Promise<any> => {
    try {
      const response = await apiClient.put(API_ENDPOINTS.ADMIN_CATEGORY_BY_ID(id), payload);
      return unwrapResponse<any>(response);
    } catch (error) {
      throw toApiError(error, 'Update category failed');
    }
  },

  deleteCategory: async (id: number): Promise<void> => {
    try {
      const response = await apiClient.delete(API_ENDPOINTS.ADMIN_CATEGORY_BY_ID(id));
      unwrapResponse<void>(response);
    } catch (error) {
      throw toApiError(error, 'Delete category failed');
    }
  },
};


