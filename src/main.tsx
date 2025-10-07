import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
// import Login from './pages/login.tsx'
import LoginPage from "./pages/login.tsx";
import RegisterPage from "./pages/register.tsx";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { ROUTES } from "./routes/routes.tsx";
import theme from "./theme/theme.ts";
import { ConfigProvider } from "antd";
// import Home from './pages/home.tsx'
import LayoutPage from "./layout/layout.tsx";
import HomePage from "./pages/home.tsx";
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ConfigProvider theme={theme}>
      <Router>
        <Routes>
          <Route element={<LayoutPage />}>
            <Route path={ROUTES.HOME} element={<HomePage />} />
          </Route>
          <Route path={ROUTES.LOGIN} element={<LoginPage />} />
          <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
        </Routes>
      </Router>
    </ConfigProvider>
  </StrictMode>
);
