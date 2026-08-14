import { Node, mergeAttributes } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'
import { TextSelection } from '@tiptap/pm/state'
import { IngredientsMarkerView } from './IngredientsMarkerView'
import { docHasNode, findFirstNode } from './helpers'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    insertIngredientsMarker: {
      insertIngredientsMarker: () => ReturnType
    }
  }
}

export const IngredientsMarker = Node.create({
  name: 'ingredientsMarker',

  group: 'block',

  atom: true,

  draggable: true,

  parseHTML() {
    return [{ tag: 'div[data-ingredients]' }]
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-ingredients': 'true' })]
  },

  addNodeView() {
    return ReactNodeViewRenderer(IngredientsMarkerView, {
      trackNodeViewPosition: true,
    })
  },

  addCommands() {
    return {
      insertIngredientsMarker:
        () =>
        ({ state, tr, dispatch }) => {
          const schema = state.schema
          if (docHasNode(state.doc, 'ingredientsMarker')) return false

          const { from } = state.selection
          const $pos = state.doc.resolve(from)
          let topLevelOfContainer: number | null = null
          for (let d = $pos.depth; d >= 0; d--) {
            if ($pos.node(d).type.name === 'recipeSteps') {
              topLevelOfContainer = $pos.before(d)
              break
            }
          }

          const marker = schema.nodes.ingredientsMarker.create()
          let insertAt: number

          if (topLevelOfContainer !== null) {
            const container = state.doc.nodeAt(topLevelOfContainer)
            if (!container) return false
            insertAt = topLevelOfContainer + 1
          } else {
            const globalAt = docHasNode(state.doc, 'recipeSteps')
              ? findFirstNode(state.doc, 'recipeSteps') ?? from
              : from
            insertAt = globalAt
          }

          tr.insert(insertAt, marker)
          tr.setSelection(
            TextSelection.near(tr.doc.resolve(insertAt + 1), 1),
          )
          tr.scrollIntoView()
          return dispatch?.(tr) ?? true
        },
    }
  },
})
