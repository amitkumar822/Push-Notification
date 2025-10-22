import React from 'react';
import { View, StyleSheet } from 'react-native';
import NotificationTester from '../../server/components/NotificationTester';

const NotificationsScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <NotificationTester />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
});

export default NotificationsScreen;

