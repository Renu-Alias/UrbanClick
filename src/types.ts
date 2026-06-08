export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  stock: number;
  rating: number;
  numReviews: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface ShippingAddress {
  fullName: string;
  addressLine: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface PaymentDetails {
  cardName: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
}

export interface Order {
  id: string;
  userId: string;
  userEmail: string;
  items: CartItem[];
  totalAmount: number;
  status: OrderStatus;
  shippingAddress: ShippingAddress;
  paymentDetails: PaymentDetails;
  createdAt: string;
}

export type UserRole = 'user' | 'admin';

export interface UserProfile {
  uid: string;
  email: string;
  role: UserRole;
  fullName: string;
  phone?: string;
  address?: string;
}
