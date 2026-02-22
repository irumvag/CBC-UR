import { type ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import { Header } from './Header'
import { Footer } from './Footer'

interface LayoutProps {
  children: ReactNode
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation()
  const isAdminPage = location.pathname.startsWith('/admin')

  return (
    <div className="min-h-screen flex flex-col bg-surface dark:bg-dark-bg transition-colors">
      {!isAdminPage && <Header />}
      <main className="flex-1">
        {children}
      </main>
      {!isAdminPage && <Footer />}
    </div>
  )
}
