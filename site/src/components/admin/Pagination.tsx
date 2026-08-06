'use client'

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@components/ui/pagination'

type PageItem = number | 'ellipsis-start' | 'ellipsis-end'

function getPageItems(current: number, total: number): PageItem[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }
  const items: PageItem[] = [1]
  const start = Math.max(2, current - 1)
  const end = Math.min(total - 1, current + 1)
  if (start > 2) items.push('ellipsis-start')
  for (let p = start; p <= end; p++) items.push(p)
  if (end < total - 1) items.push('ellipsis-end')
  items.push(total)
  return items
}

interface PaginationControlsProps {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function PaginationControls({
  page,
  totalPages,
  onPageChange,
}: PaginationControlsProps) {
  if (totalPages <= 1) return null

  const items = getPageItems(page, totalPages)

  return (
    <div className="mt-4 flex justify-center">
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              text="Назад"
              onClick={() => onPageChange(Math.max(1, page - 1))}
              disabled={page === 1}
            />
          </PaginationItem>
          {items.map((item) => {
            if (item === 'ellipsis-start' || item === 'ellipsis-end') {
              return (
                <PaginationItem key={item}>
                  <PaginationEllipsis />
                </PaginationItem>
              )
            }
            return (
              <PaginationItem key={item}>
                <PaginationLink
                  isActive={page === item}
                  onClick={() => onPageChange(item)}
                >
                  {item}
                </PaginationLink>
              </PaginationItem>
            )
          })}
          <PaginationItem>
            <PaginationNext
              text="Вперёд"
              onClick={() => onPageChange(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}
