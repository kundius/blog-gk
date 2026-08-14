import { Node, mergeAttributes } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'
import { TextSelection } from '@tiptap/pm/state'
import { RecipeStepsView } from './RecipeStepsView'
import { findFirstNode } from './helpers'

const findRecipeSteps = (doc: any) => findFirstNode(doc, 'recipeSteps')

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    insertRecipeSteps: {
      insertRecipeSteps: () => ReturnType
    }
  }
}

export const RecipeSteps = Node.create({
  name: 'recipeSteps',

  group: 'block',

  content: 'recipeStep+',

  defining: true,

  draggable: true,

  parseHTML() {
    return [
      {
        tag: 'section.recipe-steps',
        contentElement: '.recipe-steps__content',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'section',
      mergeAttributes(HTMLAttributes, { class: 'recipe-steps' }),
      ['h2', { class: 'recipe-steps__title' }, 'Пошаговое приготовление'],
      ['div', { class: 'recipe-steps__content' }, 0],
    ]
  },

  addNodeView() {
    return ReactNodeViewRenderer(RecipeStepsView, {
      contentDOMElementTag: 'div',
      trackNodeViewPosition: true,
    })
  },

  addCommands() {
    return {
      insertRecipeSteps:
        () =>
        ({ state, tr, dispatch }) => {
          const schema = state.schema
          if (findRecipeSteps(state.doc) !== null) return false

          const newStep = schema.nodes.recipeStep.create(
            null,
            schema.nodes.paragraph.create(),
          )
          const block = schema.nodes.recipeSteps.create(null, newStep)
          const { from } = state.selection
          const insertAt = Math.min(from, tr.doc.content.size)
          tr.insert(insertAt, block)
          tr.setSelection(TextSelection.near(tr.doc.resolve(insertAt + 2), 1))
          tr.scrollIntoView()
          return dispatch?.(tr) ?? true
        },
    }
  },
})
