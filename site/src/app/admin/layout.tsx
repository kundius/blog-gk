'use client'

import React, { useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import { Spinner } from '@components/Spinner'
import { AuthProvider, useAuth } from '@app/lib/admin/auth'
import { AdminShell } from '@components/admin/Shell'
import { Toaster } from '@components/ui/sonner'

function Gate({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const pathname = usePathname()
  const router = useRouter()

  const isLoginPage = pathname === '/admin/login'

  useEffect(() => {
    if (!loading && !user && !isLoginPage) {
      router.replace('/admin/login')
    }
  }, [loading, user, isLoginPage, router])

  useEffect(() => {
    document.title = adminPageTitle(pathname)
  }, [pathname])

  if (isLoginPage) {
    return <>{children}</>
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner />
      </div>
    )
  }

  if (!user) {
    return null
  }

  return <AdminShell>{children}</AdminShell>
}

const ADMIN_TITLES: Record<string, string> = {
  '/admin': 'Администрирование',
  '/admin/login': 'Вход в админку',
  '/admin/articles': 'Статьи',
  '/admin/articles/new': 'Новая статья',
  '/admin/categories': 'Категории',
  '/admin/comments': 'Комментарии',
  '/admin/files': 'Файлы',
  '/admin/subscribers': 'Подписчики',
  '/admin/albums': 'Альбомы',
  '/admin/albums/new': 'Новый альбом',
  '/admin/collections': 'Подборки',
  '/admin/collections/new': 'Новая подборка',
}

function adminPageTitle(pathname: string): string {
  const title = ADMIN_TITLES[pathname]
  if (title) return `${title} — админка`
  if (/^\/admin\/articles\/.+$/.test(pathname)) return 'Редактирование статьи — админка'
  if (/^\/admin\/albums\/.+$/.test(pathname)) return 'Редактирование альбома — админка'
  if (/^\/admin\/collections\/.+$/.test(pathname))
    return 'Редактирование подборки — админка'
  return 'Администрирование'
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <AuthProvider>
        <NuqsAdapter>
          <Gate>{children}</Gate>
          <Toaster />
        </NuqsAdapter>
      </AuthProvider>
    </>
  )
}
