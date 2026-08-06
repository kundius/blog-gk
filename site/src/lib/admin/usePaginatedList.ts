import { useEffect } from 'react'
import useSWR from 'swr'
import { api, type ListResult } from '@app/lib/admin/client'

export function usePaginatedList<T>(
  key: string | null,
  pageSize: number,
  page: number,
  setPage: (value: number) => void,
) {
  const swr = useSWR<ListResult<T>>(key, () => api.list<T>(key as string), {
    keepPreviousData: true,
  })

  const totalPages = Math.max(1, Math.ceil((swr.data?.meta?.total ?? 0) / pageSize))

  useEffect(() => {
    if (swr.data && page > totalPages) {
      setPage(totalPages)
    }
  }, [swr.data, page, totalPages, setPage])

  return { ...swr, totalPages }
}
