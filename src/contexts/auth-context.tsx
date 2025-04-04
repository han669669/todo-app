import { createContext, useState, useEffect, ReactNode, useContext } from 'react';
import { account, ID } from '../lib/appwriteConfig';
import { migrateLocalTodosToAppwrite } from '../utils/migrateTodos';
import { addToast } from '@heroui/toast';

interface AuthContextType {
  user: any;
  loading: boolean;
  isAuthenticated: boolean;
  otpData: {
    email: string;
    securityPhrase: string;
    otpSent: boolean;
    userId: string;
  };
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  initiateOTP: (email: string) => Promise<void>;
  verifyOTP: (secret: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>(null!);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [otpData, setOtpData] = useState({
    email: '',
    securityPhrase: '',
    otpSent: false,
    userId: ''
  });

  useEffect(() => {
    const checkSession = async () => {
      try {
        const current = await account.get();
        setUser(current);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    
    checkSession();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      // Delete any existing session first
      try {
        await account.deleteSession('current');
      } catch (error) {
        // Ignore if no session exists
      }
      
      await account.createEmailPasswordSession(email, password);
      const current = await account.get();
      setUser(current);
      
      addToast({
        title: 'Login Successful',
        description: `Welcome back, ${current.name}`,
        variant: 'flat',
        color: 'success',
        timeout: 3000
      });

      // Check for local todos to migrate
      const localTodos = JSON.parse(localStorage.getItem('todos') || '[]');
      if (localTodos.length) {
        await migrateLocalTodosToAppwrite(localTodos, current.$id);
        localStorage.removeItem('todos');
      }
    } catch (error) {
      addToast({
        title: 'Login Failed',
        description: error instanceof Error ? error.message : 'Invalid credentials',
        variant: 'flat',
        color: 'danger',
        timeout: 3000
      });
      throw error;
    }
  };

  const signup = async (email: string, password: string, name: string) => {
    try {
      // Delete any existing session first
      try {
        await account.deleteSession('current');
      } catch (error) {
        // Ignore if no session exists
      }

      await account.create(ID.unique(), email, password, name);
      // Skip login for OTP flow - will be handled by OTP verification
      if (!password.includes('A1!')) { // Check if it's not our generated OTP password
        await login(email, password);
      }
      
      addToast({
        title: 'Account Created',
        description: 'Your account has been successfully created',
        variant: 'flat',
        color: 'success',
        timeout: 3000
      });
    } catch (error) {
      addToast({
        title: 'Signup Failed',
        description: error instanceof Error ? error.message : 'Registration failed',
        variant: 'flat',
        color: 'danger',
        timeout: 3000
      });
      throw error;
    }
  };

  const logout = async () => {
    try {
      await account.deleteSession('current');
      setUser(null);
      addToast({
        title: 'Logged Out',
        description: 'You have been successfully logged out',
        variant: 'flat',
        color: 'default',
        timeout: 3000
      });
    } catch (error) {
      addToast({
        title: 'Logout Failed',
        description: error instanceof Error ? error.message : 'Failed to logout',
        variant: 'flat',
        color: 'danger',
        timeout: 3000
      });
      throw error;
    }
  };

  const initiateOTP = async (email: string) => {
    try {
      const sessionToken = await account.createEmailToken(
        ID.unique(),
        email,
        true // Enable security phrase
      );
      
      setOtpData({
        email,
        securityPhrase: sessionToken.phrase,
        otpSent: true,
        userId: sessionToken.userId
      });

      addToast({
        title: 'OTP Sent',
        description: 'Check your email for the verification code',
        variant: 'flat',
        color: 'success',
        timeout: 3000
      });
    } catch (error) {
      addToast({
        title: 'OTP Failed',
        description: error instanceof Error ? error.message : 'Failed to send OTP',
        variant: 'flat',
        color: 'danger',
        timeout: 3000
      });
      throw error;
    }
  };

  const verifyOTP = async (secret: string) => {
    try {
      await account.createSession(otpData.userId, secret);
      const current = await account.get();
      setUser(current);
      setOtpData({email: '', securityPhrase: '', otpSent: false, userId: ''});
      
      addToast({
        title: 'Login Successful',
        description: `Welcome back, ${current.name}`,
        variant: 'flat',
        color: 'success',
        timeout: 3000
      });

      // Check for local todos to migrate
      const localTodos = JSON.parse(localStorage.getItem('todos') || '[]');
      if (localTodos.length) {
        await migrateLocalTodosToAppwrite(localTodos, current.$id);
        localStorage.removeItem('todos');
      }
    } catch (error) {
      addToast({
        title: 'OTP Verification Failed',
        description: error instanceof Error ? error.message : 'Invalid OTP code',
        variant: 'flat',
        color: 'danger',
        timeout: 3000
      });
      throw error;
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    otpData,
    login,
    signup,
    initiateOTP,
    verifyOTP,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  return useContext(AuthContext);
};