/**
 * Notification Helper Utilities
 * Common functions for working with push notifications
 */

/**
 * Format Expo push token for display
 */
export const formatTokenForDisplay = (token) => {
  if (!token) return 'No token available';
  
  // Show first 20 characters and last 10 characters
  if (token.length > 30) {
    return `${token.substring(0, 20)}...${token.substring(token.length - 10)}`;
  }
  
  return token;
};

/**
 * Validate if string looks like an Expo push token
 */
export const isValidTokenFormat = (token) => {
  if (!token || typeof token !== 'string') return false;
  
  return token.startsWith('ExponentPushToken[') && token.endsWith(']');
};

/**
 * Parse multiple tokens from text input
 */
export const parseMultipleTokens = (text) => {
  if (!text || typeof text !== 'string') return [];
  
  return text
    .split('\n')
    .map(token => token.trim())
    .filter(token => token.length > 0 && isValidTokenFormat(token));
};

/**
 * Create notification data object
 */
export const createNotificationData = (screen, action, customData = {}) => {
  return {
    screen: screen || 'Home',
    action: action || 'open',
    timestamp: new Date().toISOString(),
    ...customData,
  };
};

/**
 * Format notification response for display
 */
export const formatNotificationResponse = (response) => {
  if (!response || !response.data) return 'No response data';
  
  const { data } = response;
  
  if (data.sentCount !== undefined) {
    return `Sent: ${data.sentCount}, Errors: ${data.errorCount || 0}`;
  }
  
  if (data.ticketId) {
    return `Ticket ID: ${data.ticketId}`;
  }
  
  return 'Notification sent successfully';
};

/**
 * Get error message from API response
 */
export const getErrorMessage = (error) => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  
  if (error.message) {
    return error.message;
  }
  
  return 'An unknown error occurred';
};

/**
 * Check if device is connected to internet
 */
export const isOnline = () => {
  return navigator.onLine !== false;
};

/**
 * Debounce function for input fields
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Sample notification templates
 */
export const notificationTemplates = {
  welcome: {
    title: 'Welcome!',
    body: 'Thanks for using our app!',
    data: { screen: 'Welcome', action: 'show' },
  },
  reminder: {
    title: 'Reminder',
    body: "Don't forget to check your notifications!",
    data: { screen: 'Reminders', action: 'open' },
  },
  update: {
    title: 'App Update',
    body: 'New features are available!',
    data: { screen: 'Updates', action: 'show' },
  },
  test: {
    title: 'Test Notification',
    body: 'This is a test notification from the app',
    data: { screen: 'Test', action: 'test' },
  },
};

/**
 * Get template by name
 */
export const getNotificationTemplate = (templateName) => {
  return notificationTemplates[templateName] || notificationTemplates.test;
};
