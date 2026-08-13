import { Node, mergeAttributes } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'
import { RecipeStepView } from './RecipeStepView'

export const RecipeStep = Node.create({
  name: 'recipeStep',

  group: 'recipeStep',

  content: '(paragraph|heading|image|bulletList|orderedList|blockquote|codeBlock)+',

  defining: true,

  draggable: true,

  parseHTML() {
    return [
      {
        tag: 'div.recipe-step',
        contentElement: '.recipe-step__body',
      },
    ]
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
      trackNodeViewPosition: true,
    })
  },
})
