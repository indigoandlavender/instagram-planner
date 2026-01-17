'use client'

import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { useState, useEffect, useCallback } from 'react'
import { CalendarGrid } from '@/components/calendar/CalendarGrid'
import { ListView } from '@/components/views/ListView'
import { FilterBar } from '@/components/layout/FilterBar'
import { PostModal } from '@/components/post/PostModal'
import { Post, PostFormData, ViewMode, FilterState, Brand } from '@/types'
import { formatDate } from '@/lib/utils'

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return isMobile
}

interface BrandPageProps {
  params: { brand: string }
}

export default function BrandPage({ params }: BrandPageProps) {
  const { data: session, status } = useSession()
  const isMobile = useIsMobile()
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [viewMode, setViewMode] = useState<ViewMode>('calendar')
  const [filters, setFilters] = useState<FilterState>({ category: null, status: null })
  const [selectedPost, setSelectedPost] = useState<Post | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [brand, setBrand] = useState<Brand | null>(null)

  const fetchPosts = useCallback(async () => {
    try {
      const response = await fetch(`/api/posts?brand=${params.brand}`)
      if (response.ok) {
        const data = await response.json()
        setPosts(data)
      }
    } catch (error) {
      console.error('Error fetching posts:', error)
    } finally {
      setLoading(false)
    }
  }, [params.brand])

  const fetchBrand = useCallback(async () => {
    try {
      const response = await fetch('/api/brands')
      if (response.ok) {
        const brands = await response.json()
        const currentBrand = brands.find((b: Brand) => b.slug === params.brand)
        setBrand(currentBrand)
      }
    } catch (error) {
      console.error('Error fetching brand:', error)
    }
  }, [params.brand])

  useEffect(() => {
    if (status === 'authenticated') {
      fetchPosts()
      fetchBrand()
    }
  }, [status, fetchPosts, fetchBrand])

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand"></div>
      </div>
    )
  }

  if (status === 'unauthenticated') {
    redirect('/auth/signin')
  }

  const filteredPosts = posts.filter(post => {
    if (filters.category && post.category !== filters.category) return false
    if (filters.status && post.status !== filters.status) return false
    return true
  })

  const handleDayClick = (date: Date) => {
    setSelectedDate(formatDate(date))
    setSelectedPost(null)
    setIsModalOpen(true)
  }

  const handlePostClick = (post: Post) => {
    setSelectedPost(post)
    setSelectedDate(null)
    setIsModalOpen(true)
  }

  const handleAddPost = () => {
    setSelectedPost(null)
    setSelectedDate(formatDate(new Date()))
    setIsModalOpen(true)
  }

  const handleSavePost = async (data: PostFormData) => {
    try {
      if (selectedPost) {
        const response = await fetch(`/api/posts/${selectedPost.id}?brand=${params.brand}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        })
        if (response.ok) {
          const updatedPost = await response.json()
          setPosts(posts.map(p => (p.id === updatedPost.id ? updatedPost : p)))
        }
      } else {
        const response = await fetch(`/api/posts?brand=${params.brand}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        })
        if (response.ok) {
          const newPost = await response.json()
          setPosts([...posts, newPost])
        }
      }
      setIsModalOpen(false)
    } catch (error) {
      console.error('Error saving post:', error)
    }
  }

  const handleDeletePost = async (postId: string) => {
    try {
      const response = await fetch(`/api/posts/${postId}?brand=${params.brand}`, {
        method: 'DELETE',
      })
      if (response.ok) {
        setPosts(posts.filter(p => p.id !== postId))
        setIsModalOpen(false)
      }
    } catch (error) {
      console.error('Error deleting post:', error)
    }
  }

  const handleDateChange = async (postId: string, newDate: string) => {
    try {
      const response = await fetch(`/api/posts/${postId}?brand=${params.brand}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: newDate }),
      })
      if (response.ok) {
        const updatedPost = await response.json()
        setPosts(posts.map(p => (p.id === updatedPost.id ? updatedPost : p)))
      }
    } catch (error) {
      console.error('Error updating post date:', error)
    }
  }

  return (
    <div className="space-y-4">
      <FilterBar
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        filters={filters}
        onFiltersChange={setFilters}
        categories={brand?.categories || []}
        onAddPost={handleAddPost}
        currentDate={currentDate}
        onDateChange={setCurrentDate}
      />

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand"></div>
        </div>
      ) : viewMode === 'calendar' && !isMobile ? (
        <CalendarGrid
          date={currentDate}
          posts={filteredPosts}
          onDayClick={handleDayClick}
          onPostClick={handlePostClick}
          onDateChange={handleDateChange}
        />
      ) : (
        <ListView
          posts={filteredPosts}
          onPostClick={handlePostClick}
        />
      )}

      {isModalOpen && (
        <PostModal
          post={selectedPost}
          initialDate={selectedDate}
          categories={brand?.categories || []}
          onSave={handleSavePost}
          onDelete={selectedPost ? () => handleDeletePost(selectedPost.id) : undefined}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  )
}
