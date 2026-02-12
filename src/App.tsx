import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { Layout } from '@/components/layout/Layout'
import { ScrollToTop } from '@/components/ScrollToTop'
import { ToastProvider } from '@/components/ui/Toast'
import { AuthProvider } from '@/contexts/AuthContext'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { AdminRoute } from '@/components/auth/AdminRoute'
import { RouteLoader } from '@/components/ui/PageLoader'

// Lazy load pages for better performance
const Home = lazy(() => import('@/pages/Home'))
const About = lazy(() => import('@/pages/About'))
const Events = lazy(() => import('@/pages/Events'))
const Projects = lazy(() => import('@/pages/Projects'))
const Join = lazy(() => import('@/pages/Join'))
const Blog = lazy(() => import('@/pages/Blog'))
const Article = lazy(() => import('@/pages/Article'))
const ArticleEditor = lazy(() => import('@/pages/ArticleEditor'))
const NotFound = lazy(() => import('@/pages/NotFound'))

// Dashboard pages
const DashboardOverview = lazy(() => import('@/pages/dashboard/DashboardOverview'))
const DashboardEvents = lazy(() => import('@/pages/dashboard/DashboardEvents'))
const DashboardProjects = lazy(() => import('@/pages/dashboard/DashboardProjects'))
const DashboardSettings = lazy(() => import('@/pages/dashboard/DashboardSettings'))

// Admin pages
const AdminDashboard = lazy(() => import('@/pages/admin/AdminDashboard'))
const AdminMembers = lazy(() => import('@/pages/admin/AdminMembers'))
const AdminEvents = lazy(() => import('@/pages/admin/AdminEvents'))
const AdminProjects = lazy(() => import('@/pages/admin/AdminProjects'))

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
                <Route path="/join" element={<Join />} />

                {/* Blog Routes */}
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:slug" element={<Article />} />
                <Route
                  path="/blog/new"
                  element={
                    <ProtectedRoute>
                      <ArticleEditor />
                    </ProtectedRoute>
                  }
                />

                {/* Protected Dashboard Routes */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <DashboardOverview />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard/events"
                  element={
                    <ProtectedRoute>
                      <DashboardEvents />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard/projects"
                  element={
                    <ProtectedRoute>
                      <DashboardProjects />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard/settings"
                  element={
                    <ProtectedRoute>
                      <DashboardSettings />
                    </ProtectedRoute>
                  }
                />

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
