import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
// import App from './App.tsx'
// import Login from './pages/login.tsx'
import LoginPage from './pages/login.tsx'
import RegisterPage from './pages/register.tsx'
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { ROUTES } from './routes/routes.tsx'
import theme from './theme/theme.ts'
import { ConfigProvider } from 'antd'
// import Home from './pages/home.tsx'
import LayoutPage from './layout/layout.tsx'
import HomePage from './pages/home.tsx'
import Dashboardlayout from './layout/dashboardlayout.tsx'
import DashboardPage from './pages/dashboard.tsx'
import MentorsPage from './pages/mentors.tsx'
import ProfilePage from './pages/profile.tsx'
import ProgramsPage from './pages/programs.tsx'
import ResourceCenterPage from './pages/resourcecenter.tsx'
import SettingsPage from './pages/setings.tsx'
import VenturesPage from './pages/ventures.tsx'
import Programapplicationpage from './pages/programapplicationpage.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ConfigProvider theme={theme}>
    <Router>
      <Routes>
        <Route element={<LayoutPage />}>
          <Route path={ROUTES.HOME} element={<HomePage />} />
        </Route>
        <Route path={ROUTES.DASHBOARD} element={<Dashboardlayout />}>
          <Route index element={<DashboardPage />} />
          <Route path={ROUTES.MENTORS} element={<MentorsPage />} />
          <Route path={ROUTES.PROFILE} element={<ProfilePage />} />
          <Route path={ROUTES.PROGRAMS} element={<ProgramsPage />} />
          <Route path={ROUTES.RESOURCE_CENTER} element={<ResourceCenterPage />} />
          <Route path={ROUTES.SETTINGS} element={<SettingsPage />} />
          <Route path={ROUTES.VENTURES} element={<VenturesPage />} />
          <Route path={ROUTES.APLICATION} element={<Programapplicationpage />} />

        </Route>
        <Route path={ROUTES.LOGIN} element={<LoginPage />} />
        <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
      </Routes>
    </Router>
    </ConfigProvider>
  </StrictMode>,
)
