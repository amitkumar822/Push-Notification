import apiClient from './client.js';

/**
 * Simple Push Notification Service
 * Handles all API calls to the backend simple notification endpoints
 */

// Check API status
export const checkApiStatus = async () => {
  try {
    const response = await apiClient.get('/status');
    return response.data;
  } catch (error) {
    throw new Error(`Failed to check API status: ${error.message}`);
  }
};

// Send notification to single device
export const sendNotification = async (notificationData) => {
  try {
    const response = await apiClient.post('/send', notificationData);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to send notification: ${error.message}`);
  }
};

// Send notification to multiple devices
export const sendMultipleNotifications = async (notificationData) => {
  try {
    const response = await apiClient.post('/send-multiple', notificationData);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to send multiple notifications: ${error.message}`);
  }
};

// Validate Expo push token
export const validateToken = async (token) => {
  try {
    const response = await apiClient.post('/validate-token', { token });
    return response.data;
  } catch (error) {
    throw new Error(`Failed to validate token: ${error.message}`);
  }
};

// Helper function to create notification payload
export const createNotificationPayload = (token, title, body, data = {}) => {
  return {
    token,
    title,
    body,
    data,
  };
};

// Helper function to create multiple notification payload
export const createMultipleNotificationPayload = (tokens, title, body, data = {}) => {
  return {
    tokens,
    title,
    body,
    data,
  };
};
