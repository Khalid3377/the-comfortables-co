// scripts/revalidate-storefront.mjs
// Run with: node scripts/revalidate-storefront.mjs
// Triggers Next.js On-Demand Revalidation for all storefront category pages.

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

const paths = ["/", "/shop", "/new-in", "/men", "/women", "/maternity", "/baby-kids", "/loungewear"];

async function revalidate() {
  console.log(`\n🔄 Revalidating storefront pages at ${BASE_URL}...\n`);
  for (const path of paths) {
    try {
      const res = await fetch(`${BASE_URL}/api/revalidate?path=${encodeURIComponent(path)}&secret=${process.env.REVALIDATE_SECRET || ""}`, {
        method: "POST",
      });
      if (res.ok) {
        console.log(`  ✅ Revalidated ${path}`);
      } else {
        console.log(`  ⚠️  ${path} responded ${res.status} — may need dev server running`);
      }
    } catch {
      console.log(`  ⚠️  Could not reach ${path} — make sure the dev server is running`);
    }
  }
  console.log(`\nDone. Open your storefront to see the new products!\n`);
}

revalidate();
