import { Node, mergeAttributes } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'
import { GalleryImageView } from './GalleryImageView'

export const GalleryImage = Node.create({
  name: 'galleryImage',

  group: 'galleryImage',

  atom: true,

  draggable: true,

  addAttributes() {
    return {
      src: { default: null },
    }
  },

  parseHTML() {
    return [
      { tag: 'img[data-gallery-image]', priority: 1000 },
      { tag: 'figure.gallery img', priority: 1000 },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['img', mergeAttributes(HTMLAttributes, { 'data-gallery-image': 'true' })]
  },

  addNodeView() {
    return ReactNodeViewRenderer(GalleryImageView, {
      trackNodeViewPosition: true,
    })
  },
})
