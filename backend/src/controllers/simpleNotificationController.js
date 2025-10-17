import { Expo } from 'expo-server-sdk';

class SimpleNotificationController {
  constructor() {
    this.expo = new Expo();
  }

  /**
   * Send push notification directly (simple method)
   * POST /api/simple/send
   */
  async sendNotification(req, res) {
    try {
      const { token, title, body, data } = req.body;

      // Validate required fields
      if (!token || !title || !body) {
        return res.status(400).json({
          success: false,
          message: 'token, title, and body are required',
          required: ['token', 'title', 'body']
        });
      }

      // Validate Expo push token format
      if (!Expo.isExpoPushToken(token)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid Expo push token format',
          expectedFormat: 'ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]'
        });
      }

      // Create message
      const message = {
        to: token,
        sound: 'default',
        title: title,
        body: body,
        data: data || {},
      };

      console.log('📤 Sending notification:', { title, body, token: token.substring(0, 20) + '...' });

      // Send notification
      const chunks = this.expo.chunkPushNotifications([message]);
      const tickets = [];

      for (const chunk of chunks) {
        try {
          const ticketChunk = await this.expo.sendPushNotificationsAsync(chunk);
          tickets.push(...ticketChunk);
        } catch (error) {
          console.error('❌ Error sending chunk:', error);
          return res.status(500).json({
            success: false,
            message: 'Failed to send notification',
            error: error.message
          });
        }
      }

      // Check ticket status
      const ticket = tickets[0];
      if (ticket.status === 'ok') {
        console.log('✅ Notification sent successfully');
        res.status(200).json({
          success: true,
          message: 'Notification sent successfully',
          data: {
            ticketId: ticket.id,
            status: ticket.status
          }
        });
      } else {
        console.error('❌ Notification failed:', ticket.message);
        res.status(400).json({
          success: false,
          message: 'Notification failed to send',
          error: ticket.message
        });
      }

    } catch (error) {
      console.error('❌ Error in sendNotification:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
      });
    }
  }

  /**
   * Send notification to multiple tokens
   * POST /api/simple/send-multiple
   */
  async sendMultipleNotifications(req, res) {
    try {
      const { tokens, title, body, data } = req.body;

      // Validate required fields
      if (!tokens || !Array.isArray(tokens) || !title || !body) {
        return res.status(400).json({
          success: false,
          message: 'tokens (array), title, and body are required',
          required: ['tokens', 'title', 'body']
        });
      }

      if (tokens.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'tokens array cannot be empty'
        });
      }

      // Validate all tokens
      const validTokens = [];
      const invalidTokens = [];

      for (const token of tokens) {
        if (Expo.isExpoPushToken(token)) {
          validTokens.push(token);
        } else {
          invalidTokens.push(token);
        }
      }

      if (validTokens.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'No valid Expo push tokens found',
          invalidTokens: invalidTokens
        });
      }

      // Create messages
      const messages = validTokens.map(token => ({
        to: token,
        sound: 'default',
        title: title,
        body: body,
        data: data || {},
      }));

      console.log(`📤 Sending ${messages.length} notifications`);

      // Send notifications
      const chunks = this.expo.chunkPushNotifications(messages);
      const tickets = [];

      for (const chunk of chunks) {
        try {
          const ticketChunk = await this.expo.sendPushNotificationsAsync(chunk);
          tickets.push(...ticketChunk);
        } catch (error) {
          console.error('❌ Error sending chunk:', error);
          return res.status(500).json({
            success: false,
            message: 'Failed to send notifications',
            error: error.message
          });
        }
      }

      // Count results
      const successCount = tickets.filter(ticket => ticket.status === 'ok').length;
      const errorCount = tickets.filter(ticket => ticket.status === 'error').length;

      console.log(`✅ Sent: ${successCount}, ❌ Errors: ${errorCount}`);

      res.status(200).json({
        success: true,
        message: 'Notifications processed',
        data: {
          totalTokens: tokens.length,
          validTokens: validTokens.length,
          invalidTokens: invalidTokens.length,
          sentCount: successCount,
          errorCount: errorCount,
          invalidTokens: invalidTokens
        }
      });

    } catch (error) {
      console.error('❌ Error in sendMultipleNotifications:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
      });
    }
  }

  /**
   * Validate Expo push token
   * POST /api/simple/validate-token
   */
  async validateToken(req, res) {
    try {
      const { token } = req.body;

      if (!token) {
        return res.status(400).json({
          success: false,
          message: 'token is required'
        });
      }

      const isValid = Expo.isExpoPushToken(token);

      res.status(200).json({
        success: true,
        data: {
          token: token,
          isValid: isValid,
          message: isValid ? 'Valid Expo push token' : 'Invalid Expo push token format'
        }
      });

    } catch (error) {
      console.error('❌ Error in validateToken:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
      });
    }
  }

  /**
   * Get server status
   * GET /api/simple/status
   */
  async getStatus(req, res) {
    try {
      res.status(200).json({
        success: true,
        message: 'Simple Push Notification API is running',
        data: {
          server: 'Online',
          expoSDK: 'Available',
          timestamp: new Date().toISOString(),
          endpoints: {
            send: 'POST /api/simple/send',
            sendMultiple: 'POST /api/simple/send-multiple',
            validateToken: 'POST /api/simple/validate-token',
            status: 'GET /api/simple/status'
          }
        }
      });
    } catch (error) {
      console.error('❌ Error in getStatus:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
}

export default new SimpleNotificationController();
