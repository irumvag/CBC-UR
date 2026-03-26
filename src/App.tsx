import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { Layout } from '@/components/layout/Layout'
import { ScrollToTop } from '@/components/ScrollToTop'
import { ToastProvider } from '@/components/ui/Toast'
import { ProtectedRoute } from '@/components/admin/ProtectedRoute'

// Lazy load public pages
const Home = lazy(() => import('@/pages/Home'))
const About = lazy(() => import('@/pages/About'))
const Team = lazy(() => import('@/pages/Team'))
const Events = lazy(() => import('@/pages/Events'))
const Links = lazy(() => import('@/pages/Links'))
const Showcase = lazy(() => import('@/pages/Showcase'))
const LogicGame = lazy(() => import('@/pages/LogicGame'))
const Hackathon = lazy(() => import('@/pages/Hackathon'))
const NotFound = lazy(() => import('@/pages/NotFound'))

// Lazy load admin pages
const AdminLogin = lazy(() => import('@/pages/admin/AdminLogin'))
const AdminLayout = lazy(() => import('@/components/admin/AdminLayout'))
const AdminDashboard = lazy(() => import('@/pages/admin/AdminDashboard'))
const AdminTeam = lazy(() => import('@/pages/admin/AdminTeam'))
const AdminEvents = lazy(() => import('@/pages/admin/AdminEvents'))
const AdminProjects = lazy(() => import('@/pages/admin/AdminProjects'))
const AdminHackathon = lazy(() => import('@/pages/admin/AdminHackathon'))
const AdminContent = lazy(() => import('@/pages/admin/AdminContent'))
const AdminLinks = lazy(() => import('@/pages/admin/AdminLinks'))

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
              {/* Public routes */}
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/team" element={<Team />} />
              <Route path="/events" element={<Events />} />
              <Route path="/links" element={<Links />} />
              <Route path="/showcase" element={<Showcase />} />
              <Route path="/game" element={<LogicGame />} />
              <Route path="/hackathon" element={<Hackathon />} />

              {/* Admin routes */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <AdminLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<AdminDashboard />} />
                <Route path="team" element={<AdminTeam />} />
                <Route path="events" element={<AdminEvents />} />
                <Route path="projects" element={<AdminProjects />} />
                <Route path="hackathon" element={<AdminHackathon />} />
                <Route path="content" element={<AdminContent />} />
                <Route path="links" element={<AdminLinks />} />
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </Layout>
      </ToastProvider>
    </HelmetProvider>
  )
}
