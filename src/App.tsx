import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { Layout } from '@/components/layout/Layout'
import { ScrollToTop } from '@/components/ScrollToTop'
import { ToastProvider } from '@/components/ui/Toast'
import { AuthProvider } from '@/contexts/AuthContext'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { AdminRoute } from '@/components/auth/AdminRoute'
import { RouteLoader } from '@/components/ui/PageLoader'

// Lazy load pages for better performance
const Home = lazy(() => import('@/pages/Home'))
const About = lazy(() => import('@/pages/About'))
const Events = lazy(() => import('@/pages/Events'))
const Projects = lazy(() => import('@/pages/Projects'))
const Blog = lazy(() => import('@/pages/Blog'))
const Article = lazy(() => import('@/pages/Article'))
const NotFound = lazy(() => import('@/pages/NotFound'))

// Admin pages
const AdminDashboard = lazy(() => import('@/pages/admin/AdminDashboard'))
const AdminMembers = lazy(() => import('@/pages/admin/AdminMembers'))
const AdminEvents = lazy(() => import('@/pages/admin/AdminEvents'))
const AdminProjects = lazy(() => import('@/pages/admin/AdminProjects'))
const AdminContent = lazy(() => import('@/pages/admin/AdminContent'))

export default function App() {
  return (
    <HelmetProvider>
      <ThemeProvider>
        <AuthProvider>
          <ToastProvider>
            <Layout>
            <ScrollToTop />
            <Suspense fallback={<RouteLoader />}>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/events" element={<Events />} />
                <Route path="/projects" element={<Projects />} />

                {/* Blog Routes */}
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:slug" element={<Article />} />

                {/* Admin Routes (require admin/lead role) */}
                <Route
                  path="/admin"
                  element={
                    <AdminRoute>
                      <AdminDashboard />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/admin/members"
                  element={
                    <AdminRoute>
                      <AdminMembers />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/admin/events"
                  element={
                    <AdminRoute>
                      <AdminEvents />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/admin/projects"
                  element={
                    <AdminRoute>
                      <AdminProjects />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/admin/content"
                  element={
                    <AdminRoute>
                      <AdminContent />
                    </AdminRoute>
                  }
                />

                {/* 404 Catch-all Route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
              </Suspense>
            </Layout>
          </ToastProvider>
        </AuthProvider>
      </ThemeProvider>
    </HelmetProvider>
  )
}
