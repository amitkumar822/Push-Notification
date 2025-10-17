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

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | API documentation |
| GET | `/health` | Health check |
| POST | `/api/notifications/token` | Register push token |
| GET | `/api/notifications/tokens/:userId` | Get user's tokens |
| DELETE | `/api/notifications/token/:tokenId` | Delete token |
| PUT | `/api/notifications/token/:tokenId/preferences` | Update token preferences |
| POST | `/api/notifications/send` | Send to one user |
| POST | `/api/notifications/send-multiple` | Send to multiple users |
| POST | `/api/notifications/send-all` | Send to all users |
| POST | `/api/notifications/send-by-device` | Send by device type |
| GET | `/api/notifications/stats` | Get statistics |
| POST | `/api/notifications/cleanup` | Cleanup inactive tokens |

## 🧪 Testing the API

### 1. Register a Push Token

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

### 2. Send Notification to One User

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
    },
    "sound": "default",
    "badge": 1
  }'
```

### 3. Send to Multiple Users

```bash
curl -X POST http://localhost:3000/api/notifications/send-multiple \
  -H "Content-Type: application/json" \
  -d '{
    "userIds": ["user123", "user456", "user789"],
    "title": "Group Notification",
    "body": "Message for multiple users",
    "data": {
      "type": "announcement"
    }
  }'
```

### 4. Send to All Users

```bash
curl -X POST http://localhost:3000/api/notifications/send-all \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Important Update",
    "body": "New features available!",
    "data": {
      "version": "2.0.0"
    }
  }'
```

### 5. Get Statistics

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
