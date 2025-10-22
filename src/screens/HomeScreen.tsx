import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { usePushNotifications } from '../../usePushNotifications';

const HomeScreen: React.FC = () => {
  const { user } = useAuth();
  const { expoPushToken, notification, sendTestNotification, isSending } = usePushNotifications();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Welcome, {user?.firstName}!</Text>
        <Text style={styles.subtitle}>Push Notification Dashboard</Text>
      </View>

      {/* User Info Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>👤 User Information</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Name:</Text>
          <Text style={styles.infoValue}>{user?.fullName}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Email:</Text>
          <Text style={styles.infoValue}>{user?.email}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Username:</Text>
          <Text style={styles.infoValue}>@{user?.username}</Text>
        </View>
      </View>

      {/* Push Token Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>📱 Push Notification Token</Text>
        <View style={styles.tokenContainer}>
          <Text style={styles.tokenLabel}>Your Expo Push Token:</Text>
          <View style={styles.tokenBox}>
            <Text style={styles.tokenText} numberOfLines={3}>
              {expoPushToken?.data || 'No token available'}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.testButton, isSending && styles.buttonDisabled]}
          onPress={sendTestNotification}
          disabled={isSending}
        >
          <Text style={styles.testButtonText}>
            {isSending ? 'Sending...' : '🔔 Send Test Notification'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Last Notification Card */}
      {notification && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>📬 Last Notification</Text>
          <View style={styles.notificationContent}>
            <Text style={styles.notificationTitle}>
              {notification.request?.content?.title || 'No title'}
            </Text>
            <Text style={styles.notificationBody}>
              {notification.request?.content?.body || 'No body'}
            </Text>
            {notification.request?.content?.data && (
              <View style={styles.dataContainer}>
                <Text style={styles.dataLabel}>Data:</Text>
                <Text style={styles.dataText}>
                  {JSON.stringify(notification.request.content.data, null, 2)}
                </Text>
              </View>
            )}
          </View>
        </View>
      )}

      {/* Stats Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>📊 Statistics</Text>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{user?.loginCount || 0}</Text>
            <Text style={styles.statLabel}>Total Logins</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              {expoPushToken ? '✓' : '✗'}
            </Text>
            <Text style={styles.statLabel}>Push Enabled</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              {user?.preferences?.allowNotifications ? '✓' : '✗'}
            </Text>
            <Text style={styles.statLabel}>Notifications</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#007AFF',
    padding: 20,
    paddingTop: 60,
    paddingBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  card: {
    backgroundColor: 'white',
    margin: 15,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  infoLabel: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
  },
  tokenContainer: {
    marginBottom: 15,
  },
  tokenLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 10,
  },
  tokenBox: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  tokenText: {
    fontSize: 12,
    color: '#333',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  testButton: {
    backgroundColor: '#34C759',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  testButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  notificationContent: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 8,
  },
  notificationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  notificationBody: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  dataContainer: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  dataLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 5,
  },
  dataText: {
    fontSize: 12,
    color: '#333',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
  },
});

export default HomeScreen;

