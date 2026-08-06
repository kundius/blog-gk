'use client'

import React, { useCallback, useState } from 'react'
import useSWR from 'swr'
import { Plus, Pencil, Trash2, ChevronRight, ChevronDown } from 'lucide-react'
import { api } from '@app/lib/admin/client'
import type { CategoryRecord } from '@app/lib/admin/types'
import { toast } from 'sonner'
import { PageHeader, ErrorState, LoadingState, ConfirmDelete } from '@components/admin/common'
import { Button } from '@components/ui/button'
import { Badge } from '@components/ui/badge'
import { CategoryDialog } from '@components/admin/CategoryDialog'

function CategoryRow({
  category,
  depth,
  expanded,
  onToggle,
  onEdit,
}: {
  category: CategoryRecord
  depth: number
  expanded: Set<string>
  onToggle: (id: string) => void
  onEdit: (category: CategoryRecord) => void
}) {
  const hasChildren = (category.children?.length ?? 0) > 0
  const isOpen = expanded.has(category.id)

  return (
    <>
      <tr className="border-b last:border-0">
        <td className="py-2 pr-2">
          <div className="flex items-center gap-1" style={{ paddingLeft: depth * 20 }}>
            {hasChildren ? (
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={() => onToggle(category.id)}
              >
                {isOpen ? <ChevronDown className="size-4" /> : <ChevronRight className="size-4" />}
              </Button>
            ) : (
              <span className="w-7" />
            )}
            <span className="font-medium">{category.name}</span>
            {category.alias && (
              <a
                href={`/${category.alias}`}
                target="_blank"
                rel="noreferrer"
                className="hidden text-xs text-muted-foreground transition-colors hover:text-foreground sm:inline"
              >
                /{category.alias}
              </a>
            )}
          </div>
        </td>
        <td className="hidden py-2 text-sm text-muted-foreground md:table-cell">
          {category._count?.articleCategories ?? 0}
        </td>
        <td className="py-2 text-right">
          <div className="flex justify-end gap-1">
            <Button variant="ghost" size="icon-sm" onClick={() => onEdit(category)}>
              <Pencil className="size-4" />
            </Button>
            <ConfirmDelete
              title="Удалить категорию?"
              description={`«${category.name}» будет удалена. Статьи категории останутся.`}
              onConfirm={async () => {
                try {
                  await api.delete(`/categories/${category.id}`)
                  toast.success('Категория удалена')
                } catch (e) {
                  toast.error(e instanceof Error ? e.message : 'Ошибка удаления')
                }
              }}
              trigger={
                <Button variant="ghost" size="icon-sm" className="text-destructive">
                  <Trash2 className="size-4" />
                </Button>
              }
            />
          </div>
        </td>
      </tr>
      {hasChildren && isOpen && (
        <>
          {category.children!.map((child) => (
            <CategoryRow
              key={child.id}
              category={child}
              depth={depth + 1}
              expanded={expanded}
              onToggle={onToggle}
              onEdit={onEdit}
            />
          ))}
        </>
      )}
    </>
  )
}

export default function AdminCategoriesPage() {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<CategoryRecord | null>(null)
  const [expanded, setExpanded] = useState<Set<string>>(new Set())

  const { data: tree, error, isLoading, mutate } = useSWR(
    '/categories/tree?limit=200',
    () => api.list<CategoryRecord>('/categories/tree?limit=200'),
  )

  const toggle = useCallback((id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

  const openNew = () => {
    setEditing(null)
    setDialogOpen(true)
  }

  const openEdit = (category: CategoryRecord) => {
    setEditing(category)
    setDialogOpen(true)
  }

  return (
    <div>
      <PageHeader
        title="Категории"
        actions={
          <Button onClick={openNew} className="bg-red-400 text-white hover:bg-red-400/90">
            <Plus className="size-4" />
            Новая категория
          </Button>
        }
      />

      {isLoading && <LoadingState rows={6} />}
      {error && <ErrorState message={error.message} />}

      {tree && (
        <div className="rounded-md border bg-background">
          <table className="w-full">
            <thead>
              <tr className="border-b text-left text-xs text-muted-foreground">
                <th className="py-2 pl-3 font-medium">Название</th>
                <th className="hidden py-2 font-medium md:table-cell">Статей</th>
                <th className="py-2 pr-3 text-right font-medium">Действия</th>
              </tr>
            </thead>
            <tbody>
              {tree.data.length === 0 && (
                <tr>
                  <td colSpan={3} className="py-10 text-center text-muted-foreground">
                    Категорий пока нет
                  </td>
                </tr>
              )}
              {tree.data.map((category) => (
                <CategoryRow
                  key={category.id}
                  category={category}
                  depth={0}
                  expanded={expanded}
                  onToggle={toggle}
                  onEdit={openEdit}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tree && tree.data.length > 0 && (
        <div className="mt-3">
          <Badge variant="secondary">Всего: {tree.data.length} корневых</Badge>
        </div>
      )}

      <CategoryDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        category={editing}
        categories={tree?.data ?? []}
        onSaved={() => void mutate()}
      />
    </div>
  )
}
