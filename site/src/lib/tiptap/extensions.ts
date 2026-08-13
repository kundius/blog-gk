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
import { RecipeSteps, RecipeStep, Gallery, GalleryImage, IngredientsMarker } from './nodes'

export function buildEditorExtensions(placeholder = 'Начните писать...') {
  return [
    StarterKit.configure({
      dropcursor: { color: '#2563eb', width: 2 },
    }),
    Underline,
    Link.configure({ openOnClick: false, autolink: true }),
    Image,
    Placeholder.configure({ placeholder }),
    TextAlign.configure({ types: ['heading', 'paragraph'] }),
    Table.configure({ resizable: true }),
    TableRow,
    TableHeader,
    TableCell,
    RecipeSteps,
    RecipeStep,
    Gallery,
    GalleryImage,
    IngredientsMarker,
  ]
}
