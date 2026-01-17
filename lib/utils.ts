import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isToday,
  isSameMonth,
  addMonths,
  subMonths,
  parseISO,
} from 'date-fns'
import { CalendarDay, Post } from '@/types'

export function getCalendarDays(date: Date, posts: Post[]): CalendarDay[] {
  const monthStart = startOfMonth(date)
  const monthEnd = endOfMonth(date)
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 }) // Monday
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 })

  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd })

  return days.map(day => {
    const dateStr = format(day, 'yyyy-MM-dd')
    const dayPosts = posts.filter(p => p.date === dateStr)

    return {
      date: day,
      isCurrentMonth: isSameMonth(day, date),
      isToday: isToday(day),
      posts: dayPosts,
    }
  })
}

export function formatDate(date: Date): string {
  return format(date, 'yyyy-MM-dd')
}

export function formatDisplayDate(date: Date): string {
  return format(date, 'MMMM d, yyyy')
}

export function formatMonthYear(date: Date): string {
  return format(date, 'MMMM yyyy')
}

export function parseDate(dateStr: string): Date {
  return parseISO(dateStr)
}

export function getNextMonth(date: Date): Date {
  return addMonths(date, 1)
}

export function getPrevMonth(date: Date): Date {
  return subMonths(date, 1)
}

export function generateId(): string {
  return crypto.randomUUID()
}

export function getInstagramCharLimit(): number {
  return 2200
}

type ClassValue = string | boolean | undefined | null | { [key: string]: boolean | undefined }

export function cn(...inputs: ClassValue[]): string {
  const classes: string[] = []

  for (const input of inputs) {
    if (!input) continue

    if (typeof input === 'string') {
      classes.push(input)
    } else if (typeof input === 'object') {
      for (const [key, value] of Object.entries(input)) {
        if (value) {
          classes.push(key)
        }
      }
    }
  }

  return classes.join(' ')
}
