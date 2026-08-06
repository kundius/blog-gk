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

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthProvider>
      <NuqsAdapter>
        <Gate>{children}</Gate>
        <Toaster />
      </NuqsAdapter>
    </AuthProvider>
  )
}
