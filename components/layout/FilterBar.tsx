'use client'

import { ViewMode, FilterState, PostStatus } from '@/types'
import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Select'
import { formatMonthYear, getNextMonth, getPrevMonth } from '@/lib/utils'

interface FilterBarProps {
  viewMode: ViewMode
  onViewModeChange: (mode: ViewMode) => void
  filters: FilterState
  onFiltersChange: (filters: FilterState) => void
  categories: string[]
  onAddPost: () => void
  currentDate: Date
  onDateChange: (date: Date) => void
}

export function FilterBar({
  viewMode,
  onViewModeChange,
  filters,
  onFiltersChange,
  categories,
  onAddPost,
  currentDate,
  onDateChange,
}: FilterBarProps) {
  const statusOptions = [
    { value: 'Draft', label: 'Draft' },
    { value: 'Ready', label: 'Ready' },
    { value: 'Posted', label: 'Posted' },
  ]

  const categoryOptions = categories.map(c => ({ value: c, label: c }))

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center justify-between sm:justify-start gap-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onDateChange(getPrevMonth(currentDate))}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg
                className="w-5 h-5 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 min-w-[140px] sm:min-w-[160px] text-center">
              {formatMonthYear(currentDate)}
            </h2>
            <button
              onClick={() => onDateChange(getNextMonth(currentDate))}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg
                className="w-5 h-5 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
          <button
            onClick={() => onDateChange(new Date())}
            className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Today
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <Select
            options={categoryOptions}
            placeholder="All categories"
            value={filters.category || ''}
            onChange={e =>
              onFiltersChange({
                ...filters,
                category: e.target.value || null,
              })
            }
            className="w-full sm:w-36"
          />

          <Select
            options={statusOptions}
            placeholder="All statuses"
            value={filters.status || ''}
            onChange={e =>
              onFiltersChange({
                ...filters,
                status: (e.target.value as PostStatus) || null,
              })
            }
            className="flex-1 sm:flex-none sm:w-32"
          />

          <div className="hidden md:flex items-center border border-gray-300 rounded-lg overflow-hidden">
            <button
              onClick={() => onViewModeChange('calendar')}
              className={`px-3 py-2 text-sm ${
                viewMode === 'calendar'
                  ? 'bg-brand text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
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
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </button>
            <button
              onClick={() => onViewModeChange('list')}
              className={`px-3 py-2 text-sm ${
                viewMode === 'list'
                  ? 'bg-brand text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
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
                  d="M4 6h16M4 10h16M4 14h16M4 18h16"
                />
              </svg>
            </button>
          </div>

          <Button onClick={onAddPost} className="flex-shrink-0">
            <svg
              className="w-4 h-4 sm:mr-1.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            <span className="hidden sm:inline">Add Post</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
