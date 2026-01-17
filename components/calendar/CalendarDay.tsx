'use client'

import { useDroppable } from '@dnd-kit/core'
import { CalendarDay as CalendarDayType } from '@/types'
import { format } from 'date-fns'
import { cn, formatDate } from '@/lib/utils'
import { DraggablePost } from './DraggablePost'
import { Post } from '@/types'

interface CalendarDayProps {
  day: CalendarDayType
  onDayClick: (date: Date) => void
  onPostClick: (post: Post) => void
}

export function CalendarDay({ day, onDayClick, onPostClick }: CalendarDayProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: formatDate(day.date),
  })

  const handleClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.post-item')) return
    onDayClick(day.date)
  }

  return (
    <div
      ref={setNodeRef}
      onClick={handleClick}
      className={cn(
        'calendar-day p-2 cursor-pointer transition-colors relative',
        {
          'bg-gray-50': !day.isCurrentMonth,
          'bg-white': day.isCurrentMonth,
          'ring-2 ring-inset ring-brand': day.isToday,
          'bg-blue-50': isOver,
        }
      )}
    >
      <div
        className={cn(
          'text-sm font-medium mb-1',
          {
            'text-gray-400': !day.isCurrentMonth,
            'text-gray-900': day.isCurrentMonth && !day.isToday,
            'text-brand': day.isToday,
          }
        )}
      >
        {format(day.date, 'd')}
      </div>

      <div className="space-y-1">
        {day.posts.slice(0, 3).map(post => (
          <DraggablePost
            key={post.id}
            post={post}
            onClick={() => onPostClick(post)}
          />
        ))}
        {day.posts.length > 3 && (
          <div className="text-xs text-gray-500 text-center">
            +{day.posts.length - 3} more
          </div>
        )}
      </div>
    </div>
  )
}
