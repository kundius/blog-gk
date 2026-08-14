'use client'

import { useState } from 'react'
import {
  NodeViewWrapper,
  NodeViewContent,
  type NodeViewProps,
} from '@tiptap/react'
import { ImagePlus } from 'lucide-react'
import { BlockToolbar } from '@app/lib/tiptap/components/BlockToolbar'
import { MediaPicker } from '@components/admin/MediaPicker'
import type { FileRecord } from '@app/lib/admin/types'

export function GalleryView({ editor, deleteNode, getPos }: NodeViewProps) {
  const [pickerOpen, setPickerOpen] = useState(false)

  const addImages = (files: FileRecord[]) => {
    const ok = files.filter((f) => f.filenameDisk)
    if (!ok.length) return
    const pos = getPos()
    if (typeof pos !== 'number') return
    const { state, dispatch } = editor.view
    const galleryNode = state.doc.nodeAt(pos)
    if (!galleryNode) return
    const insertAt = pos + galleryNode.nodeSize - 1
    const nodes = ok.map((f) =>
      state.schema.nodes.galleryImage.create({ src: `/files/${f.filenameDisk}` }),
    )
    dispatch(state.tr.insert(insertAt, nodes).scrollIntoView())
    editor.commands.focus()
  }

  return (
    <NodeViewWrapper as="section" className="gallery">
      <header className="gallery__header" contentEditable={false}>
        <h2 className="gallery__title">Фотогалерея</h2>
        <BlockToolbar onDelete={deleteNode}>
          <button
            type="button"
            title="Добавить фото"
            className="block-toolbar__add"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => setPickerOpen(true)}
          >
            <ImagePlus />
            <span>Добавить фото</span>
          </button>
        </BlockToolbar>
      </header>
      <div className="gallery__body">
        <NodeViewContent className="gallery__grid" />
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
