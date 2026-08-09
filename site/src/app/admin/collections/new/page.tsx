'use client'

import { CollectionForm } from '@components/admin/CollectionForm'
import { PageHeader } from '@components/admin/common'

export default function AdminNewCollectionPage() {
  return (
    <div>
      <PageHeader title="Новая подборка" />
      <CollectionForm />
    </div>
  )
}
