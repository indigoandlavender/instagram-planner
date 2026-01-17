'use client'

import { Post } from '@/types'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { formatDisplayDate } from '@/lib/utils'
import { parseISO } from 'date-fns'
import Image from 'next/image'

interface PostCardProps {
  post: Post
  onClick: () => void
}

export function PostCard({ post, onClick }: PostCardProps) {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
    >
      <div className="flex">
        <div className="w-24 h-24 flex-shrink-0 relative bg-gray-100">
          {post.imageUrl ? (
            <Image
              src={post.imageUrl}
              alt={post.caption || 'Post image'}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-gray-300"
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
        </div>

        <div className="flex-1 p-3 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <div className="text-sm font-medium text-gray-900">
              {formatDisplayDate(parseISO(post.date))}
              {post.time && (
                <span className="text-gray-500 font-normal ml-1">at {post.time}</span>
              )}
            </div>
            <StatusBadge status={post.status} size="sm" />
          </div>

          {post.category && (
            <div className="text-xs text-brand mb-1">{post.category}</div>
          )}

          <p className="text-sm text-gray-600 line-clamp-2">
            {post.caption || 'No caption'}
          </p>
        </div>
      </div>
    </div>
  )
}
