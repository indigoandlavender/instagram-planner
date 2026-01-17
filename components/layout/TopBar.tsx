'use client'

import { Brand } from '@/types'
import { BrandSwitcher } from './BrandSwitcher'

interface TopBarProps {
  brand: Brand
  brands: Brand[]
}

export function TopBar({ brand, brands }: TopBarProps) {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold text-gray-900">Planner</h1>
            {brands.length > 1 && (
              <BrandSwitcher currentBrand={brand} brands={brands} />
            )}
            {brands.length === 1 && (
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: brand.color }}
                />
                <span className="text-sm font-medium text-gray-700">{brand.name}</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-4">
            {brand.instagram && (
              <span className="text-sm text-gray-500">
                {brand.instagram}
              </span>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
