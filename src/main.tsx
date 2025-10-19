import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { Route, BrowserRouter as Router, Routes } from "react-router-dom"
import { ConfigProvider } from 'antd'
import theme from './theme/theme.ts'
import { ROUTES } from './routes/routes.tsx'

import { AuthProvider } from './context/authcontext.tsx'
// import ProtectedRoute from './routes/ProtectedRoute.tsx'

// Pages
import LayoutPage from './layout/layout.tsx'
import HomePage from './pages/home.tsx'
import LoginPage from './pages/login.tsx'
import RegisterPage from './pages/register.tsx'
import Dashboardlayout from './layout/dashboardlayout.tsx'
import DashboardPage from './pages/dashboard.tsx'
import MentorsPage from './pages/mentors.tsx'
// import ProfilePage from './pages/profile.tsx'
import ProgramsPage from './pages/programs.tsx'
import ResourceCenterPage from './pages/resourcecenter.tsx'
import SettingsPage from './pages/setings.tsx'
import VenturesPage from './pages/ventures.tsx'
import Programapplicationpage from './pages/programapplicationpage.tsx'
import ProtectedRoute from './routes/protectedroute.tsx'
import ProfilesPage from './pages/profilepage.tsx'
import AllUsers from './pages/allUsers.tsx'
import RequestPage from './pages/requests.tsx'
import MenteeMentorsPgae from './pages/menteementorsPgae.tsx'
import MentorResources from './components/mentorResourceComp.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ConfigProvider theme={theme}>
      <Router>
        <AuthProvider>
          <Routes>
            {/* Public routes */}
            <Route element={<LayoutPage />}>
              <Route path={ROUTES.HOME} element={<HomePage />} />
            </Route>
            <Route path={ROUTES.LOGIN} element={<LoginPage />} />
            <Route path={ROUTES.REGISTER} element={<RegisterPage />} />

            {/* Protected routes */}
            <Route
              path={ROUTES.DASHBOARD}
              element={
                <ProtectedRoute>
                  <Dashboardlayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<DashboardPage />} />
              <Route path={ROUTES.MENTORS} element={<MentorsPage />} />
              <Route path={ROUTES.PROFILE} element={<ProfilesPage />} />
              <Route path={ROUTES.PROGRAMS} element={<ProgramsPage />} />
              <Route path={ROUTES.RESOURCE_CENTER} element={<ResourceCenterPage />} />
              <Route path={ROUTES.SETTINGS} element={<SettingsPage />} />
              <Route path={ROUTES.VENTURES} element={<VenturesPage />} />
              <Route path={ROUTES.APLICATION} element={<Programapplicationpage />} />
              <Route path={ROUTES.USER} element={<AllUsers />} />
              <Route path={ROUTES.REQUESTS} element={<RequestPage />} />
              <Route path={ROUTES.MYMENTORS} element={<MenteeMentorsPgae />} />
              <Route path={ROUTES.RESOURCES} element={<MentorResources />} />





            </Route>
          </Routes>
        </AuthProvider>
      </Router>
    </ConfigProvider>
  </StrictMode>
)