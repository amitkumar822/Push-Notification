import axios, { AxiosResponse } from 'axios';
import { apiIpAdress } from '../../server/api/apiIpAdress';

const API_BASE_URL = `${apiIpAdress}/api`;
const NOTIFICATION_API_URL = `${apiIpAdress}/api/notifications`;

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

interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    user: User;
    token: string;
    expiresIn: string;
  };
}

interface RegisterData {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

interface LoginData {
  emailOrUsername: string;
  password: string;
}

interface ProfileData {
  firstName?: string;
  lastName?: string;
  preferences?: {
    allowNotifications?: boolean;
    allowEmailNotifications?: boolean;
    language?: string;
  };
}

interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auth API functions
export const authAPI = {
  // Register new user
  register: async (userData: RegisterData): Promise<AuthResponse> => {
    try {
      const response: AxiosResponse<AuthResponse> = await apiClient.post('/auth/register', userData);
      return response.data;
    } catch (error: any) {
      throw error;
    }
  },

  // Login user
  login: async (emailOrUsername: string, password: string): Promise<AuthResponse> => {
    try {
      const response: AxiosResponse<AuthResponse> = await apiClient.post('/auth/login', {
        emailOrUsername,
        password,
      });
      return response.data;
    } catch (error: any) {
      throw error;
    }
  },

  // Get user profile
  getProfile: async (token: string): Promise<AuthResponse> => {
    try {
      const response: AxiosResponse<AuthResponse> = await apiClient.get('/auth/profile', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      throw error;
    }
  },

  // Update user profile
  updateProfile: async (token: string, profileData: ProfileData): Promise<AuthResponse> => {
    try {
      const response: AxiosResponse<AuthResponse> = await apiClient.put('/auth/profile', profileData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      throw error;
    }
  },

  // Change password
  changePassword: async (token: string, currentPassword: string, newPassword: string): Promise<AuthResponse> => {
    try {
      const response: AxiosResponse<AuthResponse> = await apiClient.put(
        '/auth/change-password',
        {
          currentPassword,
          newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error: any) {
      throw error;
    }
  },

  // Verify token
  verifyToken: async (token: string): Promise<AuthResponse> => {
    try {
      const response: AxiosResponse<AuthResponse> = await apiClient.get('/auth/verify', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      throw error;
    }
  },

  // Logout
  logout: async (token: string): Promise<AuthResponse> => {
    try {
      const response: AxiosResponse<AuthResponse> = await apiClient.post(
        '/auth/logout',
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error: any) {
      throw error;
    }
  },
};

// Types for push token registration
interface PushTokenData {
  userId: string;
  token: string;
  deviceType: string;
  deviceInfo: {
    brand: string;
    modelName: string;
    osVersion: string;
  };
}

interface PushTokenResponse {
  success: boolean;
  message: string;
  data?: any;
}

// Register push token to backend
export const registerPushToken = async (tokenData: PushTokenData): Promise<PushTokenResponse> => {
  try {
    const response: AxiosResponse<PushTokenResponse> = await axios.post(
      `${NOTIFICATION_API_URL}/token`,
      tokenData
    );
    return response.data;
  } catch (error: any) {
    throw error;
  }
};

export default apiClient;

