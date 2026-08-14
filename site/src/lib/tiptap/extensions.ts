import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import Placeholder from '@tiptap/extension-placeholder'
import TextAlign from '@tiptap/extension-text-align'
import { Table } from '@tiptap/extension-table'
import { TableRow } from '@tiptap/extension-table-row'
import { TableHeader } from '@tiptap/extension-table-header'
import { TableCell } from '@tiptap/extension-table-cell'
import { RecipeSteps, RecipeStep, IngredientsMarker, Gallery, GalleryImage } from './nodes'

export function buildEditorExtensions() {
  return [
    StarterKit.configure({
      dropcursor: { color: '#2563eb', width: 2 },
    }),
    Underline,
    Link.configure({ openOnClick: false, autolink: true }),
    Placeholder.configure({
      includeChildren: true,
      showOnlyCurrent: false,
      placeholder: ({ editor, node }) => {
        const first = editor.state.doc.firstChild
        return first && first.eq(node)
          ? 'Начните здесь…'
          : 'Продолжите здесь…'
      },
    }),
    TextAlign.configure({ types: ['heading', 'paragraph'] }),
    Table.configure({ resizable: true }),
    TableRow,
    TableHeader,
    TableCell,
    RecipeSteps,
    RecipeStep,
    IngredientsMarker,
    Gallery,
    GalleryImage,
    Image,
  ]
}
