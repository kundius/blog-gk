'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Save, ImagePlus, X, GripVertical } from 'lucide-react'
import { api, fileStreamUrl } from '@app/lib/admin/client'
import type {
  ArticleRecord,
  CategoryRecord,
  FileRecord,
} from '@app/lib/admin/types'
import { toast } from 'sonner'
import { Button } from '@components/ui/button'
import { Input } from '@components/ui/input'
import { Textarea } from '@components/ui/textarea'
import { Label } from '@components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/card'
import { AliasInput } from '@components/admin/AliasInput'
import { IngredientsEditor, type IngredientItem } from '@components/admin/IngredientsEditor'
import { MediaPicker } from '@components/admin/MediaPicker'
import { RichTextEditor } from '@components/admin/RichTextEditor'
import { SeoFields, type SeoValues } from '@components/admin/SeoFields'
import { BlurImage } from '@components/admin/BlurImage'

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

const emptyIngredients: IngredientItem[] = []

interface ArticleFormProps {
  article?: ArticleRecord | null
}

export function ArticleForm({ article }: ArticleFormProps) {
  const router = useRouter()
  const isEdit = Boolean(article)

  const [name, setName] = useState(article?.name ?? '')
  const [alias, setAlias] = useState(article?.alias ?? '')
  const [status, setStatus] = useState(article?.status ?? 'draft')
  const [categoryId, setCategoryId] = useState(article?.categoryId ?? '')
  const [excerpt, setExcerpt] = useState(article?.excerpt ?? '')
  const [content, setContent] = useState(article?.content ?? '')
  const [portionCount, setPortionCount] = useState(article?.portionCount ?? '')
  const [cookingTime, setCookingTime] = useState(article?.cookingTime ?? '')
  const [ingredients, setIngredients] = useState<IngredientItem[]>(
    article?.ingredients?.map((i) => ({
      name: i.name,
      amount: i.amount ?? i.value ?? '',
    })) ?? emptyIngredients,
  )
  const [thumbnail, setThumbnail] = useState<FileRecord | null>(article?.thumbnail ?? null)
  const [gallery, setGallery] = useState<FileRecord[]>(
    article?.files?.map((f) => f.file).filter((f): f is FileRecord => Boolean(f)) ?? [],
  )
  const [seo, setSeo] = useState<SeoValues>({
    seoTitle: article?.seoTitle ?? '',
    seoKeywords: article?.seoKeywords ?? '',
    seoDescription: article?.seoDescription ?? '',
  })

  const [categories, setCategories] = useState<CategoryRecord[]>([])
  const [saving, setSaving] = useState(false)

  const [picker, setPicker] = useState<'thumbnail' | 'gallery' | null>(null)

  const loadOptions = async () => {
    const treeRes = await api.list<CategoryRecord>('/categories/tree?limit=200')
    setCategories(treeRes.data)
  }

  useEffect(() => {
    void loadOptions()
  }, [])

  const categoryOptions = useMemo(() => flattenTree(categories), [categories])

  const handlePickerConfirm = (files: FileRecord[]) => {
    if (picker === 'thumbnail' && files[0]) setThumbnail(files[0])
    if (picker === 'gallery') {
      setGallery((prev) => {
        const existing = new Set(prev.map((f) => f.id))
        const fresh = files.filter((f) => !existing.has(f.id))
        return [...prev, ...fresh]
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const payload = {
        name,
        alias,
        status,
        categoryId,
        excerpt,
        content,
        portionCount,
        cookingTime,
        ingredients,
        thumbnailId: thumbnail?.id,
        files: gallery.map((f) => f.id),
        ...seo,
      }
      if (isEdit && article) {
        await api.patch(`/articles/${article.id}`, payload)
      } else {
        await api.post('/articles', payload)
      }
      toast.success(isEdit ? 'Статья сохранена' : 'Статья создана')
      router.push('/admin/articles')
      router.refresh()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Ошибка сохранения')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Основное</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Название *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Алиас</Label>
            <AliasInput value={alias} onChange={setAlias} name={name} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Статус</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Черновик</SelectItem>
                  <SelectItem value="published">Опубликована</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Категория *</Label>
              <Select value={categoryId || undefined} onValueChange={setCategoryId}>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите категорию" />
                </SelectTrigger>
                <SelectContent>
                  {categoryOptions.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {'—'.repeat(cat.depth)} {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="excerpt">Анонс</Label>
            <Textarea
              id="excerpt"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              rows={3}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="portionCount">Порций</Label>
              <Input
                id="portionCount"
                value={portionCount}
                onChange={(e) => setPortionCount(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cookingTime">Время приготовления</Label>
              <Input
                id="cookingTime"
                value={cookingTime}
                onChange={(e) => setCookingTime(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Контент</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Текст статьи</Label>
            <RichTextEditor value={content} onChange={setContent} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Ингредиенты</CardTitle>
        </CardHeader>
        <CardContent>
          <IngredientsEditor items={ingredients} onChange={setIngredients} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Медиа</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Миниатюра</Label>
            <div className="flex items-start gap-3">
              {thumbnail ? (
                <div className="relative size-32 overflow-hidden rounded-md border">
                  <BlurImage
                    src={fileStreamUrl(thumbnail.id)}
                    blurHash={thumbnail.blurhash}
                    alt={thumbnail.title ?? ''}
                    className="h-full w-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setThumbnail(null)}
                    className="absolute right-1 top-1 rounded-full bg-background/90 p-1 text-foreground hover:text-destructive"
                  >
                    <X className="size-3.5" />
                  </button>
                </div>
              ) : (
                <div className="flex size-32 items-center justify-center rounded-md border border-dashed text-muted-foreground">
                  <ImagePlus className="size-6" />
                </div>
              )}
              <Button
                type="button"
                variant="outline"
                onClick={() => setPicker('thumbnail')}
              >
                Выбрать
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Галерея</Label>
            <div className="flex flex-wrap gap-2">
              {gallery.map((file) => (
                <div
                  key={file.id}
                  className="relative size-24 overflow-hidden rounded-md border"
                >
                  <BlurImage
                    src={fileStreamUrl(file.id)}
                    blurHash={file.blurhash}
                    alt={file.title ?? ''}
                    className="h-full w-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setGallery((prev) => prev.filter((f) => f.id !== file.id))
                    }
                    className="absolute right-0.5 top-0.5 rounded-full bg-background/90 p-0.5 text-foreground hover:text-destructive"
                  >
                    <X className="size-3.5" />
                  </button>
                  <span className="absolute bottom-0.5 left-0.5 rounded bg-background/90 p-0.5">
                    <GripVertical className="size-3.5 text-muted-foreground" />
                  </span>
                </div>
              ))}
              <button
                type="button"
                onClick={() => setPicker('gallery')}
                className="flex size-24 items-center justify-center rounded-md border border-dashed text-muted-foreground transition-colors hover:border-ring"
              >
                <ImagePlus className="size-5" />
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">SEO</CardTitle>
        </CardHeader>
        <CardContent>
          <SeoFields values={seo} onChange={setSeo} />
        </CardContent>
      </Card>

      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
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
      </div>

      <MediaPicker
        open={picker !== null}
        onOpenChange={(open) => !open && setPicker(null)}
        multiple={picker === 'gallery'}
        onConfirm={handlePickerConfirm}
      />
    </form>
  )
}
