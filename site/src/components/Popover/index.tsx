import React, { useState, useEffect, useRef } from 'react'
import { useFloating, useDismiss, useRole, useInteractions, autoUpdate, offset as fuiOffset, flip, shift, arrow, FloatingPortal } from '@floating-ui/react'
import { Placement } from '@floating-ui/react'

import cssStyles from './styles.module.css'

interface TimeoutController {
  start: () => void
  clear: () => void
}

function useTimeout (fn: Function, delay: number): TimeoutController {
  const fnRef = useRef(fn)
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  useEffect(() => {
    fnRef.current = fn
  }, [fn])

  const clear = () => {
    if (timerRef.current !== undefined) {
      clearTimeout(timerRef.current)
      timerRef.current = undefined
    }
  }

  const start = () => {
    clear()
    timerRef.current = setTimeout(() => {
      fnRef.current()
    }, delay)
  }

  useEffect(() => () => clear(), [])

  return { start, clear }
}

export interface RenderFunctionArgs<HandleType> {
  referenceElement: HandleType | null
  setReferenceElement: (el: HandleType | null) => void
  hoverListeners: Pick<React.DOMAttributes<HandleType>, 'onMouseEnter' | 'onMouseLeave'>,
  clickListeners: Pick<React.DOMAttributes<HandleType>, 'onClick'>,
  show: Function
  hide: Function
  toggle: Function
}

export type RenderFunction<HandleType> = (api: RenderFunctionArgs<HandleType>) => React.ReactElement

export interface PopoverProps<HandleType> {
  children: RenderFunction<HandleType>
  title?: RenderFunction<HandleType> | string | React.ReactNode
  content?: RenderFunction<HandleType> | string | React.ReactNode
  showClose?: boolean
  usePortal?: boolean
  placement?: Placement
  size?: 's' | 'm' | 'l'
  wrapperStyle?: React.CSSProperties
}

const isVisible = (el: HTMLElement) => !!el && !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length)

const calculateOffset = (size): number => {
  if (size === 's') {
    return 8
  }
  if (size === 'l') {
    return 24
  }
  return 16
}

export function Popover<HandleType extends HTMLElement> ({
  children,
  title,
  content,
  showClose,
  usePortal = true,
  placement = 'bottom',
  size = 'm',
  wrapperStyle = {}
}: PopoverProps<HandleType>) {
  const showTimeout = useTimeout(show, 300)
  const hideTimeout = useTimeout(hide, 200)
  const [clamp, setClamp] = useState(true)
  const [isOpen, setIsOpen] = useState(false)
  const arrowRef = useRef<HTMLDivElement | null>(null)

  const { x, y, strategy, refs, context, middlewareData } = useFloating<HandleType>({
    placement,
    open: isOpen,
    onOpenChange: setIsOpen,
    middleware: [
      fuiOffset(calculateOffset(size)),
      flip(),
      shift(),
      arrow({ element: arrowRef })
    ],
    whileElementsMounted: autoUpdate
  })

  const dismiss = useDismiss(context)
  const role = useRole(context, { role: 'tooltip' })

  const { getReferenceProps, getFloatingProps } = useInteractions([dismiss, role])

  function show () {
    setIsOpen(true)
  }

  function hide () {
    setIsOpen(false)
  }

  function toggle () {
    setIsOpen(prev => !prev)
  }

  const setReferenceElement = (el: HandleType | null) => {
    refs.setReference(el)
  }

  const hoverListeners = {
    onMouseEnter: () => {
      hideTimeout.clear()
      showTimeout.start()
      setClamp(false)
    },
    onMouseLeave: () => {
      showTimeout.clear()
      hideTimeout.start()
      setClamp(false)
    }
  }

  const clickListeners = {
    onClick: () => {
      toggle()
      setClamp(true)
    }
  }

  useEffect(() => {
    if (isOpen) {
      setClamp(false)
    }
  }, [isOpen])

  const wrapperListeners = {
    onMouseEnter: () => {
      if (clamp) return
      hideTimeout.clear()
      show()
    },
    onMouseLeave: () => {
      if (clamp) return
      hideTimeout.start()
    }
  }

  const api: RenderFunctionArgs<HandleType> = {
    referenceElement: refs.reference as unknown as HandleType | null,
    setReferenceElement,
    hoverListeners,
    clickListeners,
    show,
    hide,
    toggle
  }

  const arrowVisible = !!middlewareData.arrow

  const html = (
    <div
      className={`
        ${cssStyles.Wrapper}
        ${isOpen ? cssStyles.WrapperIsOpen : ''}
        ${size === 's' ? cssStyles.WrapperSmall : ''}
        ${size === 'm' ? cssStyles.WrapperMedium : ''}
        ${size === 'l' ? cssStyles.WrapperLarge : ''}
      `}
      ref={refs.setFloating}
      style={{
        position: strategy,
        top: y ?? 0,
        left: x ?? 0,
        ...wrapperStyle
      }}
      {...getFloatingProps()}
      {...wrapperListeners}
    >
      {((typeof showClose === 'undefined' && clamp) || showClose) && (
        <button className={cssStyles.Close} onClick={hide} />
      )}
      {title && (
        <div className={cssStyles.Title}>{typeof title === 'function' ? title(api) : title}</div>
      )}
      {content && (
        <div className={cssStyles.Content}>{typeof content === 'function' ? content(api) : content}</div>
      )}
      <div
        className={cssStyles.Arrow}
        ref={arrowRef}
        style={{
          left: middlewareData.arrow?.x ?? '',
          visibility: arrowVisible ? 'visible' : 'hidden'
        }}
      />
    </div>
  )

  return (
    <>
      {children(api)}
      {!usePortal && html}
      {typeof document !== 'undefined' && usePortal && (
        <FloatingPortal>{html}</FloatingPortal>
      )}
    </>
  )
}
