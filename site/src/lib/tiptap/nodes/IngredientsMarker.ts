import { Node, mergeAttributes } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'
import { IngredientsMarkerView } from './IngredientsMarkerView'

export const IngredientsMarker = Node.create({
  name: 'ingredientsMarker',

  group: 'block',

  atom: true,

  selectable: true,

  parseHTML() {
    return [{ tag: 'div[data-ingredients]' }]
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-ingredients': 'true' })]
  },

  addNodeView() {
    return ReactNodeViewRenderer(IngredientsMarkerView, {
      trackNodeViewPosition: true,
      stopEvent: ({ event }) => {
        const target = event.target
        if (target instanceof Element && target.closest('button')) return true
        return false
      },
    })
  },
})
