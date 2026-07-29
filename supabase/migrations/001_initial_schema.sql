-- supabase/migrations/001_initial_schema.sql

-- Categories
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  image_url TEXT,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Products
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  price NUMERIC(10,2) NOT NULL,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  category TEXT,
  images TEXT[] DEFAULT '{}',
  badge TEXT CHECK (badge IN ('BESTSELLER','NEW','ECO PICK','SALE')),
  color_variants JSONB DEFAULT '[]',
  variants JSONB DEFAULT '{}',
  inventory_count INT DEFAULT 0,
  rating NUMERIC(3,1) DEFAULT 0,
  review_count INT DEFAULT 0,
  fabric_composition TEXT,
  comfort_score INT,
  breathability_score INT,
  softness_score INT,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Orders
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT UNIQUE NOT NULL,
  customer_id UUID,
  customer_email TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','paid','shipped','delivered','cancelled')),
  items JSONB NOT NULL DEFAULT '[]',
  subtotal NUMERIC(10,2) DEFAULT 0,
  discount NUMERIC(10,2) DEFAULT 0,
  total NUMERIC(10,2) NOT NULL,
  shipping_address JSONB,
  payment_method TEXT,
  payment_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Customers
CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id UUID UNIQUE,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  addresses JSONB DEFAULT '[]',
  reward_points INT DEFAULT 0,
  tier TEXT DEFAULT 'standard',
  total_spent NUMERIC(10,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Reviews
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  customer_name TEXT,
  rating INT CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  is_approved BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Blog posts
CREATE TABLE blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  cover_image TEXT,
  excerpt TEXT,
  content TEXT,
  author TEXT DEFAULT 'The Comfortables Co.',
  is_published BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Discount codes
CREATE TABLE discount_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  type TEXT CHECK (type IN ('percentage','fixed')),
  value NUMERIC(10,2) NOT NULL,
  usage_limit INT,
  used_count INT DEFAULT 0,
  expires_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Site settings (key-value store)
CREATE TABLE site_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Admin users
CREATE TABLE admin_users (
  auth_user_id UUID PRIMARY KEY,
  email TEXT NOT NULL,
  role TEXT DEFAULT 'editor' CHECK (role IN ('super_admin','editor')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Loyalty Points (Helper)
CREATE TABLE loyalty_points (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL,
  points_balance INT DEFAULT 0,
  tier TEXT DEFAULT 'Seedling',
  lifetime_points INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notify Requests (Helper)
CREATE TABLE notify_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  product_slug TEXT,
  email TEXT NOT NULL,
  size TEXT,
  color TEXT,
  variant_id TEXT,
  notified_at TIMESTAMPTZ DEFAULT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to products, orders, blog_posts, loyalty_points
CREATE TRIGGER products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER blog_posts_updated_at
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER loyalty_points_updated_at
  BEFORE UPDATE ON loyalty_points
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Enable RLS on all tables
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE discount_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE loyalty_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE notify_requests ENABLE ROW LEVEL SECURITY;

-- Public read policies (storefront)
CREATE POLICY "Public can read published products"
  ON products FOR SELECT
  USING (is_published = true);

CREATE POLICY "Public can read categories"
  ON categories FOR SELECT
  USING (true);

CREATE POLICY "Public can read published blog posts"
  ON blog_posts FOR SELECT
  USING (is_published = true);

CREATE POLICY "Public can read approved reviews"
  ON reviews FOR SELECT
  USING (is_approved = true);

CREATE POLICY "Public can insert notify requests"
  ON notify_requests FOR INSERT
  WITH CHECK (true);
