import { type ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import { Navbar } from './Navbar'
import { Footer } from './Footer'

interface LayoutProps {
  children: ReactNode
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation()
  const isAppPage = location.pathname.startsWith('/dashboard') || location.pathname.startsWith('/admin')

  return (
    <div className="min-h-screen flex flex-col bg-surface dark:bg-dark-bg transition-colors">
      <Navbar />
      <main className={`flex-1${isAppPage ? '' : ' pt-16 md:pt-20'}`}>
        {children}
      </main>
      {!isAppPage && <Footer />}
    </div>
  )
}
