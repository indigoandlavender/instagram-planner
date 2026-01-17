'use client'

import { Post } from '@/types'
import { cn } from '@/lib/utils'
import Image from 'next/image'

interface PostThumbnailProps {
  post: Post
  isDragging?: boolean
}

export function PostThumbnail({ post, isDragging }: PostThumbnailProps) {
  const statusColors = {
    Draft: 'bg-gray-400',
    Ready: 'bg-blue-500',
    Posted: 'bg-green-500',
  }

  return (
    <div
      className={cn(
        'relative rounded overflow-hidden group',
        {
          'shadow-lg': isDragging,
        }
      )}
    >
      {post.imageUrl ? (
        <div className="relative aspect-square w-full">
          <Image
            src={post.imageUrl}
            alt={post.caption || 'Post image'}
            fill
            className="object-cover"
            sizes="80px"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
        </div>
      ) : (
        <div className="aspect-square w-full bg-gray-100 flex items-center justify-center">
          <svg
            className="w-6 h-6 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
      )}

      <div
        className={cn(
          'absolute bottom-0 right-0 w-2 h-2 rounded-full m-1',
          statusColors[post.status]
        )}
      />

      {post.time && (
        <div className="absolute top-0 left-0 bg-black/50 text-white text-[10px] px-1 rounded-br">
          {post.time}
        </div>
      )}
    </div>
  )
}
