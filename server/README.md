# Expo Push Notification Server Integration

This folder contains all the API-related code for integrating with the backend push notification server.

## 📁 Folder Structure

```
server/
├── api/
│   ├── client.js              # Axios client configuration
│   └── notificationService.js # API service functions
├── hooks/
│   └── useNotificationApi.js  # TanStack Query hooks
├── components/
│   └── NotificationTester.js  # UI component for testing
├── utils/
│   └── notificationHelpers.js # Helper utilities
├── examples/
│   └── AppExample.js          # Usage example
├── index.js                   # Main exports
├── package.json               # Dependencies
└── README.md                  # This file
```

## 🚀 Quick Start

### 1. Install Dependencies

```bash
# In your Expo project root
npm install axios @tanstack/react-query
```

### 2. Import and Use

```javascript
// In your component
import { useSendNotification, useApiStatus } from './server/hooks/useNotificationApi';
import { NotificationTester } from './server/components/NotificationTester';

// Use the hooks
const { data: status } = useApiStatus();
const sendNotification = useSendNotification();
```

### 3. Send Notification

```javascript
// Simple notification
const handleSend = async () => {
  await sendNotification.mutateAsync({
    token: 'ExponentPushToken[xxxxx]',
    title: 'Hello!',
    body: 'This is a test notification',
    data: { screen: 'Home' }
  });
};
```

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/simple/status` | Check API status |
| POST | `/api/simple/send` | Send to one device |
| POST | `/api/simple/send-multiple` | Send to multiple devices |
| POST | `/api/simple/validate-token` | Validate Expo token |

## 🧪 Testing with Postman

### 1. Check API Status
```bash
GET http://localhost:3000/api/simple/status
```

### 2. Send Single Notification
```bash
POST http://localhost:3000/api/simple/send
Content-Type: application/json

{
  "token": "ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]",
  "title": "Hello from Postman!",
  "body": "This notification was sent via Postman",
  "data": {
    "screen": "Home",
    "action": "test"
  }
}
```

### 3. Send Multiple Notifications
```bash
POST http://localhost:3000/api/simple/send-multiple
Content-Type: application/json

{
  "tokens": [
    "ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]",
    "ExponentPushToken[yyyyyyyyyyyyyyyyyyyyyy]"
  ],
  "title": "Group Message",
  "body": "This goes to multiple devices",
  "data": {
    "type": "broadcast"
  }
}
```

### 4. Validate Token
```bash
POST http://localhost:3000/api/simple/validate-token
Content-Type: application/json

{
  "token": "ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]"
}
```

## 🔧 Configuration

### Backend URL
Update the base URL in `api/client.js`:

```javascript
const apiClient = axios.create({
  baseURL: 'http://YOUR_BACKEND_URL:3000/api/simple',
  // ... other config
});
```

### Network Configuration
For testing on physical devices, make sure:
1. Your device and computer are on the same network
2. Use your computer's IP address instead of localhost
3. Backend server is running and accessible

## 📱 Usage Examples

### Basic Usage
```javascript
import { useSendNotification } from './server/hooks/useNotificationApi';

const MyComponent = () => {
  const sendNotification = useSendNotification();

  const handleSend = async () => {
    try {
      await sendNotification.mutateAsync({
        token: 'ExponentPushToken[xxxxx]',
        title: 'Hello!',
        body: 'Test notification',
      });
      alert('Notification sent!');
    } catch (error) {
      alert('Failed to send notification');
    }
  };

  return (
    <TouchableOpacity onPress={handleSend}>
      <Text>Send Notification</Text>
    </TouchableOpacity>
  );
};
```

### Using the Notification Tester Component
```javascript
import NotificationTester from './server/components/NotificationTester';

const App = () => {
  return (
    <View style={{ flex: 1 }}>
      <NotificationTester />
    </View>
  );
};
```

### Using TanStack Query Hooks
```javascript
import { 
  useApiStatus, 
  useSendNotification, 
  useValidateToken 
} from './server/hooks/useNotificationApi';

const NotificationManager = () => {
  const { data: status, isLoading } = useApiStatus();
  const sendNotification = useSendNotification();
  const validateToken = useValidateToken('ExponentPushToken[xxxxx]');

  return (
    <View>
      <Text>API Status: {isLoading ? 'Loading...' : status?.message}</Text>
      <Text>Token Valid: {validateToken.data?.data?.isValid ? 'Yes' : 'No'}</Text>
    </View>
  );
};
```

## 🛠️ Available Hooks

- `useApiStatus()` - Check if backend is online
- `useSendNotification()` - Send notification to one device
- `useSendMultipleNotifications()` - Send to multiple devices
- `useValidateToken(token)` - Validate Expo push token
- `useValidateTokenMutation()` - Validate token as mutation

## 🔧 Available Utilities

- `formatTokenForDisplay(token)` - Format token for display
- `isValidTokenFormat(token)` - Check token format
- `parseMultipleTokens(text)` - Parse tokens from text
- `createNotificationData(screen, action, customData)` - Create data object
- `getNotificationTemplate(templateName)` - Get predefined templates

## 🎯 Key Features

✅ **No Authentication Required** - Simple API calls
✅ **TanStack Query Integration** - Caching and state management
✅ **Axios HTTP Client** - Reliable API calls
✅ **Error Handling** - Comprehensive error management
✅ **TypeScript Support** - Type-safe API calls
✅ **Testing Component** - Built-in UI for testing
✅ **Helper Utilities** - Common functions for notifications

## 🚨 Troubleshooting

### Common Issues

1. **Connection Refused**
   - Make sure backend is running on port 3000
   - Check if device and computer are on same network
   - Use IP address instead of localhost for physical devices

2. **CORS Errors**
   - Backend is configured to allow all origins in development
   - Check if backend CORS settings are correct

3. **Invalid Token Format**
   - Make sure token starts with `ExponentPushToken[` and ends with `]`
   - Use the token from `usePushNotifications` hook

4. **Network Timeout**
   - Check network connection
   - Increase timeout in `api/client.js` if needed

## 📚 Integration with usePushNotifications

The server API integrates seamlessly with your existing `usePushNotifications` hook:

```javascript
// Your existing hook now includes server integration
const { expoPushToken, sendTestNotification, isSending } = usePushNotifications();

// Send test notification directly
const handleTest = () => {
  sendTestNotification(); // Uses server API internally
};
```

This provides a complete solution for push notifications with both local handling and server integration! 🎉
