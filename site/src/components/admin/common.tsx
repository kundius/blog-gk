'use client'

import React, { useState } from 'react'
import { AlertTriangle, Menu } from 'lucide-react'
import { Button } from '@components/ui/button'
import { Card } from '@components/ui/card'
import { Skeleton } from '@components/ui/skeleton'
import { useAdminShell } from '@components/admin/Shell'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@components/ui/alert-dialog'

export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string
  description?: string
  actions?: React.ReactNode
}) {
  const { setOpenMobile } = useAdminShell()
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="shrink-0 lg:hidden"
          aria-label="Открыть меню"
          onClick={() => setOpenMobile(true)}
        >
          <Menu className="size-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          {description && (
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          )}
        </div>
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  )
}

export function ConfirmDelete({
  onConfirm,
  children,
  title = 'Удалить?',
  description = 'Действие необратимо. Вы уверены?',
  trigger,
}: {
  onConfirm: () => void | Promise<void>
  children?: React.ReactNode
  title?: string
  description?: string
  trigger: React.ReactNode
}) {
  const [open, setOpen] = useState(false)
  const [busy, setBusy] = useState(false)

  const handleConfirm = async () => {
    setBusy(true)
    try {
      await onConfirm()
      setOpen(false)
    } finally {
      setBusy(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <AlertTriangle className="size-5 text-destructive" />
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription>{description || children}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Отмена</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault()
              void handleConfirm()
            }}
            disabled={busy}
            className="bg-destructive text-white hover:bg-destructive/90"
          >
            {busy ? 'Удаление...' : 'Удалить'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export function ErrorState({ message }: { message: string }) {
  return (
    <Card className="p-6 text-sm text-destructive">
      Ошибка загрузки: {message}
    </Card>
  )
}

export function LoadingState({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className="h-10 w-full" />
      ))}
    </div>
  )
}

export function EmptyState({ message }: { message: string }) {
  return (
    <Card className="flex flex-col items-center justify-center gap-2 border-dashed p-10 text-sm text-muted-foreground">
      {message}
    </Card>
  )
}
