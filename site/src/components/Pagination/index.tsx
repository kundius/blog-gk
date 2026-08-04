import {
  default as RcPagination,
  PaginationProps as RcPaginationProps
} from 'rc-pagination'

export type PaginationProps = RcPaginationProps

export function Pagination({ ...props }: PaginationProps) {
  return <RcPagination {...props} />
}
