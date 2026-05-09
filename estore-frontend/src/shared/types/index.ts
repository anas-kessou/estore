// User Types
export interface User {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  profile?: Profile;
  role?: string;
}

export interface Profile {
  id?: number;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  postalCode?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

// Category Types
export interface Category {
  id: number;
  name: string;
  description: string;
  imageUrl?: string;
  displayOrder: number;
  active: boolean;
}

// Product Types
export interface Product {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  imageUrls?: string;
  description: string;
  category?: Category;
  categoryId?: number;
  categoryName?: string;
  inventory?: Inventory;
  active: boolean;
  featured?: boolean;
  stockQuantity?: number;
  availableStock: number;
  inStock?: boolean;
  lowStock?: boolean;
  averageRating?: number | null;
  reviewCount?: number;
}

export interface Inventory {
  id: number;
  quantity: number;
}

// Cart Types
export interface CartItem {
  id?: number;
  product: Product;
  quantity: number;
  availableStock?: number;
  unitPrice: number;
}

export interface Cart {
  id?: number;
  userId: number;
  items: CartItem[];
  createdAt?: string;
}

// Order Types
export interface OrderItem {
  id?: number;
  product: Product;
  quantity: number;
  unitPrice: number;
}

export interface Order {
  id?: number;
  userId: number;
  orderDate: string;
  totalAmount: number;
  status: string;
  items: OrderItem[];
}

// Review Types
export interface Review {
  id?: string;
  productId: number;
  userId: number;
  authorName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number?: number;
  page?: number;
  first?: boolean;
  last?: boolean;
}
