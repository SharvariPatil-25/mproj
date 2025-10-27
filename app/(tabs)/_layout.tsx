import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import { IconSymbol } from '@/components/IconSymbol';
import { colors } from '@/styles/commonStyles';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TabLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.text,
        // --- UPDATED: Styles for a solid white tab bar ---
        tabBarStyle: {
          backgroundColor: 'white', // Set background to solid white
          borderTopWidth: 1,
          borderTopColor: colors.border,
          // Dynamically set height to handle iOS safe area (home indicator)
          height: 60 + insets.bottom, 
          paddingBottom: insets.bottom, // Add padding to the bottom for iOS
          paddingTop: 8,
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="house.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="chatbot"
        options={{
          title: 'Assistant',
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="shield.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="contacts"
        options={{
          title: 'Contacts',
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="phone.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="hostels"
        options={{
          title: 'Hostels',
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="building.2.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="forum"
        options={{
          title: 'Community',
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="person.2.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="gearshape.fill" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}