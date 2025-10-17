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

## 📋 Detailed API Documentation

---

### 1. **GET /api/simple/status - Check API Status**

Check if the push notification API is running and available.

#### **Input Fields:**
- **No input required** - This is a GET request with no parameters

#### **Output Format:**
```json
{
  "success": boolean,
  "message": string,
  "data": {
    "server": string,
    "expoSDK": string,
    "timestamp": string (ISO 8601 format),
    "endpoints": {
      "send": string,
      "sendMultiple": string,
      "validateToken": string,
      "status": string
    }
  }
}
```

#### **Example Request:**
```bash
curl http://localhost:3000/api/simple/status
```

#### **Example Response:**
```json
{
  "success": true,
  "message": "Simple Push Notification API is running",
  "data": {
    "server": "Online",
    "expoSDK": "Available",
    "timestamp": "2025-01-27T10:30:00.000Z",
    "endpoints": {
      "send": "POST /api/simple/send",
      "sendMultiple": "POST /api/simple/send-multiple",
      "validateToken": "POST /api/simple/validate-token",
      "status": "GET /api/simple/status"
    }
  }
}
```

#### **Postman Setup:**
- **Method:** `GET`
- **URL:** `http://localhost:3000/api/simple/status`
- **Headers:** None required
- **Body:** None

---

### 2. **POST /api/simple/send - Send Notification to One Device**

Send a push notification to a single device using its Expo push token.

#### **Input Fields:**

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| `token` | string | ✅ Yes | Valid Expo push token | `"ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]"` |
| `title` | string | ✅ Yes | Notification title (max 256 chars) | `"Hello!"` |
| `body` | string | ✅ Yes | Notification body message | `"This is a test notification"` |
| `data` | object | ❌ No | Custom data to send with notification | `{"screen": "Home", "action": "open"}` |

#### **Input Format (JSON):**
```json
{
  "token": "string (required) - Expo push token starting with ExponentPushToken[",
  "title": "string (required) - Notification title",
  "body": "string (required) - Notification message body",
  "data": {
    "key": "value - Optional custom data object"
  }
}
```

#### **Output Format:**
```json
{
  "success": boolean,
  "message": string,
  "data": {
    "ticketId": string,
    "status": "ok" | "error"
  }
}
```

#### **Example Request:**
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

#### **Success Response (200):**
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

#### **Error Response (400):**
```json
{
  "success": false,
  "message": "token, title, and body are required",
  "required": ["token", "title", "body"]
}
```

#### **Error Response (400 - Invalid Token):**
```json
{
  "success": false,
  "message": "Invalid Expo push token format",
  "expectedFormat": "ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]"
}
```

#### **Postman Setup:**
- **Method:** `POST`
- **URL:** `http://localhost:3000/api/simple/send`
- **Headers:** 
  - `Content-Type: application/json`
- **Body (raw JSON):**
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

---

### 3. **POST /api/simple/send-multiple - Send to Multiple Devices**

Send the same push notification to multiple devices at once.

#### **Input Fields:**

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| `tokens` | array | ✅ Yes | Array of valid Expo push tokens | `["ExponentPushToken[xxx]", "ExponentPushToken[yyy]"]` |
| `title` | string | ✅ Yes | Notification title (max 256 chars) | `"Group Message"` |
| `body` | string | ✅ Yes | Notification body message | `"This goes to all devices"` |
| `data` | object | ❌ No | Custom data to send with notification | `{"type": "announcement"}` |

#### **Input Format (JSON):**
```json
{
  "tokens": [
    "string (required) - Array of Expo push tokens"
  ],
  "title": "string (required) - Notification title",
  "body": "string (required) - Notification message body",
  "data": {
    "key": "value - Optional custom data object"
  }
}
```

#### **Output Format:**
```json
{
  "success": boolean,
  "message": string,
  "data": {
    "totalTokens": number,
    "validTokens": number,
    "invalidTokens": number,
    "sentCount": number,
    "errorCount": number,
    "invalidTokens": array
  }
}
```

#### **Example Request:**
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

#### **Success Response (200):**
```json
{
  "success": true,
  "message": "Notifications processed",
  "data": {
    "totalTokens": 3,
    "validTokens": 3,
    "invalidTokens": 0,
    "sentCount": 3,
    "errorCount": 0,
    "invalidTokens": []
  }
}
```

#### **Partial Success Response (200):**
```json
{
  "success": true,
  "message": "Notifications processed",
  "data": {
    "totalTokens": 5,
    "validTokens": 3,
    "invalidTokens": 2,
    "sentCount": 3,
    "errorCount": 0,
    "invalidTokens": [
      "InvalidToken1",
      "InvalidToken2"
    ]
  }
}
```

#### **Error Response (400):**
```json
{
  "success": false,
  "message": "tokens (array), title, and body are required",
  "required": ["tokens", "title", "body"]
}
```

#### **Error Response (400 - Empty Array):**
```json
{
  "success": false,
  "message": "tokens array cannot be empty"
}
```

#### **Postman Setup:**
- **Method:** `POST`
- **URL:** `http://localhost:3000/api/simple/send-multiple`
- **Headers:** 
  - `Content-Type: application/json`
- **Body (raw JSON):**
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

---

### 4. **POST /api/simple/validate-token - Validate Expo Push Token**

Validate if a token is in the correct Expo push token format.

#### **Input Fields:**

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| `token` | string | ✅ Yes | Token to validate | `"ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]"` |

#### **Input Format (JSON):**
```json
{
  "token": "string (required) - Token to validate"
}
```

#### **Output Format:**
```json
{
  "success": boolean,
  "data": {
    "token": string,
    "isValid": boolean,
    "message": string
  }
}
```

#### **Example Request:**
```bash
curl -X POST http://localhost:3000/api/simple/validate-token \
  -H "Content-Type: application/json" \
  -d '{
    "token": "ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]"
  }'
```

#### **Success Response - Valid Token (200):**
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

#### **Success Response - Invalid Token (200):**
```json
{
  "success": true,
  "data": {
    "token": "InvalidTokenFormat",
    "isValid": false,
    "message": "Invalid Expo push token format"
  }
}
```

#### **Error Response (400):**
```json
{
  "success": false,
  "message": "token is required"
}
```

#### **Postman Setup:**
- **Method:** `POST`
- **URL:** `http://localhost:3000/api/simple/validate-token`
- **Headers:** 
  - `Content-Type: application/json`
- **Body (raw JSON):**
```json
{
  "token": "ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]"
}
```

---

## 📊 Common Response Codes

| HTTP Code | Status | Description |
|-----------|--------|-------------|
| 200 | Success | Request completed successfully |
| 400 | Bad Request | Invalid input data or missing required fields |
| 500 | Internal Server Error | Server error occurred |

---

## 🧪 Quick Testing Guide

### **Test Sequence:**

1. **Check API Status:**
   ```bash
   curl http://localhost:3000/api/simple/status
   ```

2. **Validate Your Token:**
   ```bash
   curl -X POST http://localhost:3000/api/simple/validate-token \
     -H "Content-Type: application/json" \
     -d '{"token": "YOUR_EXPO_PUSH_TOKEN"}'
   ```

3. **Send Single Notification:**
   ```bash
   curl -X POST http://localhost:3000/api/simple/send \
     -H "Content-Type: application/json" \
     -d '{
       "token": "YOUR_EXPO_PUSH_TOKEN",
       "title": "Test",
       "body": "Hello World!"
     }'
   ```

4. **Send to Multiple Devices:**
   ```bash
   curl -X POST http://localhost:3000/api/simple/send-multiple \
     -H "Content-Type: application/json" \
     -d '{
       "tokens": ["TOKEN1", "TOKEN2"],
       "title": "Broadcast",
       "body": "Message for all"
     }'
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
