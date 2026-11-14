import React, { createContext, useState } from 'react';
import authService from '../services/authService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // THIS is the magic fix. It checks localStorage instantly on load.
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const login = async (userData) => {
    const data = await authService.login(userData);
    setUser(data); 
  };

  const register = async (userData) => {
    const data = await authService.register(userData);
    setUser(data);
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const updateProfile = async (userData) => {
    const data = await authService.updateProfile(userData);
    setUser(data); 
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};