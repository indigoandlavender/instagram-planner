'use client'

import { useSession, signOut } from 'next-auth/react'
import { Brand } from '@/types'
import { BrandSwitcher } from './BrandSwitcher'
import Image from 'next/image'

interface TopBarProps {
  brand: Brand
  brands: Brand[]
}

export function TopBar({ brand, brands }: TopBarProps) {
  const { data: session } = useSession()

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
              <span className="text-sm text-gray-500 hidden sm:block">
                {brand.instagram}
              </span>
            )}

            {session?.user && (
              <div className="flex items-center gap-3">
                {session.user.image && (
                  <Image
                    src={session.user.image}
                    alt={session.user.name || 'User'}
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                )}
                <button
                  onClick={() => signOut()}
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
