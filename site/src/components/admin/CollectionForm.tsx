'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Save, Plus, Trash2, ArrowUp, ArrowDown } from 'lucide-react'
import { api, fileStreamUrl } from '@app/lib/admin/client'
import type { ArticleRecord, CollectionRecord, FileRecord } from '@app/lib/admin/types'
import { toast } from 'sonner'
import { cn } from '@app/lib/utils'
import { Button } from '@components/ui/button'
import { Input } from '@components/ui/input'
import { Label } from '@components/ui/label'
import { Switch } from '@components/ui/switch'
import { FieldGroup } from '@components/admin/FieldGroup'
import { AliasInput } from '@components/admin/AliasInput'
import { MediaPicker } from '@components/admin/MediaPicker'
import { ArticlePicker } from '@components/admin/ArticlePicker'
import { ThumbnailField } from '@components/admin/ThumbnailField'
import { SeoFields, type SeoValues } from '@components/admin/SeoFields'
import { CoverImage } from '@components/CoverImage'

interface CollectionFormProps {
  collection?: CollectionRecord | null
  mutate?: () => void
}

export function CollectionForm({ collection, mutate }: CollectionFormProps) {
  const router = useRouter()
  const isEdit = Boolean(collection)

  const [name, setName] = useState(collection?.name ?? '')
  const [alias, setAlias] = useState(collection?.alias ?? '')
  const [description, setDescription] = useState(collection?.description ?? '')
  const [showOnHome, setShowOnHome] = useState(collection?.showOnHome ?? false)
  const [thumbnail, setThumbnail] = useState<FileRecord | null>(
    collection?.thumbnail ?? null,
  )
  const [seo, setSeo] = useState<SeoValues>({
    seoTitle: collection?.seoTitle ?? '',
    seoKeywords: collection?.seoKeywords ?? '',
    seoDescription: collection?.seoDescription ?? '',
  })
  const [articles, setArticles] = useState<ArticleRecord[]>(
    collection?.articles
      ?.map((row) => row.article)
      .filter((a): a is ArticleRecord => Boolean(a)) ?? [],
  )
  const [saving, setSaving] = useState(false)
  const [picker, setPicker] = useState<'thumbnail' | 'articles' | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const payload = {
        name,
        alias,
        description: description || undefined,
        thumbnailId: thumbnail?.id,
        showOnHome,
        articleIds: articles.map((a) => a.id),
        ...seo,
      }
      if (isEdit && collection) {
        await api.patch(`/collections/${collection.id}`, payload)
        toast.success('Подборка сохранена')
        mutate?.()
      } else {
        const created = await api.post<CollectionRecord>('/collections', payload)
        toast.success('Подборка создана')
        router.replace(`/admin/collections/${created.id}`)
        router.refresh()
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Ошибка сохранения')
    } finally {
      setSaving(false)
    }
  }

  const addArticles = (chosen: ArticleRecord[]) => {
    const existing = new Set(articles.map((a) => a.id))
    const next = [
      ...articles,
      ...chosen.filter((a) => !existing.has(a.id)),
    ]
    setArticles(next)
  }

  const move = (index: number, delta: number) => {
    const target = index + delta
    if (target < 0 || target >= articles.length) return
    const next = [...articles]
    ;[next[index], next[target]] = [next[target], next[index]]
    setArticles(next)
  }

  const remove = (index: number) => setArticles(articles.filter((_, i) => i !== index))

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <FieldGroup title="Основное" contentClassName="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="collection-name">Название *</Label>
            <Input
              id="collection-name"
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
            <Label htmlFor="collection-description">Описание</Label>
            <Input
              id="collection-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Краткое описание подборки"
            />
          </div>
          <div className="space-y-2">
            <Label>Обложка</Label>
            <ThumbnailField
              file={thumbnail}
              onClear={() => setThumbnail(null)}
              onPick={() => setPicker('thumbnail')}
            />
          </div>
          <div className="flex items-center gap-3 pt-1">
            <Switch
              id="collection-show-on-home"
              checked={showOnHome}
              onCheckedChange={setShowOnHome}
            />
            <Label htmlFor="collection-show-on-home" className="font-normal">
              Показывать на главной
            </Label>
          </div>
      </FieldGroup>

      <FieldGroup title="Статьи" contentClassName="space-y-2">
          {articles.map((article, index) => (
            <div
              key={article.id}
              className="flex items-center gap-2 rounded-md border px-2 py-1.5"
            >
              <div className="relative size-9 shrink-0 overflow-hidden rounded bg-muted">
                {article.thumbnail ? (
                  <CoverImage
                    src={fileStreamUrl(article.thumbnail.id)}
                    alt={article.name}
                    blurHash={article.thumbnail.blurhash}
                    sizes="36px"
                    loading="lazy"
                  />
                ) : null}
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm">{article.name}</div>
                <div className="truncate text-xs text-muted-foreground">
                  {article.category?.name ?? 'Без категории'}
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-0.5">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => move(index, -1)}
                  disabled={index === 0}
                >
                  <ArrowUp className="size-3.5" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => move(index, 1)}
                  disabled={index === articles.length - 1}
                >
                  <ArrowDown className="size-3.5" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => remove(index)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="size-3.5" />
                </Button>
              </div>
            </div>
          ))}
          {articles.length === 0 && (
            <p className="py-4 text-center text-sm text-muted-foreground">
              Статей пока нет
            </p>
          )}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setPicker('articles')}
          >
            <Plus className="size-4" />
            Добавить статьи
          </Button>
          <p className={cn('text-xs text-muted-foreground', articles.length > 0 && 'pt-1')}>
            Порядок статей задаётся стрелками и сохраняется в подборке.
          </p>
      </FieldGroup>

      <FieldGroup title="SEO">
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
        open={picker === 'thumbnail'}
        onOpenChange={(open) => !open && setPicker(null)}
        multiple={false}
        onConfirm={(files) => {
          if (files[0]) setThumbnail(files[0])
        }}
      />
      <ArticlePicker
        open={picker === 'articles'}
        onOpenChange={(open) => !open && setPicker(null)}
        excludedIds={articles.map((a) => a.id)}
        onConfirm={addArticles}
      />
    </form>
  )
}
