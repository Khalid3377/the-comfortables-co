"use server"

import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'

export async function createCustomerRecord(
  userId: string,
  name: string,
  email: string,
  phone?: string
) {
  const supabase = createAdminClient()

  // Check if customer already exists
  const { data: existing } = await supabase
    .from('customers')
    .select('*')
    .eq('auth_user_id', userId)
    .maybeSingle()

  if (existing) return existing

  // Create new customer record
  const { data, error } = await supabase
    .from('customers')
    .insert({
      auth_user_id: userId,
      name: name || 'Customer',
      email: email || '',
      phone: phone || '',
      reward_points: 0,
      tier: 'Seedling',
      total_spent: 0
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function getCurrentUser() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) {
    if (error) console.error('getCurrentUser authentication error:', error)
    return null
  }

  const admin = createAdminClient()
  let { data: customer, error: customerError } = await admin
    .from('customers')
    .select('*')
    .eq('auth_user_id', user.id)
    .maybeSingle()

  if (customerError) {
    console.error('getCurrentUser customer lookup error:', customerError)
    throw customerError
  }

  if (!customer) {
    customer = await createCustomerRecord(
      user.id,
      user.user_metadata?.full_name || user.user_metadata?.name || 'Customer',
      user.email || '',
      user.phone || ''
    )
  }

  return { user, customer }
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
}
