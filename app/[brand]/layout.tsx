import { notFound } from 'next/navigation'
import { getBrandBySlug, getBrands } from '@/lib/brands'
import { TopBar } from '@/components/layout/TopBar'

interface BrandLayoutProps {
  children: React.ReactNode
  params: { brand: string }
}

export default function BrandLayout({ children, params }: BrandLayoutProps) {
  const brand = getBrandBySlug(params.brand)
  const brands = getBrands()

  if (!brand) {
    notFound()
  }

  return (
    <div
      className="min-h-screen bg-cream"
      style={{ '--brand-color': brand.color } as React.CSSProperties}
    >
      <TopBar brand={brand} brands={brands} />
      <main className="container mx-auto px-4 py-6">{children}</main>
    </div>
  )
}
