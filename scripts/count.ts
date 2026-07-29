import { createAdminClient } from '../lib/supabase/admin'

const supabase = createAdminClient()

async function countTable(tableName: string) {
  const { count, error } = await supabase
    .from(tableName)
    .select('*', { count: 'exact', head: true })
  if (error) {
    console.error(`Error counting ${tableName}:`, error.message)
    return 0
  }
  return count || 0
}

async function main() {
  const tables = [
    'categories',
    'products',
    'orders',
    'blog_posts',
    'reviews',
    'discount_codes',
    'site_settings',
    'customers',
    'admin_users',
    'loyalty_points',
    'notify_requests'
  ]
  console.log('Seeded Table Row Counts:')
  for (const table of tables) {
    const rowCount = await countTable(table)
    console.log(`- ${table}: ${rowCount} rows`)
  }
}

main().catch(console.error)
