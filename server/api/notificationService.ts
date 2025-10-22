import apiClient from './client';

// Types
interface NotificationData {
  token: string;
  title: string;
  body: string;
  data?: Record<string, any>;
}

interface MultipleNotificationData {
  tokens: string[];
  title: string;
  body: string;
  data?: Record<string, any>;
}

interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}

interface SendResponse {
  ticketId: string;
  status: string;
}

interface MultipleSendResponse {
  totalTokens: number;
  validTokens: number;
  sentCount: number;
  errorCount: number;
  invalidTokens: string[];
}

interface ValidateResponse {
  token: string;
  isValid: boolean;
  message: string;
}

/**
 * Simple Push Notification Service
 * Handles all API calls to the backend simple notification endpoints
 */

// Check API status
export const checkApiStatus = async (): Promise<ApiResponse> => {
  try {
    const response = await apiClient.get('/status');
    return response.data;
  } catch (error: any) {
    throw new Error(`Failed to check API status: ${error.message}`);
  }
};

// Send notification to single device
export const sendNotification = async (notificationData: NotificationData): Promise<ApiResponse<SendResponse>> => {
  try {
    const response = await apiClient.post('/send', notificationData);
    return response.data;
  } catch (error: any) {
    throw new Error(`Failed to send notification: ${error.message}`);
  }
};

// Send notification to multiple devices
export const sendMultipleNotifications = async (notificationData: MultipleNotificationData): Promise<ApiResponse<MultipleSendResponse>> => {
  try {
    const response = await apiClient.post('/send-multiple', notificationData);
    return response.data;
  } catch (error: any) {
    throw new Error(`Failed to send multiple notifications: ${error.message}`);
  }
};

// Validate Expo push token
export const validateToken = async (token: string): Promise<ApiResponse<ValidateResponse>> => {
  try {
    const response = await apiClient.post('/validate-token', { token });
    return response.data;
  } catch (error: any) {
    throw new Error(`Failed to validate token: ${error.message}`);
  }
};

// Helper function to create notification payload
export const createNotificationPayload = (token: string, title: string, body: string, data: Record<string, any> = {}): NotificationData => {
  return {
    token,
    title,
    body,
    data,
  };
};

// Helper function to create multiple notification payload
export const createMultipleNotificationPayload = (tokens: string[], title: string, body: string, data: Record<string, any> = {}): MultipleNotificationData => {
  return {
    tokens,
    title,
    body,
    data,
  };
};

