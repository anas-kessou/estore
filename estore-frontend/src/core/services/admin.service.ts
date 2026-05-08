import { API_ENDPOINTS, apiClient, toApiError, unwrapResponse } from './api';

export interface ProductsCsvImportSummary {
  totalRows: number;
  created: number;
  updated: number;
  skipped: number;
  failed: number;
  errors: string[];
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
};
