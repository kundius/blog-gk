'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Loader2,
  Save,
  RotateCcw,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  WandSparkles,
  Images,
  Copy,
  Check,
} from 'lucide-react'
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
import { FieldGroup } from '@components/admin/FieldGroup'
import { AliasInput } from '@components/admin/AliasInput'
import { CategoryMultiSelect } from '@components/admin/CategoryMultiSelect'
import { IngredientsEditor, type IngredientItem } from '@components/admin/IngredientsEditor'
import { MediaPicker } from '@components/admin/MediaPicker'
import { ArticlePicker } from '@components/admin/ArticlePicker'
import { RichTextEditor } from '@components/admin/RichTextEditor'
import { SeoFields, type SeoValues } from '@components/admin/SeoFields'
import { ThumbnailField } from '@components/admin/ThumbnailField'
import { CoverImage } from '@components/CoverImage'

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
  const memberCategoryIds = article?.categories
    ?.map((c) => c.categoryId ?? '')
    .filter(Boolean) ?? []
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    memberCategoryIds.length
      ? memberCategoryIds
      : article?.categoryId
        ? [article.categoryId]
        : [],
  )
  const [categoryId, setCategoryId] = useState(
    article?.categoryId ?? selectedCategories[0] ?? '',
  )
  const [excerpt, setExcerpt] = useState(article?.excerpt ?? '')
  const [content, setContent] = useState(article?.content ?? '')
  const [portionCount, setPortionCount] = useState(article?.portionCount ?? '')
  const [cookingTime, setCookingTime] = useState(article?.cookingTime ?? '')
  const [calories, setCalories] = useState(article?.calories ?? '')
  const [protein, setProtein] = useState(article?.protein ?? '')
  const [fat, setFat] = useState(article?.fat ?? '')
  const [carbs, setCarbs] = useState(article?.carbs ?? '')
  const [ingredients, setIngredients] = useState<IngredientItem[]>(
    article?.ingredients?.map((i) => ({
      name: i.name,
      amount: i.amount ?? i.value ?? '',
    })) ?? emptyIngredients,
  )
  const [thumbnail, setThumbnail] = useState<FileRecord | null>(article?.thumbnail ?? null)
  const [related, setRelated] = useState<ArticleRecord[]>(
    article?.related
      ?.map((row) => row.relatedArticle)
      .filter((a): a is ArticleRecord => Boolean(a)) ?? [],
  )
  const [seo, setSeo] = useState<SeoValues>({
    seoTitle: article?.seoTitle ?? '',
    seoKeywords: article?.seoKeywords ?? '',
    seoDescription: article?.seoDescription ?? '',
  })

  const [categories, setCategories] = useState<CategoryRecord[]>([])
  const [saving, setSaving] = useState(false)
  const [seoLoading, setSeoLoading] = useState(false)
  const [altsLoading, setAltsLoading] = useState(false)
  const [keywords, setKeywords] = useState<string[]>([])
  const [copiedKey, setCopiedKey] = useState<string | null>(null)

  const [picker, setPicker] = useState<'thumbnail' | 'related' | null>(null)

  const loadOptions = async () => {
    const treeRes = await api.list<CategoryRecord>('/categories/tree?limit=200')
    setCategories(treeRes.data)
  }

  useEffect(() => {
    void loadOptions()
  }, [])

  const handleCategoriesChange = (ids: string[]) => {
    setSelectedCategories(ids)
    if (ids.length === 0) {
      setCategoryId('')
    } else if (!ids.includes(categoryId)) {
      setCategoryId(ids[0])
    }
  }

  const handlePickerConfirm = (files: FileRecord[]) => {
    if (picker === 'thumbnail' && files[0]) setThumbnail(files[0])
  }

  const addRelated = (chosen: ArticleRecord[]) => {
    const existing = new Set(related.map((a) => a.id))
    const fresh = chosen.filter((a) => !existing.has(a.id))
    setRelated((prev) => [...prev, ...fresh].slice(0, 4))
  }

  const moveRelated = (index: number, delta: number) => {
    const target = index + delta
    if (target < 0 || target >= related.length) return
    const next = [...related]
    ;[next[index], next[target]] = [next[target], next[index]]
    setRelated(next)
  }

  const removeRelated = (index: number) =>
    setRelated(related.filter((_, i) => i !== index))

  const stripSeoTags = (html: string): string =>
    html.replace(/<ins\b[^>]*class="[^"]*seo-keyword[^"]*"[^>]*>([\s\S]*?)<\/ins>/gi, '$1')

  const handleSeoOptimize = async () => {
    if (!stripSeoTags(name).trim() || !content.trim()) {
      toast.error('Заполните название и текст статьи')
      return
    }
    setSeoLoading(true)
    try {
      const result = await api.post<{
        keys?: string[]
        seo_keywords?: string[]
        seo_title?: string
        seo_description?: string
      }>('/opencode/seo/optimize', {
        title: stripSeoTags(name),
        excerpt,
        content,
      })
      setKeywords([...new Set(result.keys ?? [])])
      setSeo((prev) => ({
        ...prev,
        seoTitle: result.seo_title ?? prev.seoTitle ?? '',
        seoDescription: result.seo_description ?? prev.seoDescription ?? '',
        seoKeywords: result.seo_keywords?.length
          ? result.seo_keywords.join(', ')
          : prev.seoKeywords ?? '',
      }))
      toast.success('SEO-поля сформированы')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Ошибка SEO-оптимизации')
    } finally {
      setSeoLoading(false)
    }
  }

  const copyKeyword = async (key: string) => {
    try {
      await navigator.clipboard.writeText(key)
      setCopiedKey(key)
      setTimeout(() => setCopiedKey((cur) => (cur === key ? null : cur)), 1500)
    } catch {
      toast.error('Не удалось скопировать')
    }
  }

  const handleFillAlts = async () => {
    if (!content.trim()) {
      toast.error('Сначала заполните текст статьи')
      return
    }
    setAltsLoading(true)
    try {
      const result = await api.post<{ content?: string }>('/opencode/content/alts', {
        title: stripSeoTags(name),
        excerpt,
        content,
      })
      if (result.content) setContent(result.content)
      toast.success('Описания файлов заполнены')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Ошибка заполнения описаний')
    } finally {
      setAltsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const payload = {
        name: stripSeoTags(name),
        alias,
        status,
        categoryId,
        categories: selectedCategories,
        excerpt,
        content: stripSeoTags(content),
        portionCount,
        cookingTime,
        calories,
        protein,
        fat,
        carbs,
        ingredients,
        thumbnailId: thumbnail?.id,
        relatedIds: related.map((a) => a.id),
        seoTitle: stripSeoTags(seo.seoTitle ?? ''),
        seoKeywords: seo.seoKeywords ?? '',
        seoDescription: stripSeoTags(seo.seoDescription ?? ''),
      }
      if (isEdit && article) {
        await api.patch(`/articles/${article.id}`, payload)
        toast.success('Статья сохранена')
      } else {
        const created = await api.post<ArticleRecord>('/articles', payload)
        toast.success('Статья создана')
        router.push(`/admin/articles/${created.id}`)
        router.refresh()
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Ошибка сохранения')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <FieldGroup title="Основное" contentClassName="space-y-4">
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
            <Label>Категории *</Label>
            <CategoryMultiSelect
              categories={categories}
              value={selectedCategories}
              onChange={handleCategoriesChange}
              primaryId={categoryId}
              onPrimaryChange={setCategoryId}
            />
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
      </FieldGroup>

      <FieldGroup title="Медиа" contentClassName="space-y-4">
          <div className="space-y-2">
            <Label>Миниатюра</Label>
            <ThumbnailField
              file={thumbnail}
              onClear={() => setThumbnail(null)}
              onPick={() => setPicker('thumbnail')}
            />
          </div>
      </FieldGroup>

      <FieldGroup
        title="Контент"
        titleAction={
          <div className="flex items-center gap-2">
            {/* {isEdit && article?.oldContent ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setContent(article.oldContent ?? '')}
              >
                <RotateCcw className="size-4" />
                Вернуть старую версию
              </Button>
            ) : null} */}
            <Button
              type="button"
              size="sm"
              onClick={handleFillAlts}
              disabled={altsLoading}
              className="bg-gradient-to-r from-fuchsia-500 via-violet-500 to-indigo-500 text-white hover:text-white hover:opacity-90"
            >
              {altsLoading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Images className="size-4" />
              )}
              Заполнить описания файлов
            </Button>
          </div>
        }
        contentClassName="space-y-4"
      >
          <div className="space-y-2">
            <Label>Текст статьи</Label>
            <RichTextEditor value={content} onChange={setContent} />
          </div>
      </FieldGroup>

      <FieldGroup title="КБЖУ">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <Label htmlFor="calories">Ккал</Label>
              <Input
                id="calories"
                value={calories}
                onChange={(e) => setCalories(e.target.value)}
                inputMode="numeric"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="protein">Белки, г</Label>
              <Input
                id="protein"
                value={protein}
                onChange={(e) => setProtein(e.target.value)}
                inputMode="numeric"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fat">Жиры, г</Label>
              <Input
                id="fat"
                value={fat}
                onChange={(e) => setFat(e.target.value)}
                inputMode="numeric"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="carbs">Углеводы, г</Label>
              <Input
                id="carbs"
                value={carbs}
                onChange={(e) => setCarbs(e.target.value)}
                inputMode="numeric"
              />
            </div>
          </div>
      </FieldGroup>

      <FieldGroup title="Ингредиенты">
        <IngredientsEditor items={ingredients} onChange={setIngredients} />
      </FieldGroup>

      <FieldGroup title="Похожие статьи" contentClassName="space-y-2">
          {related.map((articleItem, index) => (
            <div
              key={articleItem.id}
              className="flex items-center gap-2 rounded-md border px-2 py-1.5"
            >
              <div className="relative size-9 shrink-0 overflow-hidden rounded bg-muted">
                {articleItem.thumbnail ? (
                  <CoverImage
                    src={fileStreamUrl(articleItem.thumbnail.id)}
                    alt={articleItem.name}
                    blurHash={articleItem.thumbnail.blurhash}
                    sizes="36px"
                    loading="lazy"
                  />
                ) : null}
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm">{articleItem.name}</div>
                <div className="truncate text-xs text-muted-foreground">
                  {articleItem.category?.name ?? 'Без категории'}
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-0.5">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => moveRelated(index, -1)}
                  disabled={index === 0}
                >
                  <ArrowUp className="size-3.5" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => moveRelated(index, 1)}
                  disabled={index === related.length - 1}
                >
                  <ArrowDown className="size-3.5" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => removeRelated(index)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="size-3.5" />
                </Button>
              </div>
            </div>
          ))}
          {related.length === 0 && (
            <p className="py-4 text-center text-sm text-muted-foreground">
              Похожих статей пока нет
            </p>
          )}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setPicker('related')}
            disabled={related.length >= 4}
          >
            <Plus className="size-4" />
            Добавить похожие статьи{related.length >= 4 ? '' : ` (${related.length}/4)`}
          </Button>
          <p className="text-xs text-muted-foreground">
            До 4 статей. Если не выбраны — на сайте покажутся случайные статьи из раздела.
          </p>
      </FieldGroup>

      <FieldGroup
        title="SEO"
        titleAction={
          <Button
            type="button"
            size="sm"
            onClick={handleSeoOptimize}
            disabled={seoLoading}
            className="bg-gradient-to-r from-fuchsia-500 via-violet-500 to-indigo-500 text-white hover:text-white hover:opacity-90"
          >
            {seoLoading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <WandSparkles className="size-4" />
            )}
            SEO оптимизация
          </Button>
        }
      >
        {keywords.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-2">
            {keywords.map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => void copyKeyword(key)}
                title="Скопировать"
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border bg-muted/50 px-3.5 py-1.5 text-sm font-medium transition-all duration-200 hover:-translate-y-0.5 hover:border-violet-400 hover:bg-gradient-to-r hover:from-fuchsia-500/10 hover:via-violet-500/10 hover:to-indigo-500/10 hover:shadow-md active:scale-95"
              >
                {copiedKey === key ? (
                  <Check className="size-4 text-green-600" />
                ) : (
                  <Copy className="size-3.5 text-muted-foreground" />
                )}
                {key}
              </button>
            ))}
          </div>
        )}
        <SeoFields values={seo} onChange={setSeo} />
      </FieldGroup>

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
        open={picker !== null && picker !== 'related'}
        onOpenChange={(open) => !open && setPicker(null)}
        multiple={false}
        onConfirm={handlePickerConfirm}
      />
      <ArticlePicker
        open={picker === 'related'}
        onOpenChange={(open) => !open && setPicker(null)}
        excludedIds={[article?.id ?? '', ...related.map((a) => a.id)].filter(Boolean)}
        max={4}
        onConfirm={addRelated}
      />
    </form>
  )
}
