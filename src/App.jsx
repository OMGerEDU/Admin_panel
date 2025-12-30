import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { LanguageProvider } from './context/LanguageContext'
import { ThemeProvider } from './context/ThemeContext'
import RootLayout from './layouts/RootLayout'
import DashboardLayout from './layouts/DashboardLayout'
import AuthLayout from './layouts/AuthLayout'
import LandingPage from './pages/LandingPage'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import Chats from './pages/Chats'
import Numbers from './pages/Numbers'
import Webhooks from './pages/Webhooks'
import Logs from './pages/Logs'
import Automation from './pages/Automation'
import Settings from './pages/Settings'
import Extension from './pages/Extension'
import OrganizationSettings from './pages/OrganizationSettings'
import OrganizationOverview from './pages/OrganizationOverview'
import Plans from './pages/Plans'
import ScheduledMessages from './pages/ScheduledMessages'
import ScheduledMessageEdit from './pages/ScheduledMessageEdit'
import PrivacyPolicy from './pages/PrivacyPolicy'
import Support from './pages/Support'
import './index.css'

function App() {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <ThemeProvider>
          <AuthProvider>
            <Routes>
              <Route element={<RootLayout />}>
                {/* Public */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/support" element={<Support />} />

                {/* Auth */}
                <Route element={<AuthLayout />}>
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                </Route>

                {/* Dashboard */}
                <Route path="/app" element={<DashboardLayout />}>
                  <Route index element={<Navigate to="/app/dashboard" replace />} />
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="chats/:numberId/:remoteJid" element={<Chats />} />
                  <Route path="chats/:numberId" element={<Chats />} />
                  <Route path="chats" element={<Chats />} />
                  <Route path="numbers" element={<Numbers />} />
                  <Route path="scheduled" element={<ScheduledMessages />} />
                  <Route path="scheduled/new" element={<ScheduledMessageEdit />} />
                  <Route path="scheduled/:id" element={<ScheduledMessageEdit />} />
                  <Route path="webhooks" element={<Webhooks />} />
                  <Route path="logs" element={<Logs />} />
                  <Route path="automation" element={<Automation />} />
                  <Route path="plans" element={<Plans />} />
                  <Route path="settings" element={<Settings />} />
                  <Route path="organization" element={<OrganizationOverview />} />
                  <Route path="organization/:orgId" element={<OrganizationSettings />} />
                  <Route path="extension" element={<Extension />} />
                </Route>
              </Route>
            </Routes>
          </AuthProvider>
        </ThemeProvider>
      </LanguageProvider>
    </BrowserRouter>
  )
}

export default App
