import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
// import Login from './pages/login.tsx'
import LoginPage from './pages/login.tsx'
import RegisterPage from './pages/register.tsx'
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { ROUTES } from './routes/routes..tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path={ROUTES.LOGIN} element={<LoginPage />} />
        <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
      </Routes>
    </Router>
  </StrictMode>,
)
