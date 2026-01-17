'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Brand } from '@/types'
import { cn } from '@/lib/utils'

interface BrandSwitcherProps {
  currentBrand: Brand
  brands: Brand[]
}

export function BrandSwitcher({ currentBrand, brands }: BrandSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleBrandSelect = (brand: Brand) => {
    setIsOpen(false)
    router.push(`/${brand.slug}`)
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <div
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: currentBrand.color }}
        />
        <span className="text-sm font-medium text-gray-700">{currentBrand.name}</span>
        <svg
          className={cn('w-4 h-4 text-gray-500 transition-transform', {
            'rotate-180': isOpen,
          })}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
          {brands.map(brand => (
            <button
              key={brand.id}
              onClick={() => handleBrandSelect(brand)}
              className={cn(
                'w-full flex items-center gap-2 px-3 py-2 text-sm text-left hover:bg-gray-50',
                {
                  'bg-gray-50': brand.id === currentBrand.id,
                }
              )}
            >
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: brand.color }}
              />
              <span>{brand.name}</span>
              {brand.id === currentBrand.id && (
                <svg
                  className="w-4 h-4 text-brand ml-auto"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
