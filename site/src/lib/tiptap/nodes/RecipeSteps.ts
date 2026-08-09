import { Node, mergeAttributes } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'
import { TextSelection } from '@tiptap/pm/state'
import { RecipeStepsView } from './RecipeStepsView'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    recipeSteps: {
      exitRecipeSteps: () => ReturnType
    }
  }
}

export const RecipeSteps = Node.create({
  name: 'recipeSteps',

  group: 'block',

  content: 'recipeStep+',

  defining: true,

  addAttributes() {
    return {
      title: {
        default: 'Пошаговое приготовление',
        renderHTML: () => ({}),
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'section.recipe-steps',
        contentElement: '.recipe-steps__content',
        getAttrs: (el) => {
          if (typeof el === 'string') return {}
          const heading = el.querySelector('.recipe-steps__title')
          return { title: heading?.textContent?.trim() || null }
        },
      },
    ]
  },

  renderHTML({ node, HTMLAttributes }) {
    return [
      'section',
      mergeAttributes(HTMLAttributes, { class: 'recipe-steps' }),
      ['h2', { class: 'recipe-steps__title' }, node.attrs.title || ''],
      ['div', { class: 'recipe-steps__content' }, 0],
    ]
  },

  addCommands() {
    return {
      exitRecipeSteps:
        () =>
        ({ tr, state, dispatch }) => {
          const { selection } = state
          const { $from } = selection
          let depth = -1
          for (let d = $from.depth; d > 0; d--) {
            if ($from.node(d).type.name === 'recipeSteps') {
              depth = d
              break
            }
          }
          if (depth < 0) return false
          const start = $from.before(depth)
          const end = start + $from.node(depth).nodeSize
          const paragraph = state.schema.nodes.paragraph.create()
          tr.insert(end, paragraph)
          tr.setSelection(TextSelection.near(tr.doc.resolve(end + 1), 1))
          if (dispatch) dispatch(tr.scrollIntoView())
          return true
        },
    }
  },

  addNodeView() {
    return ReactNodeViewRenderer(RecipeStepsView, {
      contentDOMElementTag: 'div',
      stopEvent: ({ event }) => {
        const target = event.target
        if (target instanceof Element && target.closest('button, input')) return true
        return false
      },
    })
  },
})
