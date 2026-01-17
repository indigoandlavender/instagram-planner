'use client'

import { useDraggable } from '@dnd-kit/core'
import { Post } from '@/types'
import { PostThumbnail } from './PostThumbnail'
import { cn } from '@/lib/utils'

interface DraggablePostProps {
  post: Post
  onClick: () => void
}

export function DraggablePost({ post, onClick }: DraggablePostProps) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: post.id,
  })

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      onClick={e => {
        e.stopPropagation()
        onClick()
      }}
      className={cn('post-item cursor-grab active:cursor-grabbing', {
        'opacity-50': isDragging,
      })}
    >
      <PostThumbnail post={post} />
    </div>
  )
}
