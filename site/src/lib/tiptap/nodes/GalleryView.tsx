'use client'

import React, { useState } from 'react'
import {
  NodeViewWrapper,
  NodeViewContent,
  type NodeViewProps,
} from '@tiptap/react'
import { Trash2, ImagePlus } from 'lucide-react'
import { MediaPicker } from '@components/admin/MediaPicker'
import type { FileRecord } from '@app/lib/admin/types'
import { fileUrl } from '@app/api/images'

export function GalleryView({ node, getPos, editor, deleteNode }: NodeViewProps) {
  const [pickerOpen, setPickerOpen] = useState(false)

  const addImages = (files: FileRecord[]) => {
    const pos = getPos()
    if (typeof pos !== 'number') return

    const content = files
      .filter((f) => f.filenameDisk)
      .map((f) => ({
        type: 'image',
        attrs: { src: fileUrl(f.filenameDisk) },
      }))
    if (!content.length) return

    editor
      .chain()
      .focus()
      .insertContentAt(pos + node.nodeSize - 1, content)
      .run()
  }

  return (
    <NodeViewWrapper as="figure" className="gallery" data-gallery>
      <NodeViewContent className="gallery__images" />
      <div className="gallery__controls" contentEditable={false}>
        <button
          type="button"
          title="Добавить фото"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => setPickerOpen(true)}
        >
          <ImagePlus className="size-4" />
          <span>Фото</span>
        </button>
        <button
          type="button"
          title="Удалить галерею"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => deleteNode()}
        >
          <Trash2 className="size-4" />
        </button>
      </div>
      <MediaPicker
        open={pickerOpen}
        onOpenChange={setPickerOpen}
        multiple
        onConfirm={addImages}
      />
    </NodeViewWrapper>
  )
}
