# React Native App Structure

## 📁 Folder Structure

```
src/
├── context/
│   └── AuthContext.js           # Authentication state management
├── navigation/
│   ├── AuthNavigator.js         # Login/Register navigation
│   ├── TabNavigator.js          # Bottom tabs navigation
│   └── RootNavigator.js         # Root navigation controller
├── screens/
│   ├── auth/
│   │   ├── LoginScreen.js       # Login screen
│   │   └── RegisterScreen.js    # Registration screen
│   ├── HomeScreen.js            # Home dashboard
│   ├── NotificationsScreen.js   # Push notifications testing
│   └── ProfileScreen.js         # User profile
└── services/
    └── authService.js           # Backend API calls for auth
```

## 🚀 Features

### Authentication Flow
- ✅ User registration with validation
- ✅ User login with JWT tokens
- ✅ Auto-login on app restart
- ✅ Secure token storage with AsyncStorage
- ✅ Logout functionality
- ✅ Protected routes

### Screens

#### 1. **Login Screen** (`auth/LoginScreen.js`)
- Email/Username and password login
- Form validation
- Error handling
- Navigation to register screen

#### 2. **Register Screen** (`auth/RegisterScreen.js`)
- Complete registration form
- Form validation
- Password confirmation
- Navigation to login screen

#### 3. **Home Screen** (`HomeScreen.js`)
- Welcome message with user name
- User information card
- Push token display
- Test notification button
- Last notification display
- Statistics

#### 4. **Notifications Screen** (`NotificationsScreen.js`)
- Send notifications to single device
- Send to multiple devices
- Token validation
- API status check
- Full notification testing UI

#### 5. **Profile Screen** (`ProfileScreen.js`)
- User information display
- Account preferences
- Statistics (login count, last login)
- Edit profile modal
- Logout button

### Navigation

#### **Auth Navigator**
- Login Screen
- Register Screen
- No tabs, stack navigation

#### **Tab Navigator** (After Login)
- 🏠 Home Tab
- 🔔 Notifications Tab
- 👤 Profile Tab

#### **Root Navigator**
- Shows Auth Navigator when not logged in
- Shows Tab Navigator when logged in
- Loading screen during initialization

## 🔧 Usage

### Install Dependencies
```bash
npm install
```

### Run the App
```bash
npm start
```

### Configuration

#### Update API URL
Edit `src/services/authService.js`:
```javascript
const API_BASE_URL = 'http://YOUR_IP:3000/api';
```

**Important:** For physical devices, replace `localhost` with your computer's IP address.

## 🎨 Design Features

### Color Scheme
- Primary: `#007AFF` (iOS Blue)
- Success: `#34C759` (Green)
- Error: `#FF3B30` (Red)
- Background: `#f5f5f5` (Light Gray)
- Text: `#333` (Dark Gray)

### UI Components
- Cards with shadows
- Rounded corners (8-12px)
- Consistent spacing
- Responsive layout
- Loading states
- Error states
- Success feedback

## 🔐 Authentication Flow

1. **App Launch:**
   - Check for saved token in AsyncStorage
   - If token exists, auto-login
   - Otherwise, show login screen

2. **Login:**
   - User enters email/username and password
   - API call to backend `/api/auth/login`
   - Save token and user data
   - Navigate to tabs

3. **Register:**
   - User fills registration form
   - API call to backend `/api/auth/register`
   - Auto-login after registration
   - Navigate to tabs

4. **Logout:**
   - Clear token from AsyncStorage
   - Clear user data
   - Navigate to login screen

## 📱 Screen Features

### Home Screen
- Real-time push token display
- Send test notification button
- Display last received notification
- User statistics
- Welcome message

### Notifications Screen
- Uses `NotificationTester` component
- Send to single device
- Send to multiple devices
- Token validation
- API status check

### Profile Screen
- User avatar with initials
- Complete user information
- Account preferences
- Edit profile functionality
- Logout button

## 🔗 Backend Integration

### Auth Service Functions
- `register(userData)` - Register new user
- `login(emailOrUsername, password)` - Login user
- `getProfile(token)` - Get user profile
- `updateProfile(token, profileData)` - Update profile
- `changePassword(token, currentPassword, newPassword)` - Change password
- `verifyToken(token)` - Verify JWT token
- `logout(token)` - Logout user

### Context Functions
- `login(emailOrUsername, password)` - Login and save state
- `register(userData)` - Register and save state
- `logout()` - Logout and clear state
- `updateUser(updatedData)` - Update user in state

## 🎯 Best Practices

### State Management
- Use Context API for global auth state
- Use AsyncStorage for persistence
- Use TanStack Query for API calls

### Navigation
- Conditional rendering based on auth state
- Protect routes with authentication check
- Use proper navigation types

### Security
- Store tokens securely
- Never store plain passwords
- Clear sensitive data on logout
- Validate all inputs

### UI/UX
- Show loading states
- Provide error feedback
- Validate forms
- Confirm destructive actions

## 🐛 Troubleshooting

### Cannot connect to backend
- Make sure backend is running
- Use your computer's IP instead of localhost
- Check if device and computer are on same network

### Auto-login not working
- Check AsyncStorage permissions
- Verify token is being saved
- Check token expiration

### Navigation not working
- Make sure all dependencies are installed
- Check React Navigation setup
- Verify screen names match

## 📚 Additional Resources

- [React Navigation Docs](https://reactnavigation.org/)
- [Expo Docs](https://docs.expo.dev/)
- [AsyncStorage Docs](https://react-native-async-storage.github.io/async-storage/)
- [TanStack Query Docs](https://tanstack.com/query/latest)

