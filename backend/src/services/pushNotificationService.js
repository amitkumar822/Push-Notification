import { Expo } from 'expo-server-sdk';
import PushToken from '../models/PushToken.js';

class PushNotificationService {
  constructor() {
    this.expo = new Expo();
  }

  /**
   * Validate if token is a valid Expo push token
   */
  isValidExpoPushToken(token) {
    return Expo.isExpoPushToken(token);
  }

  /**
   * Send notification to a single user
   */
  async sendToUser(userId, notification) {
    try {
      console.log(`📤 Sending notification to user: ${userId}`);
      
      // Find all active tokens for the user
      const tokenDocs = await PushToken.findActiveTokensByUser(userId);

      if (tokenDocs.length === 0) {
        console.log(`⚠️ No active tokens found for user: ${userId}`);
        return { 
          success: false, 
          message: 'No active tokens found for user',
          sentCount: 0 
        };
      }

      const tokens = tokenDocs.map(doc => doc.token);
      const result = await this.sendToTokens(tokens, notification);
      
      // Update notification count for each token
      if (result.success) {
        await Promise.all(
          tokenDocs.map(doc => doc.incrementNotificationCount())
        );
      }

      return result;
    } catch (error) {
      console.error('❌ Error sending notification to user:', error);
      throw error;
    }
  }

  /**
   * Send notification to multiple tokens
   */
  async sendToTokens(tokens, notification) {
    const messages = [];
    const validTokens = [];

    // Build messages and validate tokens
    for (const pushToken of tokens) {
      if (!this.isValidExpoPushToken(pushToken)) {
        console.warn(`⚠️ Invalid push token: ${pushToken}`);
        continue;
      }

      validTokens.push(pushToken);
      messages.push({
        to: pushToken,
        sound: notification.sound || 'default',
        title: notification.title,
        body: notification.body,
        data: notification.data || {},
        badge: notification.badge,
        channelId: notification.channelId || 'default',
        priority: notification.priority || 'high',
        ttl: notification.ttl || 0,
        ...(notification.subtitle && { subtitle: notification.subtitle }),
        ...(notification.categoryId && { categoryId: notification.categoryId }),
      });
    }

    if (messages.length === 0) {
      return {
        success: false,
        message: 'No valid tokens found',
        sentCount: 0,
        tickets: [],
        errors: []
      };
    }

    console.log(`📨 Sending ${messages.length} notifications`);

    // Send in chunks
    const chunks = this.expo.chunkPushNotifications(messages);
    const tickets = [];
    const errors = [];

    for (const chunk of chunks) {
      try {
        const ticketChunk = await this.expo.sendPushNotificationsAsync(chunk);
        tickets.push(...ticketChunk);
      } catch (error) {
        console.error('❌ Error sending chunk:', error);
        errors.push(error);
      }
    }

    // Handle tickets and errors
    const receiptIds = await this.handleTickets(tickets);

    const successCount = tickets.filter(ticket => ticket.status === 'ok').length;
    const errorCount = tickets.filter(ticket => ticket.status === 'error').length;

    console.log(`✅ Sent: ${successCount}, ❌ Errors: ${errorCount}`);

    return {
      success: true,
      tickets,
      errors,
      sentCount: successCount,
      errorCount,
      receiptIds,
    };
  }

  /**
   * Handle push notification tickets (receipts)
   */
  async handleTickets(tickets) {
    const receiptIds = [];

    for (const ticket of tickets) {
      if (ticket.status === 'ok') {
        receiptIds.push(ticket.id);
      } else if (ticket.status === 'error') {
        console.error(`❌ Error sending notification: ${ticket.message}`);
        
        // Handle specific errors
        if (ticket.details?.error === 'DeviceNotRegistered') {
          console.log(`🗑️ Deactivating invalid token: ${ticket.details.expoPushToken}`);
          // Deactivate token
          await PushToken.updateOne(
            { token: ticket.details.expoPushToken },
            { isActive: false }
          );
        }
      }
    }

    return receiptIds;
  }

  /**
   * Send notification to all users
   */
  async sendToAll(notification) {
    try {
      console.log('📢 Sending notification to all users');
      
      const tokenDocs = await PushToken.findAllActiveTokens();
      const tokens = tokenDocs.map(doc => doc.token);
      
      if (tokens.length === 0) {
        console.log('⚠️ No active tokens found');
        return { 
          success: false, 
          message: 'No active tokens found',
          sentCount: 0 
        };
      }

      const result = await this.sendToTokens(tokens, notification);
      
      // Update notification count for each token
      if (result.success) {
        await Promise.all(
          tokenDocs.map(doc => doc.incrementNotificationCount())
        );
      }

      return result;
    } catch (error) {
      console.error('❌ Error sending notification to all:', error);
      throw error;
    }
  }

  /**
   * Send notification to multiple users
   */
  async sendToUsers(userIds, notification) {
    try {
      console.log(`📤 Sending notification to ${userIds.length} users`);
      
      const tokenDocs = await PushToken.findActiveTokensByUsers(userIds);
      const tokens = tokenDocs.map(doc => doc.token);
      
      if (tokens.length === 0) {
        console.log('⚠️ No active tokens found for users');
        return { 
          success: false, 
          message: 'No active tokens found for users',
          sentCount: 0 
        };
      }

      const result = await this.sendToTokens(tokens, notification);
      
      // Update notification count for each token
      if (result.success) {
        await Promise.all(
          tokenDocs.map(doc => doc.incrementNotificationCount())
        );
      }

      return result;
    } catch (error) {
      console.error('❌ Error sending notification to users:', error);
      throw error;
    }
  }

  /**
   * Send notification to users by device type
   */
  async sendToDeviceType(deviceType, notification) {
    try {
      console.log(`📱 Sending notification to ${deviceType} devices`);
      
      const tokenDocs = await PushToken.find({ 
        deviceType, 
        isActive: true 
      });
      
      const tokens = tokenDocs.map(doc => doc.token);
      
      if (tokens.length === 0) {
        console.log(`⚠️ No active ${deviceType} tokens found`);
        return { 
          success: false, 
          message: `No active ${deviceType} tokens found`,
          sentCount: 0 
        };
      }

      const result = await this.sendToTokens(tokens, notification);
      
      // Update notification count for each token
      if (result.success) {
        await Promise.all(
          tokenDocs.map(doc => doc.incrementNotificationCount())
        );
      }

      return result;
    } catch (error) {
      console.error(`❌ Error sending notification to ${deviceType} devices:`, error);
      throw error;
    }
  }

  /**
   * Get notification statistics
   */
  async getNotificationStats() {
    try {
      const stats = await PushToken.aggregate([
        {
          $group: {
            _id: null,
            totalTokens: { $sum: 1 },
            activeTokens: {
              $sum: { $cond: ['$isActive', 1, 0] }
            },
            totalNotifications: { $sum: '$notificationCount' },
            avgNotificationsPerToken: { $avg: '$notificationCount' }
          }
        }
      ]);

      const deviceStats = await PushToken.getDeviceStats();
      const recentTokens = await PushToken.countDocuments({
        isActive: true,
        lastUsed: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } // Last 7 days
      });

      return {
        ...stats[0],
        deviceBreakdown: deviceStats,
        recentActiveTokens: recentTokens
      };
    } catch (error) {
      console.error('❌ Error getting notification stats:', error);
      throw error;
    }
  }

  /**
   * Cleanup inactive tokens
   */
  async cleanupInactiveTokens(daysInactive = 30) {
    try {
      console.log(`🧹 Cleaning up tokens inactive for ${daysInactive} days`);
      
      const result = await PushToken.cleanupInactiveTokens(daysInactive);
      
      console.log(`✅ Deactivated ${result.modifiedCount} inactive tokens`);
      
      return {
        success: true,
        deactivatedCount: result.modifiedCount
      };
    } catch (error) {
      console.error('❌ Error cleaning up inactive tokens:', error);
      throw error;
    }
  }
}

export default new PushNotificationService();
