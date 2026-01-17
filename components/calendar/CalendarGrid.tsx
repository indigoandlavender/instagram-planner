'use client'

import { useState } from 'react'
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { Post } from '@/types'
import { getCalendarDays, formatDate } from '@/lib/utils'
import { CalendarDay } from './CalendarDay'
import { PostThumbnail } from './PostThumbnail'

interface CalendarGridProps {
  date: Date
  posts: Post[]
  onDayClick: (date: Date) => void
  onPostClick: (post: Post) => void
  onDateChange: (postId: string, newDate: string) => void
}

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export function CalendarGrid({
  date,
  posts,
  onDayClick,
  onPostClick,
  onDateChange,
}: CalendarGridProps) {
  const [activePost, setActivePost] = useState<Post | null>(null)
  const days = getCalendarDays(date, posts)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  )

  const handleDragStart = (event: DragStartEvent) => {
    const post = posts.find(p => p.id === event.active.id)
    if (post) {
      setActivePost(post)
    }
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const newDate = over.id as string
      onDateChange(active.id as string, newDate)
    }

    setActivePost(null)
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="grid grid-cols-7 border-b border-gray-200">
          {WEEKDAYS.map(day => (
            <div
              key={day}
              className="px-2 py-3 text-center text-sm font-medium text-gray-500"
            >
              {day}
            </div>
          ))}
        </div>

        <div className="calendar-grid">
          {days.map(day => (
            <CalendarDay
              key={formatDate(day.date)}
              day={day}
              onDayClick={onDayClick}
              onPostClick={onPostClick}
            />
          ))}
        </div>
      </div>

      <DragOverlay>
        {activePost && (
          <div className="opacity-90 transform scale-105">
            <PostThumbnail post={activePost} isDragging />
          </div>
        )}
      </DragOverlay>
    </DndContext>
  )
}
