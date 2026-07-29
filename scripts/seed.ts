import { createAdminClient } from '../lib/supabase/admin'
import { readFileSync } from 'fs'
import { join } from 'path'

const supabase = createAdminClient()

async function readJSON(filename: string) {
  const filePath = join(process.cwd(), 'data', filename)
  return JSON.parse(readFileSync(filePath, 'utf-8'))
}

async function seedCategories() {
  const categories = await readJSON('categories.json')
  const { error } = await supabase
    .from('categories')
    .upsert(categories.map((c: any) => ({
      name: c.name,
      slug: c.slug,
      image_url: c.image || c.image_url || '',
      sort_order: c.sort_order || 0
    })), { onConflict: 'slug' })
  if (error) console.error('Categories error:', error)
  else console.log('✓ Categories seeded')
}

async function seedProducts() {
  const products = await readJSON('products.json')
  
  // Get categories to map category names to IDs
  const { data: categories } = await supabase
    .from('categories')
    .select('id, name, slug')
  
  const categoryMap = new Map<string, string>();
  categories?.forEach((cat) => {
    categoryMap.set(cat.name.toLowerCase(), cat.id);
  });

  const productsToSeed = products.map((p: any) => {
    const categoryId = p.category ? categoryMap.get(p.category.toLowerCase()) : null;
    return {
      name: p.name,
      slug: p.slug,
      description: p.description || '',
      price: p.price,
      category_id: categoryId,
      category: p.category || '',
      images: Array.isArray(p.gallery) ? p.gallery : (p.image ? [p.image] : []),
      badge: p.badge || null,
      color_variants: p.colorVariants || [],
      variants: p.stockBySize || {},
      inventory_count: p.inventory || 0,
      rating: p.rating || 0,
      review_count: p.reviewCount || 0,
      fabric_composition: p.material || '',
      comfort_score: p.scores?.comfort || null,
      breathability_score: p.scores?.breathability || null,
      softness_score: p.scores?.softness || null,
      is_published: p.published !== false
    };
  });

  const { error } = await supabase
    .from('products')
    .upsert(productsToSeed, { onConflict: 'slug' })
  if (error) console.error('Products error:', error)
  else console.log('✓ Products seeded')
}

async function seedOrders() {
  const orders = await readJSON('orders.json')
  
  const ordersToSeed = orders.map((o: any) => {
    // Pack full order metadata in shipping_address for compatibility
    const metadata = {
      address: o.shippingAddress || '',
      customerName: o.customerName || '',
      customerPhone: o.customerPhone || '',
      paymentStatus: o.paymentStatus || 'Pending',
      fulfillmentStatus: o.fulfillmentStatus || 'Unfulfilled',
      discountCode: o.discountCode || null,
      date: o.date || o.createdAt || new Date().toISOString()
    };

    // Map "processing" status (which is in JSON/TS but not DB constraint) to "paid"
    let status = o.status || 'pending';
    if (status === 'processing') {
      status = 'paid';
    }

    return {
      order_number: o.id || o.order_number,
      customer_email: o.customerEmail || o.email || '',
      status: status,
      items: o.items || [],
      subtotal: o.subtotal || o.total || 0,
      discount: o.discount || 0,
      total: o.total || 0,
      shipping_address: metadata
    };
  });

  const { error } = await supabase
    .from('orders')
    .upsert(ordersToSeed, { onConflict: 'order_number' })
  if (error) console.error('Orders error:', error)
  else console.log('✓ Orders seeded')
}

async function seedBlogPosts() {
  const posts = await readJSON('blog.json')
  const { error } = await supabase
    .from('blog_posts')
    .upsert(posts.map((p: any) => ({
      title: p.title,
      slug: p.slug,
      cover_image: p.image || p.cover_image || '',
      excerpt: p.excerpt || '',
      content: p.content || '',
      author: p.author || 'The Comfortables Co.',
      is_published: p.published !== false,
      published_at: p.date || p.published_at || new Date().toISOString()
    })), { onConflict: 'slug' })
  if (error) console.error('Blog posts error:', error)
  else console.log('✓ Blog posts seeded')
}

async function seedReviews() {
  const reviews = await readJSON('reviews.json')
  
  const { data: products } = await supabase
    .from('products')
    .select('id, slug')
  
  const productMap = new Map<string, string>();
  products?.forEach((prod) => {
    productMap.set(prod.slug, prod.id);
  });

  const { error } = await supabase
    .from('reviews')
    .upsert(reviews.map((r: any) => {
      const productId = r.productSlug ? productMap.get(r.productSlug) : null;
      return {
        product_id: productId,
        customer_name: r.name || 'Customer',
        rating: r.rating || 5,
        comment: r.text || '',
        is_approved: r.status === 'approved',
        created_at: r.date || new Date().toISOString()
      };
    }))
  if (error) console.error('Reviews error:', error)
  else console.log('✓ Reviews seeded')
}

async function seedDiscounts() {
  const discounts = await readJSON('discounts.json')
  const { error } = await supabase
    .from('discount_codes')
    .upsert(discounts.map((d: any) => ({
      code: d.code,
      type: d.type || 'percentage',
      value: d.value || 0,
      usage_limit: d.usageLimit || null,
      used_count: d.usageCount || 0,
      expires_at: d.expiryDate || null,
      is_active: d.active !== false
    })), { onConflict: 'code' })
  if (error) console.error('Discounts error:', error)
  else console.log('✓ Discount codes seeded')
}

async function seedSettings() {
  const settings = await readJSON('settings.json')
  
  const settingsToSeed = [
    {
      key: 'announcement_messages',
      value: settings.announcementMessages || [
        "FREE SHIPPING OVER ₹1,999",
        "30-DAY SOFTNESS GUARANTEE",
        "COTTON × BAMBOO — OEKO-TEX CERTIFIED"
      ]
    },
    {
      key: 'announcement_speed',
      value: settings.announcementSpeed || 5
    },
    {
      key: 'hero_title',
      value: settings.heroTitle || "Made for Comfort. Designed for Life."
    },
    {
      key: 'hero_subtitle',
      value: settings.heroSubtitle || "Premium Cotton × Bamboo apparel."
    },
    {
      key: 'comfort_promise',
      value: settings.comfortPromise || []
    },
    {
      key: 'sustainability_timeline',
      value: settings.sustainabilityTimeline || []
    }
  ]

  for (const setting of settingsToSeed) {
    const { error } = await supabase
      .from('site_settings')
      .upsert({
        key: setting.key,
        value: setting.value
      }, { onConflict: 'key' })
    if (error) console.error(`Setting ${setting.key} error:`, error)
  }
  console.log('✓ Site settings seeded')
}

async function main() {
  console.log('Starting seed...')
  await seedCategories()
  await seedProducts()
  await seedOrders()
  await seedBlogPosts()
  await seedReviews()
  await seedDiscounts()
  await seedSettings()
  console.log('✓ Seed complete!')
}

main().catch(console.error)
