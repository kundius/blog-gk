import { Mark, mergeAttributes } from '@tiptap/core'

export interface SeoKeywordOptions {
  HTMLAttributes: Record<string, unknown>
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    seoKeyword: {
      setSeoKeyword: () => ReturnType
      unsetSeoKeyword: () => ReturnType
      toggleSeoKeyword: () => ReturnType
    }
  }
}

export const SeoKeyword = Mark.create<SeoKeywordOptions>({
  name: 'seoKeyword',

  addOptions() {
    return {
      HTMLAttributes: {},
    }
  },

  parseHTML() {
    return [{ tag: 'ins.seo-keyword' }]
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'ins',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        class: 'seo-keyword',
      }),
    ]
  },

  addCommands() {
    return {
      setSeoKeyword:
        () =>
        ({ commands }) =>
          commands.setMark(this.name),
      unsetSeoKeyword:
        () =>
        ({ commands }) =>
          commands.unsetMark(this.name),
      toggleSeoKeyword:
        () =>
        ({ commands }) =>
          commands.toggleMark(this.name),
    }
  },
})