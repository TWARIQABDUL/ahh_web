import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
// import Login from './pages/login.tsx'
import LoginPage from "./pages/login.tsx";
import RegisterPage from "./pages/register.tsx";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { ROUTES } from "./routes/routes..tsx";
import theme from "./theme/theme.ts";
import { ConfigProvider } from "antd";
// import Home from './pages/home.tsx'
import LayoutPage from "./layout/layout.tsx";
import HomePage from "./pages/home.tsx";
createRoot(document.getElementById("root")!).render(
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
              <Route
                path={ROUTES.RESOURCE_CENTER}
                element={<ResourceCenterPage />}
              />
              <Route path={ROUTES.SETTINGS} element={<SettingsPage />} />
              <Route path={ROUTES.VENTURES} element={<VenturesPage />} />
              <Route
                path={ROUTES.APLICATION}
                element={<Programapplicationpage />}
              />
            </Route>
          </Routes>
        </AuthProvider>
      </Router>
    </ConfigProvider>
  </StrictMode>
);
