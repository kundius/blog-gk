import { Node, mergeAttributes } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'
import { GalleryView } from './GalleryView'

export const Gallery = Node.create({
  name: 'gallery',

  group: 'block',

  content: 'galleryImage*',

  defining: true,

  draggable: true,

  extendNodeSchema() {
    return { disableDropCursor: true }
  },

  parseHTML() {
    return [{ tag: 'figure.gallery' }]
  },

  renderHTML({ HTMLAttributes }) {
    return ['figure', mergeAttributes(HTMLAttributes, { class: 'gallery' }), 0]
  },

  addNodeView() {
    return ReactNodeViewRenderer(GalleryView, {
      contentDOMElementTag: 'div',
    })
  },
})
