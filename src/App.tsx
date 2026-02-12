import { Routes, Route } from 'react-router-dom'
import { Layout } from '@/components/layout/Layout'
import { ScrollToTop } from '@/components/ScrollToTop'
import { ToastProvider } from '@/components/ui/Toast'
import { AuthProvider } from '@/contexts/AuthContext'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import Home from '@/pages/Home'
import About from '@/pages/About'
import Events from '@/pages/Events'
import Projects from '@/pages/Projects'
import Join from '@/pages/Join'
import DashboardOverview from '@/pages/dashboard/DashboardOverview'
import DashboardEvents from '@/pages/dashboard/DashboardEvents'
import DashboardProjects from '@/pages/dashboard/DashboardProjects'
import DashboardSettings from '@/pages/dashboard/DashboardSettings'

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
          </Routes>
        </Layout>
      </ToastProvider>
    </AuthProvider>
  )
}
