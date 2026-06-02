import { createContext, useContext, useState, type ReactNode } from 'react';
import type { User } from '../types';

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => boolean;
  signup: (firstName: string, lastName: string, email: string, password: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const DEMO_CREDENTIALS = {
  email: 'demo@vaultnest.com',
  password: 'Demo@1234',
  firstName: 'Demo',
  lastName: 'User',
  id: 'demo-user',
};

// In-memory user store for signups during the session
const registeredUsers: Array<User & { password: string }> = [];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = (email: string, password: string): boolean => {
    const normalizedEmail = email.toLowerCase().trim();

    if (
      normalizedEmail === DEMO_CREDENTIALS.email &&
      password === DEMO_CREDENTIALS.password
    ) {
      setUser({
        id: DEMO_CREDENTIALS.id,
        firstName: DEMO_CREDENTIALS.firstName,
        lastName: DEMO_CREDENTIALS.lastName,
        email: DEMO_CREDENTIALS.email,
      });
      return true;
    }

    const found = registeredUsers.find(
      u => u.email === normalizedEmail && u.password === password
    );
    if (found) {
      setUser({ id: found.id, firstName: found.firstName, lastName: found.lastName, email: found.email });
      return true;
    }

    return false;
  };

  const signup = (firstName: string, lastName: string, email: string, password: string) => {
    const newUser: User & { password: string } = {
      id: `user-${Date.now()}`,
      firstName,
      lastName,
      email: email.toLowerCase().trim(),
      password,
    };
    registeredUsers.push(newUser);
    setUser({ id: newUser.id, firstName, lastName, email: newUser.email });
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
