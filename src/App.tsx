import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { Layout } from '@/components/layout/Layout'
import { ScrollToTop } from '@/components/ScrollToTop'
import { ToastProvider } from '@/components/ui/Toast'

// Lazy load pages for better performance
const Home = lazy(() => import('@/pages/Home'))
const About = lazy(() => import('@/pages/About'))
const Team = lazy(() => import('@/pages/Team'))
const Events = lazy(() => import('@/pages/Events'))
const Links = lazy(() => import('@/pages/Links'))
const Showcase = lazy(() => import('@/pages/Showcase'))
const LogicGame = lazy(() => import('@/pages/LogicGame'))
const NotFound = lazy(() => import('@/pages/NotFound'))

function RouteLoader() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
    </div>
  )
}

export default function App() {
  return (
    <HelmetProvider>
      <ToastProvider>
        <Layout>
          <ScrollToTop />
          <Suspense fallback={<RouteLoader />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/team" element={<Team />} />
              <Route path="/events" element={<Events />} />
              <Route path="/links" element={<Links />} />
              <Route path="/showcase" element={<Showcase />} />
              <Route path="/game" element={<LogicGame />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </Layout>
      </ToastProvider>
    </HelmetProvider>
  )
}
