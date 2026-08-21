import Link from 'next/link'

export interface CategoryPaginationProps {
  alias: string
  current: number
  total: number
  pageSize: number
}

type PageItem =
  | { type: 'page'; value: number }
  | { type: 'jump-prev' }
  | { type: 'jump-next' }

function buildRange(current: number, totalPages: number): PageItem[] {
  const items: PageItem[] = []

  const pushPage = (value: number) => items.push({ type: 'page', value })

  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pushPage(i)
    return items
  }

  pushPage(1)

  const left = Math.max(2, current - 1)
  const right = Math.min(totalPages - 1, current + 1)

  if (left > 2) items.push({ type: 'jump-prev' })
  for (let i = left; i <= right; i++) pushPage(i)
  if (right < totalPages - 1) items.push({ type: 'jump-next' })

  pushPage(totalPages)
  return items
}

function pageHref(alias: string, page: number) {
  return page <= 1 ? `/${alias}` : `/${alias}/page/${page}`
}

export function CategoryPagination({
  alias,
  current,
  total,
  pageSize
}: CategoryPaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize))

  if (totalPages <= 1) return null

  const prevHref = pageHref(alias, current - 1)
  const nextHref = pageHref(alias, current + 1)

  return (
    <ul className="rc-pagination">
      <li
        className="rc-pagination-prev"
        aria-disabled={current <= 1}
      >
        {current > 1 && (
          <Link href={prevHref} aria-label="Previous page" rel="prev" />
        )}
      </li>

      {buildRange(current, totalPages).map((item) => {
        if (item.type === 'jump-prev' || item.type === 'jump-next') {
          return (
            <li key={item.type} className={`rc-pagination-${item.type}`}>
              <span>••••</span>
            </li>
          )
        }

        const isActive = item.value === current

        return (
          <li
            key={item.value}
            title={String(item.value)}
            className={
              isActive
                ? 'rc-pagination-item rc-pagination-item-active'
                : 'rc-pagination-item'
            }
          >
            {isActive ? (
              <a aria-current="page">{item.value}</a>
            ) : (
              <Link href={pageHref(alias, item.value)}>
                {item.value}
              </Link>
            )}
          </li>
        )
      })}

      <li
        className="rc-pagination-next"
        aria-disabled={current >= totalPages}
      >
        {current < totalPages && (
          <Link href={nextHref} aria-label="Next page" rel="next" />
        )}
      </li>
    </ul>
  )
}
