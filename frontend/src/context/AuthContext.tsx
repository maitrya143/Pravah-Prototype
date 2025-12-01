import React, { createContext, useContext, useState, useEffect } from 'react';
import { api, setAuthToken, setUserData, getUserData } from '../utils/api';
import { useNavigate } from 'react-router-dom';

interface User {
  id: number;
  volunteer_id: string;
  full_name: string;
  city: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (volunteerId: string, password: string) => Promise<void>;
  signup: (volunteerId: string, fullName: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(getUserData());
  const [token, setToken] = useState<string | null>(localStorage.getItem('auth_token'));
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated on mount
    if (token) {
      api.getCurrentUser()
        .then((response) => {
          setUser(response.user);
          setUserData(response.user);
        })
        .catch(() => {
          logout();
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (volunteerId: string, password: string) => {
    try {
      const response = await api.login({ volunteer_id: volunteerId, password });
      setToken(response.token);
      setUser(response.user);
      setAuthToken(response.token);
      setUserData(response.user);
    } catch (error: any) {
      throw error;
    }
  };

  const signup = async (volunteerId: string, fullName: string, password: string) => {
    try {
      const response = await api.signup({
        volunteer_id: volunteerId,
        full_name: fullName,
        password,
      });
      setToken(response.token);
      setUser(response.user);
      setAuthToken(response.token);
      setUserData(response.user);
    } catch (error: any) {
      throw error;
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setAuthToken(null);
    setUserData(null);
    localStorage.removeItem('selected_center');
    navigate('/login');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        signup,
        logout,
        isAuthenticated: !!token && !!user,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

