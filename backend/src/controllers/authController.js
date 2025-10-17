import jwt from 'jsonwebtoken';
import User from '../models/User.js';

class AuthController {
  /**
   * Register a new user
   * POST /api/auth/register
   */
  async register(req, res) {
    try {
      const { username, email, password, firstName, lastName } = req.body;

      // Validate required fields
      if (!username || !email || !password || !firstName || !lastName) {
        return res.status(400).json({
          success: false,
          message: 'All fields are required',
          required: ['username', 'email', 'password', 'firstName', 'lastName']
        });
      }

      // Check if email already exists
      const existingEmail = await User.emailExists(email);
      if (existingEmail) {
        return res.status(400).json({
          success: false,
          message: 'Email already registered',
          field: 'email'
        });
      }

      // Check if username already exists
      const existingUsername = await User.usernameExists(username);
      if (existingUsername) {
        return res.status(400).json({
          success: false,
          message: 'Username already taken',
          field: 'username'
        });
      }

      // Create new user
      const user = await User.create({
        username,
        email,
        password,
        firstName,
        lastName,
      });

      // Generate JWT token
      const token = jwt.sign(
        { 
          userId: user._id,
          email: user.email,
          username: user.username,
          role: user.role
        },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      console.log(`✅ New user registered: ${user.username} (${user.email})`);

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: {
          user: user.getPublicProfile(),
          token,
          expiresIn: '7d'
        }
      });
    } catch (error) {
      console.error('❌ Error registering user:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to register user',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }

  /**
   * Login user
   * POST /api/auth/login
   */
  async login(req, res) {
    try {
      const { emailOrUsername, password } = req.body;

      // Validate required fields
      if (!emailOrUsername || !password) {
        return res.status(400).json({
          success: false,
          message: 'Email/Username and password are required',
          required: ['emailOrUsername', 'password']
        });
      }

      // Find user by email or username (include password for comparison)
      const user = await User.findByEmailOrUsername(emailOrUsername).select('+password');
      
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials'
        });
      }

      // Check if user is active
      if (!user.isActive) {
        return res.status(401).json({
          success: false,
          message: 'Account is deactivated'
        });
      }

      // Compare password
      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials'
        });
      }

      // Update last login
      await user.updateLastLogin();

      // Generate JWT token
      const token = jwt.sign(
        { 
          userId: user._id,
          email: user.email,
          username: user.username,
          role: user.role
        },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      console.log(`✅ User logged in: ${user.username} (${user.email})`);

      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: {
          user: user.getPublicProfile(),
          token,
          expiresIn: '7d'
        }
      });
    } catch (error) {
      console.error('❌ Error logging in user:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to login',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }

  /**
   * Get current user profile
   * GET /api/auth/profile
   */
  async getProfile(req, res) {
    try {
      const user = await User.findById(req.user.userId);
      
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      res.status(200).json({
        success: true,
        data: {
          user: user.getPublicProfile()
        }
      });
    } catch (error) {
      console.error('❌ Error getting user profile:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get user profile',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }

  /**
   * Update user profile
   * PUT /api/auth/profile
   */
  async updateProfile(req, res) {
    try {
      const { firstName, lastName, preferences } = req.body;
      const userId = req.user.userId;

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      // Update allowed fields
      if (firstName) user.firstName = firstName;
      if (lastName) user.lastName = lastName;
      if (preferences) {
        user.preferences = { ...user.preferences, ...preferences };
      }

      await user.save();

      res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        data: {
          user: user.getPublicProfile()
        }
      });
    } catch (error) {
      console.error('❌ Error updating user profile:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update profile',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }

  /**
   * Change password
   * PUT /api/auth/change-password
   */
  async changePassword(req, res) {
    try {
      const { currentPassword, newPassword } = req.body;
      const userId = req.user.userId;

      if (!currentPassword || !newPassword) {
        return res.status(400).json({
          success: false,
          message: 'Current password and new password are required'
        });
      }

      if (newPassword.length < 6) {
        return res.status(400).json({
          success: false,
          message: 'New password must be at least 6 characters'
        });
      }

      const user = await User.findById(userId).select('+password');
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      // Verify current password
      const isCurrentPasswordValid = await user.comparePassword(currentPassword);
      if (!isCurrentPasswordValid) {
        return res.status(400).json({
          success: false,
          message: 'Current password is incorrect'
        });
      }

      // Update password
      user.password = newPassword;
      await user.save();

      console.log(`✅ Password changed for user: ${user.username}`);

      res.status(200).json({
        success: true,
        message: 'Password changed successfully'
      });
    } catch (error) {
      console.error('❌ Error changing password:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to change password',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }

  /**
   * Logout user (client-side token removal)
   * POST /api/auth/logout
   */
  async logout(req, res) {
    try {
      // In a stateless JWT system, logout is handled client-side
      // You could implement token blacklisting here if needed
      
      console.log(`✅ User logged out: ${req.user.username}`);

      res.status(200).json({
        success: true,
        message: 'Logout successful'
      });
    } catch (error) {
      console.error('❌ Error logging out user:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to logout',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }

  /**
   * Verify token
   * GET /api/auth/verify
   */
  async verifyToken(req, res) {
    try {
      // If we reach here, the token is valid (middleware already verified)
      const user = await User.findById(req.user.userId);
      
      if (!user || !user.isActive) {
        return res.status(401).json({
          success: false,
          message: 'Invalid or inactive user'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Token is valid',
        data: {
          user: user.getPublicProfile()
        }
      });
    } catch (error) {
      console.error('❌ Error verifying token:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to verify token',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }
}

export default new AuthController();
