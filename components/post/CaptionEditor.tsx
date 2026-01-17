'use client'

import { getInstagramCharLimit } from '@/lib/utils'

interface CaptionEditorProps {
  value: string
  onChange: (value: string) => void
}

export function CaptionEditor({ value, onChange }: CaptionEditorProps) {
  const charLimit = getInstagramCharLimit()
  const charCount = value.length
  const isOverLimit = charCount > charLimit

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <label className="block text-sm font-medium text-gray-700">Caption</label>
        <span
          className={`text-xs ${
            isOverLimit ? 'text-red-500' : 'text-gray-500'
          }`}
        >
          {charCount.toLocaleString()} / {charLimit.toLocaleString()}
        </span>
      </div>
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        rows={6}
        className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand resize-none"
        placeholder="Write your caption... Use emojis freely!"
      />
      {isOverLimit && (
        <p className="mt-1 text-xs text-red-500">
          Caption exceeds Instagram&apos;s character limit
        </p>
      )}
    </div>
  )
}
