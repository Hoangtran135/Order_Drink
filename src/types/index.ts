export interface User {
  id: number;
  username: string;
  email: string;
  password: string;
  fullName: string;
  phone: string;
  address: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  available: boolean;
}

export interface CartItem {
  productId: number;
  quantity: number;
  product?: Product;
}

export interface Order {
  id: number;
  userId: number;
  items: CartItem[];
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  createdAt: Date;
  deliveryAddress: string;
  phone: string;
  paymentMethod: string;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  deliveryFee: number;
  discount: number;
  finalAmount: number;
}

export interface Review {
  id: number;
  userId: number;
  productId: number;
  rating: number;
  comment: string;
  createdAt: Date;
  user?: User;
}

export interface Promotion {
  id: number;
  code: string;
  name: string;
  description: string;
  type: 'percentage' | 'fixed';
  value: number;
  minOrderAmount: number;
  maxDiscount: number;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  usageLimit: number;
  usedCount: number;
}

export interface Notification {
  id: number;
  userId: number;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  isRead: boolean;
  createdAt: Date;
  data?: any;
}

export interface Favorite {
  id: number;
  userId: number;
  productId: number;
  createdAt: Date;
  product?: Product;
}

export interface Analytics {
  totalOrders: number;
  totalRevenue: number;
  totalUsers: number;
  totalProducts: number;
  ordersByStatus: { [key: string]: number };
  revenueByMonth: { month: string; revenue: number }[];
  topProducts: { productId: number; name: string; sales: number }[];
}

export interface SessionData {
  userId?: number;
  username?: string;
  cart?: CartItem[];
}
