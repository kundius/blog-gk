import { DateTime } from 'luxon'

export function formatCookingTime (value?: string | null): string | null {
  const total = Number(value)
  if (!value || Number.isNaN(total)) return null
  if (total < 60) return `${total} мин`
  const hours = Math.floor(total / 60)
  const minutes = total % 60
  if (minutes === 0) return `${hours} ч`
  return `${hours} ч ${minutes} мин`
}

export function formatHits (count: number): string {
  return new Intl.NumberFormat('ru-RU').format(count)
}

export function formatPublicationDate (iso?: string | null): string | null {
  if (!iso) return null
  const date = DateTime.fromISO(iso, { zone: 'utc' })
  if (!date.isValid) return null
  return `Опубликовано ${date.setLocale('ru').toFormat('d MMMM yyyy')}`
}

export function formatDate (iso?: string | null): string | null {
  if (!iso) return null
  const date = DateTime.fromISO(iso, { zone: 'utc' })
  if (!date.isValid) return null
  return date.setLocale('ru').toFormat('d MMMM yyyy')
}