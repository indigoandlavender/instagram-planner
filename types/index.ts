export interface Brand {
  id: string
  name: string
  slug: string
  color: string
  sheetId: string
  instagram: string
  logoUrl: string
  categories: string[]
}

export interface Post {
  id: string
  date: string // YYYY-MM-DD
  time: string // HH:MM
  category: string
  caption: string
  imageUrl: string
  status: PostStatus
  postedAt: string | null
}

export type PostStatus = 'Draft' | 'Ready' | 'Posted'

export interface PostFormData {
  date: string
  time: string
  category: string
  caption: string
  imageUrl: string
  status: PostStatus
}

export interface CalendarDay {
  date: Date
  isCurrentMonth: boolean
  isToday: boolean
  posts: Post[]
}

export type ViewMode = 'calendar' | 'list'

export interface FilterState {
  category: string | null
  status: PostStatus | null
}
