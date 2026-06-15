import { createContext, useContext, useState, type ReactNode } from 'react';

interface AuthContextValue {
  user: any | null;
  isAuthenticated: boolean;
  setAuthenticatedUser: (user: any) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const AUTH_USER_STORAGE_KEY = 'vaultnest-auth-user';

function getStoredUser() {
  const storedUser = sessionStorage.getItem(AUTH_USER_STORAGE_KEY);
  return storedUser ? JSON.parse(storedUser) : null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any | null>(() => getStoredUser());

  const setAuthenticatedUser = (authenticatedUser: any) => {
    setUser(authenticatedUser);
    sessionStorage.setItem(AUTH_USER_STORAGE_KEY, JSON.stringify(authenticatedUser));
  };

  const logout = () => {
    sessionStorage.clear();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, setAuthenticatedUser, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
