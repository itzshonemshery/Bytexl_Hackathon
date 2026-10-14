import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "../types";
import { api, getAuthToken, setAuthToken, clearAuthToken } from "../services/api";

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (creds: { email: string; password: string }) => Promise<void>;
  signup: (data: any) => Promise<void>;
  demoLogin: () => Promise<void>;
  logout: () => void;
  updateUser: (data: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setTokenState] = useState<string | null>(getAuthToken());
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadUser() {
      const storedToken = getAuthToken();
      if (storedToken) {
        try {
          const userData = await api.getMe();
          setUser(userData);
        } catch (err) {
          console.warn("Session expired or invalid, logging out");
          clearAuthToken();
          setTokenState(null);
          setUser(null);
        }
      }
      setIsLoading(false);
    }
    loadUser();
  }, []);

  const login = async (creds: { email: string; password: string }) => {
    const res = await api.login(creds);
    setAuthToken(res.access_token);
    setTokenState(res.access_token);
    setUser(res.user);
  };

  const signup = async (data: any) => {
    const res = await api.signup(data);
    setAuthToken(res.access_token);
    setTokenState(res.access_token);
    setUser(res.user);
  };

  const demoLogin = async () => {
    const res = await api.demoLogin();
    setAuthToken(res.access_token);
    setTokenState(res.access_token);
    setUser(res.user);
  };

  const logout = () => {
    clearAuthToken();
    setTokenState(null);
    setUser(null);
  };

  const updateUser = async (data: Partial<User>) => {
    const updated = await api.updateProfile(data);
    setUser(updated);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        demoLogin,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
