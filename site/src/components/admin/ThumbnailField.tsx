'use client'

import React from 'react'
import { ImagePlus, X } from 'lucide-react'
import { fileStreamUrl } from '@app/lib/admin/client'
import type { FileRecord } from '@app/lib/admin/types'
import { Button } from '@components/ui/button'
import { BlurImage } from '@components/admin/BlurImage'

interface ThumbnailFieldProps {
  file: FileRecord | null
  onClear: () => void
  onPick: () => void
}

export function ThumbnailField({ file, onClear, onPick }: ThumbnailFieldProps) {
  return (
    <div className="flex items-start gap-3">
      {file ? (
        <div className="relative size-32 overflow-hidden rounded-md border">
          <BlurImage
            src={fileStreamUrl(file.id)}
            blurHash={file.blurhash}
            alt={file.title ?? ''}
            className="h-full w-full object-cover"
          />
          <button
            type="button"
            onClick={onClear}
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
      <Button type="button" variant="outline" onClick={onPick}>
        Выбрать
      </Button>
    </div>
  )
}
