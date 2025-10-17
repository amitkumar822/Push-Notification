# Expo Push Notifications Backend

A complete Node.js backend server for handling Expo push notifications with local MongoDB integration.

## 🚀 Quick Start

### Prerequisites

- Node.js (>= 16.0.0)
- MongoDB (running locally on port 27017)
- npm or yarn

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   # Copy the example environment file
   cp env.example .env
   
   # Edit .env file with your configuration
   nano .env
   ```

3. **Start MongoDB locally:**
   ```bash
   # On macOS with Homebrew
   brew services start mongodb-community
   
   # On Ubuntu/Debian
   sudo systemctl start mongod
   
   # On Windows
   net start MongoDB
   ```

4. **Start the server:**
   ```bash
   # Development mode (with auto-reload)
   npm run dev
   
   # Production mode
   npm start
   ```

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── database.js          # MongoDB connection
│   ├── controllers/
│   │   └── notificationController.js  # API controllers
│   ├── middleware/
│   │   ├── errorHandler.js      # Error handling
│   │   └── rateLimiter.js       # Rate limiting
│   ├── models/
│   │   └── PushToken.js         # MongoDB schema
│   ├── routes/
│   │   └── notificationRoutes.js # API routes
│   ├── services/
│   │   └── pushNotificationService.js # Business logic
│   └── server.js                # Main server file
├── .env                         # Environment variables (create from env.example)
├── .gitignore                   # Git ignore rules
├── package.json                 # Dependencies and scripts
└── README.md                    # This file
```

## 🔧 Configuration

### CORS Configuration

The server is configured to handle CORS (Cross-Origin Resource Sharing) intelligently:

**Development Mode (`NODE_ENV=development`):**
- ✅ **Allows all origins** - Perfect for testing from any device
- ✅ **No CORS restrictions** - Works with mobile apps, web apps, and API testing tools

**Production Mode (`NODE_ENV=production`):**
- 🔒 **Restricted origins** - Only allows specified domains
- 🔒 **Security focused** - Prevents unauthorized access

**Configuration Options:**

1. **Allow All Origins (Development):**
   ```env
   NODE_ENV=development
   CORS_ORIGIN=
   ```

2. **Specific Origins (Production):**
   ```env
   NODE_ENV=production
   CORS_ORIGIN=https://yourdomain.com,https://app.yourdomain.com
   ```

3. **Multiple Origins:**
   ```env
   CORS_ORIGIN=http://localhost:19006,https://expo.dev,https://yourdomain.com
   ```

### Environment Variables

Create a `.env` file from `env.example`:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# MongoDB Configuration (Local)
MONGODB_URI=mongodb://localhost:27017/expo-push-notifications

# Security
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
API_RATE_LIMIT=100

# CORS Configuration (for production, specify allowed origins)
# CORS_ORIGIN=http://localhost:19006,https://yourdomain.com
# For development, leave empty to allow all origins
CORS_ORIGIN=

# Logging
LOG_LEVEL=info
```

### MongoDB Setup

1. **Install MongoDB locally:**
   ```bash
   # macOS
   brew install mongodb-community
   
   # Ubuntu/Debian
   sudo apt-get install mongodb
   
   # Windows
   # Download from https://www.mongodb.com/try/download/community
   ```

2. **Start MongoDB service:**
   ```bash
   # macOS
   brew services start mongodb-community
   
   # Ubuntu/Debian
   sudo systemctl start mongod
   
   # Windows
   net start MongoDB
   ```

3. **Verify MongoDB is running:**
   ```bash
   # Connect to MongoDB shell
   mongosh
   
   # Or check if port 27017 is listening
   lsof -i :27017
   ```

## 📡 API Endpoints

### Base URL: `http://localhost:3000`

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | API documentation | ❌ No |
| GET | `/health` | Health check | ❌ No |
| **Authentication Endpoints** | | | |
| POST | `/api/auth/register` | Register new user | ❌ No |
| POST | `/api/auth/login` | Login user | ❌ No |
| GET | `/api/auth/profile` | Get user profile | ✅ Yes |
| PUT | `/api/auth/profile` | Update profile | ✅ Yes |
| PUT | `/api/auth/change-password` | Change password | ✅ Yes |
| GET | `/api/auth/verify` | Verify token | ✅ Yes |
| POST | `/api/auth/logout` | Logout user | ✅ Yes |
| **Notification Endpoints** | | | |
| POST | `/api/notifications/token` | Register push token | ❌ No* |
| GET | `/api/notifications/tokens/:userId` | Get user's tokens | ❌ No |
| DELETE | `/api/notifications/token/:tokenId` | Delete token | ❌ No |
| PUT | `/api/notifications/token/:tokenId/preferences` | Update token preferences | ❌ No |
| POST | `/api/notifications/send` | Send to one user | ❌ No |
| POST | `/api/notifications/send-multiple` | Send to multiple users | ❌ No |
| POST | `/api/notifications/send-all` | Send to all users | ❌ No |
| POST | `/api/notifications/send-by-device` | Send by device type | ❌ No |
| GET | `/api/notifications/stats` | Get statistics | ❌ No |
| POST | `/api/notifications/cleanup` | Cleanup inactive tokens | ❌ No |

*Authentication optional - can register tokens anonymously or with user ID

---

## 📋 Detailed API Documentation

### 1. **GET** `/` - API Documentation

**Description:** Get API documentation and available endpoints

**Input:** None

**Output:**
```json
{
  "success": true,
  "message": "Expo Push Notification Server",
  "version": "1.0.0",
  "environment": "development",
  "endpoints": {
    "health": "GET /health",
    "tokenRegistration": "POST /api/notifications/token",
    "sendToUser": "POST /api/notifications/send",
    "sendToMultiple": "POST /api/notifications/send-multiple",
    "sendToAll": "POST /api/notifications/send-all",
    "sendByDevice": "POST /api/notifications/send-by-device",
    "getUserTokens": "GET /api/notifications/tokens/:userId",
    "deleteToken": "DELETE /api/notifications/token/:tokenId",
    "updatePreferences": "PUT /api/notifications/token/:tokenId/preferences",
    "stats": "GET /api/notifications/stats",
    "cleanup": "POST /api/notifications/cleanup"
  }
}
```

**Postman Setup:**
- Method: `GET`
- URL: `http://localhost:3000/`
- Headers: None required

---

### 2. **GET** `/health` - Health Check

**Description:** Check if the server is running and healthy

**Input:** None

**Output:**
```json
{
  "success": true,
  "message": "Server is healthy",
  "timestamp": "2025-01-27T10:30:00.000Z",
  "uptime": 3600.5,
  "environment": "development"
}
```

**Postman Setup:**
- Method: `GET`
- URL: `http://localhost:3000/health`
- Headers: None required

---

### 3. **POST** `/api/notifications/token` - Register Push Token

**Description:** Register a new push token for a user

**Input Fields:**
```json
{
  "userId": "string (required)",           // User identifier
  "token": "string (required)",           // Expo push token (ExponentPushToken[...])
  "deviceType": "string (required)",      // ios, android, or web
  "deviceInfo": {                         // Optional device information
    "brand": "string",                    // Device brand (e.g., "Samsung")
    "modelName": "string",                // Device model (e.g., "Galaxy S21")
    "osVersion": "string",                // OS version (e.g., "Android 12")
    "appVersion": "string"                // App version (e.g., "1.0.0")
  }
}
```

**Output:**
```json
{
  "success": true,
  "message": "Push token registered successfully",
  "data": {
    "id": "65f1a2b3c4d5e6f7g8h9i0j1",
    "userId": "user123",
    "deviceType": "android",
    "isActive": true,
    "createdAt": "2025-01-27T10:30:00.000Z"
  }
}
```

**Postman Setup:**
- Method: `POST`
- URL: `http://localhost:3000/api/notifications/token`
- Headers: `Content-Type: application/json`
- Body (raw JSON):
```json
{
  "userId": "user123",
  "token": "ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]",
  "deviceType": "android",
  "deviceInfo": {
    "brand": "Samsung",
    "modelName": "Galaxy S21",
    "osVersion": "Android 12",
    "appVersion": "1.0.0"
  }
}
```

---

### 4. **GET** `/api/notifications/tokens/:userId` - Get User's Tokens

**Description:** Get all active tokens for a specific user

**Input:** 
- URL Parameter: `userId` (string, required)

**Output:**
```json
{
  "success": true,
  "data": {
    "userId": "user123",
    "tokenCount": 2,
    "tokens": [
      {
        "id": "65f1a2b3c4d5e6f7g8h9i0j1",
        "deviceType": "android",
        "deviceInfo": {
          "brand": "Samsung",
          "modelName": "Galaxy S21",
          "osVersion": "Android 12"
        },
        "isActive": true,
        "lastUsed": "2025-01-27T10:30:00.000Z",
        "notificationCount": 5,
        "createdAt": "2025-01-27T09:00:00.000Z"
      }
    ]
  }
}
```

**Postman Setup:**
- Method: `GET`
- URL: `http://localhost:3000/api/notifications/tokens/user123`
- Headers: None required

---

### 5. **DELETE** `/api/notifications/token/:tokenId` - Delete Token

**Description:** Deactivate a push token

**Input:**
- URL Parameter: `tokenId` (string, required) - MongoDB ObjectId

**Output:**
```json
{
  "success": true,
  "message": "Token deactivated successfully",
  "data": {
    "tokenId": "65f1a2b3c4d5e6f7g8h9i0j1",
    "userId": "user123"
  }
}
```

**Postman Setup:**
- Method: `DELETE`
- URL: `http://localhost:3000/api/notifications/token/65f1a2b3c4d5e6f7g8h9i0j1`
- Headers: None required

---

### 6. **PUT** `/api/notifications/token/:tokenId/preferences` - Update Token Preferences

**Description:** Update notification preferences for a token

**Input:**
- URL Parameter: `tokenId` (string, required)
- Body Fields:
```json
{
  "allowNotifications": "boolean (optional)",  // Enable/disable notifications
  "allowSound": "boolean (optional)",          // Enable/disable sound
  "allowVibration": "boolean (optional)"       // Enable/disable vibration
}
```

**Output:**
```json
{
  "success": true,
  "message": "Token preferences updated successfully",
  "data": {
    "tokenId": "65f1a2b3c4d5e6f7g8h9i0j1",
    "preferences": {
      "allowNotifications": true,
      "allowSound": false,
      "allowVibration": true
    }
  }
}
```

**Postman Setup:**
- Method: `PUT`
- URL: `http://localhost:3000/api/notifications/token/65f1a2b3c4d5e6f7g8h9i0j1/preferences`
- Headers: `Content-Type: application/json`
- Body (raw JSON):
```json
{
  "allowNotifications": true,
  "allowSound": false,
  "allowVibration": true
}
```

---

### 7. **POST** `/api/notifications/send` - Send to One User

**Description:** Send a push notification to a specific user

**Input Fields:**
```json
{
  "userId": "string (required)",           // Target user ID
  "title": "string (required)",            // Notification title
  "body": "string (required)",             // Notification body/message
  "data": {                                // Optional custom data
    "key": "value",                        // Any key-value pairs
    "screen": "string",                    // Screen to navigate to
    "action": "string"                     // Action to perform
  },
  "sound": "string (optional)",            // Sound file name (default: "default")
  "badge": "number (optional)",            // Badge count (iOS)
  "channelId": "string (optional)",        // Android channel ID (default: "default")
  "subtitle": "string (optional)",         // iOS subtitle
  "categoryId": "string (optional)"        // iOS category ID
}
```

**Output:**
```json
{
  "success": true,
  "message": "Notification sent successfully",
  "data": {
    "sentCount": 1,
    "errorCount": 0,
    "userId": "user123"
  }
}
```

**Postman Setup:**
- Method: `POST`
- URL: `http://localhost:3000/api/notifications/send`
- Headers: `Content-Type: application/json`
- Body (raw JSON):
```json
{
  "userId": "user123",
  "title": "Hello!",
  "body": "This is a test notification",
  "data": {
    "screen": "Home",
    "action": "open",
    "customData": "any value"
  },
  "sound": "default",
  "badge": 1,
  "channelId": "default"
}
```

---

### 8. **POST** `/api/notifications/send-multiple` - Send to Multiple Users

**Description:** Send a push notification to multiple users

**Input Fields:**
```json
{
  "userIds": ["string (required)"],        // Array of user IDs
  "title": "string (required)",            // Notification title
  "body": "string (required)",             // Notification body/message
  "data": {                                // Optional custom data
    "key": "value"                         // Any key-value pairs
  },
  "sound": "string (optional)",            // Sound file name
  "badge": "number (optional)",            // Badge count (iOS)
  "channelId": "string (optional)",        // Android channel ID
  "subtitle": "string (optional)",         // iOS subtitle
  "categoryId": "string (optional)"        // iOS category ID
}
```

**Output:**
```json
{
  "success": true,
  "message": "Notifications sent successfully",
  "data": {
    "sentCount": 3,
    "errorCount": 0,
    "targetUserCount": 3
  }
}
```

**Postman Setup:**
- Method: `POST`
- URL: `http://localhost:3000/api/notifications/send-multiple`
- Headers: `Content-Type: application/json`
- Body (raw JSON):
```json
{
  "userIds": ["user123", "user456", "user789"],
  "title": "Group Notification",
  "body": "Message for multiple users",
  "data": {
    "type": "announcement",
    "priority": "high"
  },
  "sound": "default"
}
```

---

### 9. **POST** `/api/notifications/send-all` - Send to All Users

**Description:** Send a push notification to all registered users

**Input Fields:**
```json
{
  "title": "string (required)",            // Notification title
  "body": "string (required)",             // Notification body/message
  "data": {                                // Optional custom data
    "key": "value"                         // Any key-value pairs
  },
  "sound": "string (optional)",            // Sound file name
  "badge": "number (optional)",            // Badge count (iOS)
  "channelId": "string (optional)",        // Android channel ID
  "subtitle": "string (optional)",         // iOS subtitle
  "categoryId": "string (optional)"        // iOS category ID
}
```

**Output:**
```json
{
  "success": true,
  "message": "Notifications sent to all users",
  "data": {
    "sentCount": 15,
    "errorCount": 0
  }
}
```

**Postman Setup:**
- Method: `POST`
- URL: `http://localhost:3000/api/notifications/send-all`
- Headers: `Content-Type: application/json`
- Body (raw JSON):
```json
{
  "title": "Important Update",
  "body": "New features available!",
  "data": {
    "version": "2.0.0",
    "type": "update"
  },
  "sound": "default",
  "badge": 1
}
```

---

### 10. **POST** `/api/notifications/send-by-device` - Send by Device Type

**Description:** Send a push notification to users with specific device types

**Input Fields:**
```json
{
  "deviceType": "string (required)",       // ios, android, or web
  "title": "string (required)",            // Notification title
  "body": "string (required)",             // Notification body/message
  "data": {                                // Optional custom data
    "key": "value"                         // Any key-value pairs
  },
  "sound": "string (optional)",            // Sound file name
  "badge": "number (optional)",            // Badge count (iOS)
  "channelId": "string (optional)",        // Android channel ID
  "subtitle": "string (optional)",         // iOS subtitle
  "categoryId": "string (optional)"        // iOS category ID
}
```

**Output:**
```json
{
  "success": true,
  "message": "Notifications sent to android devices",
  "data": {
    "sentCount": 8,
    "errorCount": 0,
    "deviceType": "android"
  }
}
```

**Postman Setup:**
- Method: `POST`
- URL: `http://localhost:3000/api/notifications/send-by-device`
- Headers: `Content-Type: application/json`
- Body (raw JSON):
```json
{
  "deviceType": "android",
  "title": "Android Update",
  "body": "New Android features available!",
  "data": {
    "platform": "android",
    "version": "1.2.0"
  },
  "channelId": "updates"
}
```

---

### 11. **GET** `/api/notifications/stats` - Get Statistics

**Description:** Get notification statistics and analytics

**Input:** None

**Output:**
```json
{
  "success": true,
  "data": {
    "totalTokens": 25,
    "activeTokens": 20,
    "inactiveTokens": 5,
    "totalNotifications": 150,
    "avgNotificationsPerToken": 7.5,
    "deviceBreakdown": [
      {
        "_id": "android",
        "count": 12,
        "avgNotifications": 8.2
      },
      {
        "_id": "ios",
        "count": 8,
        "avgNotifications": 6.5
      }
    ],
    "recentActiveTokens": 18
  }
}
```

**Postman Setup:**
- Method: `GET`
- URL: `http://localhost:3000/api/notifications/stats`
- Headers: None required

---

### 12. **POST** `/api/notifications/cleanup` - Cleanup Inactive Tokens

**Description:** Clean up tokens that haven't been used for a specified period

**Input Fields:**
```json
{
  "daysInactive": "number (optional)"      // Days of inactivity (default: 30)
}
```

**Output:**
```json
{
  "success": true,
  "message": "Cleanup completed successfully",
  "data": {
    "success": true,
    "deactivatedCount": 3
  }
}
```

**Postman Setup:**
- Method: `POST`
- URL: `http://localhost:3000/api/notifications/cleanup`
- Headers: `Content-Type: application/json`
- Body (raw JSON):
```json
{
  "daysInactive": 30
}
```

---

## 🧪 Postman Collection Setup

### Import Postman Collection

1. **Create a new Collection in Postman:**
   - Name: "Expo Push Notifications API"
   - Base URL: `http://localhost:3000`

2. **Add Environment Variables:**
   - `base_url`: `http://localhost:3000`
   - `user_id`: `user123`
   - `token_id`: `65f1a2b3c4d5e6f7g8h9i0j1`

3. **Test Sequence:**
   ```
   1. GET /health (Check server)
   2. POST /api/notifications/token (Register token)
   3. GET /api/notifications/tokens/{{user_id}} (Get tokens)
   4. POST /api/notifications/send (Send notification)
   5. GET /api/notifications/stats (Check stats)
   ```

### Common Error Responses

**400 Bad Request:**
```json
{
  "success": false,
  "message": "userId, token, and deviceType are required",
  "required": ["userId", "token", "deviceType"]
}
```

**404 Not Found:**
```json
{
  "success": false,
  "message": "Token not found"
}
```

**500 Internal Server Error:**
```json
{
  "success": false,
  "message": "Failed to send notification",
  "error": "Detailed error message (development only)"
}
```

## 🧪 Quick Testing with cURL

### Basic Test Sequence

1. **Check server health:**
```bash
curl http://localhost:3000/health
```

2. **Register a token:**
```bash
curl -X POST http://localhost:3000/api/notifications/token \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user123",
    "token": "ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]",
    "deviceType": "android",
    "deviceInfo": {
      "brand": "Samsung",
      "modelName": "Galaxy S21",
      "osVersion": "Android 12"
    }
  }'
```

3. **Send notification:**
```bash
curl -X POST http://localhost:3000/api/notifications/send \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user123",
    "title": "Hello!",
    "body": "This is a test notification",
    "data": {
      "screen": "Home",
      "action": "open"
    }
  }'
```

4. **Check statistics:**
```bash
curl http://localhost:3000/api/notifications/stats
```

## 🔒 Security Features

- **Rate Limiting**: Prevents API abuse
- **Input Validation**: Validates all incoming data
- **Error Handling**: Secure error responses
- **CORS Protection**: Configurable CORS settings
- **Helmet**: Security headers
- **Environment Variables**: Sensitive data protection

## 📊 Database Schema

### PushToken Model

```javascript
{
  userId: String,           // User identifier
  token: String,           // Expo push token
  deviceType: String,      // ios, android, web
  deviceInfo: {
    brand: String,
    modelName: String,
    osVersion: String,
    appVersion: String
  },
  isActive: Boolean,       // Token status
  lastUsed: Date,          // Last activity
  lastNotificationSent: Date,
  notificationCount: Number,
  preferences: {
    allowNotifications: Boolean,
    allowSound: Boolean,
    allowVibration: Boolean
  },
  createdAt: Date,
  updatedAt: Date
}
```

## 🛠️ Development

### Available Scripts

```bash
# Start development server with auto-reload
npm run dev

# Start production server
npm start

# Check for linting errors
npm run lint

# Run tests
npm test
```

### Adding New Features

1. **Models**: Add new schemas in `src/models/`
2. **Controllers**: Add business logic in `src/controllers/`
3. **Routes**: Define API endpoints in `src/routes/`
4. **Services**: Add complex logic in `src/services/`
5. **Middleware**: Add custom middleware in `src/middleware/`

## 🚨 Troubleshooting

### Common Issues

1. **MongoDB Connection Error:**
   ```
   Error: connect ECONNREFUSED 127.0.0.1:27017
   ```
   **Solution**: Make sure MongoDB is running locally

2. **Port Already in Use:**
   ```
   Error: listen EADDRINUSE :::3000
   ```
   **Solution**: Change PORT in `.env` or kill the process using port 3000

3. **Invalid Token Format:**
   ```
   Error: Invalid Expo push token format
   ```
   **Solution**: Ensure token starts with `ExponentPushToken[`

### Debug Mode

Set `NODE_ENV=development` in your `.env` file to see detailed error messages.

## 📚 Integration with Expo App

Update your React Native app's `usePushNotifications.ts`:

```typescript
useEffect(() => {
  registerForPushNotificationsAsync().then(async (token) => {
    setExpoPushToken(token);
    
    // Send token to your backend
    if (token) {
      try {
        await fetch('http://localhost:3000/api/notifications/token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: 'your-user-id',
            token: token.data,
            deviceType: Platform.OS,
            deviceInfo: {
              brand: Device.brand,
              modelName: Device.modelName,
              osVersion: Device.osVersion,
            },
          }),
        });
      } catch (error) {
        console.error('Failed to register token with backend:', error);
      }
    }
  });
}, []);
```

## 🔗 Related Links

- [Expo Push Notification Tool](https://expo.dev/notifications)
- [Expo Notifications Documentation](https://docs.expo.dev/versions/latest/sdk/notifications/)
- [Firebase Console](https://console.firebase.google.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)

## 📄 License

MIT License - feel free to use this code in your projects!
