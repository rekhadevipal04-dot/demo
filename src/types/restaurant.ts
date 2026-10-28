export type Portion = 'half' | 'full';

export interface MenuItem {
  id: string;
  name: string;
  category: 'rice' | 'noodles' | 'soup' | 'starter';
  categoryLabel: string;
  halfPrice: number;
  fullPrice: number;
  description: string;
  imageUrl?: string;
  isBestseller?: boolean;
  isChefSpecial?: boolean;
  spiceLevel?: 1 | 2 | 3; // 1: Mild, 2: Medium Schezwan, 3: Fiery Hot
  tags?: string[];
}

export interface CartItem {
  id: string; // unique item + portion
  menuItemId: string;
  name: string;
  portion: Portion;
  price: number;
  quantity: number;
  spicePreference?: string;
  specialInstructions?: string;
}

export type OrderStatus = 'new' | 'preparing' | 'out_for_delivery' | 'completed' | 'cancelled';

export interface OrderBooking {
  orderId: string;
  customerName: string;
  phone: string;
  email: string;
  orderType: 'delivery' | 'takeaway' | 'dinein';
  deliveryAddress?: string;
  landmark?: string;
  scheduledTime?: string;
  paymentMethod: 'cod'; // Cash on Delivery only
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: OrderStatus;
  timestamp: string;
  createdAt: number;
  notes?: string;
}

export interface CustomerReview {
  id: string;
  author: string;
  location: string;
  rating: number;
  date: string;
  comment: string;
  favoriteDish: string;
  verifiedOrder?: boolean;
}
