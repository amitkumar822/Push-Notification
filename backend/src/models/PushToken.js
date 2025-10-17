import mongoose from 'mongoose';

const pushTokenSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: [true, 'User ID is required'],
      index: true,
      trim: true,
    },
    token: {
      type: String,
      required: [true, 'Push token is required'],
      unique: true,
      trim: true,
      validate: {
        validator: function(v) {
          // Validate Expo push token format
          return /^ExponentPushToken\[[a-zA-Z0-9_-]+\]$/.test(v);
        },
        message: 'Invalid Expo push token format'
      }
    },
    deviceType: {
      type: String,
      required: [true, 'Device type is required'],
      enum: {
        values: ['ios', 'android', 'web'],
        message: 'Device type must be ios, android, or web'
      },
    },
    deviceInfo: {
      brand: {
        type: String,
        trim: true,
      },
      modelName: {
        type: String,
        trim: true,
      },
      osVersion: {
        type: String,
        trim: true,
      },
      appVersion: {
        type: String,
        trim: true,
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastUsed: {
      type: Date,
      default: Date.now,
    },
    lastNotificationSent: {
      type: Date,
    },
    notificationCount: {
      type: Number,
      default: 0,
    },
    preferences: {
      allowNotifications: {
        type: Boolean,
        default: true,
      },
      allowSound: {
        type: Boolean,
        default: true,
      },
      allowVibration: {
        type: Boolean,
        default: true,
      },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for efficient queries
pushTokenSchema.index({ userId: 1, isActive: 1 });
pushTokenSchema.index({ token: 1 });
pushTokenSchema.index({ deviceType: 1, isActive: 1 });
pushTokenSchema.index({ lastUsed: -1 });

// Virtual for days since last used
pushTokenSchema.virtual('daysSinceLastUsed').get(function() {
  const now = new Date();
  const diffTime = Math.abs(now - this.lastUsed);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

// Instance methods
pushTokenSchema.methods.deactivate = function() {
  this.isActive = false;
  return this.save();
};

pushTokenSchema.methods.updateLastUsed = function() {
  this.lastUsed = new Date();
  return this.save();
};

pushTokenSchema.methods.incrementNotificationCount = function() {
  this.notificationCount += 1;
  this.lastNotificationSent = new Date();
  return this.save();
};

// Static methods
pushTokenSchema.statics.findActiveTokensByUser = function(userId) {
  return this.find({ userId, isActive: true });
};

pushTokenSchema.statics.findActiveTokensByUsers = function(userIds) {
  return this.find({ userId: { $in: userIds }, isActive: true });
};

pushTokenSchema.statics.findAllActiveTokens = function() {
  return this.find({ isActive: true });
};

pushTokenSchema.statics.getDeviceStats = function() {
  return this.aggregate([
    { $match: { isActive: true } },
    { 
      $group: { 
        _id: '$deviceType', 
        count: { $sum: 1 },
        avgNotifications: { $avg: '$notificationCount' }
      } 
    },
    { $sort: { count: -1 } }
  ]);
};

pushTokenSchema.statics.cleanupInactiveTokens = function(daysInactive = 30) {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysInactive);
  
  return this.updateMany(
    { 
      isActive: true, 
      lastUsed: { $lt: cutoffDate } 
    },
    { isActive: false }
  );
};

// Pre-save middleware
pushTokenSchema.pre('save', function(next) {
  // Update lastUsed timestamp
  this.lastUsed = new Date();
  next();
});

const PushToken = mongoose.model('PushToken', pushTokenSchema);

export default PushToken;
