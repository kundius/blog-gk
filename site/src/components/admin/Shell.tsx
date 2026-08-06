'use client'

import React, { useState } from 'react'
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
  Menu,
  LogOut,
} from 'lucide-react'

import { cn } from '@app/lib/utils'
import { Button } from '@components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@components/ui/avatar'
import { Sheet, SheetContent, SheetTrigger } from '@components/ui/sheet'
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
                ? 'bg-muted text-foreground'
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

function UserMenu() {
  const { user, logout } = useAuth()
  const initial = (user?.name || user?.email || '?').charAt(0).toUpperCase()
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Avatar className="size-8">
            <AvatarFallback className="text-xs">{initial}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col">
            <span className="text-sm font-medium">{user?.name}</span>
            <span className="text-xs text-muted-foreground">{user?.email}</span>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={logout}>
          <LogOut className="size-4" />
          Выйти
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background text-foreground">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 border-r bg-background lg:block">
        <div className="flex h-14 items-center border-b px-4">
          <Link href="/admin" className="text-lg font-semibold tracking-tight">
            Админка
          </Link>
        </div>
        <NavLinks />
      </aside>

      <div className="lg:pl-60">
        <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b bg-background/95 px-4 backdrop-blur">
          <div className="flex items-center gap-2">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="size-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-0">
                <div className="flex h-14 items-center border-b px-4">
                  <span className="text-lg font-semibold tracking-tight">
                    Админка
                  </span>
                </div>
                <NavLinks onNavigate={() => setOpen(false)} />
              </SheetContent>
            </Sheet>
            <span className="text-sm text-muted-foreground">
              blog-gk / администрирование
            </span>
          </div>
          <UserMenu />
        </header>

        <main className="p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
}
