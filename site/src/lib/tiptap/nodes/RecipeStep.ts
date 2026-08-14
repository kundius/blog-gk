import { Node, mergeAttributes } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'
import { Plugin, PluginKey } from '@tiptap/pm/state'
import { RecipeStepView } from './RecipeStepView'

export const RecipeStep = Node.create({
  name: 'recipeStep',

  group: 'recipeStep',

  content: '(paragraph|heading|image|gallery|bulletList|orderedList|blockquote|codeBlock)+',

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

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey('recipeStepTrailingParagraph'),
        appendTransaction: (_transactions, _oldState, state) => {
          const { doc, tr, schema } = state
          const insertions: number[] = []
          doc.descendants((node, pos) => {
            if (node.type.name !== 'recipeStep') return
            const last = node.lastChild
            if (last && last.type.name !== 'paragraph') {
              insertions.push(pos + node.nodeSize - 1)
            }
          })
          if (!insertions.length) return
          insertions.sort((a, b) => b - a)
          for (const insertPos of insertions) {
            tr.insert(insertPos, schema.nodes.paragraph.create())
          }
          return tr
        },
      }),
    ]
  },
})
