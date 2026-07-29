export type Product = {
  slug: string;
  name: string;
  category: string;
  collection: string;
  price: number;
  colors: string[];
  sizes: string[];
  material: string;
  image: string;
  gallery: string[];
  description: string;
  inventory: number;
  stockBySize: Record<string, number>;
  scores: { comfort: number; breathability: number; softness: number };
  reviews: { name: string; text: string; rating: number }[];
  published: boolean;
  badge?: 'BESTSELLER' | 'NEW' | 'ECO PICK' | 'SALE' | null;
  colorVariants?: { name: string; hex: string; image?: string }[];
  rating?: number;
  reviewCount?: number;
  salePrice?: number;
  stage?: string;
  ageRange?: string;
};

export type Category = {
  slug: string;
  name: string;
  image: string;
  description?: string;
  heroHeadline?: string;
  heroSubheadline?: string;
  sortOrder?: number;
};

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  published: boolean;
  date: string;
};

export type Review = {
  id: string;
  productSlug: string;
  productName: string;
  name: string;
  rating: number;
  text: string;
  status: "pending" | "approved" | "rejected";
  date: string;
};

export type DiscountCode = {
  code: string;
  type: "percentage" | "fixed";
  value: number;
  usageLimit: number;
  usageCount: number;
  expiryDate: string;
  active: boolean;
};

export type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  createdAt: string;
  joinedAt: string;
};

export type OrderItem = {
  productSlug: string;
  productName: string;
  quantity: number;
  price: number;
  size?: string;
  color?: string;
};

export type Order = {
  id: string;
  date: string;
  createdAt: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string | {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  items: OrderItem[];
  subtotal: number;
  discount: number;
  total: number;
  status: "pending" | "paid" | "failed" | "refunded" | "processing" | "shipped" | "delivered" | "cancelled";
  paymentStatus: "Pending" | "Paid" | "Failed" | "Refunded";
  fulfillmentStatus: "Unfulfilled" | "Shipped" | "Delivered";
  discountCode?: string;
};

export type SiteSetting = {
  announcementMessages: string[];
  announcementSpeed: number; // in seconds
  heroTitle: string;
  heroSubtitle: string;
  comfortPromise: { title: string; text: string }[]; // exactly 4 items
  sustainabilityTimeline: { step: string; title: string; desc: string }[];
};
