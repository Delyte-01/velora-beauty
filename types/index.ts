export interface ProductVariant {
  id: string;
  name: string;
  options: string[];
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  previousPrice?: number;
  category: string;
  categorySlug: string;
  image: string;
  gallery: string[];
  brand: string;
  stock: number;
  featured: boolean;
  bestSeller: boolean;
  newArrival: boolean;
  rating: number;
  reviewCount: number;
  highlights: string[];
  variants: ProductVariant[];
  createdAt: string;
  popularity: number;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string;
  image: string;
  productCount: number;
}

export interface CartItem {
  productId: string;
  slug: string;
  name: string;
  price: number;
  image: string;
  category: string;
  quantity: number;
  selectedVariants: Record<string, string>;
  stock: number;
  lineKey: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  selectedVariants: Record<string, string>;
}

export interface Order {
  reference: string;
  createdAt: string;
  items: OrderItem[];
  customer: {
    fullName: string;
    email: string;
    phone: string;
    state: string;
    city: string;
    address: string;
    instructions?: string;
  };
  deliveryMethod: string;
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: string;
}

export interface BeautyService {
  id: string;
  slug: string;
  name: string;
  description: string;
  duration: string;
  price: number;
  image: string;
  category: string;
}

export interface Booking {
  reference: string;
  createdAt: string;
  serviceId: string;
  serviceName: string;
  date: string;
  timeSlot: string;
  customer: {
    name: string;
    phone: string;
    email: string;
    notes?: string;
  };
  price: number;
  status: string;
}

export interface Review {
  id: string;
  productId: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
}
