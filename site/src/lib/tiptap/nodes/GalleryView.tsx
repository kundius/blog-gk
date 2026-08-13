'use client'

import React, { useEffect, useRef, useState } from 'react'
import {
  NodeViewWrapper,
  NodeViewContent,
  type NodeViewProps,
} from '@tiptap/react'
import { ImagePlus } from 'lucide-react'
import { MediaPicker } from '@components/admin/MediaPicker'
import type { FileRecord } from '@app/lib/admin/types'
import { fileUrl } from '@app/api/images'

export function GalleryView({ node, getPos, editor }: NodeViewProps) {
  const [pickerOpen, setPickerOpen] = useState(false)
  const [placeholder, setPlaceholder] = useState<{ left: number; top: number } | null>(null)
  const wrapperRef = useRef<HTMLElement | null>(null)
  const getPosRef = useRef(getPos)
  getPosRef.current = getPos

  useEffect(() => {
    const wrapper = wrapperRef.current
    if (!wrapper) return
    const onMouseDown = (e: MouseEvent) => {
      if (e.button !== 0) return
      const target = e.target as HTMLElement
      const content = wrapper.querySelector('[data-node-view-content]')
      if (content && content.contains(target)) return
      if (target.closest && target.closest('button')) return
      const pos = getPosRef.current()
      if (pos != null) {
        editor.commands.setNodeSelection(pos)
        editor.commands.focus()
      }
    }
    wrapper.addEventListener('mousedown', onMouseDown)
    return () => wrapper.removeEventListener('mousedown', onMouseDown)
  }, [editor])

  const addImages = (files: FileRecord[]) => {
    const pos = getPos()
    if (typeof pos !== 'number') return

    const content = files
      .filter((f) => f.filenameDisk)
      .map((f) => ({
        type: 'galleryImage',
        attrs: { src: fileUrl(f.filenameDisk) },
      }))
    if (!content.length) return

    editor
      .chain()
      .focus()
      .insertContentAt(pos + node.nodeSize - 1, content)
      .run()
  }

  const isGalleryImageDrag = () =>
    editor.view.dragging?.slice.content.firstChild?.type.name === 'galleryImage'

  const handleDragOver = (e: React.DragEvent<HTMLElement>) => {
    if (!isGalleryImageDrag()) return
    e.preventDefault()

    const wrapper = wrapperRef.current
    const pos = editor.view.posAtCoords({ left: e.clientX, top: e.clientY })
    if (!wrapper || !pos) return

    const $pos = editor.view.state.doc.resolve(pos.pos)
    const before = $pos.nodeBefore
    const after = $pos.nodeAfter
    if (before?.type.name !== 'galleryImage' && after?.type.name !== 'galleryImage') return

    const wrapperRect = wrapper.getBoundingClientRect()
    let left: number | null = null
    let top: number | null = null

    if (before) {
      const el = editor.view.nodeDOM(pos.pos - before.nodeSize)
      if (el instanceof Element) {
        const r = el.getBoundingClientRect()
        left = r.right
        top = r.top
      }
    } else if (after) {
      const el = editor.view.nodeDOM(pos.pos)
      if (el instanceof Element) {
        const r = el.getBoundingClientRect()
        left = r.left
        top = r.top
      }
    }

    if (left == null || top == null) return
    setPlaceholder({ left: left - wrapperRect.left, top: top - wrapperRect.top })
  }

  const clearPlaceholder = () => setPlaceholder(null)

  const handleDragLeave = (e: React.DragEvent<HTMLElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node | null)) clearPlaceholder()
  }

  return (
    <NodeViewWrapper
      ref={wrapperRef}
      as="figure"
      className="gallery"
      data-gallery
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={clearPlaceholder}
      onDragEnd={clearPlaceholder}
    >
      <div className="gallery__grid">
        <NodeViewContent className="gallery__images" />
        <div
          role="button"
          tabIndex={0}
          className="gallery__add"
          title="Добавить фото (перетащите, чтобы переместить галерею)"
          draggable
          data-drag-handle
          onClick={() => setPickerOpen(true)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              setPickerOpen(true)
            }
          }}
        >
          <ImagePlus className="size-5" />
          <span>Добавить фото</span>
        </div>
      </div>
      {placeholder && (
        <div
          className="gallery-image__placeholder"
          style={{ left: placeholder.left, top: placeholder.top }}
        />
      )}
      <MediaPicker
        open={pickerOpen}
        onOpenChange={setPickerOpen}
        multiple
        onConfirm={addImages}
      />
    </NodeViewWrapper>
  )
}
