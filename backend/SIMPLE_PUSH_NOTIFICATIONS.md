# Simple Push Notifications API

## 🚀 Quick Start - Send Push Notifications Without Login

This is the **simplest way** to send push notifications using our backend API. No authentication, no database, just direct notification sending.

---

## 📡 Simple API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/simple/status` | Check API status |
| POST | `/api/simple/send` | Send to one device |
| POST | `/api/simple/send-multiple` | Send to multiple devices |
| POST | `/api/simple/validate-token` | Validate Expo token |

---

## 🧪 How to Use

### 1. **Check API Status**
```bash
curl http://localhost:3000/api/simple/status
```

**Response:**
```json
{
  "success": true,
  "message": "Simple Push Notification API is running",
  "data": {
    "server": "Online",
    "expoSDK": "Available",
    "timestamp": "2025-01-27T10:30:00.000Z"
  }
}
```

### 2. **Send Notification to One Device**

**Request:**
```bash
curl -X POST http://localhost:3000/api/simple/send \
  -H "Content-Type: application/json" \
  -d '{
    "token": "ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]",
    "title": "Hello!",
    "body": "This is a test notification",
    "data": {
      "screen": "Home",
      "action": "open"
    }
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "Notification sent successfully",
  "data": {
    "ticketId": "12345-67890-abcdef",
    "status": "ok"
  }
}
```

### 3. **Send to Multiple Devices**

**Request:**
```bash
curl -X POST http://localhost:3000/api/simple/send-multiple \
  -H "Content-Type: application/json" \
  -d '{
    "tokens": [
      "ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]",
      "ExponentPushToken[yyyyyyyyyyyyyyyyyyyyyy]",
      "ExponentPushToken[zzzzzzzzzzzzzzzzzzzzzz]"
    ],
    "title": "Group Message",
    "body": "This message goes to all devices",
    "data": {
      "type": "announcement"
    }
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "Notifications processed",
  "data": {
    "totalTokens": 3,
    "validTokens": 3,
    "invalidTokens": 0,
    "sentCount": 3,
    "errorCount": 0
  }
}
```

### 4. **Validate Token**

**Request:**
```bash
curl -X POST http://localhost:3000/api/simple/validate-token \
  -H "Content-Type: application/json" \
  -d '{
    "token": "ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]"
  }'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]",
    "isValid": true,
    "message": "Valid Expo push token"
  }
}
```

---

## 📱 Expo App Integration

### Step 1: Get Push Token in Your Expo App

```typescript
// In your Expo app (App.tsx or usePushNotifications.ts)
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';

const getPushToken = async () => {
  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    
    const token = await Notifications.getExpoPushTokenAsync({
      projectId: 'your-eas-project-id', // From app.json
    });
    
    console.log('Push Token:', token.data);
    return token.data; // This is what you use in API calls
  } else {
    alert('Must use physical device for Push Notifications');
  }
};
```

### Step 2: Send Token to Backend (Optional)

```typescript
// You can store the token in your app state or send it to backend
const [pushToken, setPushToken] = useState(null);

useEffect(() => {
  getPushToken().then(token => {
    setPushToken(token);
    // You can send this token to your backend for storage
  });
}, []);
```

### Step 3: Test Sending Notifications

```typescript
// Test function to send notification to your own device
const testNotification = async () => {
  if (!pushToken) {
    alert('No push token available');
    return;
  }

  try {
    const response = await fetch('http://localhost:3000/api/simple/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token: pushToken,
        title: 'Test Notification',
        body: 'This is a test from your app!',
        data: {
          screen: 'Test',
          action: 'test'
        }
      }),
    });

    const result = await response.json();
    console.log('Notification sent:', result);
  } catch (error) {
    console.error('Error sending notification:', error);
  }
};
```

---

## 🧪 Testing with Postman

### 1. **Create Postman Collection**

**Collection Name:** "Simple Push Notifications"

**Base URL:** `http://localhost:3000`

### 2. **Add Requests**

#### **Request 1: Check Status**
- Method: `GET`
- URL: `{{base_url}}/api/simple/status`
- Headers: None

#### **Request 2: Send Notification**
- Method: `POST`
- URL: `{{base_url}}/api/simple/send`
- Headers: `Content-Type: application/json`
- Body (raw JSON):
```json
{
  "token": "ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]",
  "title": "Hello from Postman!",
  "body": "This notification was sent via Postman",
  "data": {
    "source": "postman",
    "timestamp": "2025-01-27"
  }
}
```

#### **Request 3: Send to Multiple**
- Method: `POST`
- URL: `{{base_url}}/api/simple/send-multiple`
- Headers: `Content-Type: application/json`
- Body (raw JSON):
```json
{
  "tokens": [
    "ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]",
    "ExponentPushToken[yyyyyyyyyyyyyyyyyyyyyy]"
  ],
  "title": "Multiple Devices",
  "body": "This goes to multiple devices",
  "data": {
    "type": "broadcast"
  }
}
```

#### **Request 4: Validate Token**
- Method: `POST`
- URL: `{{base_url}}/api/simple/validate-token`
- Headers: `Content-Type: application/json`
- Body (raw JSON):
```json
{
  "token": "ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]"
}
```

---

## 🔧 Environment Variables

Make sure your `.env` file has:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# JWT Secret (for other features)
JWT_SECRET=your-super-secret-jwt-key

# CORS (allows all origins in development)
CORS_ORIGIN=
```

---

## 🚀 Quick Test Sequence

1. **Start your backend:**
   ```bash
   cd backend
   npm run dev
   ```

2. **Check if it's running:**
   ```bash
   curl http://localhost:3000/api/simple/status
   ```

3. **Get push token from your Expo app**

4. **Send test notification:**
   ```bash
   curl -X POST http://localhost:3000/api/simple/send \
     -H "Content-Type: application/json" \
     -d '{
       "token": "YOUR_EXPO_PUSH_TOKEN_HERE",
       "title": "Test",
       "body": "Hello World!"
     }'
   ```

5. **Check your device for the notification!**

---

## ❌ Common Errors & Solutions

### **Error: "Invalid Expo push token format"**
**Solution:** Make sure your token starts with `ExponentPushToken[` and ends with `]`

### **Error: "Failed to get push token"**
**Solution:** 
- Use a physical device (not emulator)
- Grant notification permissions
- Check your EAS project ID in app.json

### **Error: "Connection refused"**
**Solution:**
- Make sure backend is running on port 3000
- Check if MongoDB is running (optional for simple API)
- Verify your device and backend are on same network

### **Error: "CORS error"**
**Solution:**
- Backend is configured to allow all origins in development
- Make sure you're using the correct URL

---

## 📊 Response Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 400 | Bad Request (invalid data) |
| 500 | Server Error |

---

## 🎯 Key Points

✅ **No authentication required**
✅ **No database required**
✅ **Direct notification sending**
✅ **Works with any Expo push token**
✅ **Simple JSON API**
✅ **Perfect for testing and simple apps**

**This is the easiest way to send push notifications!** 🎉
