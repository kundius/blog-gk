import { Node, mergeAttributes } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'
import { RecipeStepsView } from './RecipeStepsView'

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
})
