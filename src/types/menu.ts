export type CategoryId =
  | 'all'
  | 'biryani'
  | 'kebabs'
  | 'curries'
  | 'tikkas'
  | 'veg'
  | 'non-veg'
  | 'rolls-breads'
  | 'combos';

export type CategoryDisplay =
  | 'All'
  | 'Biryani'
  | 'Kebabs'
  | 'Curries'
  | 'Tikkas'
  | 'Veg'
  | 'Non-Veg'
  | 'Rolls & Breads'
  | 'Combos';

export type PortionOption = 'half' | 'full' | 'single';

export interface Dish {
  id: string;
  name: string;
  category: 'Biryani' | 'Kebabs' | 'Curries' | 'Tikkas' | 'Rolls & Breads' | 'Combos';
  isVeg: boolean;
  description: string;
  fullPrice: number;
  halfPrice?: number;
  originalPrice?: number;
  pieces?: string;
  rating: number;
  ratingCount: number;
  image: string;
  localImage?: any;
  isBestseller?: boolean;
  isChefSpecial?: boolean;
  isSpicy?: boolean;
  prepTime: string;
  calories?: string;
  heritageStory?: string;
  ingredients?: string[];
}

export interface CartItem {
  id: string; // unique item id = `${dish.id}_${portion}`
  dish: Dish;
  portion: PortionOption;
  quantity: number;
  unitPrice: number;
  instructions?: string;
}

export interface DeliveryAddress {
  id: string;
  name: string;
  phone: string;
  label: 'Home' | 'Office' | 'Other';
  addressLine: string;
  area: string;
  city: string;
  landmark?: string;
  pincode: string;
  isDefault: boolean;
}

export type OrderStage =
  | 'Order Placed'
  | 'Order Confirmed'
  | 'Preparing Your Food'
  | 'Out for Delivery'
  | 'Delivered';

export interface OrderTimelineStep {
  stage: OrderStage;
  description: string;
  time: string;
  isCompleted: boolean;
  isCurrent: boolean;
}

export interface Order {
  id: string;
  orderNumber: string;
  date: string;
  items: CartItem[];
  itemTotal: number;
  deliveryCharge: number;
  tax: number;
  discount: number;
  totalAmount: number;
  deliveryAddress: DeliveryAddress;
  paymentMethod: 'Cash on Delivery' | 'UPI / Online' | 'Credit/Debit Card';
  paymentStatus: 'Pending' | 'Paid';
  deliveryInstruction?: string;
  currentStage: OrderStage;
  timeline: OrderTimelineStep[];
  estimatedDeliveryTime: string;
  deliveryPartner?: {
    name: string;
    phone: string;
    vehicleNumber: string;
  };
}

export interface RestaurantInfo {
  name: string;
  tagline: string;
  story: string;
  address: string;
  area: string;
  city: string;
  pincode: string;
  phone: string;
  phoneDisplay: string;
  email: string;
  openingHours: string;
  rating: number;
  reviewsCount: number;
  socials: {
    facebook: string;
    instagram: string;
    whatsapp: string;
  };
}
