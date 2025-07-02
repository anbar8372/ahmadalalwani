
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

// Security: Hash function for password storage
const hashPassword = (password: string): string => {
  // Simple hash function - in production, use a proper hashing library
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(16);
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [credentials, setCredentials] = useState(() => {
    const saved = localStorage.getItem('admin-credentials');
    return saved ? JSON.parse(saved) : { 
      username: DEFAULT_USERNAME, 
      password: DEFAULT_PASSWORD 
    };
  });
  const [loginAttempts, setLoginAttempts] = useState(0);
  const maxAttempts = 5;

  useEffect(() => {
    const authStatus = sessionStorage.getItem('admin-auth');
    const lastActivity = sessionStorage.getItem('last-activity');
    const sessionTimeout = 30 * 60 * 1000; // 30 minutes
    
    if (authStatus === 'true' && lastActivity) {
      const timeSinceActivity = Date.now() - parseInt(lastActivity);
      if (timeSinceActivity < sessionTimeout) {
        setIsAuthenticated(true);
        // Update last activity
        sessionStorage.setItem('last-activity', Date.now().toString());
      } else {
        // Session expired
        logout();
      }
    }

    // Security: Clear login attempts after 15 minutes
    const lastAttemptTime = localStorage.getItem('last-login-attempt');
    if (lastAttemptTime) {
      const timeSinceLastAttempt = Date.now() - parseInt(lastAttemptTime);
      if (timeSinceLastAttempt > 15 * 60 * 1000) {
        setLoginAttempts(0);
        localStorage.removeItem('last-login-attempt');
      }
    }
  }, []);

  // Security: Update last activity on user interaction
  useEffect(() => {
    if (isAuthenticated) {
      const updateActivity = () => {
        sessionStorage.setItem('last-activity', Date.now().toString());
      };

      const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
      events.forEach(event => {
        document.addEventListener(event, updateActivity, true);
      });

      return () => {
        events.forEach(event => {
          document.removeEventListener(event, updateActivity, true);
        });
      };
    }
  }, [isAuthenticated]);

  const login = (username: string, password: string): boolean => {
    // Security: Rate limiting
    if (loginAttempts >= maxAttempts) {
      const lastAttemptTime = localStorage.getItem('last-login-attempt');
      if (lastAttemptTime) {
        const timeSinceLastAttempt = Date.now() - parseInt(lastAttemptTime);
        if (timeSinceLastAttempt < 15 * 60 * 1000) { // 15 minutes
          return false;
        }
      }
    }

    // Security: Input validation
    if (!username.trim() || !password.trim()) {
      setLoginAttempts(prev => prev + 1);
      localStorage.setItem('last-login-attempt', Date.now().toString());
      return false;
    }

    if (username === credentials.username && password === credentials.password) {
      setIsAuthenticated(true);
      sessionStorage.setItem('admin-auth', 'true');
      sessionStorage.setItem('last-activity', Date.now().toString());
      setLoginAttempts(0);
      localStorage.removeItem('last-login-attempt');
      
      // Security: Log successful login
      console.log('Admin login successful at:', new Date().toISOString());
      return true;
    } else {
      setLoginAttempts(prev => prev + 1);
      localStorage.setItem('last-login-attempt', Date.now().toString());
      
      // Security: Log failed login attempt
      console.warn('Failed login attempt for username:', username, 'at:', new Date().toISOString());
      return false;
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('admin-auth');
    sessionStorage.removeItem('last-activity');
    
    // Security: Log logout
    console.log('Admin logout at:', new Date().toISOString());
  };

  const updateCredentials = (newUsername: string, newPassword: string) => {
    // Security: Validate new credentials
    if (!newUsername.trim() || newUsername.length < 3) {
      throw new Error('اسم المستخدم يجب أن يكون 3 أحرف على الأقل');
    }
    
    if (!newPassword.trim() || newPassword.length < 8) {
      throw new Error('كلمة المرور يجب أن تكون 8 أحرف على الأقل');
    }

    // Security: Password strength validation
    const hasUpperCase = /[A-Z]/.test(newPassword);
    const hasLowerCase = /[a-z]/.test(newPassword);
    const hasNumbers = /\d/.test(newPassword);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword);
    
    if (!(hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar)) {
      throw new Error('كلمة المرور يجب أن تحتوي على أحرف كبيرة وصغيرة وأرقام ورموز خاصة');
    }

    const newCredentials = { 
      username: newUsername.trim(), 
      password: hashPassword(newPassword) 
    };
    setCredentials(newCredentials);
    localStorage.setItem('admin-credentials', JSON.stringify(newCredentials));
    
    // Security: Log credential update
    console.log('Admin credentials updated at:', new Date().toISOString());
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
