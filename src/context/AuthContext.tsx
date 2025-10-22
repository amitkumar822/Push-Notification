import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authAPI, registerPushToken } from '../services/authService';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

// Types
interface User {
  _id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  isActive: boolean;
  lastLogin?: string;
  loginCount: number;
  preferences: {
    allowNotifications: boolean;
    allowEmailNotifications: boolean;
    language: string;
  };
  role: string;
  createdAt: string;
  updatedAt: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (emailOrUsername: string, password: string, pushToken?: string) => Promise<{ success: boolean; user?: User; message?: string }>;
  register: (userData: RegisterData, pushToken?: string) => Promise<{ success: boolean; user?: User; message?: string }>;
  logout: () => Promise<{ success: boolean; message?: string }>;
  updateUser: (updatedData: Partial<User>) => Promise<{ success: boolean }>;
}

interface RegisterData {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Load user data from storage on app start
  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async (): Promise<void> => {
    try {
      const savedToken = await AsyncStorage.getItem('userToken');
      const savedUser = await AsyncStorage.getItem('userData');

      if (savedToken && savedUser) {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (emailOrUsername: string, password: string, pushToken?: string): Promise<{ success: boolean; user?: User; message?: string }> => {
    try {
      setIsLoading(true);
      const response = await authAPI.login(emailOrUsername, password);

      if (response.success && response.data) {
        const { user, token } = response.data;

        // Save to state
        setUser(user);
        setToken(token);
        setIsAuthenticated(true);

        // Save to AsyncStorage
        await AsyncStorage.setItem('userToken', token);
        await AsyncStorage.setItem('userData', JSON.stringify(user));

        // Register push token to backend if available
        if (pushToken) {
          try {
            await registerPushToken({
              userId: user._id,
              token: pushToken,
              deviceType: Platform.OS,
              deviceInfo: {
                brand: Device.brand || 'Unknown',
                modelName: Device.modelName || 'Unknown',
                osVersion: Device.osVersion || 'Unknown',
              },
            });
            console.log('✅ Push token registered to backend');
          } catch (error) {
            console.error('❌ Failed to register push token:', error);
            // Don't fail login if push token registration fails
          }
        }

        return { success: true, user };
      } else {
        return { success: false, message: response.message };
      }
    } catch (error: any) {
      console.error('Login error:', error);
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Login failed',
      };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterData, pushToken?: string): Promise<{ success: boolean; user?: User; message?: string }> => {
    try {
      setIsLoading(true);
      const response = await authAPI.register(userData);

      if (response.success && response.data) {
        const { user, token } = response.data;

        // Save to state
        setUser(user);
        setToken(token);
        setIsAuthenticated(true);

        // Save to AsyncStorage
        await AsyncStorage.setItem('userToken', token);
        await AsyncStorage.setItem('userData', JSON.stringify(user));

        // Register push token to backend if available
        if (pushToken) {
          try {
            await registerPushToken({
              userId: user._id,
              token: pushToken,
              deviceType: Platform.OS,
              deviceInfo: {
                brand: Device.brand || 'Unknown',
                modelName: Device.modelName || 'Unknown',
                osVersion: Device.osVersion || 'Unknown',
              },
            });
            console.log('✅ Push token registered to backend');
          } catch (error) {
            console.error('❌ Failed to register push token:', error);
            // Don't fail registration if push token registration fails
          }
        }

        return { success: true, user };
      } else {
        return { success: false, message: response.message };
      }
    } catch (error: any) {
      console.error('Register error:', error);
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Registration failed',
      };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<{ success: boolean; message?: string }> => {
    try {
      setIsLoading(true);

      // Clear state
      setUser(null);
      setToken(null);
      setIsAuthenticated(false);

      // Clear AsyncStorage
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('userData');

      return { success: true };
    } catch (error: any) {
      console.error('Logout error:', error);
      return { success: false, message: 'Logout failed' };
    } finally {
      setIsLoading(false);
    }
  };

  const updateUser = async (updatedData: Partial<User>): Promise<{ success: boolean }> => {
    try {
      const updatedUser = { ...user, ...updatedData } as User;
      setUser(updatedUser);
      await AsyncStorage.setItem('userData', JSON.stringify(updatedUser));
      return { success: true };
    } catch (error) {
      console.error('Update user error:', error);
      return { success: false };
    }
  };

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
