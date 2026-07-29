# The Comfortable Co.

A premium D2C comfort-wear storefront for Cotton x Bamboo apparel.

## Stack

- Next.js 15 App Router
- TypeScript
- Tailwind CSS
- Framer Motion
- Zustand cart and wishlist store
- React Hook Form and Zod
- Lucide React icons
- Shadcn-style UI primitives
- SEO metadata, robots, sitemap, product schema

## Pages

- Home
- Shop
- Product Detail
- Fabric Innovation
- Sustainability
- About Us
- Journal / Blog
- Contact
- Wishlist
- Cart
- Checkout
- Account

## Run Locally

```bash
npm install
npm run dev
```

Open:

```text
http://localhost:3000
```

## Build

```bash
npm run build
npm run start
```

## Notes

The project uses Unsplash remote images for the sample brand and product photography. Replace these with owned campaign and product images before a real launch.




## Folder Structure
the-comfortable-co
├── MIGRATION.md
├── README.md
├── app
│   ├── about
│   │   ├── about-client.tsx
│   │   └── page.tsx
│   ├── account
│   │   ├── account-client.tsx
│   │   ├── actions.ts
│   │   ├── page.tsx
│   │   ├── referrals
│   │   │   └── page.tsx
│   │   └── rewards
│   │       └── page.tsx
│   ├── admin
│   │   ├── actions.ts
│   │   ├── blog
│   │   │   ├── actions.ts
│   │   │   ├── blog-client.tsx
│   │   │   └── page.tsx
│   │   ├── categories
│   │   │   ├── actions.ts
│   │   │   ├── categories-client.tsx
│   │   │   └── page.tsx
│   │   ├── content
│   │   │   ├── actions.ts
│   │   │   ├── actions.tsx
│   │   │   ├── content-client.tsx
│   │   │   └── page.tsx
│   │   ├── customers
│   │   │   ├── customers-client.tsx
│   │   │   └── page.tsx
│   │   ├── discounts
│   │   │   ├── actions.ts
│   │   │   ├── discounts-client.tsx
│   │   │   └── page.tsx
│   │   ├── layout.tsx
│   │   ├── login
│   │   │   ├── login-form.tsx
│   │   │   └── page.tsx
│   │   ├── orders
│   │   │   ├── actions.ts
│   │   │   ├── orders-client.tsx
│   │   │   └── page.tsx
│   │   ├── page.tsx
│   │   ├── products
│   │   │   ├── actions.ts
│   │   │   ├── page.tsx
│   │   │   └── products-client.tsx
│   │   └── reviews
│   │       ├── actions.ts
│   │       ├── page.tsx
│   │       └── reviews-client.tsx
│   ├── api
│   │   ├── notify-requests
│   │   │   └── route.ts
│   │   ├── recommendations
│   │   │   └── route.ts
│   │   └── ugc
│   │       └── route.ts
│   ├── baby-kids
│   │   └── page.tsx
│   ├── cart
│   │   ├── cart-client.tsx
│   │   └── page.tsx
│   ├── checkout
│   │   └── page.tsx
│   ├── contact
│   │   └── page.tsx
│   ├── fabric-innovation
│   │   └── page.tsx
│   ├── globals.css
│   ├── journal
│   │   ├── [slug]
│   │   │   └── page.tsx
│   │   └── page.tsx
│   ├── layout.tsx
│   ├── loungewear
│   │   └── page.tsx
│   ├── maternity
│   │   └── page.tsx
│   ├── men
│   │   └── page.tsx
│   ├── new-in
│   │   └── page.tsx
│   ├── page.tsx
│   ├── privacy
│   │   └── page.tsx
│   ├── product
│   │   └── [slug]
│   │       ├── page.tsx
│   │       └── product-actions.tsx
│   ├── returns
│   │   └── page.tsx
│   ├── robots.ts
│   ├── shop
│   │   └── page.tsx
│   ├── sitemap.ts
│   ├── sustainability
│   │   └── page.tsx
│   ├── wishlist
│   │   ├── page.tsx
│   │   └── wishlist-client.tsx
│   └── women
│       └── page.tsx
├── components
│   ├── ErrorBoundary.tsx
│   ├── account
│   │   └── ReferralHub.tsx
│   ├── back-to-top.tsx
│   ├── button-link.tsx
│   ├── category
│   │   └── CategoryPageClient.tsx
│   ├── fabric-innovation
│   │   └── FabricInnovationClient.tsx
│   ├── footer.tsx
│   ├── home
│   │   ├── HomeClient.tsx
│   │   ├── MetricCounter.tsx
│   │   └── UGCGrid.tsx
│   ├── layout
│   │   ├── AnnouncementBar.tsx
│   │   ├── MissionBanner.tsx
│   │   └── Navbar.tsx
│   ├── loyalty
│   │   └── ComfortCredits.tsx
│   ├── motion.tsx
│   ├── navbar.tsx
│   ├── product
│   │   ├── BackInStock.tsx
│   │   ├── CompleteTheSet.tsx
│   │   ├── SizeQuiz.tsx
│   │   ├── StickyCartBar.tsx
│   │   ├── StockSignal.tsx
│   │   └── TrustBar.tsx
│   ├── product-card.tsx
│   ├── size-recommender.tsx
│   ├── theme-toggle.tsx
│   └── ui
│       ├── button.tsx
│       ├── input.tsx
│       ├── safe-image.tsx
│       └── skeleton.tsx
├── data
│   ├── blog.json
│   ├── blog.json.metadata.json
│   ├── categories.json
│   ├── customers.json
│   ├── customers.json.metadata.json
│   ├── discounts.json
│   ├── discounts.json.metadata.json
│   ├── orders.json
│   ├── orders.json.metadata.json
│   ├── products.json
│   ├── reviews.json
│   ├── reviews.json.metadata.json
│   └── settings.json
├── lib
│   ├── announcement-bar.ts
│   ├── auth.ts
│   ├── data
│   │   ├── _store.ts
│   │   ├── blog.ts
│   │   ├── categories.ts
│   │   ├── customers.ts
│   │   ├── discounts.ts
│   │   ├── orders.ts
│   │   ├── products.ts
│   │   ├── reviews.ts
│   │   └── settings.ts
│   ├── data.ts
│   ├── emails
│   │   └── sequences.ts
│   ├── inventory.ts
│   ├── loyalty.ts
│   ├── recommendations.ts
│   ├── sizeCalculator.ts
│   ├── supabase
│   │   ├── admin.ts
│   │   ├── client.ts
│   │   ├── server.ts
│   │   └── types.ts
│   ├── types.ts
│   └── utils.ts
├── middleware.ts
├── next-env.d.ts
├── next.config.ts
├── package.json
├── postcss.config.js
├── public
│   ├── images
│   │   ├── categories
│   │   │   ├── accessories.jpg
│   │   │   ├── baby-kids.jpg
│   │   │   ├── everyday-wear.jpg
│   │   │   ├── loungewear.jpg
│   │   │   └── maternity.jpg
│   │   ├── hero
│   │   │   └── hero-woman.jpg
│   │   └── products
│   │       ├── product-1.jpg
│   │       ├── product-2.jpg
│   │       ├── product-3.jpg
│   │       ├── product-4.jpg
│   │       └── product-5.jpg
│   └── logo.jpg
├── scripts
│   ├── count.ts
│   ├── download-images.ts
│   └── seed.ts
├── store
│   └── commerce-store.ts
├── supabase
│   └── migrations
│       └── 001_initial_schema.sql
├── tailwind.config.ts
├── test-crud.ts
├── tsconfig.json
├── tsconfig.tsbuildinfo
└── vercel.json