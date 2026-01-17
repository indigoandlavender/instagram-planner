'use client'

import { useState, useEffect } from 'react'
import { Post, PostFormData, PostStatus } from '@/types'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { CaptionEditor } from './CaptionEditor'
import { ImagePreview } from './ImagePreview'
import { formatDate } from '@/lib/utils'

interface PostModalProps {
  post: Post | null
  initialDate: string | null
  categories: string[]
  onSave: (data: PostFormData) => void
  onDelete?: () => void
  onClose: () => void
}

export function PostModal({
  post,
  initialDate,
  categories,
  onSave,
  onDelete,
  onClose,
}: PostModalProps) {
  const [formData, setFormData] = useState<PostFormData>({
    date: post?.date || initialDate || formatDate(new Date()),
    time: post?.time || '09:00',
    category: post?.category || categories[0] || '',
    caption: post?.caption || '',
    imageUrl: post?.imageUrl || '',
    status: post?.status || 'Draft',
  })
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (post) {
      setFormData({
        date: post.date,
        time: post.time,
        category: post.category,
        caption: post.caption,
        imageUrl: post.imageUrl,
        status: post.status,
      })
    }
  }, [post])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      await onSave(formData)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = () => {
    if (showDeleteConfirm && onDelete) {
      onDelete()
    } else {
      setShowDeleteConfirm(true)
    }
  }

  const statusOptions = [
    { value: 'Draft', label: 'Draft' },
    { value: 'Ready', label: 'Ready' },
    { value: 'Posted', label: 'Posted' },
  ]

  const categoryOptions = categories.map(c => ({ value: c, label: c }))

  return (
    <Modal isOpen onClose={onClose} className="w-full max-w-2xl">
      <form onSubmit={handleSubmit}>
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              {post ? 'Edit Post' : 'New Post'}
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg
                className="w-5 h-5 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <ImagePreview
            imageUrl={formData.imageUrl}
            onImageChange={url => setFormData({ ...formData, imageUrl: url })}
          />

          <CaptionEditor
            value={formData.caption}
            onChange={caption => setFormData({ ...formData, caption })}
          />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date
              </label>
              <Input
                type="date"
                value={formData.date}
                onChange={e => setFormData({ ...formData, date: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Time
              </label>
              <Input
                type="time"
                value={formData.time}
                onChange={e => setFormData({ ...formData, time: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <Select
                options={categoryOptions}
                value={formData.category}
                onChange={e => setFormData({ ...formData, category: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <Select
                options={statusOptions}
                value={formData.status}
                onChange={e =>
                  setFormData({ ...formData, status: e.target.value as PostStatus })
                }
              />
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 flex items-center justify-between">
          <div>
            {post && onDelete && (
              <Button
                type="button"
                variant="danger"
                onClick={handleDelete}
              >
                {showDeleteConfirm ? 'Confirm Delete' : 'Delete'}
              </Button>
            )}
          </div>
          <div className="flex items-center gap-3">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? 'Saving...' : post ? 'Save Changes' : 'Create Post'}
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  )
}
