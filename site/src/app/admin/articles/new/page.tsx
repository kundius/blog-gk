'use client'

import { ArticleForm } from '@components/admin/ArticleForm'
import { PageHeader } from '@components/admin/common'

export default function AdminNewArticlePage() {
  return (
    <div>
      <PageHeader title="Новая статья" />
      <ArticleForm />
    </div>
  )
}
