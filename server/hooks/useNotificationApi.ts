import { useMutation, useQuery } from '@tanstack/react-query';
import {
  checkApiStatus,
  sendNotification,
  sendMultipleNotifications,
  validateToken,
  createNotificationPayload,
  createMultipleNotificationPayload,
} from '../api/notificationService';

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

// Query keys for TanStack Query
export const notificationKeys = {
  all: ['notifications'] as const,
  status: () => [...notificationKeys.all, 'status'] as const,
  validate: (token: string) => [...notificationKeys.all, 'validate', token] as const,
};

/**
 * Hook to check API status
 */
export const useApiStatus = () => {
  return useQuery({
    queryKey: notificationKeys.status(),
    queryFn: checkApiStatus,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
  });
};

/**
 * Hook to validate Expo push token
 */
export const useValidateToken = (token: string) => {
  return useQuery({
    queryKey: notificationKeys.validate(token),
    queryFn: () => validateToken(token),
    enabled: !!token, // Only run if token exists
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

/**
 * Hook to send notification to single device
 */
export const useSendNotification = () => {
  return useMutation({
    mutationFn: sendNotification,
    onSuccess: (data) => {
      console.log('✅ Notification sent successfully:', data);
    },
    onError: (error) => {
      console.error('❌ Failed to send notification:', error);
    },
  });
};

/**
 * Hook to send notification to multiple devices
 */
export const useSendMultipleNotifications = () => {
  return useMutation({
    mutationFn: sendMultipleNotifications,
    onSuccess: (data) => {
      console.log('✅ Multiple notifications sent successfully:', data);
    },
    onError: (error) => {
      console.error('❌ Failed to send multiple notifications:', error);
    },
  });
};

/**
 * Hook to validate token (mutation version)
 */
export const useValidateTokenMutation = () => {
  return useMutation({
    mutationFn: validateToken,
    onSuccess: (data) => {
      console.log('✅ Token validation result:', data);
    },
    onError: (error) => {
      console.error('❌ Token validation failed:', error);
    },
  });
};

