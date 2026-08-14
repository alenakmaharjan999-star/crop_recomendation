
// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import { registerUser, loginUser } from '../api/apiClient';

const AuthContext = createContext(null);

function getStoredUser() {
  const storedUser = localStorage.getItem('user');
  if (!storedUser) return null;

  try {
    return JSON.parse(storedUser);
  } catch {
    localStorage.removeItem('user');
    return null;
  }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [user, setUser] = useState(getStoredUser);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  // ============ REGISTER ============
  const register = async (username, password, confirmPassword) => {
    setLoading(true);
    try {
      const response = await registerUser({ username, password, confirmPassword });
      
      // response.data = { token, user: { userId, username } }
      setToken(response.data.token);
      setUser(response.data.user);
      
      return { success: true, user: response.data.user };
    } catch (error) {
      const message = error.response?.data?.error || error.message || 'Registration failed';
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  // ============ LOGIN ============
  const login = async (username, password) => {
    setLoading(true);
    try {
      const response = await loginUser({ username, password });
      
      // response.data = { token, user: { userId, username } }
      setToken(response.data.token);
      setUser(response.data.user);
      
      return { success: true, user: response.data.user };
    } catch (error) {
      const message = error.response?.data?.error || error.message || 'Login failed';
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  // ============ LOGOUT ============
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ 
      token, 
      user, 
      loading,
      login, 
      register,
      logout, 
      isAuthenticated: !!token && !!user 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}