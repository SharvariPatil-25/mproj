import { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  Pressable,
  Alert,
  Linking,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import * as Location from 'expo-location';
import { IconSymbol } from '@/components/IconSymbol';
import { ChatMessage } from '@/components/ChatMessage';
import { EmergencyPanel } from '@/components/EmergencyPanel';
import { SafetyInfoCard } from '@/components/SafetyInfoCard';
import { findBestResponse, detectDistressKeyword } from '@/data/chatbotResponses';
import { findNearestSafetyZone, calculateDistance, SafetyZone } from '@/data/safetyZones';
import { colors } from '@/styles/commonStyles';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export default function ChatbotScreen() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm your Women's Safety Assistant. I'm here to protect you and help you stay safe. You can:\n\n• Ask about safe routes\n• Check safety of any area\n• Get emergency help\n• Find nearby police stations\n\nHow can I help you today?",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [nearestZone, setNearestZone] = useState<SafetyZone | null>(null);
  const [locationPermissionDenied, setLocationPermissionDenied] = useState(false);

  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    getCurrentLocation();
    const locationInterval = setInterval(getCurrentLocation, 30000); // Update every 30 seconds
    
    return () => clearInterval(locationInterval);
  }, []);

  useEffect(() => {
    if (location) {
      const zone = findNearestSafetyZone(
        location.coords.latitude,
        location.coords.longitude
      );
      setNearestZone(zone);

      // Check for unsafe zone proximity
      if (zone && zone.safety_label === 'Unsafe') {
        const distance = calculateDistance(
          location.coords.latitude,
          location.coords.longitude,
          zone.latitude,
          zone.longitude
        );

        if (distance <= 0.5) {
          const alertMessage: Message = {
            id: Date.now().toString(),
            text: `⚠️ WARNING: You are entering an unsafe area (${zone.area}). This area has a safety score of ${zone.safety_score}/10.\n\nNearest police station: ${zone.nearest_police_station} (${zone.police_station_distance}km)\n\nAdvice: ${zone.advice}\n\nWould you like me to call emergency services or show you a safer route?`,
            isUser: false,
            timestamp: new Date()
          };

          setMessages(prev => {
            const lastMessage = prev[prev.length - 1];
            if (lastMessage && lastMessage.text.indexOf('WARNING') !== -1) {
              return prev;
            }
            return [...prev, alertMessage];
          });
        }
      }
    }
  }, [location]);

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLocationPermissionDenied(true);
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);
      setLocationPermissionDenied(false);
    } catch (error) {
      console.log('Error getting location:', error);
      setLocationPermissionDenied(true);
    }
  };

  const handleDistressAlert = () => {
    const alertMsg: Message = {
      id: Date.now().toString(),
      text: "🚨 DISTRESS DETECTED! Stay calm, I'm here to help.\n\nImmediate actions available:\n• Call Emergency Services (112)\n• Call Police (100)\n• Call Women's Helpline (181)\n• View Safe Route on Map\n\nWhat would you like me to do?",
      isUser: false,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, alertMsg]);
  };

  const handleSendMessage = (text?: string) => {
    const messageText = text || inputMessage.trim();
    if (!messageText) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: messageText,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');

    if (detectDistressKeyword(messageText)) {
      handleDistressAlert();
      return;
    }

    setTimeout(() => {
      const lowerMessage = messageText.toLowerCase();
      let botResponse = '';

      if (lowerMessage.indexOf('safe') !== -1 && (lowerMessage.indexOf('area') !== -1 || lowerMessage.indexOf('location') !== -1)) {
        if (nearestZone && location) {
          const distance = calculateDistance(
            location.coords.latitude,
            location.coords.longitude,
            nearestZone.latitude,
            nearestZone.longitude
          );
          botResponse = `Based on your current location, you are near ${nearestZone.area} in ${nearestZone.city}.\n\nSafety Status: ${nearestZone.safety_label}\nSafety Score: ${nearestZone.safety_score}/10\nLighting: ${nearestZone.lighting_score}/10\nFoot Traffic: ${nearestZone.foot_traffic_score}/10\n\nNearest Police Station: ${nearestZone.nearest_police_station} (${nearestZone.police_station_distance}km)\n\nAdvice: ${nearestZone.advice}\n\nWould you like to see this on a map?`;
        } else if (locationPermissionDenied) {
          botResponse = "I don't have access to your location. You can:\n1. Enable location permission in your settings\n2. Tell me the city/area name you want to check\n\nWhich city would you like safety information for?";
        }
      } else if (lowerMessage.indexOf('route') !== -1 || lowerMessage.indexOf('map') !== -1 || lowerMessage.indexOf('navigate') !== -1) {
        botResponse = "I can show you a safety map with:\n• Safe zones (marked in green)\n• Moderate zones (marked in yellow)\n• Unsafe zones (marked in red)\n• Your current location\n• Nearby police stations\n\nYou can view the map in the main screen.";
      } else if (lowerMessage.indexOf('police') !== -1 || lowerMessage.indexOf('station') !== -1) {
        if (nearestZone) {
          botResponse = `The nearest police station to you is:\n\n${nearestZone.nearest_police_station}\nDistance: ${nearestZone.police_station_distance}km away\n\nWould you like me to show you the location on the map or call emergency services?`;
        }
      } else {
        const response = findBestResponse(messageText);
        botResponse = response ? response.response : "I'm here to help keep you safe. You can ask me about:\n• Safe routes and directions\n• Safety information for any area\n• Nearest police stations\n• Emergency assistance\n\nWhat would you like to know?";
      }

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    }, 500);
  };

  const handleCallEmergency = (number: string) => {
    Alert.alert(
      'Call Emergency',
      `Do you want to call ${number}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Call',
          onPress: () => {
            Linking.openURL(`tel:${number}`);
            const confirmMsg: Message = {
              id: Date.now().toString(),
              text: `Initiating call to ${number}. Stay on the line and clearly state your location and emergency.`,
              isUser: false,
              timestamp: new Date()
            };
            setMessages(prev => [...prev, confirmMsg]);
          }
        }
      ]
    );
  };

  const handleShowMap = () => {
    Alert.alert('Map View', 'Map functionality is available in the main Home tab');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={100}
    >
      <View style={styles.header}>
        <View style={styles.headerIcon}>
          <IconSymbol name="shield.fill" size={20} color="#ffffff" />
        </View>
        <Text style={styles.headerTitle}>Safety Assistant</Text>
      </View>

      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
      >
        {messages.map((msg) => (
          <ChatMessage
            key={msg.id}
            message={msg.text}
            isUser={msg.isUser}
            timestamp={msg.timestamp}
          />
        ))}
      </ScrollView>

      <View style={styles.inputContainer}>
        <ScrollView
          style={styles.infoScroll}
          contentContainerStyle={styles.infoScrollContent}
        >
          <EmergencyPanel
            nearestZone={nearestZone}
            onCallEmergency={handleCallEmergency}
            onShowMap={handleShowMap}
          />

          {nearestZone && location && (
            <SafetyInfoCard
              zone={nearestZone}
              distance={calculateDistance(
                location.coords.latitude,
                location.coords.longitude,
                nearestZone.latitude,
                nearestZone.longitude
              )}
            />
          )}

          {locationPermissionDenied && (
            <View style={styles.locationAlert}>
              <IconSymbol name="location.fill" size={16} color="#d97706" />
              <View style={styles.locationAlertText}>
                <Text style={styles.locationAlertTitle}>Location Access Needed</Text>
                <Text style={styles.locationAlertMessage}>
                  Enable location for safety alerts
                </Text>
              </View>
            </View>
          )}
        </ScrollView>

        <View style={styles.inputRow}>
          <TextInput
            value={inputMessage}
            onChangeText={setInputMessage}
            onSubmitEditing={() => handleSendMessage()}
            placeholder="Type your message..."
            placeholderTextColor="#9ca3af"
            style={styles.textInput}
            multiline
          />
          <Pressable
            onPress={() => handleSendMessage()}
            style={({ pressed }) => [
              styles.sendButton,
              pressed && styles.sendButtonPressed
            ]}
          >
            <IconSymbol name="paperplane.fill" size={18} color="#ffffff" />
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 16,
    paddingTop: 60,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerIcon: {
    backgroundColor: colors.primary,
    padding: 8,
    borderRadius: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
  },
  messagesContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  messagesContent: {
    paddingVertical: 16,
  },
  inputContainer: {
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  infoScroll: {
    maxHeight: 400,
    marginBottom: 12,
  },
  infoScrollContent: {
    paddingBottom: 8,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'flex-end',
  },
  textInput: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    color: '#1f2937',
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: colors.primary,
    padding: 12,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    width: 48,
    height: 48,
  },
  sendButtonPressed: {
    opacity: 0.8,
  },
  locationAlert: {
    backgroundColor: '#fef3c7',
    borderLeftWidth: 4,
    borderLeftColor: '#f59e0b',
    padding: 12,
    borderRadius: 8,
    flexDirection: 'row',
    gap: 8,
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  locationAlertText: {
    flex: 1,
  },
  locationAlertTitle: {
    fontSize: 12,
    fontWeight: '500',
    color: '#92400e',
    marginBottom: 4,
  },
  locationAlertMessage: {
    fontSize: 12,
    color: '#92400e',
  },
});
