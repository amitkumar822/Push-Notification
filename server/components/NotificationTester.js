import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import {
  useApiStatus,
  useSendNotification,
  useSendMultipleNotifications,
  useValidateTokenMutation,
} from '../hooks/useNotificationApi.js';
import { createNotificationPayload, createMultipleNotificationPayload } from '../api/notificationService.js';

const NotificationTester = () => {
  // State for form inputs
  const [token, setToken] = useState('');
  const [title, setTitle] = useState('Test Notification');
  const [body, setBody] = useState('This is a test notification from the app');
  const [multipleTokens, setMultipleTokens] = useState('');
  const [customData, setCustomData] = useState('{"screen": "Home", "action": "test"}');

  // API hooks
  const { data: statusData, isLoading: statusLoading, refetch: refetchStatus } = useApiStatus();
  const sendNotificationMutation = useSendNotification();
  const sendMultipleMutation = useSendMultipleNotifications();
  const validateTokenMutation = useValidateTokenMutation();

  // Handle single notification
  const handleSendNotification = async () => {
    if (!token.trim()) {
      Alert.alert('Error', 'Please enter a push token');
      return;
    }

    if (!title.trim() || !body.trim()) {
      Alert.alert('Error', 'Please enter title and body');
      return;
    }

    try {
      let data = {};
      if (customData.trim()) {
        data = JSON.parse(customData);
      }

      const payload = createNotificationPayload(token.trim(), title.trim(), body.trim(), data);
      
      await sendNotificationMutation.mutateAsync(payload);
      Alert.alert('Success', 'Notification sent successfully!');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  // Handle multiple notifications
  const handleSendMultiple = async () => {
    if (!multipleTokens.trim()) {
      Alert.alert('Error', 'Please enter push tokens (one per line)');
      return;
    }

    if (!title.trim() || !body.trim()) {
      Alert.alert('Error', 'Please enter title and body');
      return;
    }

    try {
      const tokens = multipleTokens
        .split('\n')
        .map(t => t.trim())
        .filter(t => t.length > 0);

      if (tokens.length === 0) {
        Alert.alert('Error', 'Please enter at least one valid token');
        return;
      }

      let data = {};
      if (customData.trim()) {
        data = JSON.parse(customData);
      }

      const payload = createMultipleNotificationPayload(tokens, title.trim(), body.trim(), data);
      
      await sendMultipleMutation.mutateAsync(payload);
      Alert.alert('Success', `Notifications sent to ${tokens.length} devices!`);
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  // Handle token validation
  const handleValidateToken = async () => {
    if (!token.trim()) {
      Alert.alert('Error', 'Please enter a push token to validate');
      return;
    }

    try {
      const result = await validateTokenMutation.mutateAsync(token.trim());
      Alert.alert(
        'Token Validation',
        `Token is ${result.data.isValid ? 'VALID' : 'INVALID'}\n\n${result.data.message}`
      );
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Push Notification Tester</Text>

      {/* API Status */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>API Status</Text>
        <TouchableOpacity style={styles.button} onPress={refetchStatus}>
          <Text style={styles.buttonText}>Check Status</Text>
        </TouchableOpacity>
        {statusLoading ? (
          <ActivityIndicator size="small" color="#007AFF" />
        ) : (
          <Text style={styles.statusText}>
            {statusData ? '✅ API Online' : '❌ API Offline'}
          </Text>
        )}
      </View>

      {/* Single Notification */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Send Single Notification</Text>
        
        <TextInput
          style={styles.input}
          placeholder="ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]"
          value={token}
          onChangeText={setToken}
          multiline
        />
        
        <TextInput
          style={styles.input}
          placeholder="Notification Title"
          value={title}
          onChangeText={setTitle}
        />
        
        <TextInput
          style={styles.input}
          placeholder="Notification Body"
          value={body}
          onChangeText={setBody}
          multiline
        />
        
        <TextInput
          style={styles.input}
          placeholder='Custom Data (JSON): {"screen": "Home", "action": "test"}'
          value={customData}
          onChangeText={setCustomData}
          multiline
        />

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.button, styles.validateButton]}
            onPress={handleValidateToken}
            disabled={validateTokenMutation.isPending}
          >
            <Text style={styles.buttonText}>
              {validateTokenMutation.isPending ? 'Validating...' : 'Validate Token'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.sendButton]}
            onPress={handleSendNotification}
            disabled={sendNotificationMutation.isPending}
          >
            <Text style={styles.buttonText}>
              {sendNotificationMutation.isPending ? 'Sending...' : 'Send Notification'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Multiple Notifications */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Send Multiple Notifications</Text>
        
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Enter tokens (one per line):&#10;ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]&#10;ExponentPushToken[yyyyyyyyyyyyyyyyyyyyyy]"
          value={multipleTokens}
          onChangeText={setMultipleTokens}
          multiline
          numberOfLines={4}
        />

        <TouchableOpacity
          style={[styles.button, styles.sendMultipleButton]}
          onPress={handleSendMultiple}
          disabled={sendMultipleMutation.isPending}
        >
          <Text style={styles.buttonText}>
            {sendMultipleMutation.isPending ? 'Sending...' : 'Send to Multiple'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Instructions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Instructions</Text>
        <Text style={styles.instructionText}>
          1. Make sure your backend is running on http://localhost:3000{'\n'}
          2. Get your Expo push token from the main app{'\n'}
          3. Paste the token in the input field{'\n'}
          4. Enter title and body for your notification{'\n'}
          5. Click "Send Notification" to test{'\n'}
          6. Check your device for the notification!
        </Text>
      </View>
    </ScrollView>
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
  section: {
    backgroundColor: 'white',
    padding: 15,
    marginBottom: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  validateButton: {
    backgroundColor: '#34C759',
  },
  sendButton: {
    backgroundColor: '#007AFF',
  },
  sendMultipleButton: {
    backgroundColor: '#FF9500',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statusText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 10,
  },
  instructionText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#666',
  },
});

export default NotificationTester;
