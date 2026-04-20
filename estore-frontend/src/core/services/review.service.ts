import { API_ENDPOINTS, apiClient, toApiError, unwrapResponse } from './api';
import { Review } from '@/shared/types';

interface BackendReviewDTO {
  id: string;
  productId: number;
  userId: number;
  authorName: string;
  authorEmail: string;
  rating: number;
  comment: string;
  createdAt: string;
}

interface CreateReviewPayload {
  productId: number;
  rating: number;
  comment: string;
}

const mapReview = (review: BackendReviewDTO): Review => ({
  id: review.id,
  productId: review.productId,
  userId: review.userId,
  authorName: review.authorName,
  rating: review.rating,
  comment: review.comment,
  createdAt: review.createdAt,
});

export const ReviewService = {
  createReview: async (review: CreateReviewPayload): Promise<Review> => {
    try {
      const response = await apiClient.post(API_ENDPOINTS.REVIEWS, {
        productId: review.productId,
        rating: review.rating,
        comment: review.comment,
      });
      const data = unwrapResponse<BackendReviewDTO>(response);
      return mapReview(data);
    } catch (error) {
      throw toApiError(error, 'Failed to create review');
    }
  },

  getProductReviews: async (productId: number): Promise<Review[]> => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.REVIEWS_PRODUCT(productId));
      const data = unwrapResponse<BackendReviewDTO[]>(response);
      return data.map(mapReview);
    } catch (error) {
      throw toApiError(error, 'Failed to fetch reviews');
    }
  },
};
