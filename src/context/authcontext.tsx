// context/authcontext.tsx
import React, { createContext, useState, useEffect, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode, type JwtPayload } from "jwt-decode";
import { message } from "antd";
import { ROUTES } from "../routes/routes";

interface AuthContextType {
  user: any;
  accessToken: string | null;
  login: (values: LoginFormValues) => Promise<void>;
  logout: () => void;
  loading: boolean;
  isInitialized: boolean;
}

interface LoginFormValues {
  email: string;
  password: string;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    const storedToken = localStorage.getItem("access_token");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      try {
        const decoded = jwtDecode<JwtPayload>(storedToken);
        const now = Date.now() / 1000;

        if (decoded.exp && decoded.exp > now) {
          setAccessToken(storedToken);
          setUser(JSON.parse(storedUser));
        } else {
          logout();
        }
      } catch (err) {
        console.error("Invalid token:", err);
        logout();
      }
    }
    setIsInitialized(true); // ✅ mark done
  }, []);

  const login = async (values: LoginFormValues) => {
    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await response.json();
      if (response.ok) {
        messageApi.success("Login successful!");
        localStorage.setItem("access_token", data.access_token);
        localStorage.setItem("user", JSON.stringify(data.user));
        setAccessToken(data.access_token);
        setUser(data.user);
        navigate(ROUTES.DASHBOARD);
      } else {
        messageApi.error(data.detail || "Invalid credentials");
      }
    } catch (error) {
      messageApi.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.clear();
    setAccessToken(null);
    setUser(null);
    navigate(ROUTES.LOGIN);
  };

  return (
    <AuthContext.Provider value={{ user, accessToken, login, logout, loading, isInitialized }}>
      {contextHolder}
      {children}
    </AuthContext.Provider>
  );
};
