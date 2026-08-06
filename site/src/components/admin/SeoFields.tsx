'use client'

import React from 'react'
import { Label } from '@components/ui/label'
import { Input } from '@components/ui/input'
import { Textarea } from '@components/ui/textarea'

export interface SeoValues {
  seoTitle?: string | null
  seoKeywords?: string | null
  seoDescription?: string | null
}

interface SeoFieldsProps {
  values: SeoValues
  onChange: (values: SeoValues) => void
}

export function SeoFields({ values, onChange }: SeoFieldsProps) {
  const set = (patch: Partial<SeoValues>) => onChange({ ...values, ...patch })

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="seoTitle">SEO title</Label>
        <Input
          id="seoTitle"
          value={values.seoTitle ?? ''}
          onChange={(e) => set({ seoTitle: e.target.value })}
          placeholder="Заголовок для поисковиков"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="seoKeywords">SEO keywords</Label>
        <Input
          id="seoKeywords"
          value={values.seoKeywords ?? ''}
          onChange={(e) => set({ seoKeywords: e.target.value })}
          placeholder="через запятую"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="seoDescription">SEO description</Label>
        <Textarea
          id="seoDescription"
          value={values.seoDescription ?? ''}
          onChange={(e) => set({ seoDescription: e.target.value })}
          placeholder="Описание для поисковиков"
          rows={3}
        />
      </div>
    </div>
  )
}
