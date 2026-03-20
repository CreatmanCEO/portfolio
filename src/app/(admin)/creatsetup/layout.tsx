"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { SessionProvider } from 'next-auth/react'
import {
  LayoutDashboard,
  FileText,
  FolderOpen,
  BookOpen,
  BarChart3,
  LogOut,
} from 'lucide-react'

const navItems = [
  { href: '/creatsetup', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/creatsetup/content', label: 'Content', icon: FileText },
  { href: '/creatsetup/projects', label: 'Projects', icon: FolderOpen },
  { href: '/creatsetup/blog', label: 'Blog', icon: BookOpen },
  { href: '/creatsetup/analytics', label: 'Analytics', icon: BarChart3 },
]

function AdminLayoutInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  // Don't show admin layout on login page
  if (pathname === '/creatsetup/login') {
    return <>{children}</>
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-surface">
        <div className="p-6">
          <h1 className="text-lg font-bold">CREATSETUP</h1>
        </div>
        <nav className="space-y-1 px-3">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive =
              pathname === item.href ||
              (item.href !== '/creatsetup' && pathname.startsWith(item.href))
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                  isActive
                    ? 'bg-accent/10 font-medium text-accent'
                    : 'text-muted hover:bg-accent/5 hover:text-foreground'
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            )
          })}
        </nav>
        <div className="mt-auto border-t border-border p-3">
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted transition-colors hover:bg-accent/5 hover:text-foreground"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8">{children}</main>
    </div>
  )
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SessionProvider>
      <AdminLayoutInner>{children}</AdminLayoutInner>
    </SessionProvider>
  )
}
