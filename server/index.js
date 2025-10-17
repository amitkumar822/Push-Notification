/**
 * Server API Module
 * Main entry point for all server-related functionality
 */

// Export all API services
export { default as apiClient } from './api/client.js';
export * from './api/notificationService.js';

// Export all hooks
export * from './hooks/useNotificationApi.js';

// Export components
export { default as NotificationTester } from './components/NotificationTester.js';

// Export utilities
export * from './utils/notificationHelpers.js';

// Export configuration
export const API_CONFIG = {
  BASE_URL: 'http://localhost:3000/api/simple',
  TIMEOUT: 10000,
  ENDPOINTS: {
    STATUS: '/status',
    SEND: '/send',
    SEND_MULTIPLE: '/send-multiple',
    VALIDATE_TOKEN: '/validate-token',
  },
};
