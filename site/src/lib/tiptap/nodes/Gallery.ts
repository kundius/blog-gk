import { Node } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'
import { GalleryView } from './GalleryView'

export interface GalleryImageFile {
  filenameDisk?: string | null
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    insertGallery: {
      insertGallery: (files: ReadonlyArray<GalleryImageFile> | undefined) => ReturnType
    }
  }
}

export const Gallery = Node.create({
  name: 'gallery',

  group: 'block',

  content: 'galleryImage+',

  defining: true,

  draggable: true,

  parseHTML() {
    return [{ tag: 'div.gallery' }]
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', HTMLAttributes, 0]
  },

  addNodeView() {
    return ReactNodeViewRenderer(GalleryView, {
      contentDOMElementTag: 'div',
      trackNodeViewPosition: true,
    })
  },

  addCommands() {
    return {
      insertGallery:
        (files) =>
        ({ commands }) => {
          const content = files?.filter((f) => f.filenameDisk) ?? []
          if (!content.length) return false
          const mapped = content.map((f) => ({
            type: 'galleryImage',
            attrs: { src: `/files/${f.filenameDisk}` },
          }))
          return commands.insertContent({ type: 'gallery', content: mapped })
        },
    }
  },
})
