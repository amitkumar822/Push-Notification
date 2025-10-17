# Expo SDK 54 Push Notifications Documentation

## Table of Contents
1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Installation](#installation)
4. [Project Configuration](#project-configuration)
5. [Implementation](#implementation)
6. [Usage](#usage)
7. [Testing Push Notifications](#testing-push-notifications)
8. [Troubleshooting](#troubleshooting)
9. [API Reference](#api-reference)
10. [Best Practices](#best-practices)

---

## Overview

This documentation covers implementing push notifications in an Expo SDK 54 application using the `expo-notifications` package. Push notifications allow you to send messages to users' devices even when the app is not active.

### Key Features
- ✅ Cross-platform support (iOS, Android)
- ✅ Custom notification handlers
- ✅ Notification channels (Android)
- ✅ Permission management
- ✅ Expo Push Token generation
- ✅ Foreground and background notifications

---

## Prerequisites

Before implementing push notifications, ensure you have:

- **Physical Device**: Push notifications require a real device (not an emulator/simulator)
- **Expo Account**: Sign up at [expo.dev](https://expo.dev)
- **EAS CLI**: Install with `npm install -g eas-cli`
- **EAS Project ID**: Your app must be registered with EAS
- **Google Services** (Android): Firebase Cloud Messaging (FCM) setup
- **Apple Developer Account** (iOS): APNs configuration
- **Local MongoDB**: For backend development

---

## EAS CLI Setup & Configuration

Expo Application Services (EAS) is essential for building and managing native apps with Expo, especially when dealing with push notifications and custom native configurations.

### 1. Install and Login to EAS CLI

```bash
# Install EAS CLI globally
npm install -g eas-cli

# Check if you're logged in
eas whoami

# If not logged in, login to your Expo account
eas login
```

### 2. Initialize EAS for Your Project

```bash
# Navigate to your Expo project directory
cd your-expo-project

# Initialize EAS (creates eas.json and links project to your Expo account)
eas init
```

### 3. Configure EAS Build

```bash
# Configure EAS Build for native builds
eas build:configure
```

This command helps you set up the necessary configurations for EAS Build, which is used to create native app binaries (APKs for Android, IPAs for iOS).

### 4. Manage Credentials with EAS

```bash
# Manage all credentials (iOS certificates, Android keystores, etc.)
eas credentials

# Or manage specific platform credentials
eas credentials -p android
eas credentials -p ios
```

**Important Notes:**
- **`google-services.json`**: This file is managed by EAS for Android builds. Place it in your project root and EAS will handle it automatically.
- **Firebase Admin SDK JSON**: This file is for your **backend server only**, not for the mobile app. It should never be uploaded to EAS credentials.

---

## Installation

### 1. Install Required Packages

```bash
npm install expo-notifications expo-device expo-constants
```

### 2. Install Dependencies

```json
{
  "dependencies": {
    "expo": "~54.0.0",
    "expo-constants": "~18.0.9",
    "expo-device": "~8.0.9",
    "expo-notifications": "~0.32.12",
    "react": "19.1.0",
    "react-native": "0.81.4"
  },
  "devDependencies": {
    "@babel/core": "^7.20.0",
    "babel-preset-expo": "~12.0.5",
    "typescript": "~5.9.2"
  }
}
```

### 3. Install Node Modules

```bash
npm install
```

---

## Project Configuration

### 1. `app.json` Configuration

Configure your `app.json` with the necessary settings:

```json
{
  "expo": {
    "name": "PushNotifications2",
    "slug": "PushNotifications2",
    "version": "1.0.0",
    "android": {
      "googleServicesFile": "./google-services.json",
      "package": "com.yourcompany.yourapp"
    },
    "ios": {
      "bundleIdentifier": "com.yourcompany.yourapp"
    },
    "extra": {
      "eas": {
        "projectId": "your-eas-project-id"
      }
    }
  }
}
```

#### Understanding Configuration Fields:

**`bundleIdentifier` (iOS):**
- A unique identifier for your iOS app
- Format: reverse domain notation (e.g., `com.yourcompany.yourapp`)
- Must match the Bundle ID in your Apple Developer account
- Used by Apple to identify your app in the App Store and APNs
- Example: `com.amitkr1.myexpoapp`

**`package` (Android):**
- A unique identifier for your Android app (also called Application ID)
- Format: reverse domain notation (e.g., `com.yourcompany.yourapp`)
- Must match the package name in Firebase Console
- Used by Google Play Store and FCM to identify your app
- Example: `com.amitkr1.myexpoapp`

**`googleServicesFile` (Android):**
- Path to your Firebase configuration file
- This file contains your Firebase project credentials
- Required for Firebase Cloud Messaging (FCM) to work
- Download from Firebase Console
- Place at the specified path: `./google-services.json`

**`projectId` (EAS):**
- Your Expo Application Services (EAS) project identifier
- Obtained when you create an EAS project
- Required for generating Expo Push Tokens
- Find it in your Expo dashboard at [expo.dev](https://expo.dev)

### 2. Android Setup (FCM) - Step by Step

#### Getting `google-services.json` (For Mobile App):

**Step 1: Create a Firebase Project**
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or "Create a project"
3. Enter your project name (e.g., "ExpoPushNotifications")
4. Accept terms and click "Continue"
5. Enable/disable Google Analytics (optional)
6. Click "Create project"

**Step 2: Add Android App to Firebase**
1. In Firebase Console, click the Android icon (🤖) or "Add app"
2. **Important:** Enter your Android package name (must match `app.json` → `android.package`)
   - Example: `com.amitkr1.myexpoapp`
3. Enter app nickname (optional): "My Expo App"
4. Enter SHA-1 certificate (optional, but recommended for security)
5. Click "Register app"

**Step 3: Download google-services.json**
1. Click "Download google-services.json" button
2. Save the file to your **Expo project root directory**
3. **EAS will automatically handle this file** - no need to copy to `android/app/`
4. Click "Next" and "Continue to console"

**Step 4: Configure with EAS**
```bash
# After placing google-services.json in project root, run:
eas build:configure

# This will automatically detect and configure the google-services.json file
```

**What's in `google-services.json`?**
```json
{
  "project_info": {
    "project_number": "123456789012",
    "firebase_url": "https://your-project.firebaseio.com",
    "project_id": "your-project-id",
    "storage_bucket": "your-project.appspot.com"
  },
  "client": [
    {
      "client_info": {
        "mobilesdk_app_id": "1:123456789012:android:abc123def456",
        "android_client_info": {
          "package_name": "com.amitkr1.myexpoapp"
        }
      },
      "api_key": [
        {
          "current_key": "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
        }
      ]
    }
  ]
}
```

This file contains:
- **project_id**: Your Firebase project identifier
- **project_number**: Used for FCM sender ID
- **mobilesdk_app_id**: Your app's Firebase ID
- **package_name**: Your Android package identifier
- **api_key**: Firebase API key for authentication

**Step 4: Enable Cloud Messaging**
1. In Firebase Console, go to "Project Settings" (⚙️ gear icon)
2. Navigate to "Cloud Messaging" tab
3. Note your "Server key" and "Sender ID" (you may need these for backend)

### 3. Firebase Admin SDK Configuration (Backend Only)

#### Getting Firebase Admin SDK JSON File:

The file `expo-push-notification-1e683-firebase-adminsdk-fbsvc-3b984544f0.json` is your **Firebase Admin SDK service account key**. This is **ONLY for your backend server**, not for the mobile app.

**⚠️ IMPORTANT:** This file is **NOT** managed by EAS credentials. It's only for your Node.js backend server.

**How to Get This File:**

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Click the ⚙️ gear icon → "Project settings"
4. Navigate to "Service accounts" tab
5. Click "Generate new private key"
6. Confirm by clicking "Generate key"
7. A JSON file will download automatically
8. **⚠️ CRITICAL:** 
   - Keep this file secure, never commit to Git!
   - Place it in your **backend folder only**
   - Never upload to EAS credentials
   - This is for server-to-server communication only

**File Structure:**
```json
{
  "type": "service_account",
  "project_id": "expo-push-notification-1e683",
  "private_key_id": "3b984544f0...",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-fbsvc@expo-push-notification-1e683.iam.gserviceaccount.com",
  "client_id": "1234567890123456789",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/..."
}
```

**What's in This File:**
- **project_id**: Your Firebase project ID
- **private_key**: RSA private key for authentication
- **client_email**: Service account email address
- **Used for**: Backend push notifications, Firebase Admin operations

**Security Best Practices:**
1. Add to `.gitignore`: `*-firebase-adminsdk-*.json`
2. Use environment variables to store the path
3. Never expose in client-side code
4. Restrict API access in Firebase Console

### 4. iOS Setup (APNs)

1. Enable Push Notifications in your Apple Developer account
2. Create APNs keys in the Apple Developer portal
3. Upload APNs keys to Expo via EAS
4. Build your app with EAS Build

---

## Implementation

### Step 1: Create the Push Notifications Hook

Create `usePushNotifications.ts`:

```typescript
import { useState, useEffect, useRef } from "react";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { Platform } from "react-native";

export interface PushNotificationState {
  expoPushToken?: Notifications.ExpoPushToken;
  notification?: Notifications.Notification;
}

export const usePushNotifications = (): PushNotificationState => {
  // Configure notification handler
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldPlaySound: false,
      shouldShowAlert: true,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });

  const [expoPushToken, setExpoPushToken] = useState<
    Notifications.ExpoPushToken | undefined
  >();

  const [notification, setNotification] = useState<
    Notifications.Notification | undefined
  >();

  const notificationListener = useRef<Notifications.Subscription | undefined>(undefined);
  const responseListener = useRef<Notifications.Subscription | undefined>(undefined);

  async function registerForPushNotificationsAsync() {
    let token;
    
    // Check if running on a physical device
    if (Device.isDevice) {
      // Get existing permissions
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      // Request permissions if not granted
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      
      if (finalStatus !== "granted") {
        alert("Failed to get push token for push notification");
        return;
      }

      // Get Expo Push Token
      token = await Notifications.getExpoPushTokenAsync({
        projectId: Constants.expoConfig?.extra?.eas.projectId,
      });
    } else {
      alert("Must be using a physical device for Push notifications");
    }

    // Android-specific: Create notification channel
    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }

    return token;
  }

  useEffect(() => {
    // Register for push notifications
    registerForPushNotificationsAsync().then((token) => {
      setExpoPushToken(token);
    });

    // Listener for notifications received while app is foregrounded
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    // Listener for when user taps on notification
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response);
      });

    // Cleanup listeners on unmount
    return () => {
      notificationListener.current?.remove();
      responseListener.current?.remove();
    };
  }, []);

  return {
    expoPushToken,
    notification,
  };
};
```

### Step 2: Use the Hook in Your App

In `App.tsx`:

```typescript
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { usePushNotifications } from "./usePushNotifications";

export default function App() {
  const { expoPushToken, notification } = usePushNotifications();
  
  // Display notification data (for debugging)
  const data = JSON.stringify(notification, undefined, 2);
  
  console.log("Expo Push Token:", expoPushToken?.data);

  return (
    <View style={styles.container}>
      <Text>Token: {expoPushToken?.data ?? ""}</Text>
      <Text>Notification: {data}</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
```

---

## Usage

### 1. Build and Run Your App

**For Android:**
```bash
npm run android
# or
expo run:android
```

**For iOS:**
```bash
npm run ios
# or
expo run:ios
```

### 2. Get the Expo Push Token

Once your app runs on a physical device:
1. The app will request notification permissions
2. Grant the permissions
3. The Expo Push Token will be displayed on screen and logged to console
4. Copy this token for testing

Example token format:
```
ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]
```

---

## Testing Push Notifications

### Method 1: Expo Push Notification Tool (Recommended) ⭐

**URL:** [https://expo.dev/notifications](https://expo.dev/notifications)

This is the official Expo web-based tool for testing push notifications without writing any backend code.

**Step-by-Step Guide:**

1. **Get Your Push Token**
   - Run your app on a physical device
   - Copy the Expo Push Token displayed on screen
   - Format: `ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]`

2. **Open the Testing Tool**
   - Visit [https://expo.dev/notifications](https://expo.dev/notifications)

3. **Fill in the Form:**

   **Recipient (Required):**
   - Paste your Expo Push Token
   - Example: `ExponentPushToken[abc123def456ghi789]`

   **Access Token (Optional):**
   - Only required if you've enabled push security
   - Leave empty for basic testing

   **Message Title:**
   - Example: "Test Notification"
   - This appears as the notification headline

   **Message Body:**
   - Example: "This is a test from Expo!"
   - The main notification text

   **Data (JSON string):**
   - Custom data payload (optional)
   - Must be valid JSON
   - Example: `{"userId": "123", "action": "open_profile"}`

   **TTL (Time To Live in seconds):**
   - How long to retry delivery
   - Default: 0 (immediate delivery only)
   - Example: 3600 (retry for 1 hour)

   **iOS Specific:**
   - **Message Subtitle:** Additional text below title
   - **Badge Count:** Number displayed on app icon (e.g., 5)
   - **Sound Name:** Custom sound file name (e.g., "notification.wav")

   **Android Specific:**
   - **Channel ID:** Notification channel (e.g., "default")

4. **Send the Notification**
   - Click "Send a Notification" button
   - Check your device for the notification
   - If app is in foreground, notification appears in-app
   - If app is in background, notification appears in system tray

**Expected Results:**
- ✅ Success: You'll see a success message and the notification on your device
- ❌ Error: Check token format, device connectivity, and permissions

**Common Testing Scenarios:**

```json
// Basic notification
{
  "to": "ExponentPushToken[xxxxx]",
  "title": "Hello!",
  "body": "Test message"
}

// With custom data
{
  "to": "ExponentPushToken[xxxxx]",
  "title": "New Message",
  "body": "You have a new message",
  "data": {
    "screen": "Messages",
    "messageId": "12345"
  }
}

// iOS with badge and sound
{
  "to": "ExponentPushToken[xxxxx]",
  "title": "Reminder",
  "body": "Don't forget!",
  "badge": 3,
  "sound": "default"
}

// Android with channel
{
  "to": "ExponentPushToken[xxxxx]",
  "title": "Update Available",
  "body": "New version is ready",
  "channelId": "updates"
}
```

### Method 2: Using cURL

```bash
curl -H "Content-Type: application/json" -X POST "https://exp.host/--/api/v2/push/send" -d '{
  "to": "ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]",
  "title": "Hello",
  "body": "This is a test notification",
  "data": { "customData": "goes here" }
}'
```

### Method 3: Complete Backend Implementation (Ready to Use!)

I've created a complete backend folder with all the code you need. Here's how to set it up:

#### Quick Setup:

1. **Navigate to the backend folder:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   # Copy the example file
   cp env.example .env
   
   # Edit .env with your settings (optional - defaults work for local development)
   nano .env
   ```

4. **Start MongoDB locally:**
   ```bash
   # macOS
   brew services start mongodb-community
   
   # Ubuntu/Debian
   sudo systemctl start mongod
   
   # Windows
   net start MongoDB
   ```

5. **Start the server:**
   ```bash
   # Development mode (with auto-reload)
   npm run dev
   
   # Production mode
   npm start
   ```

#### What's Included:

✅ **Complete Backend Structure:**
```
backend/
├── src/
│   ├── config/database.js          # MongoDB connection
│   ├── models/PushToken.js         # Database schema
│   ├── controllers/notificationController.js  # API logic
│   ├── routes/notificationRoutes.js # API routes
│   ├── services/pushNotificationService.js # Business logic
│   ├── middleware/
│   │   ├── errorHandler.js         # Error handling
│   │   └── rateLimiter.js          # Rate limiting
│   └── server.js                   # Main server
├── .env.example                    # Environment template
├── .gitignore                      # Git ignore rules
├── package.json                    # Dependencies
└── README.md                       # Backend documentation
```

✅ **Features:**
- Local MongoDB integration
- ES6 modules (import/export)
- Rate limiting and security
- Error handling
- Input validation
- Statistics and analytics
- Token management
- Device-specific notifications

#### API Endpoints Available:

Once your backend is running, you'll have these endpoints:

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | API documentation |
| GET | `/health` | Health check |
| POST | `/api/notifications/token` | Register push token |
| GET | `/api/notifications/tokens/:userId` | Get user's tokens |
| DELETE | `/api/notifications/token/:tokenId` | Delete token |
| PUT | `/api/notifications/token/:tokenId/preferences` | Update preferences |
| POST | `/api/notifications/send` | Send to one user |
| POST | `/api/notifications/send-multiple` | Send to multiple users |
| POST | `/api/notifications/send-all` | Send to all users |
| POST | `/api/notifications/send-by-device` | Send by device type |
| GET | `/api/notifications/stats` | Get statistics |
| POST | `/api/notifications/cleanup` | Cleanup inactive tokens |

#### Quick Test Commands:

**Register a token:**
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

**Send notification:**
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

**Get statistics:**
```bash
curl http://localhost:3000/api/notifications/stats
```

---

## Troubleshooting

### Common Issues

#### 1. "Must be using a physical device for Push notifications"
**Solution:** Push notifications don't work on emulators/simulators. Use a real device.

#### 2. "Failed to get push token"
**Solutions:**
- Ensure you've granted notification permissions
- Check your EAS project ID in `app.json`
- Verify Firebase setup for Android
- Verify APNs setup for iOS

#### 3. "Module not found: babel-preset-expo"
**Solution:**
```bash
npm install babel-preset-expo --save-dev
npm install
```

#### 4. Notifications not appearing
**Solutions:**
- Check notification handler configuration
- Verify notification channel setup (Android)
- Ensure app has notification permissions
- Test with Expo's push notification tool first

#### 5. Token is undefined
**Solutions:**
- Wait for permissions to be granted
- Check device internet connection
- Verify `Constants.expoConfig?.extra?.eas.projectId` is set correctly

### Debug Tips

1. **Enable Debug Logging:**
```typescript
Notifications.addNotificationReceivedListener((notification) => {
  console.log("Notification received:", notification);
});

Notifications.addNotificationResponseReceivedListener((response) => {
  console.log("Notification response:", response);
});
```

2. **Check Permissions:**
```typescript
const { status } = await Notifications.getPermissionsAsync();
console.log("Permission status:", status);
```

3. **Validate Token:**
```typescript
if (token) {
  console.log("Valid token:", token.data);
} else {
  console.log("Token is undefined");
}
```

---

## API Reference

### Notification Handler Configuration

```typescript
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: boolean,      // Play notification sound
    shouldShowAlert: boolean,       // Show alert (iOS)
    shouldSetBadge: boolean,       // Update badge count (iOS)
    shouldShowBanner: boolean,     // Show banner notification
    shouldShowList: boolean,       // Add to notification center
  }),
});
```

### Android Notification Channels

```typescript
Notifications.setNotificationChannelAsync(channelId, {
  name: string,                    // Channel name
  importance: AndroidImportance,   // MIN, LOW, DEFAULT, HIGH, MAX
  vibrationPattern: number[],      // [delay, vibrate, delay, vibrate, ...]
  lightColor: string,              // Hex color code
  lockscreenVisibility: Visibility, // PUBLIC, PRIVATE, SECRET
  sound: string,                   // Audio file name
  audioAttributes: AudioAttributes,
  bypassDnd: boolean,
  enableLights: boolean,
  enableVibrate: boolean,
  showBadge: boolean,
});
```

### Permission Methods

```typescript
// Get current permissions
const { status } = await Notifications.getPermissionsAsync();

// Request permissions
const { status } = await Notifications.requestPermissionsAsync();

// Permission statuses: 'granted' | 'denied' | 'undetermined'
```

### Push Token

```typescript
const token = await Notifications.getExpoPushTokenAsync({
  projectId: string,  // Your EAS project ID
});

// token.data contains the Expo Push Token string
```

### Event Listeners

```typescript
// Notification received (app foregrounded)
const subscription = Notifications.addNotificationReceivedListener(
  (notification: Notifications.Notification) => {
    // Handle notification
  }
);

// Notification interaction (user tapped)
const subscription = Notifications.addNotificationResponseReceivedListener(
  (response: Notifications.NotificationResponse) => {
    // Handle user interaction
  }
);

// Remove listeners
subscription.remove();
```

---

## Best Practices

### 1. Handle Permissions Gracefully
```typescript
const requestPermissions = async () => {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  
  if (existingStatus !== 'granted') {
    // Explain why you need permissions
    Alert.alert(
      "Enable Notifications",
      "We need your permission to send you important updates.",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "OK", 
          onPress: async () => {
            await Notifications.requestPermissionsAsync();
          }
        }
      ]
    );
  }
};
```

### 2. Store Tokens Securely
```typescript
// Send token to your backend
const sendTokenToBackend = async (token: string) => {
  try {
    await fetch('https://your-api.com/tokens', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, userId: 'user-id' }),
    });
  } catch (error) {
    console.error('Failed to send token:', error);
  }
};
```

### 3. Handle Notification Actions
```typescript
Notifications.addNotificationResponseReceivedListener((response) => {
  const { notification, actionIdentifier } = response;
  
  // Navigate based on notification data
  if (notification.request.content.data?.screen) {
    navigation.navigate(notification.request.content.data.screen);
  }
});
```

### 4. Schedule Local Notifications
```typescript
const scheduleLocalNotification = async () => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Reminder",
      body: "Don't forget to check the app!",
      data: { data: 'goes here' },
    },
    trigger: {
      seconds: 60,  // Fire in 60 seconds
    },
  });
};
```

### 5. Cancel Notifications
```typescript
// Cancel all scheduled notifications
await Notifications.cancelAllScheduledNotificationsAsync();

// Cancel specific notification
await Notifications.cancelScheduledNotificationAsync(notificationId);
```

### 6. Update Badge Count (iOS)
```typescript
// Set badge count
await Notifications.setBadgeCountAsync(5);

// Get current badge count
const badgeCount = await Notifications.getBadgeCountAsync();
```

---

## Quick Reference Summary

### Configuration Files Explained:

| File | Purpose | Location |
|------|---------|----------|
| **bundleIdentifier** | iOS app unique ID | `app.json` → `ios.bundleIdentifier` |
| **package** | Android app unique ID | `app.json` → `android.package` |
| **googleServicesFile** | Firebase config for FCM | `app.json` → `android.googleServicesFile` |
| **google-services.json** | Android Firebase credentials | Project root & `android/app/` |
| **Firebase Admin SDK JSON** | Backend server authentication | Server-side only (keep secure!) |
| **projectId** | EAS project identifier | `app.json` → `extra.eas.projectId` |

### Key URLs & Tools:

- **Test Push Notifications:** [https://expo.dev/notifications](https://expo.dev/notifications)
- **Firebase Console:** [https://console.firebase.google.com/](https://console.firebase.google.com/)
- **Expo Dashboard:** [https://expo.dev](https://expo.dev)
- **Apple Developer:** [https://developer.apple.com/](https://developer.apple.com/)

### API Endpoints (Backend):

```
POST   /api/notifications/token              - Register push token
POST   /api/notifications/send               - Send to one user
POST   /api/notifications/send-multiple      - Send to multiple users
POST   /api/notifications/send-all           - Send to all users
GET    /api/notifications/tokens/:userId     - Get user's tokens
DELETE /api/notifications/token/:tokenId     - Delete token
GET    /api/notifications/stats               - Get statistics
```

### Common Workflows:

**1. Initial Setup:**
```
1. Create Firebase project → Get google-services.json
2. Generate Firebase Admin SDK JSON (for backend)
3. Configure app.json with package/bundleIdentifier
4. Add EAS projectId
5. Install dependencies
```

**2. Client-Side Flow:**
```
1. Request notification permissions
2. Get Expo Push Token
3. Send token to backend API
4. Listen for notifications
5. Handle notification responses
```

**3. Backend Flow:**
```
1. Receive and store tokens
2. Validate token format
3. Send notifications via Expo API
4. Handle receipts and errors
5. Deactivate invalid tokens
```

### Testing Checklist:

- [ ] Physical device (not emulator)
- [ ] Permissions granted
- [ ] Push token generated
- [ ] Token sent to backend
- [ ] Test with [https://expo.dev/notifications](https://expo.dev/notifications)
- [ ] Test notification in foreground
- [ ] Test notification in background
- [ ] Test notification data payload
- [ ] Test notification interactions

---

## Additional Resources

### Official Documentation:
- [Expo Notifications Documentation](https://docs.expo.dev/versions/latest/sdk/notifications/)
- [Expo Push Notification Tool](https://expo.dev/notifications) - **Test your notifications here!**
- [Expo Push Service API](https://docs.expo.dev/push-notifications/sending-notifications/)
- [expo-server-sdk (Node.js Backend)](https://github.com/expo/expo-server-sdk-node)

### Firebase & Cloud Services:
- [Firebase Console](https://console.firebase.google.com/) - **Get google-services.json here**
- [Firebase Cloud Messaging (FCM)](https://firebase.google.com/docs/cloud-messaging)
- [Firebase Admin SDK Setup](https://firebase.google.com/docs/admin/setup)

### Apple Development:
- [Apple Developer Portal](https://developer.apple.com/)
- [Apple Push Notification Service (APNs)](https://developer.apple.com/documentation/usernotifications)

### Community & Support:
- [Expo Forums](https://forums.expo.dev)
- [Expo Discord Community](https://chat.expo.dev)
- [GitHub Issues](https://github.com/expo/expo/issues)
- [Stack Overflow - Expo Tag](https://stackoverflow.com/questions/tagged/expo)

---

## Version Information

### Frontend Dependencies:
- **Expo SDK:** ~54.0.0
- **expo-notifications:** ~0.32.12
- **expo-device:** ~8.0.9
- **expo-constants:** ~18.0.9
- **React Native:** 0.81.4
- **React:** 19.1.0
- **babel-preset-expo:** ~12.0.5

### Backend Dependencies:
- **Node.js:** >= 16.x
- **Express:** ^4.18.2
- **expo-server-sdk:** ^3.7.0
- **Mongoose:** ^8.0.0
- **dotenv:** ^16.3.1
- **cors:** ^2.8.5

---

## Security Notes

⚠️ **IMPORTANT SECURITY PRACTICES:**

1. **Never commit sensitive files to Git:**
   ```gitignore
   # Add to .gitignore
   *-firebase-adminsdk-*.json
   google-services.json
   .env
   ```

2. **Use environment variables:**
   ```bash
   FIREBASE_ADMIN_SDK_PATH=/path/to/admin-sdk.json
   DATABASE_URL=mongodb://...
   ```

3. **Restrict Firebase API keys:**
   - Go to Google Cloud Console
   - Restrict API keys to specific IPs/domains
   - Enable only required APIs

4. **Validate tokens on backend:**
   ```javascript
   if (!Expo.isExpoPushToken(token)) {
     throw new Error('Invalid token format');
   }
   ```

5. **Handle notification receipts:**
   - Check for `DeviceNotRegistered` errors
   - Remove invalid tokens from database
   - Monitor delivery success rates

---

## License

This documentation is provided as-is for educational purposes.

---

## Contributing

Found an issue or want to improve this documentation?
- Open an issue on GitHub
- Submit a pull request
- Share your feedback

---

## Acknowledgments

Created for Expo SDK 54 push notifications implementation. Based on official Expo documentation and best practices from the community.

**Last Updated:** October 2025

