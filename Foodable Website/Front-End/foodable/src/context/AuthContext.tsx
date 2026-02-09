import React, { createContext, useState, useContext, useCallback, ReactNode } from 'react';
import { UserData } from '../types';
import logger from '../utils/logger';

interface AuthContextType {
  user: UserData | null;
  isAuthenticated: boolean;
  login: (email: string, token: string) => void;
  logout: () => void;
  updateUser: (userData: UserData) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserData | null>(() => {
    // Check if user is already logged in
    const jwt = sessionStorage.getItem('jwt');
    return jwt ? { email: '' } : null; // TODO: Decode JWT to get user info
  });

  const login = useCallback((email: string, token: string): void => {
    sessionStorage.setItem('jwt', token);
    setUser({ email });
    logger.debug('User logged in:', email);
  }, []);

  const logout = useCallback((): void => {
    sessionStorage.removeItem('jwt');
    setUser(null);
    logger.debug('User logged out');
  }, []);

  const updateUser = useCallback((userData: UserData): void => {
    setUser(prevUser => ({
      ...prevUser,
      ...userData,
    }));
  }, []);

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
