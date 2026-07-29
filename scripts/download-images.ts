import https from 'https'
import fs from 'fs'
import path from 'path'

const images = [
  {
    url: 'https://images.unsplash.com/photo-1554568218-0f1715e72254?w=1200&q=80',
    path: 'public/images/hero/hero-woman.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1506634572416-48cdfe530110?w=600&q=80',
    path: 'public/images/categories/everyday-wear.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80',
    path: 'public/images/categories/loungewear.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1519689373023-dd07c7988603?w=600&q=80',
    path: 'public/images/categories/maternity.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=600&q=80',
    path: 'public/images/categories/baby-kids.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=600&q=80',
    path: 'public/images/categories/accessories.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80',
    path: 'public/images/products/product-1.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600&q=80',
    path: 'public/images/products/product-2.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1503342394128-c104d54dba01?w=600&q=80',
    path: 'public/images/products/product-3.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&q=80',
    path: 'public/images/products/product-4.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1471286174890-9c112ffca5b4?w=600&q=80',
    path: 'public/images/products/product-5.jpg'
  }
]

async function downloadImage(url: string, filepath: string) {
  const dir = path.dirname(filepath)
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filepath)
    https.get(url, (response) => {
      if (response.statusCode && response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        // Handle redirect
        https.get(response.headers.location, (redirectResponse) => {
          redirectResponse.pipe(file)
          file.on('finish', () => { file.close(); resolve(true) })
        }).on('error', reject)
      } else {
        response.pipe(file)
        file.on('finish', () => { file.close(); resolve(true) })
      }
    }).on('error', reject)
  })
}

async function main() {
  for (const img of images) {
    console.log(`Downloading ${img.path}...`)
    try {
      await downloadImage(img.url, img.path)
      console.log(`✓ ${img.path}`)
    } catch (e) {
      console.error(`✗ Failed to download ${img.path}:`, e)
    }
  }
}

main()
