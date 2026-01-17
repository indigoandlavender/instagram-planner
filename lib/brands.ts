import { Brand } from '@/types'

export function getBrands(): Brand[] {
  const brands: Brand[] = []
  let index = 1

  while (true) {
    const name = process.env[`BRAND_${index}_NAME`]
    if (!name) break

    brands.push({
      id: `brand-${index}`,
      name,
      slug: process.env[`BRAND_${index}_SLUG`] || name.toLowerCase().replace(/\s+/g, '-'),
      color: process.env[`BRAND_${index}_COLOR`] || '#3B82F6',
      sheetId: process.env[`BRAND_${index}_SHEET_ID`] || '',
      instagram: process.env[`BRAND_${index}_INSTAGRAM`] || '',
      logoUrl: process.env[`BRAND_${index}_LOGO_URL`] || '',
      categories: (process.env[`BRAND_${index}_CATEGORIES`] || 'General').split(',').map(c => c.trim()),
    })

    index++
  }

  return brands
}

export function getBrandBySlug(slug: string): Brand | undefined {
  return getBrands().find(b => b.slug === slug)
}

export function getDefaultBrand(): Brand | undefined {
  return getBrands()[0]
}
