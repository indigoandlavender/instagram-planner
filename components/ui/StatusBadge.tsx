'use client'

import { PostStatus } from '@/types'
import { cn } from '@/lib/utils'

interface StatusBadgeProps {
  status: PostStatus
  size?: 'sm' | 'md'
}

export function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-medium',
        {
          'px-2 py-0.5 text-xs': size === 'sm',
          'px-2.5 py-1 text-xs': size === 'md',
        },
        {
          'bg-gray-100 text-gray-700': status === 'Draft',
          'bg-blue-100 text-blue-700': status === 'Ready',
          'bg-green-100 text-green-700': status === 'Posted',
        }
      )}
    >
      {status}
    </span>
  )
}
