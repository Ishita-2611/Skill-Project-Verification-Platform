import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ProjectProvider } from './context/ProjectContext'
import PrivateRoute from './components/PrivateRoute'

// Pages
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import ProfilePage from './pages/ProfilePage'
import ProjectsPage from './pages/ProjectsPage'
import UploadProjectPage from './pages/UploadProjectPage'
import ProjectDetailPage from './pages/ProjectDetailPage'
import VerificationListPage from './pages/VerificationListPage'
import VerifyProjectPage from './pages/VerifyProjectPage'

function App() {
  return (
    <Router>
      <AuthProvider>
        <ProjectProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Protected Routes */}
            <Route path="/dashboard" element={
              <PrivateRoute>
                <DashboardPage />
              </PrivateRoute>
            } />
            <Route path="/profile" element={
              <PrivateRoute>
                <ProfilePage />
              </PrivateRoute>
            } />
            <Route path="/projects" element={
              <PrivateRoute>
                <ProjectsPage />
              </PrivateRoute>
            } />
            <Route path="/projects/upload" element={
              <PrivateRoute>
                <UploadProjectPage />
              </PrivateRoute>
            } />
            <Route path="/projects/:projectId" element={
              <PrivateRoute>
                <ProjectDetailPage />
              </PrivateRoute>
            } />
            <Route path="/verify" element={
              <PrivateRoute>
                <VerificationListPage />
              </PrivateRoute>
            } />
            <Route path="/verify/:projectId" element={
              <PrivateRoute>
                <VerifyProjectPage />
              </PrivateRoute>
            } />

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </ProjectProvider>
      </AuthProvider>
    </Router>
  )
}

export default App
