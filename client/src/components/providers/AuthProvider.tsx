import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role?: 'superadmin' | 'admin' | 'vendor' | 'customer' | 'business';
  firstName?: string;
  lastName?: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: string;
  bio?: string;
  avatarUrl?: string;
  emailVerified?: boolean;
  phoneVerified?: boolean;
  twoFactorEnabled?: boolean;
  createdAt?: string;
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (name: string, email: string, password: string) => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('auth_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        localStorage.removeItem('auth_user');
      }
    }
    setIsLoading(false);
  }, []);

  // Keep auth state in sync with localStorage changes (e.g., logout route, other tabs)
  useEffect(() => {
    const onStorage = () => {
      const storedUser = localStorage.getItem('auth_user');
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch {
          setUser(null);
          localStorage.removeItem('auth_user');
        }
      } else {
        setUser(null);
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Call real backend API
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      // Support both { success, user } and { token, user } response shapes
      const returnedUser = data.user;
      if (!returnedUser) {
        throw new Error('Invalid response from server');
      }
      setUser(returnedUser);
      localStorage.setItem('auth_user', JSON.stringify(returnedUser));
      if (data.token) {
        localStorage.setItem('auth_token', data.token);
      }
    } catch (error: any) {
      throw new Error(error.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      // Call real backend API
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      const returnedUser = data.user;
      if (!returnedUser) {
        throw new Error('Invalid response from server');
      }
      setUser(returnedUser);
      localStorage.setItem('auth_user', JSON.stringify(returnedUser));
      if (data.token) {
        localStorage.setItem('auth_token', data.token);
      }
    } catch (error: any) {
      throw new Error(error.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('auth_user');
    localStorage.removeItem('auth_token');
    localStorage.removeItem('selected-role');
    try {
      window.dispatchEvent(new Event('storage'));
      window.dispatchEvent(new Event('updateHeaderCounts'));
    } catch {}
  };

  const value: AuthContextType = {
    user,
    isLoggedIn: !!user,
    login,
    logout,
    register,
    isLoading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};