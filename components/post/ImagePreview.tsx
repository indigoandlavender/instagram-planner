'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/Input'
import Image from 'next/image'

interface ImagePreviewProps {
  imageUrl: string
  onImageChange: (url: string) => void
}

export function ImagePreview({ imageUrl, onImageChange }: ImagePreviewProps) {
  const [showUrlInput, setShowUrlInput] = useState(!imageUrl)
  const [urlInput, setUrlInput] = useState(imageUrl)
  const [imageError, setImageError] = useState(false)

  const handleUrlSubmit = () => {
    if (urlInput.trim()) {
      onImageChange(urlInput.trim())
      setShowUrlInput(false)
      setImageError(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleUrlSubmit()
    }
  }

  const handleImageError = () => {
    setImageError(true)
  }

  const handleChangeImage = () => {
    setShowUrlInput(true)
    setUrlInput(imageUrl)
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Image
      </label>

      {showUrlInput || !imageUrl ? (
        <div className="space-y-2">
          <div className="flex gap-2">
            <Input
              type="url"
              value={urlInput}
              onChange={e => setUrlInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Paste image URL..."
              className="flex-1"
            />
            <button
              type="button"
              onClick={handleUrlSubmit}
              className="px-4 py-2 bg-brand text-white rounded-lg text-sm hover:opacity-90 transition-colors"
            >
              Add
            </button>
          </div>
          <p className="text-xs text-gray-500">
            Paste a direct link to an image (e.g., from Google Drive, Dropbox, or any image host)
          </p>
        </div>
      ) : (
        <div className="relative group">
          <div className="relative aspect-square max-w-xs rounded-lg overflow-hidden bg-gray-100">
            {imageError ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
                <svg
                  className="w-12 h-12 mb-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                <span className="text-sm">Failed to load image</span>
              </div>
            ) : (
              <Image
                src={imageUrl}
                alt="Post preview"
                fill
                className="object-cover"
                onError={handleImageError}
              />
            )}
          </div>
          <button
            type="button"
            onClick={handleChangeImage}
            className="absolute top-2 right-2 p-2 bg-black/50 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
              />
            </svg>
          </button>
        </div>
      )}
    </div>
  )
}
