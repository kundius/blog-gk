'use client'

import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { createPortal } from 'react-dom'
import { LightboxContext } from './context'
import styles from './styles.module.css'

const DURATION = 320
const EASING = 'cubic-bezier(0.32, 0.72, 0.33, 1)'

interface SavedStyle {
  el: HTMLElement
  prop: string
}

interface SavedAttr {
  el: HTMLImageElement
  attr: string
  value: string | null
}

interface Rect {
  left: number
  top: number
  width: number
  height: number
}

interface ViewerState {
  el: HTMLElement
  rect: Rect
  scale: number
  tx: number
  ty: number
  saved: SavedStyle[]
  savedAttrs: SavedAttr[]
}

function getRect (el: HTMLElement): Rect {
  const r = el.getBoundingClientRect()
  return { left: r.left, top: r.top, width: r.width, height: r.height }
}

function layoutFor (rect: Rect, vw: number, vh: number) {
  return {
    scale: Math.min(vw / rect.width, vh / rect.height),
    tx: vw / 2 - (rect.left + rect.width / 2),
    ty: vh / 2 - (rect.top + rect.height / 2),
  }
}

function parseSrcset (srcset: string): { url: string; width: number }[] {
  return srcset
    .split(',')
    .map((part) => {
      const [url, desc] = part.trim().split(/\s+/)
      const width = parseInt((desc || '').replace('w', ''), 10)
      return { url, width }
    })
    .filter((c) => c.url && c.width > 0)
}

function neutralizeAncestors (el: HTMLElement, saved: SavedStyle[]) {
  const stackProps = ['transform', 'filter', 'perspective']
  let node: HTMLElement | null = el.parentElement
  while (node && node !== document.body) {
    const cs = window.getComputedStyle(node)
    for (const p of stackProps) {
      if (cs.getPropertyValue(p) !== 'none') {
        saved.push({ el: node, prop: p })
        node.style.setProperty(p, 'none')
      }
    }
    if (cs.getPropertyValue('will-change') !== 'auto') {
      saved.push({ el: node, prop: 'will-change' })
      node.style.setProperty('will-change', 'auto')
    }
    if (cs.zIndex !== 'auto') {
      saved.push({ el: node, prop: 'z-index' })
      node.style.setProperty('z-index', 'auto')
    }
    if (cs.overflow !== 'visible') {
      saved.push({ el: node, prop: 'overflow' })
      node.style.setProperty('overflow', 'visible')
    }
    node = node.parentElement
  }
}

export function LightboxProvider ({ children }: { children: React.ReactNode }) {
  const [viewer, setViewer] = useState<ViewerState | null>(null)
  const viewerRef = useRef<ViewerState | null>(null)
  const backdropRef = useRef<HTMLDivElement>(null)
  const closingRef = useRef(false)
  const timerRef = useRef<number | null>(null)

  const restore = useCallback((v: ViewerState) => {
    const styleProps = [
      'position',
      'z-index',
      'transform',
      'transform-origin',
      'border-radius',
      'transition',
    ]
    for (const p of styleProps) v.el.style.removeProperty(p)
    for (const s of v.saved) s.el.style.removeProperty(s.prop)
    for (const a of v.savedAttrs) {
      if (a.value === null) a.el.removeAttribute(a.attr)
      else a.el.setAttribute(a.attr, a.value)
    }
  }, [])

  const close = useCallback(() => {
    const v = viewerRef.current
    if (!v || closingRef.current) return
    closingRef.current = true
    v.el.style.transition = `transform ${DURATION}ms ${EASING}`
    v.el.style.transform = 'none'
    if (backdropRef.current) backdropRef.current.style.opacity = '0'
    if (timerRef.current !== null) window.clearTimeout(timerRef.current)
    timerRef.current = window.setTimeout(() => {
      restore(v)
      viewerRef.current = null
      closingRef.current = false
      setViewer(null)
    }, DURATION)
  }, [restore])

  const open = useCallback((el: HTMLImageElement) => {
    if (viewerRef.current || closingRef.current) return
    const rect = getRect(el)
    if (rect.width === 0 || rect.height === 0) return

    const vw = window.innerWidth
    const vh = window.innerHeight
    const layout = layoutFor(rect, vw, vh)

    const saved: SavedStyle[] = []
    const savedAttrs: SavedAttr[] = []

    const srcset = el.getAttribute('srcset')
    if (srcset) {
      const candidates = parseSrcset(srcset)
      const biggest = candidates.reduce((a, b) => (b.width > a.width ? b : a))
      if (biggest) {
        savedAttrs.push({ el, attr: 'sizes', value: el.getAttribute('sizes') })
        savedAttrs.push({ el, attr: 'srcset', value: srcset })
        savedAttrs.push({ el, attr: 'src', value: el.getAttribute('src') })
        el.sizes = '100vw'
        el.srcset = `${biggest.url} ${biggest.width}w`
        el.src = biggest.url
      }
    }

    neutralizeAncestors(el, saved)

    const cs = window.getComputedStyle(el)
    if (cs.transform !== 'none') {
      saved.push({ el, prop: 'transform' })
      el.style.transform = 'none'
    }
    if (cs.position === 'static') {
      saved.push({ el, prop: 'position' })
      el.style.position = 'relative'
    }
    saved.push({ el, prop: 'transform-origin' })
    el.style.transformOrigin = '50% 50%'
    saved.push({ el, prop: 'z-index' })
    el.style.zIndex = '110'
    saved.push({ el, prop: 'border-radius' })
    el.style.borderRadius = '0'

    el.style.transition = 'none'

    viewerRef.current = { el, rect, ...layout, saved, savedAttrs }
    setViewer(viewerRef.current)
  }, [])

  useEffect(() => {
    if (!viewer) return

    const onScroll = () => {
      if (!viewerRef.current || closingRef.current) return
      close()
    }

    const onResize = () => {
      const cur = viewerRef.current
      if (!cur || closingRef.current) return
      const layout = layoutFor(cur.rect, window.innerWidth, window.innerHeight)
      cur.el.style.transition = 'none'
      cur.el.style.transform = `translate(${layout.tx}px, ${layout.ty}px) scale(${layout.scale})`
    }

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
    }

    const onElClick = () => close()

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize)
    window.addEventListener('keydown', onKey)
    viewer.el.addEventListener('click', onElClick)

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('keydown', onKey)
      viewer.el.removeEventListener('click', onElClick)
    }
  }, [viewer, close])

  useLayoutEffect(() => {
    if (!viewer) return
    void viewer.el.offsetWidth
    viewer.el.style.transition = `transform ${DURATION}ms ${EASING}`
    viewer.el.style.transform = `translate(${viewer.tx}px, ${viewer.ty}px) scale(${viewer.scale})`
    if (backdropRef.current) backdropRef.current.style.opacity = '1'
  }, [viewer])

  useEffect(() => {
    return () => {
      const v = viewerRef.current
      if (v) restore(v)
      if (timerRef.current !== null) window.clearTimeout(timerRef.current)
    }
  }, [restore])

  const value = useMemo(() => ({ open, close }), [open, close])

  const context = (
    <LightboxContext.Provider value={value}>{children}</LightboxContext.Provider>
  )

  return (
    <>
      {context}
      {viewer &&
        createPortal(
          <div
            className={styles.Overlay}
            role="dialog"
            aria-modal="true"
            onClick={close}
          >
            <div ref={backdropRef} className={styles.Backdrop} />
          </div>,
          document.body,
        )}
    </>
  )
}
