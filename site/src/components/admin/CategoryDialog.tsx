'use client'

import React, { useEffect, useState } from 'react'
import { Loader2, Save } from 'lucide-react'
import { api } from '@app/lib/admin/client'
import type { CategoryRecord } from '@app/lib/admin/types'
import { toast } from 'sonner'
import { Button } from '@components/ui/button'
import { Input } from '@components/ui/input'
import { Textarea } from '@components/ui/textarea'
import { Label } from '@components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@components/ui/select'
import { AliasInput } from '@components/admin/AliasInput'
import { SeoFields, type SeoValues } from '@components/admin/SeoFields'

interface FlattenedCategory {
  id: string
  name: string
  depth: number
}

function flattenTree(nodes: CategoryRecord[], depth = 0): FlattenedCategory[] {
  const out: FlattenedCategory[] = []
  for (const node of nodes) {
    out.push({ id: node.id, name: node.name, depth })
    if (node.children?.length) out.push(...flattenTree(node.children, depth + 1))
  }
  return out
}

interface CategoryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  category?: CategoryRecord | null
  categories: CategoryRecord[]
  onSaved: () => void
}

export function CategoryDialog({
  open,
  onOpenChange,
  category,
  categories,
  onSaved,
}: CategoryDialogProps) {
  const isEdit = Boolean(category)

  const [name, setName] = useState('')
  const [alias, setAlias] = useState('')
  const [parentId, setParentId] = useState<string>('')
  const [sort, setSort] = useState<string>('')
  const [content, setContent] = useState('')
  const [seo, setSeo] = useState<SeoValues>({})
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (open) {
      setName(category?.name ?? '')
      setAlias(category?.alias ?? '')
      setParentId(category?.parentId ?? '')
      setSort(category?.sort != null ? String(category.sort) : '')
      setContent(category?.content ?? '')
      setSeo({
        seoTitle: category?.seoTitle ?? '',
        seoKeywords: category?.seoKeywords ?? '',
        seoDescription: category?.seoDescription ?? '',
      })
    }
  }, [open, category])

  const options = flattenTree(categories).filter((c) => c.id !== category?.id)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const payload = {
        name,
        alias,
        parentId: parentId || undefined,
        sort: sort === '' ? undefined : Number(sort),
        content,
        ...seo,
      }
      if (isEdit && category) {
        await api.patch(`/categories/${category.id}`, payload)
      } else {
        await api.post('/categories', payload)
      }
      toast.success(isEdit ? 'Категория сохранена' : 'Категория создана')
      onOpenChange(false)
      onSaved()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Ошибка сохранения')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Редактирование категории' : 'Новая категория'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="cat-name">Название *</Label>
            <Input
              id="cat-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Алиас</Label>
            <AliasInput value={alias} onChange={setAlias} name={name} />
          </div>
          <div className="space-y-2">
            <Label>Родительская категория</Label>
            <Select value={parentId || undefined} onValueChange={(v) => setParentId(v)}>
              <SelectTrigger>
                <SelectValue placeholder="Нет (корневая)" />
              </SelectTrigger>
              <SelectContent>
                {options.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {'—'.repeat(cat.depth)} {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="cat-sort">Сортировка</Label>
            <Input
              id="cat-sort"
              type="number"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              placeholder="Например, 1"
            />
            <p className="text-xs text-muted-foreground">
              Меньшее значение — ближе к началу списка.
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="cat-content">Описание</Label>
            <Textarea
              id="cat-content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={3}
            />
          </div>
          <SeoFields values={seo} onChange={setSeo} />
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={saving}
            >
              Отмена
            </Button>
            <Button
              type="submit"
              disabled={saving}
              className="bg-red-400 text-white hover:bg-red-400/90"
            >
              {saving && <Loader2 className="size-4 animate-spin" />}
              <Save className="size-4" />
              Сохранить
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
