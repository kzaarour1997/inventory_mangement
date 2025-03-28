import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/axios';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setIsAuthenticated(false);
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const response = await api.get('/user');
      setUser(response.data);
      setIsAuthenticated(true);
    } catch (error) {
      localStorage.removeItem('token');
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (username, password) => {
    try {
      const response = await api.post('/login', {
        username,
        password,
      });
      
      const { status, user, authorization } = response.data;
      if (status === 'success' && authorization.token) {
        localStorage.setItem('token', authorization.token);
        setIsAuthenticated(true);
        setUser(user);
        return true;
      } else {
        throw new Error('Invalid login response');
      }
    } catch (error) {
      if (error.response) {
        // Server responded with an error
        if (error.response.status === 401) {
          throw new Error('Invalid username or password');
        } else if (error.response.status === 422) {
          const validationErrors = error.response.data;
          const errorMessages = Object.values(validationErrors).flat();
          throw new Error(errorMessages.join(', '));
        }
      }
      throw new Error('Unable to connect to the server. Please try again later.');
    }
  };

  const register = async (name, email, username, password) => {
    try {
      const registerResponse = await api.post('/register', {
        name,
        email,
        username,
        password,
      });

      const { status, user, authorization } = registerResponse.data;
      if (status === 'success' && authorization.token) {
        localStorage.setItem('token', authorization.token);
        setIsAuthenticated(true);
        setUser(user);
        return true;
      } else {
        throw new Error('Invalid register response');
      }
    } catch (error) {
      if (error.response) {
        // Handle validation errors
        if (error.response.status === 422) {
          const validationErrors = error.response.data;
          const errorMessages = [];
          
          // Format validation errors
          Object.entries(validationErrors).forEach(([field, messages]) => {
            if (Array.isArray(messages)) {
              errorMessages.push(...messages);
            } else {
              errorMessages.push(messages);
            }
          });
          
          throw new Error(errorMessages.join('\n'));
        }
        // Handle other server errors
        throw new Error(error.response.data.message || 'Registration failed');
      }
      throw new Error('Unable to connect to the server. Please try again later.');
    }
  };

  const logout = async () => {
    try {
      // Call logout endpoint if your API has one
      // await api.post('/logout');
    } catch (error) {
      // Handle error silently
    } finally {
      localStorage.removeItem('token');
      setIsAuthenticated(false);
      setUser(null);
    }
  };

  if (loading) {
    return null; // or a loading spinner
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}; 