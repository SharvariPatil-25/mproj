import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface ChatMessageProps {
  message: string;
  isUser: boolean;
  timestamp: Date;
}

export function ChatMessage({ message, isUser, timestamp }: ChatMessageProps) {
  return (
    <View style={[styles.container, isUser ? styles.userContainer : styles.botContainer]}>
      <View
        style={[
          styles.bubble,
          isUser ? styles.userBubble : styles.botBubble
        ]}
      >
        <Text style={[styles.messageText, isUser ? styles.userText : styles.botText]}>
          {message}
        </Text>
        <Text style={[styles.timestamp, isUser ? styles.userTimestamp : styles.botTimestamp]}>
          {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    paddingHorizontal: 12,
  },
  userContainer: {
    alignItems: 'flex-end',
  },
  botContainer: {
    alignItems: 'flex-start',
  },
  bubble: {
    maxWidth: '85%',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  userBubble: {
    backgroundColor: '#2563eb',
    borderBottomRightRadius: 4,
  },
  botBubble: {
    backgroundColor: '#e5e7eb',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 24,
  },
  userText: {
    color: '#ffffff',
  },
  botText: {
    color: '#1f2937',
  },
  timestamp: {
    fontSize: 12,
    marginTop: 6,
  },
  userTimestamp: {
    color: '#dbeafe',
  },
  botTimestamp: {
    color: '#6b7280',
  },
});
