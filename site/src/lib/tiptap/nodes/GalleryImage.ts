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
      alt: { default: '' },
    }
  },

  parseHTML() {
    return [{ tag: 'img.gallery-image__img' }]
  },

  renderHTML({ HTMLAttributes }) {
    return ['img', mergeAttributes(HTMLAttributes, { class: 'gallery-image__img' })]
  },

  addNodeView() {
    return ReactNodeViewRenderer(GalleryImageView, {
      trackNodeViewPosition: true,
    })
  },
})