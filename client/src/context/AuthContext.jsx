import { createContext, useState, useEffect } from 'react';
import API from '../utils/api';

/**
 * AuthContext
 * Manages authentication state and user information
 */
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  /**
   * Check if user is logged in on component mount
   */
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await API.get('/auth/me');
        if (response.data.success) {
          setUser(response.data.user);
          setIsAuthenticated(true);
        }
      } catch (error) {
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  /**
   * Login user
   */
  const login = async (email, password) => {
    try {
      const response = await API.post('/auth/login', { email, password });
      setUser(response.data.user);
      setIsAuthenticated(true);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Login failed' };
    }
  };

  /**
   * Register user
   */
  const register = async (email, password) => {
    try {
      const response = await API.post('/auth/register', { email, password });
      setUser(response.data.user);
      setIsAuthenticated(true);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Registration failed' };
    }
  };

  /**
   * Logout user
   */
  const logout = async () => {
    try {
      await API.post('/auth/logout');
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, isAuthenticated, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
