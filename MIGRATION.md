# MIGRATION.md — Switching from Mock Data to Supabase

This document explains how to migrate The Comfortable Co. from its current
in-memory mock data layer to a real Supabase (PostgreSQL) database. Because
every page and component already talks to `lib/data/*.ts` async functions,
**zero component or page changes are required**. You only touch the 8 data
access files.

---

## Step 1 — Set up Supabase

1. Create a project at <https://supabase.com>.
2. Copy your project URL and anon/service-role keys.
3. Update `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhb...
SUPABASE_SERVICE_ROLE_KEY=eyJhb...   # server-only, never expose to client
ADMIN_PASSWORD=your-secure-admin-password
ADMIN_SESSION_SECRET=a-64-char-random-hex-string
```

---

## Step 2 — Create tables

Run these in Supabase SQL Editor (or use migrations):

```sql
-- Products
create table products (
  slug text primary key,
  name text not null,
  category text,
  collection text,
  price numeric not null,
  colors text[],
  sizes text[],
  material text,
  image text,
  gallery text[],
  description text,
  inventory integer default 0,
  stock_by_size jsonb default '{}',
  scores jsonb default '{}',
  reviews jsonb default '[]',
  published boolean default true
);

-- Categories
create table categories (
  slug text primary key,
  name text not null,
  image text,
  description text
);

-- Blog Posts
create table blog_posts (
  slug text primary key,
  title text not null,
  excerpt text,
  content text,
  image text,
  published boolean default true,
  date text
);

-- Reviews
create table reviews (
  id text primary key,
  product_slug text references products(slug) on delete cascade,
  product_name text,
  name text,
  rating integer,
  text text,
  status text default 'pending',
  date text
);

-- Discount Codes
create table discount_codes (
  code text primary key,
  type text,
  value numeric,
  usage_limit integer default 0,
  usage_count integer default 0,
  expiry_date text,
  active boolean default true
);

-- Customers
create table customers (
  id text primary key,
  name text,
  email text unique,
  phone text,
  created_at timestamptz default now(),
  joined_at timestamptz default now()
);

-- Orders
create table orders (
  id text primary key,
  date text,
  created_at timestamptz default now(),
  customer_name text,
  customer_email text,
  customer_phone text,
  shipping_address text,
  items jsonb default '[]',
  subtotal numeric,
  discount numeric default 0,
  total numeric,
  status text default 'pending',
  payment_status text default 'Pending',
  fulfillment_status text default 'Unfulfilled',
  discount_code text
);

-- Site Settings (single row)
create table site_settings (
  id integer primary key default 1,
  announcement_messages text[],
  announcement_speed integer,
  hero_title text,
  hero_subtitle text,
  comfort_promise jsonb,
  sustainability_timeline jsonb,
  constraint single_row check (id = 1)
);
```

---

## Step 3 — Install Supabase client

```bash
npm install @supabase/supabase-js
```

Create `lib/supabase.ts`:

```ts
import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!   // server-side only
);
```

---

## Step 4 — Swap data access files (one at a time)

Each file in `lib/data/` follows the same pattern. Here is the **products.ts** example:

### Before (mock)
```ts
import { products } from "./_store";

export async function getProducts(options?: { publishedOnly?: boolean }) {
  if (options?.publishedOnly) return products.filter(p => p.published);
  return products;
}
```

### After (Supabase)
```ts
import { supabase } from "../supabase";
import { Product } from "../types";

export async function getProducts(options?: { publishedOnly?: boolean }): Promise<Product[]> {
  let query = supabase.from("products").select("*");
  if (options?.publishedOnly) query = query.eq("published", true);
  const { data, error } = await query;
  if (error) throw error;
  // Map snake_case → camelCase to match Product type
  return (data ?? []).map(row => ({
    ...row,
    stockBySize: row.stock_by_size,
  }));
}

export async function updateProduct(slug: string, data: Partial<Product>): Promise<Product> {
  const { data: row, error } = await supabase
    .from("products")
    .update({ ...data, stock_by_size: data.stockBySize })
    .eq("slug", slug)
    .select()
    .single();
  if (error) throw error;
  return { ...row, stockBySize: row.stock_by_size };
}
```

Apply the same pattern to all 8 files:

| File | Table |
|------|-------|
| `lib/data/products.ts` | `products` |
| `lib/data/categories.ts` | `categories` |
| `lib/data/blog.ts` | `blog_posts` |
| `lib/data/reviews.ts` | `reviews` |
| `lib/data/discounts.ts` | `discount_codes` |
| `lib/data/customers.ts` | `customers` |
| `lib/data/orders.ts` | `orders` |
| `lib/data/settings.ts` | `site_settings` |

---

## Step 5 — Auth (optional upgrade)

Currently auth uses a signed cookie against `ADMIN_PASSWORD`. To upgrade to
Supabase Auth with admin roles:

1. Enable Email Auth in Supabase dashboard.
2. Create an `admin_users` table with a `user_id` foreign key to `auth.users`.
3. Replace `lib/auth.ts` sign/verify logic with `supabase.auth.signInWithPassword()`.
4. Replace `middleware.ts` cookie check with `supabase.auth.getUser()`.

No admin page changes needed — middleware still redirects unauthenticated requests.

---

## Step 6 — Remove mock data

Once Supabase is seeded and tested, delete:

```
lib/data/_store.ts
```

That's the only file removed. All components and pages remain untouched.
