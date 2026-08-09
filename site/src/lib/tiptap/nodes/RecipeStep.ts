import { Node, mergeAttributes } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'
import { TextSelection } from '@tiptap/pm/state'
import { RecipeStepView } from './RecipeStepView'

export const RecipeStep = Node.create({
  name: 'recipeStep',

  group: 'recipeStep',

  content: '(paragraph|heading|image|gallery|bulletList|orderedList|blockquote|codeBlock)+',

  defining: true,

  addKeyboardShortcuts() {
    return {
      Enter: ({ editor }) => {
        const { state, dispatch } = editor.view
        const { selection } = state
        if (!(selection instanceof TextSelection) || !selection.empty) {
          return false
        }

        const $from = selection.$from

        let stepDepth = -1
        for (let d = $from.depth; d > 0; d--) {
          if ($from.node(d).type.name === 'recipeStep') {
            stepDepth = d
            break
          }
        }
        if (stepDepth < 0) return false

        const inDirectTextblock = $from.depth === stepDepth + 1 && $from.parent.isTextblock
        if (!inDirectTextblock) return false

        const tr = state.tr
        tr.split(selection.from, $from.depth - stepDepth)
        tr.setSelection(TextSelection.near(tr.doc.resolve(selection.from + 1), 1))
        dispatch(tr.scrollIntoView())
        return true
      },
    }
  },

  parseHTML() {
    return [{ tag: 'div.recipe-step' }]
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      mergeAttributes(HTMLAttributes, { class: 'recipe-step' }),
      ['span', { class: 'recipe-step__num', 'aria-hidden': 'true' }],
      ['div', { class: 'recipe-step__body' }, 0],
    ]
  },

  addNodeView() {
    return ReactNodeViewRenderer(RecipeStepView, {
      contentDOMElementTag: 'div',
      stopEvent: ({ event }) => {
        const target = event.target
        if (target instanceof Element && target.closest('button')) return true
        return false
      },
    })
  },
})
