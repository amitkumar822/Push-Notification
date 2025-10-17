import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { usePushNotifications } from '../usePushNotifications';
import NotificationTester from '../components/NotificationTester';

// Example of how to use the integrated push notifications
const AppExample = () => {
  const { expoPushToken, sendTestNotification, isSending } = usePushNotifications();

  const handleSendTest = async () => {
    try {
      await sendTestNotification();
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Push Notification Demo</Text>
      
      <View style={styles.tokenContainer}>
        <Text style={styles.tokenLabel}>Your Push Token:</Text>
        <Text style={styles.tokenText}>
          {expoPushToken ? expoPushToken.data : 'No token available'}
        </Text>
      </View>

      <TouchableOpacity
        style={[styles.button, isSending && styles.buttonDisabled]}
        onPress={handleSendTest}
        disabled={isSending}
      >
        <Text style={styles.buttonText}>
          {isSending ? 'Sending...' : 'Send Test Notification'}
        </Text>
      </TouchableOpacity>

      {/* Advanced Notification Tester Component */}
      <NotificationTester />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  tokenContainer: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tokenLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  tokenText: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'monospace',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AppExample;
