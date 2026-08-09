'use client'

import React, { useEffect } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
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
import { RecipeSteps, RecipeStep, Gallery, IngredientsMarker } from '@app/lib/tiptap/nodes'
import { insertStep } from '@app/lib/tiptap/insertStep'
import { testContent } from './content'

import '@app/components/admin/editor.css'

declare global {
  interface Window {
    __editor?: import('@tiptap/react').Editor
  }
}

export default function TestEditorPage() {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({ openOnClick: false, autolink: true }),
      Image,
      Placeholder.configure({ placeholder: 'Начните писать...' }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      RecipeSteps,
      RecipeStep,
      Gallery,
      IngredientsMarker,
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: testContent,
    editorProps: {
      attributes: { class: 'admin-editor__content' },
    },
  })

  useEffect(() => {
    if (editor) {
      window.__editor = editor
      ;(window as any).__addStep = () => {
        insertStep(editor)
      }
      ;(window as any).__addMarker = () => {
        const ed = editor
        ed.chain().focus().insertContent({ type: 'ingredientsMarker' }).run()
        const sel = ed.state.selection
        if (sel.constructor.name === 'NodeSelection') {
          ed.commands.setTextSelection(sel.to)
        }
      }
    }
  }, [editor])

  if (!editor) return null

  return (
    <div style={{ padding: 40, maxWidth: 900, margin: '0 auto' }}>
      <h1>Test editor</h1>
      <div className="overflow-hidden rounded-md border bg-background">
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}
