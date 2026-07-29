"use server"

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'

async function getCustomerId(): Promise<string | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const admin = createAdminClient()
  const { data } = await admin
    .from('customers')
    .select('id')
    .eq('auth_user_id', user.id)
    .single()
  return data?.id || null
}

export async function addToCart(
  productIdOrSlug: string,
  quantity: number = 1,
  size?: string,
  color?: string
) {
  const customerId = await getCustomerId()

  if (!customerId) {
    // Return signal to use local cart
    return { success: false, useLocal: true }
  }

  const supabase = createAdminClient()

  // Resolve UUID if a slug was provided
  let productId = productIdOrSlug;
  if (!productId.includes('-') || productId.length !== 36) { // rough UUID check
    const { data: p } = await supabase
      .from('products')
      .select('id')
      .eq('slug', productIdOrSlug)
      .single()
    if (p) productId = p.id;
  }

  // Check if item already in cart
  const { data: existing } = await supabase
    .from('cart_items' as any)
    .select('id, quantity')
    .eq('customer_id', customerId)
    .eq('product_id', productId)
    .eq('size', size || '')
    .eq('color', color || '')
    .single()

  if (existing) {
    // Update quantity
    await supabase
      .from('cart_items' as any)
      .update({ quantity: (existing as any).quantity + quantity })
      .eq('id', (existing as any).id)
  } else {
    // Add new item
    await supabase
      .from('cart_items' as any)
      .insert({
        customer_id: customerId,
        product_id: productId,
        quantity,
        size: size || '',
        color: color || ''
      })
  }

  revalidatePath('/cart')
  return { success: true }
}

export async function removeFromCart(itemId: string) {
  const supabase = createAdminClient()
  await supabase
    .from('cart_items' as any)
    .delete()
    .eq('id', itemId)
  revalidatePath('/cart')
}

export async function updateCartQuantity(
  itemId: string,
  quantity: number
) {
  if (quantity <= 0) {
    return removeFromCart(itemId)
  }
  const supabase = createAdminClient()
  await supabase
    .from('cart_items' as any)
    .update({ quantity } as any)
    .eq('id', itemId)
  revalidatePath('/cart')
}

export async function getCartItems() {
  const customerId = await getCustomerId()
  if (!customerId) return []

  const supabase = createAdminClient()
  const { data } = await supabase
    .from('cart_items' as any)
    .select(`
      *,
      products (
        id, name, slug, price,
        images, inventory_count
      )
    `)
    .eq('customer_id', customerId)

  return data || []
}

export async function clearCart() {
  const customerId = await getCustomerId()
  if (!customerId) return

  const supabase = createAdminClient()
  await supabase
    .from('cart_items' as any)
    .delete()
    .eq('customer_id', customerId)

  revalidatePath('/cart')
}

export async function mergeLocalCart(
  localItems: {
    productId: string
    quantity: number
    size?: string
    color?: string
  }[]
) {
  // Called after login to merge local cart
  // with database cart
  for (const item of localItems) {
    await addToCart(
      item.productId,
      item.quantity,
      item.size,
      item.color
    )
  }
}
