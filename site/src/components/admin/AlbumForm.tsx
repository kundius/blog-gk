'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Save, ImagePlus, X } from 'lucide-react'
import { api, fileStreamUrl } from '@app/lib/admin/client'
import type { AlbumRecord, FileRecord } from '@app/lib/admin/types'
import { toast } from 'sonner'
import { Button } from '@components/ui/button'
import { Input } from '@components/ui/input'
import { Label } from '@components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/card'
import { AliasInput } from '@components/admin/AliasInput'
import { MediaPicker } from '@components/admin/MediaPicker'
import { SeoFields, type SeoValues } from '@components/admin/SeoFields'
import { BlurImage } from '@components/admin/BlurImage'

interface AlbumFormProps {
  album?: AlbumRecord | null
}

export function AlbumForm({ album }: AlbumFormProps) {
  const router = useRouter()
  const isEdit = Boolean(album)

  const [name, setName] = useState(album?.name ?? '')
  const [alias, setAlias] = useState(album?.alias ?? '')
  const [thumbnail, setThumbnail] = useState<FileRecord | null>(album?.thumbnail ?? null)
  const [seo, setSeo] = useState<SeoValues>({
    seoTitle: album?.seoTitle ?? '',
    seoKeywords: album?.seoKeywords ?? '',
    seoDescription: album?.seoDescription ?? '',
  })
  const [saving, setSaving] = useState(false)
  const [picker, setPicker] = useState<'thumbnail' | 'photos' | null>(null)

  const photos: FileRecord[] =
    album?.photos?.map((p) => p.file).filter((f): f is FileRecord => Boolean(f)) ?? []

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const payload = { name, alias, thumbnailId: thumbnail?.id, ...seo }
      if (isEdit && album) {
        await api.patch(`/albums/${album.id}`, payload)
      } else {
        const created = await api.post<AlbumRecord>('/albums', payload)
        if (!album) {
          toast.success('Альбом создан. Добавьте фотографии.')
          router.replace(`/admin/albums/${created.id}`)
          router.refresh()
        } else {
          toast.success('Альбом сохранён')
          router.push('/admin/albums')
          router.refresh()
        }
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Ошибка сохранения')
    } finally {
      setSaving(false)
    }
  }

  const addPhotos = async (files: FileRecord[]) => {
    if (!album) return
    try {
      await api.post(`/albums/${album.id}/photos`, { fileIds: files.map((f) => f.id) })
      toast.success('Фотографии добавлены')
      router.refresh()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Ошибка добавления')
    }
  }

  const removePhoto = async (fileId: string) => {
    if (!album) return
    try {
      await api.delete(`/albums/${album.id}/photos/${fileId}`)
      toast.success('Фотография удалена')
      router.refresh()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Ошибка удаления')
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
            <Label htmlFor="album-name">Название *</Label>
            <Input
              id="album-name"
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
            <Label>Обложка</Label>
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
        </CardContent>
      </Card>

      {isEdit && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Фотографии</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {photos.map((file) => (
                <div
                  key={file.id}
                  className="group relative size-28 overflow-hidden rounded-md border"
                >
                  <BlurImage
                    src={fileStreamUrl(file.id)}
                    blurHash={file.blurhash}
                    alt={file.title ?? ''}
                    className="h-full w-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => void removePhoto(file.id)}
                    className="absolute right-0.5 top-0.5 rounded-full bg-background/90 p-0.5 text-foreground opacity-0 transition-opacity hover:text-destructive group-hover:opacity-100"
                  >
                    <X className="size-3.5" />
                  </button>
                </div>
              ))}
              {photos.length === 0 && (
                <div className="w-full py-6 text-center text-sm text-muted-foreground">
                  Фотографий пока нет
                </div>
              )}
              <button
                type="button"
                onClick={() => setPicker('photos')}
                className="flex size-28 items-center justify-center rounded-md border border-dashed text-muted-foreground transition-colors hover:border-ring"
              >
                <ImagePlus className="size-5" />
              </button>
            </div>
          </CardContent>
        </Card>
      )}

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
        <Button type="submit" disabled={saving}>
          {saving && <Loader2 className="size-4 animate-spin" />}
          <Save className="size-4" />
          Сохранить
        </Button>
      </div>

      <MediaPicker
        open={picker !== null}
        onOpenChange={(open) => !open && setPicker(null)}
        multiple={picker === 'photos'}
        onConfirm={(files) => {
          if (picker === 'thumbnail' && files[0]) setThumbnail(files[0])
          if (picker === 'photos') void addPhotos(files)
        }}
      />
    </form>
  )
}
