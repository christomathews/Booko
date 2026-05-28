import React, { createContext, useContext, useState } from 'react';
import type { User } from '../types';
import { storage } from '../utils/storage';

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => boolean;
  signup: (username: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(storage.getCurrentUser());

  const login = (username: string, password: string) => {
    const users = storage.getUsers();
    const foundUser = users.find(u => u.username === username && u.password === password);
    if (foundUser) {
      const { password: _, ...userSafe } = foundUser;
      setUser(userSafe as User);
      storage.setCurrentUser(userSafe as User);
      return true;
    }
    return false;
  };

  const signup = (username: string, password: string) => {
    const users = storage.getUsers();
    if (users.find(u => u.username === username)) return false;
    
    const newUser: User = { id: Math.random().toString(36).substr(2, 9), username, password };
    storage.setUsers([...users, newUser]);
    
    const { password: _, ...userSafe } = newUser;
    setUser(userSafe as User);
    storage.setCurrentUser(userSafe as User);
    return true;
  };

  const logout = () => {
    setUser(null);
    storage.setCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
