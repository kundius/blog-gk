import { Node, mergeAttributes } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'
import { RecipeStepsView } from './RecipeStepsView'

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

  addNodeView() {
    return ReactNodeViewRenderer(RecipeStepsView, {
      contentDOMElementTag: 'div',
      trackNodeViewPosition: true,
      stopEvent: ({ event }) => {
        const target = event.target
        if (target instanceof Element && target.closest('button')) return true
        return false
      },
    })
  },
})
