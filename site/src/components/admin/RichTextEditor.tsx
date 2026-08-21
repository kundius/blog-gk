'use client'

import React, { useEffect, useState } from 'react'
import { EditorContent, useEditor, type Editor } from '@tiptap/react'
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
  ImagePlus,
  Images,
  UtensilsCrossed,
  ChefHat
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
  DialogTitle
} from '@components/ui/dialog'
import { MediaPicker } from '@components/admin/MediaPicker'
import { buildEditorExtensions } from '@app/lib/tiptap/extensions'
import type { FileRecord } from '@app/lib/admin/types'

import '@app/components/admin/editor.css'

function ToolbarButton({
  onClick,
  active,
  disabled,
  title,
  children
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
  children
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
      className={cn(
        'h-8 gap-1.5 px-2 text-xs',
        active && 'bg-muted text-foreground'
      )}
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
}

export function RichTextEditor({
  value,
  onChange
}: RichTextEditorProps) {
  const [showLinkDialog, setShowLinkDialog] = useState(false)
  const [linkUrl, setLinkUrl] = useState('')
  const [picker, setPicker] = useState<null | {
    multiple: boolean
    run: (files: FileRecord[]) => void
  }>(null)

  const editor = useEditor({
    extensions: buildEditorExtensions(),
    content: value || '',
    editorProps: {
      attributes: {
        class: 'admin-editor'
      }
    },
    immediatelyRender: false,
    onUpdate: ({ editor: e }) => {
      onChange(e.getHTML())
    }
  })

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || '', { emitUpdate: false })
    }
  }, [editor, value])

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

  const insertTable = () => {
    editor
      .chain()
      .focus()
      .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
      .run()
  }

  return (
    <div className="rounded-md border bg-background">
      <div className="sticky top-0 z-20 rounded-t-md border-b bg-muted p-1">
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
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 1 }).run()
            }
            active={editor.isActive('heading', { level: 1 })}
            title="Заголовок 1"
          >
            <Heading1 className="size-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
            active={editor.isActive('heading', { level: 2 })}
            title="Заголовок 2"
          >
            <Heading2 className="size-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 3 }).run()
            }
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
            onClick={() =>
              editor.chain().focus().unsetAllMarks().clearNodes().run()
            }
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
            onClick={() =>
              setPicker({
                multiple: false,
                run: (files) => {
                  const src = files[0]?.filenameDisk
                  if (!src) return
                  editor.chain().focus().setImage({ src: `/files/${src}` }).run()
                },
              })
            }
            title="Картинка"
          >
            <ImagePlus className="size-4" />
            Картинка
          </ToolbarTextButton>
          <ToolbarTextButton
            onClick={() =>
              setPicker({
                multiple: true,
                run: (files) => editor.chain().focus().insertGallery(files).run(),
              })
            }
            title="Галерея"
          >
            <Images className="size-4" />
            Галерея
          </ToolbarTextButton>
          <ToolbarTextButton
            onClick={() =>
              editor.chain().focus().insertIngredientsMarker().run()
            }
            disabled={!editor.can().insertIngredientsMarker()}
            title="Ингредиенты"
          >
            <UtensilsCrossed className="size-4" />
            Ингредиенты
          </ToolbarTextButton>
          <ToolbarTextButton
            onClick={() => editor.chain().focus().insertRecipeSteps().run()}
            disabled={!editor.can().insertRecipeSteps()}
            title="Пошаговое приготовление"
          >
            <ChefHat className="size-4" />
            Пошаговое приготовление
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
        open={picker !== null}
        onOpenChange={() => setPicker(null)}
        multiple={picker?.multiple ?? false}
        onConfirm={(files) => {
          picker?.run(files)
          setPicker(null)
        }}
      />
    </div>
  )
}

export type { Editor }
