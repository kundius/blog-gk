'use client'

import React, { createContext, useContext, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  FileText,
  FolderTree,
  Images,
  MessageSquare,
  Users,
  FolderOpen,
  LogOut,
} from 'lucide-react'

import { cn } from '@app/lib/utils'
import { Button } from '@components/ui/button'
import { Avatar, AvatarFallback } from '@components/ui/avatar'
import { Sheet, SheetContent } from '@components/ui/sheet'
import { useAuth } from '@app/lib/admin/auth'

const NAV_ITEMS = [
  { href: '/admin', label: 'Дашборд', icon: LayoutDashboard },
  { href: '/admin/articles', label: 'Статьи', icon: FileText },
  { href: '/admin/categories', label: 'Категории', icon: FolderTree },
  { href: '/admin/albums', label: 'Альбомы', icon: Images },
  { href: '/admin/comments', label: 'Комментарии', icon: MessageSquare },
  { href: '/admin/files', label: 'Файлы', icon: FolderOpen },
  { href: '/admin/subscribers', label: 'Подписчики', icon: Users },
]

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname()
  return (
    <nav className="flex flex-col gap-1 p-3">
      {NAV_ITEMS.map((item) => {
        const active =
          item.href === '/admin'
            ? pathname === '/admin'
            : pathname.startsWith(item.href)
        const Icon = item.icon
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
              active
                ? 'bg-red-400/10 text-red-600 dark:text-red-400'
                : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground',
            )}
          >
            <Icon className="size-4 shrink-0" />
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}

function BrandLink() {
  return (
    <Link href="/" target="_blank" rel="noreferrer" className="flex items-center gap-2.5">
      <img
        src="/images/logo.png"
        alt=""
        width={36}
        height={36}
        className="size-9 shrink-0"
      />
      <span className="text-sm font-semibold leading-tight uppercase">blog-gk.ru</span>
    </Link>
  )
}

function UserMenu() {
  const { user, logout } = useAuth()
  const initial = (user?.name || user?.email || '?').charAt(0).toUpperCase()
  return (
    <div className="flex items-center gap-2.5">
      <Avatar className="size-8 shrink-0">
        <AvatarFallback className="text-xs">{initial}</AvatarFallback>
      </Avatar>
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-medium leading-tight">
          {user?.name}
        </div>
        <div className="truncate text-xs leading-tight text-muted-foreground">
          {user?.email}
        </div>
      </div>
      <Button variant="ghost" size="icon-sm" onClick={logout} title="Выйти">
        <LogOut className="size-4" />
      </Button>
    </div>
  )
}

interface AdminShellContextValue {
  openMobile: boolean
  setOpenMobile: (open: boolean) => void
}

const AdminShellContext = createContext<AdminShellContextValue>({
  openMobile: false,
  setOpenMobile: () => {},
})

export function useAdminShell() {
  return useContext(AdminShellContext)
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  const [openMobile, setOpenMobile] = useState(false)

  return (
    <AdminShellContext.Provider value={{ openMobile, setOpenMobile }}>
      <div className="admin-page-bg min-h-svh text-foreground">
        <div className="mx-auto flex min-h-svh w-full max-w-[1440px]">
          <aside className="sticky top-0 hidden h-svh w-64 shrink-0 p-2 lg:block">
            <div className="flex h-full flex-col">
              <div className="flex h-14 shrink-0 items-center px-4">
                <BrandLink />
              </div>
              <div className="flex-1 overflow-y-auto">
                <NavLinks />
              </div>
              <div className="shrink-0 border-t p-2">
                <UserMenu />
              </div>
            </div>
          </aside>

          <div className="flex min-w-0 flex-1 flex-col p-2 md:p-3">
            <div className="flex flex-1 flex-col overflow-hidden rounded-xl bg-background shadow-sm">
              <main className="flex-1 p-4 md:p-6">{children}</main>
            </div>
          </div>
        </div>
      </div>

      <Sheet open={openMobile} onOpenChange={setOpenMobile}>
        <SheetContent side="left" className="flex w-64 flex-col p-0">
          <div className="flex h-14 shrink-0 items-center border-b px-4">
            <BrandLink />
          </div>
          <div className="flex-1 overflow-y-auto">
            <NavLinks onNavigate={() => setOpenMobile(false)} />
          </div>
          <div className="shrink-0 border-t p-2">
            <UserMenu />
          </div>
        </SheetContent>
      </Sheet>
    </AdminShellContext.Provider>
  )
}
