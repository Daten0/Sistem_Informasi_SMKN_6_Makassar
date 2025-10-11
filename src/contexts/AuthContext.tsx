import React, { createContext, useState, useEffect, ReactNode, useContext } from 'react';

export default interface User {
  id: string;
  name: string;
  username: string;
  role: 'admin' | 'user';
  nip: string;
  title: string;
  birthDate: string;
  region: string;
  address: string;
  religion: string;
}

interface AuthContextType {
  currentUser: User | null;
  login: (user: User) => void;
  logout: () => void;
  register: (user: Omit<User, 'id' | 'role'>) => void;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = (user: User) => {
    localStorage.setItem('currentUser', JSON.stringify(user));
    setCurrentUser(user);
  };

  const logout = () => {
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
  };

  const register = (userData: Omit<User, 'id' | 'role'>) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const newUser: User = {
      ...userData,
      id: new Date().toISOString(),
      role: 'user', // default role
    };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    console.log('User registered:', newUser);
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, register, loading }}>
      {!loading && children}
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