import React, { useState, useEffect, useRef } from 'react'
import { usePopper } from 'react-popper'
import { Placement } from '@popperjs/core'
import ReactDOM from 'react-dom'
import { useTimeout } from 'rooks'

import cssStyles from './styles.module.css'

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

const calculateOffset = (size): [number, number] => {
  if (size === 's') {
    return [-8, 8]
  }
  if (size === 'l') {
    return [-24, 24]
  }
  if (size === 'm') {
    return [-16, 16]
  }
  return [-16, 16]
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
  const [referenceElement, setReferenceElement] = useState<HandleType | null>(null)
  const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(null)
  const [arrowElement, setArrowElement] = useState<HTMLDivElement | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const { styles, attributes, forceUpdate } = usePopper(referenceElement, popperElement, {
    placement: placement,
    modifiers: [{
      name: 'offset',
      options: {
        offset: calculateOffset(size)
      }
    }, {
      name: 'flip'
    }, {
      name: 'arrow',
      options: { element: arrowElement }
    }]
  })

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

  useEffect(() => {
    if (isOpen) {
      // обновить позицию при открытии
      forceUpdate?.()
      // старый добрый костыль, дождемся завершения клика изменившего isOpen
      setTimeout(addOutsideClickListener)
    }
    return removeOutsideClickListener
  }, [isOpen])

  function show () {
    setIsOpen(true)
  }

  function hide () {
    setIsOpen(false)
  }

  function toggle () {
    setIsOpen(prev => !prev)
  }

  const outsideClickListener = (e: MouseEvent) => {
    if (
      popperElement &&
      !popperElement.contains(e.target as Node) &&
      isVisible(popperElement) &&
      referenceElement &&
      !referenceElement.contains(e.target as Node) &&
      referenceElement !== e.target
    ) {
      hide()
    }
  }

  const removeOutsideClickListener = () => {
    document.removeEventListener('click', outsideClickListener)
  }

  const addOutsideClickListener = () => {
    document.addEventListener('click', outsideClickListener)
  }

  const api: RenderFunctionArgs<HandleType> = {
    referenceElement,
    setReferenceElement,
    hoverListeners,
    clickListeners,
    show,
    hide,
    toggle
  }

  const html = (
    <div
      className={`
        ${cssStyles.Wrapper}
        ${isOpen ? cssStyles.WrapperIsOpen : ''}
        ${size === 's' ? cssStyles.WrapperSmall : ''}
        ${size === 'm' ? cssStyles.WrapperMedium : ''}
        ${size === 'l' ? cssStyles.WrapperLarge : ''}
      `}
      ref={setPopperElement}
      style={{
        ...styles.popper,
        ...wrapperStyle
      }}
      {...attributes.popper}
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
      <div className={cssStyles.Arrow} ref={setArrowElement} style={styles.arrow} />
    </div>
  )

  return (
    <>
      {children(api)}
      {!usePortal && html}
      {(typeof document !== 'undefined' && usePortal) && ReactDOM.createPortal(html, document.body)}
    </>
  )
}
