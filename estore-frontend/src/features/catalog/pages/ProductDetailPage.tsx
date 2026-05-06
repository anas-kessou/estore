import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CatalogService, CartService, ReviewService, AuthService } from '@/core/services';
import { Product, Review } from '@/shared/types';
import { ShoppingCart, Star, ArrowLeft } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useCartStore } from '@/features/cart/store/useCartStore';

export const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  
  const queryClient = useQueryClient();
  const addToCartAction = useCartStore(state => state.addToCart);

  // Fetch product from MySQL using TanStack Query
  const { data: product, isLoading: productLoading, error: productError } = useQuery({
    queryKey: ['product', id],
    queryFn: () => CatalogService.getProductById(parseInt(id!)),
    enabled: !!id
  });

  // Fetch reviews from MongoDB using TanStack Query
  const { data: reviews = [], isLoading: reviewsLoading } = useQuery({
    queryKey: ['reviews', id],
    queryFn: () => ReviewService.getProductReviews(parseInt(id!)),
    enabled: !!id
  });

  const cartMutation = useMutation({
    mutationFn: async ({ user, p, q }: { user: any, p: Product, q: number }) => {
      await addToCartAction(user.id, p, q);
    },
    onSuccess: () => alert('Added to cart!'),
    onError: () => alert('Failed to add to cart')
  });

  const reviewMutation = useMutation({
    mutationFn: async (reviewData: any) => {
      await ReviewService.createReview(reviewData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews', id] });
      setNewReview({ rating: 5, comment: '' });
    }
  });

  const reviewLoading = reviewMutation.isPending;

  const handleAddToCart = () => {
    const user = AuthService.getCurrentUser();
    if (!product || !user?.id) {
      alert('Please login to add items to cart');
      return;
    }
    cartMutation.mutate({ user, p: product, q: quantity });
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    const user = AuthService.getCurrentUser();
    if (!user || !product) {
      alert('Please login to submit a review');
      return;
    }

    reviewMutation.mutate({
      productId: product.id,
      rating: newReview.rating,
      comment: newReview.comment,
    });
  };

  if (productLoading) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center">
        <div className="inline-block w-8 h-8 border-4 border-[#3498db] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-lg">Product not found</p>
          <button onClick={() => navigate('/products')} className="mt-4 text-[#3498db] hover:underline">
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  const inStock = (product.inventory?.quantity ?? 0) > 0;
  const averageRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : '0';

  return (
    <div className="min-h-screen bg-[#f8f9fa] py-8">
      <div className="max-w-7xl mx-auto px-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-[#3498db] hover:underline mb-6"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </button>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="grid md:grid-cols-2 gap-8 p-8">
            {/* Product Image */}
            <div className="relative">
              <img
                src={product.imageUrl || 'https://via.placeholder.com/500x400'}
                alt={product.name}
                className="w-full rounded-lg"
              />
              {!inStock && (
                <div className="absolute top-4 right-4 bg-[#e74c3c] text-white px-4 py-2 rounded">
                  Out of Stock
                </div>
              )}
            </div>

            {/* Product Info */}
            <div>
              <h1 className="text-3xl font-bold font-[Poppins] text-[#2c3e50] mb-2">
                {product.name}
              </h1>
              {product.category && (
                <p className="text-[#3498db] text-lg mb-4">{product.category.name}</p>
              )}

              <div className="flex items-center mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.round(parseFloat(averageRating))
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="ml-2 text-gray-600">
                  {averageRating} ({reviews.length} reviews)
                </span>
              </div>

              <p className="text-4xl font-bold text-[#27ae60] mb-6">
                ${product.price.toFixed(2)}
              </p>

              <p className="text-gray-600 mb-6">{product.description}</p>

              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="px-4 py-2 hover:bg-gray-100"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 border-x border-gray-300">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="px-4 py-2 hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
                <span className="text-gray-500">
                  {product.inventory?.quantity ?? 0} in stock
                </span>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={!inStock}
                className="w-full bg-[#27ae60] text-white py-4 rounded-lg font-semibold hover:bg-[#219a52] transition-colors disabled:opacity-50 flex items-center justify-center"
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Add to Cart
              </button>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold font-[Poppins] text-[#2c3e50] mb-6">
            Customer Reviews
          </h2>

          {/* Add Review Form */}
          <form onSubmit={handleSubmitReview} className="mb-8 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Write a Review</h3>
            <div className="flex items-center mb-4">
              <span className="mr-4">Rating:</span>
              {[...Array(5)].map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setNewReview({ ...newReview, rating: i + 1 })}
                  className="focus:outline-none"
                >
                  <Star
                    className={`w-6 h-6 ${
                      i < newReview.rating
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>
            <textarea
              value={newReview.comment}
              onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
              placeholder="Share your thoughts about this product..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3498db] focus:border-transparent outline-none mb-4"
              rows={4}
              required
            />
            <button
              type="submit"
              disabled={reviewLoading}
              className="bg-[#3498db] text-white px-6 py-2 rounded-lg hover:bg-[#2980b9] transition-colors disabled:opacity-50"
            >
              {reviewLoading ? 'Submitting...' : 'Submit Review'}
            </button>
          </form>

          {/* Reviews List */}
          {reviews.length === 0 ? (
            <p className="text-gray-600">No reviews yet. Be the first to review!</p>
          ) : (
            <div className="space-y-6">
              {reviews.map((review) => (
                <div key={review.id || `${review.userId}-${review.createdAt}`} className="border-b border-gray-200 pb-6 last:border-0">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-[#3498db] rounded-full flex items-center justify-center text-white font-semibold mr-3">
                        {review.authorName.charAt(0)}
                      </div>
                      <span className="font-semibold text-[#2c3e50]">{review.authorName}</span>
                    </div>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < review.rating
                              ? 'text-yellow-400 fill-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-600">{review.comment}</p>
                  <p className="text-sm text-gray-400 mt-2">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
