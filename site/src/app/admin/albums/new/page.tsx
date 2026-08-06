'use client'

import { AlbumForm } from '@components/admin/AlbumForm'
import { PageHeader } from '@components/admin/common'

export default function AdminNewAlbumPage() {
  return (
    <div>
      <PageHeader title="Новый альбом" />
      <AlbumForm />
    </div>
  )
}
