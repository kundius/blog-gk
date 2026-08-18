import type { Category } from '@app/api/types'

export interface BreadcrumbItem {
  name: string
  alias: string
  isCurrent: boolean
}

type BreadcrumbCategory = Pick<Category, 'name' | 'alias' | 'ancestors'>

export function breadcrumbCategories (
  category: BreadcrumbCategory
): BreadcrumbItem[] {
  const parents = (category.ancestors ?? []).slice(1)

  return [
    ...parents.map((item) => ({
      name: item.name,
      alias: item.alias,
      isCurrent: false
    })),
    { name: category.name, alias: category.alias, isCurrent: true }
  ]
}