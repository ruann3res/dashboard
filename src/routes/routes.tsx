import { Routes, Route, Navigate } from 'react-router-dom'
import { ActuatorPage, ProjectsPage, DevicePage, SettingsPage, MonitorPage, NotFoundPage } from '@/pages/App'
import { LoginPage, RegisterPage, VerifyPage } from '@/pages/Auth'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { ScientistRoute } from '@/components/ScientistRoute'
import { GuestRoute } from '@/components/GuestRoute'
import { useCurrentUser } from '@/hooks/use-current-user'

const HomePage = () => {
  const { isEnthusiast } = useCurrentUser()
  if (isEnthusiast) {
    return <Navigate to="/monitor" replace />
  }
  return <ProjectsPage />
}

export const AppRoutes = () => {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <GuestRoute>
            <LoginPage />
          </GuestRoute>
        }
      />
      <Route
        path="/register"
        element={
          <GuestRoute>
            <RegisterPage />
          </GuestRoute>
        }
      />
      <Route
        path="/verify"
        element={
          <GuestRoute>
            <VerifyPage />
          </GuestRoute>
        }
      />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/actuators"
        element={
          <ProtectedRoute>
            <ScientistRoute>
              <ActuatorPage />
            </ScientistRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/devices"
        element={
          <ProtectedRoute>
            <ScientistRoute>
              <DevicePage />
            </ScientistRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/monitor"
        element={
          <ProtectedRoute>
            <MonitorPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <ScientistRoute>
              <SettingsPage />
            </ScientistRoute>
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}