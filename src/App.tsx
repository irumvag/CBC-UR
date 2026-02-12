import { Routes, Route } from 'react-router-dom'
import { Layout } from '@/components/layout/Layout'
import { ScrollToTop } from '@/components/ScrollToTop'
import { ToastProvider } from '@/components/ui/Toast'
import { AuthProvider } from '@/contexts/AuthContext'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { AdminRoute } from '@/components/auth/AdminRoute'
import Home from '@/pages/Home'
import About from '@/pages/About'
import Events from '@/pages/Events'
import Projects from '@/pages/Projects'
import Join from '@/pages/Join'
import DashboardOverview from '@/pages/dashboard/DashboardOverview'
import DashboardEvents from '@/pages/dashboard/DashboardEvents'
import DashboardProjects from '@/pages/dashboard/DashboardProjects'
import DashboardSettings from '@/pages/dashboard/DashboardSettings'
import AdminDashboard from '@/pages/admin/AdminDashboard'
import AdminMembers from '@/pages/admin/AdminMembers'
import AdminEvents from '@/pages/admin/AdminEvents'
import AdminProjects from '@/pages/admin/AdminProjects'

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Layout>
          <ScrollToTop />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/events" element={<Events />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/join" element={<Join />} />

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
          </Routes>
        </Layout>
      </ToastProvider>
    </AuthProvider>
  )
}
