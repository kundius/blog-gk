'use client'

import React, { useState } from 'react'
import { EditorContent, useEditor, type Editor } from '@tiptap/react'
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
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Code,
  Link as LinkIcon,
  ImagePlus,
  Images,
  UtensilsCrossed,
  ChefHat,
  Table as TableIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Undo2,
  Redo2,
  Minus,
  RemoveFormatting,
  Unlink,
} from 'lucide-react'
import { cn } from '@app/lib/utils'
import { Button } from '@components/ui/button'
import { Input } from '@components/ui/input'
import { Label } from '@components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@components/ui/dialog'
import { MediaPicker } from '@components/admin/MediaPicker'
import type { FileRecord } from '@app/lib/admin/types'
import { NodeSelection } from 'prosemirror-state'
import { RecipeSteps, RecipeStep, Gallery, IngredientsMarker } from '@app/lib/tiptap/nodes'
import { insertStep } from '@app/lib/tiptap/insertStep'

import '@app/components/admin/editor.css'

function ToolbarButton({
  onClick,
  active,
  disabled,
  title,
  children,
}: {
  onClick: () => void
  active?: boolean
  disabled?: boolean
  title?: string
  children: React.ReactNode
}) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      title={title}
      onClick={onClick}
      disabled={disabled}
      className={cn('h-8 w-8', active && 'bg-muted text-foreground')}
    >
      {children}
    </Button>
  )
}

function ToolbarTextButton({
  onClick,
  active,
  disabled,
  title,
  children,
}: {
  onClick: () => void
  active?: boolean
  disabled?: boolean
  title?: string
  children: React.ReactNode
}) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      title={title}
      onClick={onClick}
      disabled={disabled}
      className={cn('h-8 gap-1.5 px-2 text-xs', active && 'bg-muted text-foreground')}
    >
      {children}
    </Button>
  )
}

function Divider() {
  return <div className="mx-1 h-5 w-px bg-border" />
}

interface RichTextEditorProps {
  value: string
  onChange: (html: string) => void
  placeholder?: string
  minHeight?: number
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = 'Начните писать...',
  minHeight = 320,
}: RichTextEditorProps) {
  const [showImagePicker, setShowImagePicker] = useState(false)
  const [showGalleryPicker, setShowGalleryPicker] = useState(false)
  const [showLinkDialog, setShowLinkDialog] = useState(false)
  const [linkUrl, setLinkUrl] = useState('')

  const editor = useEditor({
    extensions: [
      StarterKit,
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
      IngredientsMarker,
    ],
    content: value || '',
    editorProps: {
      attributes: {
        class: 'admin-editor__content',
        style: `min-height:${minHeight}px`,
      },
    },
    onUpdate: ({ editor: e }) => {
      onChange(e.getHTML())
    },
  })

  if (!editor) return null

  const openLinkDialog = () => {
    setLinkUrl((editor.getAttributes('link').href as string | undefined) ?? '')
    setShowLinkDialog(true)
  }

  const applyLink = () => {
    const url = linkUrl.trim()
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
    setShowLinkDialog(false)
  }

  const removeLink = () => {
    editor.chain().focus().extendMarkRange('link').unsetLink().run()
    setShowLinkDialog(false)
  }

  const insertImage = (files: FileRecord[]) => {
    const file = files[0]
    if (file?.filenameDisk) {
      editor.chain().focus().setImage({ src: `/files/${file.filenameDisk}` }).run()
    }
  }

  const insertGallery = (files: FileRecord[]) => {
    const content = files
      .filter((f) => f.filenameDisk)
      .map((f) => ({
        type: 'image',
        attrs: { src: `/files/${f.filenameDisk}` },
      }))
    if (!content.length) return
    editor.chain().focus().insertContent({ type: 'gallery', content }).run()
  }

  const insertIngredients = () => {
    editor.chain().focus().insertContent({ type: 'ingredientsMarker' }).run()
    const sel = editor.state.selection
    if (sel instanceof NodeSelection) {
      editor.commands.setTextSelection(sel.to)
    }
  }

  let foundIngredientsMarker = false
  editor.state.doc.descendants((node) => {
    if (node.type.name === 'ingredientsMarker') {
      foundIngredientsMarker = true
      return false
    }
    return true
  })

  const insertTable = () => {
    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
  }

  return (
    <div className="overflow-hidden rounded-md border bg-background">
      <div className="border-b bg-muted/40 p-1">
        <div className="flex flex-wrap items-center gap-0.5">
        <ToolbarButton
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          title="Отменить"
        >
          <Undo2 className="size-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          title="Вернуть"
        >
          <Redo2 className="size-4" />
        </ToolbarButton>
        <Divider />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive('bold')}
          title="Жирный"
        >
          <Bold className="size-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive('italic')}
          title="Курсив"
        >
          <Italic className="size-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          active={editor.isActive('underline')}
          title="Подчёркнутый"
        >
          <UnderlineIcon className="size-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          active={editor.isActive('strike')}
          title="Зачёркнутый"
        >
          <Strikethrough className="size-4" />
        </ToolbarButton>
        <Divider />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          active={editor.isActive('heading', { level: 1 })}
          title="Заголовок 1"
        >
          <Heading1 className="size-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          active={editor.isActive('heading', { level: 2 })}
          title="Заголовок 2"
        >
          <Heading2 className="size-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          active={editor.isActive('heading', { level: 3 })}
          title="Заголовок 3"
        >
          <Heading3 className="size-4" />
        </ToolbarButton>
        <Divider />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive('bulletList')}
          title="Маркированный список"
        >
          <List className="size-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive('orderedList')}
          title="Нумерованный список"
        >
          <ListOrdered className="size-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          active={editor.isActive('blockquote')}
          title="Цитата"
        >
          <Quote className="size-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          active={editor.isActive('codeBlock')}
          title="Блок кода"
        >
          <Code className="size-4" />
        </ToolbarButton>
        <Divider />
        <ToolbarButton
          onClick={openLinkDialog}
          active={editor.isActive('link')}
          title="Ссылка"
        >
          <LinkIcon className="size-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().unsetLink().run()}
          disabled={!editor.isActive('link')}
          title="Убрать ссылку"
        >
          <Unlink className="size-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => setShowImagePicker(true)}
          title="Картинка"
        >
          <ImagePlus className="size-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={insertTable}
          active={editor.isActive('table')}
          title="Таблица"
        >
          <TableIcon className="size-4" />
        </ToolbarButton>
        <Divider />
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          active={editor.isActive({ textAlign: 'left' })}
          title="По левому краю"
        >
          <AlignLeft className="size-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          active={editor.isActive({ textAlign: 'center' })}
          title="По центру"
        >
          <AlignCenter className="size-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          active={editor.isActive({ textAlign: 'right' })}
          title="По правому краю"
        >
          <AlignRight className="size-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign('justify').run()}
          active={editor.isActive({ textAlign: 'justify' })}
          title="По ширине"
        >
          <AlignJustify className="size-4" />
        </ToolbarButton>
        <Divider />
        <ToolbarButton
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          title="Горизонтальная линия"
        >
          <Minus className="size-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}
          title="Очистить форматирование"
        >
          <RemoveFormatting className="size-4" />
        </ToolbarButton>
        </div>

        <div className="mt-1 flex flex-wrap items-center gap-1 border-t border-border pt-1.5">
          <span className="px-1 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
            Блоки
          </span>
          <ToolbarTextButton
            onClick={insertIngredients}
            disabled={foundIngredientsMarker}
            title="Вставить блок ингредиентов"
          >
            <UtensilsCrossed className="size-4" />
            Ингредиенты
          </ToolbarTextButton>
          <ToolbarTextButton
            onClick={() => insertStep(editor)}
            title="Вставить пошаговую инструкцию"
          >
            <ChefHat className="size-4" />
            Шаги
          </ToolbarTextButton>
          <ToolbarTextButton
            onClick={() => setShowGalleryPicker(true)}
            title="Вставить галерею"
          >
            <Images className="size-4" />
            Галерея
          </ToolbarTextButton>
        </div>
      </div>

      <EditorContent editor={editor} />

      <Dialog open={showLinkDialog} onOpenChange={setShowLinkDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Ссылка</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="link-url">URL</Label>
            <Input
              id="link-url"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') applyLink()
              }}
              placeholder="https://"
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={removeLink}>
              Убрать
            </Button>
            <Button type="button" onClick={applyLink}>
              Сохранить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <MediaPicker
        open={showImagePicker}
        onOpenChange={setShowImagePicker}
        multiple={false}
        onConfirm={insertImage}
      />

      <MediaPicker
        open={showGalleryPicker}
        onOpenChange={setShowGalleryPicker}
        multiple
        onConfirm={insertGallery}
      />
    </div>
  )
}

export type { Editor }
