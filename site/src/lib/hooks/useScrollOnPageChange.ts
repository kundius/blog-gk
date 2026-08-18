import { useEffect, useRef } from 'react'

interface Options {
  page: number
  loaded: boolean
  hasContent: boolean
}

export function useScrollOnPageChange({ page, loaded, hasContent }: Options) {
  const targetRef = useRef<HTMLElement | null>(null)
  const didMount = useRef(false)
  const prevPage = useRef(page)
  const pendingScroll = useRef(false)

  useEffect(() => {
    if (!didMount.current) {
      didMount.current = true
      prevPage.current = page
      return
    }
    if (prevPage.current !== page) {
      prevPage.current = page
      pendingScroll.current = true
    }
  }, [page])

  useEffect(() => {
    if (pendingScroll.current && loaded && hasContent) {
      pendingScroll.current = false
      targetRef.current?.scrollIntoView({ block: 'start', behavior: 'smooth' })
    }
  }, [page, loaded, hasContent])

  return targetRef
}