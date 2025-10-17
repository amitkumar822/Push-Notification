import PushToken from '../models/PushToken.js';
import pushNotificationService from '../services/pushNotificationService.js';

class NotificationController {
  /**
   * Register a new push token
   * POST /api/notifications/token
   */
  async registerToken(req, res) {
    try {
      const { userId, token, deviceType, deviceInfo } = req.body;

      // Validate required fields
      if (!userId || !token || !deviceType) {
        return res.status(400).json({
          success: false,
          message: 'userId, token, and deviceType are required',
          required: ['userId', 'token', 'deviceType']
        });
      }

      // Validate token format
      if (!pushNotificationService.isValidExpoPushToken(token)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid Expo push token format',
          expectedFormat: 'ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]'
        });
      }

      // Check if token already exists
      let pushToken = await PushToken.findOne({ token });

      if (pushToken) {
        // Update existing token
        pushToken.userId = userId;
        pushToken.deviceType = deviceType;
        pushToken.deviceInfo = { ...pushToken.deviceInfo, ...deviceInfo };
        pushToken.isActive = true;
        pushToken.lastUsed = new Date();
        await pushToken.save();
        
        console.log(`✅ Updated existing token for user: ${userId}`);
      } else {
        // Create new token
        pushToken = await PushToken.create({
          userId,
          token,
          deviceType,
          deviceInfo: deviceInfo || {},
        });
        
        console.log(`✅ Created new token for user: ${userId}`);
      }

      res.status(201).json({
        success: true,
        message: 'Push token registered successfully',
        data: {
          id: pushToken._id,
          userId: pushToken.userId,
          deviceType: pushToken.deviceType,
          isActive: pushToken.isActive,
          createdAt: pushToken.createdAt
        }
      });
    } catch (error) {
      console.error('❌ Error registering token:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to register push token',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }

  /**
   * Send notification to a specific user
   * POST /api/notifications/send
   */
  async sendToUser(req, res) {
    try {
      const { userId, title, body, data, sound, badge, channelId, subtitle, categoryId } = req.body;

      if (!userId || !title || !body) {
        return res.status(400).json({
          success: false,
          message: 'userId, title, and body are required',
          required: ['userId', 'title', 'body']
        });
      }

      const notification = {
        title,
        body,
        data: data || {},
        sound,
        badge,
        channelId,
        subtitle,
        categoryId,
      };

      const result = await pushNotificationService.sendToUser(userId, notification);

      res.status(200).json({
        success: result.success,
        message: result.message || 'Notification sent successfully',
        data: {
          sentCount: result.sentCount,
          errorCount: result.errorCount || 0,
          userId
        }
      });
    } catch (error) {
      console.error('❌ Error sending notification:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to send notification',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }

  /**
   * Send notification to multiple users
   * POST /api/notifications/send-multiple
   */
  async sendToMultipleUsers(req, res) {
    try {
      const { userIds, title, body, data, sound, badge, channelId, subtitle, categoryId } = req.body;

      if (!userIds || !Array.isArray(userIds) || !title || !body) {
        return res.status(400).json({
          success: false,
          message: 'userIds (array), title, and body are required',
          required: ['userIds', 'title', 'body']
        });
      }

      if (userIds.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'userIds array cannot be empty'
        });
      }

      const notification = {
        title,
        body,
        data: data || {},
        sound,
        badge,
        channelId,
        subtitle,
        categoryId,
      };

      const result = await pushNotificationService.sendToUsers(userIds, notification);

      res.status(200).json({
        success: result.success,
        message: result.message || 'Notifications sent successfully',
        data: {
          sentCount: result.sentCount,
          errorCount: result.errorCount || 0,
          targetUserCount: userIds.length
        }
      });
    } catch (error) {
      console.error('❌ Error sending notifications:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to send notifications',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }

  /**
   * Send notification to all users
   * POST /api/notifications/send-all
   */
  async sendToAll(req, res) {
    try {
      const { title, body, data, sound, badge, channelId, subtitle, categoryId } = req.body;

      if (!title || !body) {
        return res.status(400).json({
          success: false,
          message: 'title and body are required',
          required: ['title', 'body']
        });
      }

      const notification = {
        title,
        body,
        data: data || {},
        sound,
        badge,
        channelId,
        subtitle,
        categoryId,
      };

      const result = await pushNotificationService.sendToAll(notification);

      res.status(200).json({
        success: result.success,
        message: result.message || 'Notifications sent to all users',
        data: {
          sentCount: result.sentCount,
          errorCount: result.errorCount || 0
        }
      });
    } catch (error) {
      console.error('❌ Error sending notification to all:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to send notification to all users',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }

  /**
   * Send notification to users by device type
   * POST /api/notifications/send-by-device
   */
  async sendByDeviceType(req, res) {
    try {
      const { deviceType, title, body, data, sound, badge, channelId, subtitle, categoryId } = req.body;

      if (!deviceType || !title || !body) {
        return res.status(400).json({
          success: false,
          message: 'deviceType, title, and body are required',
          required: ['deviceType', 'title', 'body']
        });
      }

      if (!['ios', 'android', 'web'].includes(deviceType)) {
        return res.status(400).json({
          success: false,
          message: 'deviceType must be ios, android, or web'
        });
      }

      const notification = {
        title,
        body,
        data: data || {},
        sound,
        badge,
        channelId,
        subtitle,
        categoryId,
      };

      const result = await pushNotificationService.sendToDeviceType(deviceType, notification);

      res.status(200).json({
        success: result.success,
        message: result.message || `Notifications sent to ${deviceType} devices`,
        data: {
          sentCount: result.sentCount,
          errorCount: result.errorCount || 0,
          deviceType
        }
      });
    } catch (error) {
      console.error('❌ Error sending notification by device type:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to send notification by device type',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }

  /**
   * Get all tokens for a user
   * GET /api/notifications/tokens/:userId
   */
  async getUserTokens(req, res) {
    try {
      const { userId } = req.params;

      const tokens = await PushToken.findActiveTokensByUser(userId);

      res.status(200).json({
        success: true,
        data: {
          userId,
          tokenCount: tokens.length,
          tokens: tokens.map(token => ({
            id: token._id,
            deviceType: token.deviceType,
            deviceInfo: token.deviceInfo,
            isActive: token.isActive,
            lastUsed: token.lastUsed,
            notificationCount: token.notificationCount,
            createdAt: token.createdAt
          }))
        }
      });
    } catch (error) {
      console.error('❌ Error fetching user tokens:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch user tokens',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }

  /**
   * Delete a push token
   * DELETE /api/notifications/token/:tokenId
   */
  async deleteToken(req, res) {
    try {
      const { tokenId } = req.params;

      const token = await PushToken.findById(tokenId);

      if (!token) {
        return res.status(404).json({
          success: false,
          message: 'Token not found'
        });
      }

      await token.deactivate();

      res.status(200).json({
        success: true,
        message: 'Token deactivated successfully',
        data: {
          tokenId,
          userId: token.userId
        }
      });
    } catch (error) {
      console.error('❌ Error deleting token:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete token',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }

  /**
   * Get notification statistics
   * GET /api/notifications/stats
   */
  async getStats(req, res) {
    try {
      const stats = await pushNotificationService.getNotificationStats();

      res.status(200).json({
        success: true,
        data: stats
      });
    } catch (error) {
      console.error('❌ Error fetching stats:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch statistics',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }

  /**
   * Cleanup inactive tokens
   * POST /api/notifications/cleanup
   */
  async cleanupTokens(req, res) {
    try {
      const { daysInactive = 30 } = req.body;

      const result = await pushNotificationService.cleanupInactiveTokens(daysInactive);

      res.status(200).json({
        success: true,
        message: 'Cleanup completed successfully',
        data: result
      });
    } catch (error) {
      console.error('❌ Error cleaning up tokens:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to cleanup tokens',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }

  /**
   * Update token preferences
   * PUT /api/notifications/token/:tokenId/preferences
   */
  async updateTokenPreferences(req, res) {
    try {
      const { tokenId } = req.params;
      const { allowNotifications, allowSound, allowVibration } = req.body;

      const token = await PushToken.findById(tokenId);

      if (!token) {
        return res.status(404).json({
          success: false,
          message: 'Token not found'
        });
      }

      // Update preferences
      if (allowNotifications !== undefined) {
        token.preferences.allowNotifications = allowNotifications;
      }
      if (allowSound !== undefined) {
        token.preferences.allowSound = allowSound;
      }
      if (allowVibration !== undefined) {
        token.preferences.allowVibration = allowVibration;
      }

      await token.save();

      res.status(200).json({
        success: true,
        message: 'Token preferences updated successfully',
        data: {
          tokenId,
          preferences: token.preferences
        }
      });
    } catch (error) {
      console.error('❌ Error updating token preferences:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update token preferences',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }
}

export default new NotificationController();
