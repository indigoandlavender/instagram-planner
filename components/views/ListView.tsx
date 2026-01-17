'use client'

import { useState } from 'react'
import { Post } from '@/types'
import { PostCard } from '@/components/post/PostCard'
import { parseISO } from 'date-fns'

interface ListViewProps {
  posts: Post[]
  onPostClick: (post: Post) => void
}

type SortField = 'date' | 'status' | 'category'
type SortDirection = 'asc' | 'desc'

export function ListView({ posts, onPostClick }: ListViewProps) {
  const [sortField, setSortField] = useState<SortField>('date')
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const sortedPosts = [...posts].sort((a, b) => {
    let comparison = 0

    switch (sortField) {
      case 'date':
        comparison = parseISO(a.date).getTime() - parseISO(b.date).getTime()
        break
      case 'status':
        const statusOrder = { Draft: 0, Ready: 1, Posted: 2 }
        comparison = statusOrder[a.status] - statusOrder[b.status]
        break
      case 'category':
        comparison = a.category.localeCompare(b.category)
        break
    }

    return sortDirection === 'asc' ? comparison : -comparison
  })

  const SortButton = ({
    field,
    children,
  }: {
    field: SortField
    children: React.ReactNode
  }) => (
    <button
      onClick={() => handleSort(field)}
      className={`text-sm font-medium flex items-center gap-1 ${
        sortField === field ? 'text-brand' : 'text-gray-600 hover:text-gray-900'
      }`}
    >
      {children}
      {sortField === field && (
        <svg
          className={`w-4 h-4 transition-transform ${
            sortDirection === 'desc' ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 15l7-7 7 7"
          />
        </svg>
      )}
    </button>
  )

  if (posts.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
        <svg
          className="w-12 h-12 text-gray-300 mx-auto mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        <h3 className="text-lg font-medium text-gray-900 mb-1">No posts yet</h3>
        <p className="text-gray-500">
          Click &quot;Add Post&quot; to create your first scheduled post.
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-200 flex items-center gap-6">
        <span className="text-sm text-gray-500">Sort by:</span>
        <SortButton field="date">Date</SortButton>
        <SortButton field="status">Status</SortButton>
        <SortButton field="category">Category</SortButton>
      </div>

      <div className="divide-y divide-gray-200">
        {sortedPosts.map(post => (
          <div key={post.id} className="p-4">
            <PostCard post={post} onClick={() => onPostClick(post)} />
          </div>
        ))}
      </div>
    </div>
  )
}
