
import { useState, useEffect, createContext, useContext, ReactNode } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  updateCredentials: (newUsername: string, newPassword: string) => void;
  currentUsername: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEFAULT_USERNAME = 'alalwanicom';
const DEFAULT_PASSWORD = '6e6a1f4170ec6859fc7957fbaca8455c';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [credentials, setCredentials] = useState(() => {
    const saved = localStorage.getItem('admin-credentials');
    return saved ? JSON.parse(saved) : { username: DEFAULT_USERNAME, password: DEFAULT_PASSWORD };
  });

  useEffect(() => {
    const authStatus = sessionStorage.getItem('admin-auth');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const login = (username: string, password: string): boolean => {
    if (username === credentials.username && password === credentials.password) {
      setIsAuthenticated(true);
      sessionStorage.setItem('admin-auth', 'true');
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('admin-auth');
  };

  const updateCredentials = (newUsername: string, newPassword: string) => {
    const newCredentials = { username: newUsername, password: newPassword };
    setCredentials(newCredentials);
    localStorage.setItem('admin-credentials', JSON.stringify(newCredentials));
  };

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      login,
      logout,
      updateCredentials,
      currentUsername: credentials.username
    }}>
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
